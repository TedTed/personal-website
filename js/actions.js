/**
 * Fichier contenant toutes les actions que le joueur peut faire
 */

/**
 * Fonction exécutée à la fin de chaque tour : on s'occupe des monstres, on
 * vérifie qu'on est pas morts, et on rafraîchit l'affichage de la page.
 */
function finTour() {
    // TODO monstres
    afficherCarte();
}

/**
 * Fonction auxiliaire qui renvoie l'objet de la case sur laquelle on se trouve.
 */
function objetCourant() {
    return objetsParCode[carte[posYjoueur].charAt(posXjoueur)];
}

/**
 * Bouger
 */
function deplacement(deltaX, deltaY) {
    if (menuVisible)
        return;
    if (Math.abs(deltaX) > 1 || Math.abs(deltaY) > 1)
        console.log("Déplacement trop long: (" + deltaX + "," + deltaY + ")");
    nouveauX = posXjoueur + deltaX;
    nouveauY = posYjoueur + deltaY;
    //console.log("(" + posXjoueur + "," + posYjoueur + ") → " + 
    //            "(" + nouveauX + "," + nouveauY + ")");
    if (deltaX*deltaX + deltaY*deltaY > 0) {
        objet = objetsParCode[carte[nouveauY].charAt(nouveauX)];
        console.log(objet);
        if ("marcherDessus" in objet) {
            if (objet.marcherDessus()) {
                posXjoueur = nouveauX;
                posYjoueur = nouveauY;
            }
        }
    }
    afficherCarte();
    //finTour();
}

/**
 * Prendre un truc par terre
 */
function prendreParTerre() {
    if (menuVisible)
        return;
    objet = objetCourant();
    if (! ("prendre" in objet)) {
        afficherMessage("There is nothing to pick up here.");
    } else if (objet.prendre()) {
        inventaire.push(objet);
        if ("enDessous" in objet)
            carte[posYjoueur] = remplacer(carte[posYjoueur], objet.enDessous, posXjoueur);
        else
            carte[posYjoueur] = remplacer(carte[posYjoueur], ".", posXjoueur);
    }
    console.log(inventaire);
    console.log(creerInventaire());
    finTour();
}

/**
 * Afficher/cacher l'inventaire
 */
function ouvrirInventaire() {
    console.log(creerInventaire());
    if (menuVisible)
        cacherMenu();
    else
        afficherMenu(creerInventaire());
    menuVisible = ! menuVisible;
}
