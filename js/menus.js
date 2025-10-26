/**
 * Fichier contenant les fonctions de création et de manipulation de menus. Pour
 * afficher un menu, on doit appeler la fonction afficherMenu(), dont le code se
 * trouve dans le fichier affichage.js.
 */

/**
 * Transforme un tableau de chaînes de caractères en menu carré affichable.
 */
function creerMenu(tableau) {
    var taille = tableau.length;
    var menu = new Array(taille+2);
    // On calcule la taille horizontale du menu
    var longueurMax = 0;
    for (var i = 0 ; i < taille ; i++)
        if (longueurMax < tableau[i].length)
            longueurMax = tableau[i].length;
    // On crée une barre de ─
    var barre = "";
    for (var i = 0 ; i < longueurMax ; i++)
        barre += "─";
    // Et on remplit le menu avant de le renvoyer
    menu[0] = "┌" + barre + "┐";
    for (var i = 0 ; i < taille ; i++) {
        var fin = "";
        var tailleReste = longueurMax - tableau[i].length;
        for (var j = 0 ; j < tailleReste ; j++)
            fin += " ";
        menu[i+1] = "│" + tableau[i] + fin + "│";
    }
    menu[taille+1] = "└" + barre + "┘";
    return menu;
}

/**
 * À partir de la variable inventaire de etat.js, crée un menu affichable.
 */
function creerInventaire() {
    n = inventaire.length;
    if (n == 0)
        return creerMenu([""," Your inventory is empty! ",""]);
    liste = [" Inventory contents: "];
    for (var i = 0 ; i < n ; i++) {
        liste.push(" - " + inventaire[i].nomInventaire + " ");
    }
    return creerMenu(liste);
}
