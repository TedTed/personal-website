var chaine = "abcde";

var chaine2 = "am";

var tab = ["abcd","efgh","ijkl"];
var tab2 = ["12","45"];

var tableau = remplacer2D(tab,tab2,2,1);

var carte = salles["Centre"].carte;

carte[3] = remplacer(carte[3],objetsParNom["potionverte"].code,3);

/*
for (i = 0 ; i < nomsSalles.length ; i++) {
    salle = salles[nomsSalles[i]];
    salle.initialiser();
    carte = remplacer2D(carte,salle.carte,salle.posX,salle.posY);
}
*/

var carteAffichable = traduireCarte(carte);

afficherCarte()

console.log("Joueur : (" + posXjoueur + "," + posYjoueur + ")")

function debug() {
}

//var balise = document.getElementById('body');
//balise.innerHTML = tableauEnChaine(carteAffichable);
//balise.innerHTML = unicode + "<br/>Taille : " + unicode.length;
//balise.innerHTML = test.search(/protch/);
