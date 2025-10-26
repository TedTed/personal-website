/*
 * Fichier contenant les fonctions d'affichage.
 */

/**
 * Fonction prenant en argument un tableau de chaînes de caractères et renvoyant
 * le même tableau, où tous les caractères unicode représentant des objets sont
 * renvoyés par le code HTML qui les affiche correctement.
 */
function traduireCarte(tableau) {
    taille = tableau.length;
    renvoi = new Array(taille);
    for (var l = 0 ; l < taille ; l++) {
        var t = tableau[l].length;
        var c = "";
        for (var i = 0 ; i < t ; i++) {
            c += objetsParCode[tableau[l].charAt(i)].html;
        }
        renvoi[l] = c;
    }
    return renvoi;
}

/**
 * Fonction prenant en argument un tableau de chaînes de caractères et renvoyant
 * le même tableau, où on a ajouté le joueur à la position indiquée par les
 * variables (globales) d'état.
 */
function ajouterJoueur(tableau) {
    taille = tableau.length;
    // On copie le tableau
    renvoi = new Array(taille);
    for (var i = 0 ; i < taille ; i++)
        renvoi[i] = tableau[i];
    // On modifie la bonne ligne pour y ajouter le code du joueur
    var chaine = renvoi[posYjoueur];
    var debut = chaine.substr(0,posXjoueur);
    var fin = chaine.substr(posXjoueur+1);
    renvoi[posYjoueur] = debut + objetsParNom["joueur"].code + fin;
    // Et on retourne ce qu'il faut
    return renvoi;
}

/**
 * Fonction affichant la carte sur la page
 */
function afficherCarte() {
    var carteAffichable = traduireCarte(ajouterJoueur(carte));
    var div = document.getElementById('carte');
    div.innerHTML = tableauEnChaine(carteAffichable)
}

/**
 * Fonction affichant un message dans la barre du haut
 */
function afficherMessage(message) {
    var baliseMessage = document.getElementById('barreHaut');
    baliseMessage.innerHTML = message;
}

/**
 * Fonction vidant la barre du haut
 */
function enleverMessage() {
    var baliseMessage = document.getElementById('barreHaut');
    baliseMessage.innerHTML = "<br/>";
}

/**
 * Affiche un menu (sous la forme d'un tableau de chaînes)
 */
function afficherMenu(tableau) {
    var div = document.getElementById("menu");
    // On remplit le menu
    div.innerHTML = tableauEnChaine(tableau);
    // On le rend visible
    div.style.display = "inline";
    // Et on le centre bien (l'ordre n'est pas logique, because of reasons)
    div.style.left = (window.innerWidth - div.offsetWidth)/2 + 'px';
}

/**
 * Enlève le menu de l'écran
 */
function cacherMenu() {
    var div = document.getElementById("menu");
    div.style.display = "none";
}
