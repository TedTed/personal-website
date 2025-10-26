/**
 * Fichier contenant l'initialisation du système, et la boucle principale qui
 * appelle tout le reste.
 */

/**
 * Mappings clavier
 */
Mousetrap.bindGlobal('y', bougerHG, 'keypress');
Mousetrap.bindGlobal('k', bougerH, 'keypress');
Mousetrap.bindGlobal('u', bougerHD, 'keypress');
Mousetrap.bindGlobal('h', bougerG, 'keypress');
Mousetrap.bindGlobal('l', bougerD, 'keypress');
Mousetrap.bindGlobal('b', bougerBG, 'keypress');
Mousetrap.bindGlobal('j', bougerB, 'keypress');
Mousetrap.bindGlobal('n', bougerBD, 'keypress');
Mousetrap.bindGlobal('v', enleverMessage, 'keypress');

/**
 * Fonctions de déplacement
 */
function bougerHG() {bouger(-1,-1)}
function bougerH() {bouger(0,-1)}
function bougerHD() {bouger(1,-1)}
function bougerG() {bouger(-1,0)}
function bougerD() {bouger(1,0)}
function bougerBG() {bouger(-1,1)}
function bougerB() {bouger(0,1)}
function bougerBD() {bouger(1,1)}
function bouger(dx,dy) {
    var x = posXjoueur + dx;
    var y = posYjoueur + dy;
    function estObjetMarchable(code) {
        return code in objetCode && objet[objetCode[code]].marchable
    }
    if (0 <= y && y < carte.length && 0 <= x && x < carte[y].length) {
        var code = carte[y][x];
        if (code == ".") {
            posXjoueur = x;
            posYjoueur = y;
        } else if (code in objetCode && objet[objetCode[code]].marchable) {
            posXjoueur = x;
            posYjoueur = y;
            objet[objetCode[code]].marcherDessus();
        } else {
            afficherMessage("You can't go there.")
        }
    }
    afficherCarte();
}

////////////////////
// Initialisation //
////////////////////

var carte = fondCarte;

// On affiche toutes les salles - TODO n'afficher que la première
var salleDepart = salles["Centre"];
salleDepart.initialiser();
carte = remplacer2D(carte,salleDepart.carte,salleDepart.posX,salleDepart.posY);
/*
for (i = 0 ; i < nomsSalles.length ; i++) {
    salle = salles[nomsSalles[i]];
    salle.initialiser();
    carte = remplacer2D(carte,salle.carte,salle.posX,salle.posY);
}
*/

enleverMessage();
afficherCarte();

menuCourant = creerMenu(["aaaa","aaaa","aaaa","aaa"]);

afficherMenu();

function mourir() {}
