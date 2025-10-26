#!/usr/bin/python3
# -*- coding: utf-8 -*-
#
# (Ouaip, je code et commente en français, traitez avec ça.)
#
# Script de génération automatique de recettes. C'est pas utilisable en l'état
# sur une autre config' que la mienne (ça prend aucun argument et y'a tout un
# tas de trucs codés en dur…) mais ça doit être suffisamment simple à comprendre
# pour que ça soit adaptable pas trop difficilement.
#
# Il nécessite Markdown (#pip3 install markdown), python3 et c'est tout. Pour
# fonctionner correctement, il faut que :
# - la liste des recettes soit dans le répertoire courant, et les fichiers ont
#   leur nom qui commence par une majuscule si et seulement si ils contiennent
#   une recette ;
# - chaque recette soit constituée d'une première ligne avec son titre, d'une
#   seconde avec les étiquettes de la recette séparés par un ou plusieurs
#   espaces, et le reste qui soit en syntaxe Markdown (avec l'extension
#   sane_lists) ;
# - header1.html, header2.html et footer.html soient trois fichiers dans le
#   dossier courant, qui sont supposés contenir le code HTML à rajouter
#   respectivement avant la balise <title>, après la base <title> (en haut de la
#   page), et après le code généré par Markdown pour chaque recette ;
# - template.html contienne le code HTML de l'index des recettes, à l'exception
#   près des lignes contenant simplement une étiquette, qui seront remplacées
#   par une liste de liens vers les recettes comportant cette étiquette.
# Après l'exécution du script, tout se trouve dans le dossier html. Ne rien
# stocker d'important dans ce dossier, il est supprimé à chaque lancement du
# script.
#
# Author : Damien Desfontaines
# License : CC0 1.0 Universal - https://creativecommons.org/publicdomain/zero/1.0/

import os
import sys
import markdown

liens = {}
groupes = {"#dip":[], "#apero":[], "#salade":[], "#soupe":[], "#brunch":[],
        "#grill":[], "#mijote":[], "#poele":[], "#puree":[], "#tarte":[],
        "#roti":[], "#pate":[], "#risotto":[], "#accompagnement":[],
        "#biscuit":[], "#gateau":[], "#glace":[], "#dessert":[], "#boisson":[],
        "#tech":[], "#facile":[], "#rapide":[], "#vege":[],  "#photo":[],
        "#blanc":[], "#jaune":[], "#materiel":[]}
toujoursVege = {"#puree", "#accompagnement", "#biscuit", "#gateau", "#glace", "#dessert", "#boisson"}

htmlphoto = ' <img class="inline" title="Photo !" alt="(Photo !)" src="images/camera.gif"/>'
htmlmateriel = ' <img class="inline" title="Nécessite du matériel non-standard" alt="(Nécessite du matériel non-standard)" src="images/gear.png"/>'

# Nettoyage
os.system("rm -rf html")
os.system("mkdir html")
print("Précédent dossier supprimé")

# On commence par lister tous les fichiers du répertoire
fichiers = os.listdir(".")
fichiers.sort()
# Seuls les fichiers commençant par une majuscule sont des recettes
recettes = [f for f in fichiers if f[0].isupper()]
print("%d recettes trouvées" % len(recettes))
i = 1
for nomRecette in recettes:
    lignes = open(nomRecette, "r").readlines()

    # Le nom et chemin du fichier HTML généré
    nomHTML = nomRecette + ".html"
    chemin = "html/" + nomHTML

    # On fait du fichier original un html en utilisant markdown
    os.system("cat header1.html > " + chemin)
    os.system("echo \"    <title>" + lignes[0] + " — Les bonnes recettes de Ted</title>\" >> " + chemin)
    os.system("cat header2.html >> " + chemin)
    # Le titre ne comprend pas les éventuelles parenthèses dans son nom
    mkd = "##" + lignes[0].split("(")[0] + "".join(lignes[2:])
    html = markdown.markdown(mkd, extensions=['sane_lists'])
    fichierHTML = open(chemin, "a")
    print(html, file=fichierHTML)
    fichierHTML.close()
    os.system("cat footer.html >> " + chemin)

    # On ajoute la recette à toutes ses étiquettes
    titre = lignes[0][:-1]
    etiquettes = lignes[1].strip().split()
    liens[titre] = nomHTML
    for e in etiquettes:
        if e not in groupes:
            print("Étiquette « %s » inconnue (trouvée dans %s)" % (e, titre))
            sys.exit(1)
        groupes[e].append(titre)
        if e in toujoursVege:
            groupes["#vege"].append(titre)

    if i%50 == 0:
        print("%d recettes traitées" % i)
    i += 1

# Ensuite, on remplit l'index HTML
print("Génération de l'index…")
lignes = open("template.html", "r").readlines()
index = open("html/index.html", "a")
for l in lignes:
    if (not l.strip()) or l.strip()[0] != '#':
        index.write(l)
        continue
    for titre in groupes[l.strip()]:
        # Pour ajouter plusieurs classes à un élément HTML, on énumère les
        # classes séparées par un espace dans l'attribut class de l'élément.
        html = "        <li class=\"recette"
        if titre in groupes["#facile"]:
            html += " facile"
        if titre in groupes["#rapide"]:
            html += " rapide"
        if titre in groupes["#vege"]:
            html += " vege"
        html += "\"><a href=\"" + liens[titre] +"\">"
        # Ce qu'il y a entre parenthèses ne fait pas partie du lien
        try:
            i = titre.index("(") - 1
        except:
            i = len(titre)
        html += titre[:i] + "</a>"
        if titre in groupes["#photo"]:
            html += htmlphoto
        if titre in groupes["#materiel"]:
            html += htmlmateriel
        html += titre[i:] + "</li>\n"
        index.write(html)
print("Index généré")

os.system("cp genererhtml.py html/")
os.system("cp -Rf images html/images")
