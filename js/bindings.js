/**
 * Associations touches du clavier → actions
 */

/* Déplacements */
Mousetrap.bind(['h', 'left'], function() {
    deplacement(-1,0);
});
Mousetrap.bind('y', function() {
    deplacement(-1,-1);
});
Mousetrap.bind(['k', 'up'], function() {
    deplacement(0,-1);
});
Mousetrap.bind('u', function() {
    deplacement(1,-1);
});
Mousetrap.bind(['l', 'right'], function() {
    deplacement(1,0);
});
Mousetrap.bind('n', function() {
    deplacement(1,1);
});
Mousetrap.bind(['j', 'down'], function() {
    deplacement(0,1);
});
Mousetrap.bind('b', function() {
    deplacement(-1,1);
});
Mousetrap.bind('.', function() {
    deplacement(0,0);
});

/* Prendre un truc par terre */
Mousetrap.bind('p', function() {
    prendreParTerre();
});

/* Afficher l'inventaire */
Mousetrap.bind('i', function() {
    ouvrirInventaire();
});


/* Debug */
Mousetrap.bind('m', function() {
    menu = creerMenu(["wat", "whoopitywhat", "huhu"]);
    afficherMenu(menu);
});
