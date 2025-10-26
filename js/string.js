/* Fonctions auxiliaires de gestion de chaînes de caractères en Javascript. Des
meilleures solutions existent déjà probablement dans la librairie standard,
mais à l'heure où j'écris ces, je n'ai pas Internet et la seule documentation
dont je dispose date de 2000. */

/*
 * Remplace une partie d'une chaîne par une sous-chaîne.
 *      remplacer("coucou", "hi", 2) = "cohiou"
 */
function remplacer(chaine, souschaine, index) {
    var fin = index + souschaine.length;
    if (souschaine.length + index > chaine.length)
        alert("bug : remplacer(" + chaine + "," + souschaine + "," + index + ")");
    return chaine.substr(0,index) + souschaine + chaine.substr(fin)
}

/*
 * Remplace une partie d'un tableau de chaînes de caractères. C'est l'équivalent
 * de la fonction remplacer, mais en deux dimensions. Les deux tableaux sont
 * supposés être rectangulaires (c'est-à-dire que toutes les chaînes ont la même
 * taille), si ça n'est pas le cas, la fonction a probablement un comportement
 * bizarre.
 *      remplacer2D(["abcd","efgh","ijkl","mnop"],["12","34"],1,2) =
 *          ["abcd","ef12","ij34"]
 */
function remplacer2D(tableau, soustableau, x, y) { 
    var taille1 = tableau.length;
    var taille2 = soustableau.length;
    var nouveauTab = new Array(taille1);
    if (taille2 + y > taille1 || soustableau[0].length + x > tableau[0].length)
        alert("bug : remplacer2D([" + tableau + "],[" 
                + soustableau + "]," + x + "," + y + ")")
    for (var i = 0 ; i < y ; i++)
        nouveauTab[i] = tableau[i];
    for (var i = y ; i < y + taille2 ; i++)
        nouveauTab[i] = remplacer(tableau[i], soustableau[i-y], x);
    for (var i = y + taille2 ; i < taille1 ; i++)
        nouveauTab[i] = tableau[i];
    return nouveauTab;
}

/*
 * Transforme un tableau de chaîne de caractères en grosse chaîne de caractères
 * avec des retours à la ligne entre chaque chaîne du tableau.
 *      tableauEnChaine(["abcd","efgh","ijkl"]) = "abcd<br/>efgh<br/>ijkl"
 */
function tableauEnChaine(tab) {
    var chaine = tab[0];
    for (var i = 1 ; i < tab.length ; i ++)
        chaine = chaine + "<br/>" + tab[i];
    return chaine;
}
