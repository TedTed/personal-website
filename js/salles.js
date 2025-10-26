var fondCarte = new Array(29);
for (var i = 0 ; i < fondCarte.length ; i++) {
    s = "";
    for (var k = 0 ; i < s ; k++)
        s += " ";
    fondCarte[i] = s
}

/**
 * salles est une map qui à l'identifiant de chaque salle (une chaîne de
 * caractères) associe les informations relatives à cette salle. Chacun de ses
 * objets contient : 
 *
 * - un fond de carte - le plan de la salle en question, sous la forme d'un
 *   tableau de chaînes de caractère (voir l'exemple de salles["Centre"]) ;
 * - deux champs posX et posY contenant l'information de la positition absolue
 *   de la salle par rapport à la grosse carte globale ;
 * - un champ facultatif portes, qui contient les positions des différentes
 *   portes de la pièce, et l'identifiant de la salle sur laquelle chacune
 *   débouche ;
 * - et une fonction initialisation, qui dit ce qui se passe lors de l'ouverture
 *   de la salle.
 *
 */
var salles = {
    "Centre" : 
    {
       carte : 
           ["┌───────────────+────────────────────────┐",
            "│........................................│",
            "+........................................│",
            "│........................................│",
            "│........................................│",
            "│........................................+",
            "│........................................│",
            "│........................................│",
            "│........................................│",
            "│........................................│",
            "+........................................│",
            "│........................................│",
            "│........................................│",
            "│........................................│",
            "│........................................│",
            "│........................................│",
            "└─────────+───────────────────+──────────┘"],
        posX : 20, posY : 5,
        portes : 
           [{posX : 16 , posY : 0 , destination : "Haut"},
            {posX : 0 , posY : 2 , destination : "GaucheHaut"},
            {posX : 0 , posY : 10 , destination : "GaucheBas"},
            {posX : 10 , posY : 16 , destination : "BasGauche"},
            {posX : 30 , posY : 16 , destination : "BasDroite"},
            {posX : 41 , posY : 5 , destination : "Droite"}],
        initialiser : function() {
            var tailleX = 42;
            var tailleY = 17;

            // On met quelques piscines
            var nbMaxPiscines = 10;
            var symbolePiscine = objet["piscine"].code;
            var nbPiscines = Math.floor(Math.random() * nbMaxPiscines + 1);
            for (var i = 0 ; i < nbPiscines ; i++) {
                var x = Math.floor(Math.random() * (tailleX-2) + 1);
                var y = Math.floor(Math.random() * (tailleY-2) + 1);
                this.carte[y] = remplacer(this.carte[y],symbolePiscine,x);
            }

            // On met trois fontaines
            var symboleFontaine = objet["fontaine"].code;
            for (var i = 1 ; i <= 3 ; i++) {
                var x = Math.floor(Math.random() * (tailleX-2) + 1);
                var y = Math.floor(Math.random() * (tailleY-2) + 1);
                this.carte[y] = remplacer(this.carte[y],symboleFontaine,x);
            }

            // On ajoute les portes
            ajouterPortes(this.carte, this.portes);

        }
    },
    "Haut" : 
    {
        carte :
           ["┌──────────────────────────────────┐",
            "│.Hey.!.I.am.Damien.Desfontaines...│",
            "│.........Nice.to.meet.you.!.......│",
            "│..............`...................│",
            "└──────────.───────────────────────┘"],
        posX : 25,
        posY : 0,
        initialiser : function() {
            this.carte[1] = remplacer(this.carte[1],objet["potionverte"],6);
            this.carte[2] = remplacer(this.carte[1],objet["potionrouge"],27);
        }
    },
    "GaucheHaut" :
    {
        carte :
           ["┌──────────────────┐",
            "│...I.study........│",
            "│.computer.science*│",
            "│..at.the.ENS.Paris│",
            "│..................│",
            "│(in.France)........",
            "└──────────────────┘"],
        posX : 0,
        posY : 2,
        initialiser : function() {}
    },
    "GaucheBas" :
    {
        carte :
           ["┌─────────────────┐",
            "│.I.also.train....│",
            "│..First-year-....│",
            "│.students.of.the.│",
            "│..Louis-le-Grand.│",
            "│...french school..",
            "│.to.oral.exams...│",
            "│..in.mathematics.│",
            "│.................│",
            "│Here.+.are.a.few.│",
            "│.vicious.problems│",
            "└─────────────────┘"],
        posX : 1,
        posY : 10,
        initialiser : function() {}
    },
    "Droite" :
    {
        carte :
           ["┌─────────────────┐",
            "│.................│",
            "│.I.like.:........│",
            "│..-.Music.♫......│",
            "│..-.Video.games*.│",
            "│..-.Bicycle......│",
            "│..-.Theater......│",
            "...-.Role-playing.│",
            "│......games......│",
            "│..-.Open-source..│",
            "│.....programming.│",
            "│..-.Mathematical.│",
            "│.......logic.....│",
            "│..-.Useless......│",
            "│.........things..│",
            "│..-.Chocolate./..│",
            "│..-.Good.tea.%...│",
            "│.................│",
            "└─────────────────┘"],
        posX : 62,
        posY : 3,
        initialiser : function() {}
    },
    "BasGauche" :
    {
        carte :
           ["┌────────────────────────.───────────┐",
            "│.......Here.you.can.find.:..........│",
            "│..My.e-mail.:.|.....................│",
            "│.My.CV.:.?............My.PGP.key.:.⚷│",
            "│My.publications.:. .................│",
            "└────────────────────────────────────┘"],
        posX : 5,
        posY : 22,
        initialiser : function() {}
    },
    "BasDroite" :
    {
        carte :
           ["┌─────.───────────────────┐",
            "│.........................│",
            "│I'm.also.known.as.Ted....│",
            "│..Or.sometimes,.TedTed...│",
            "│...Or.even.TedTedTed.....│",
            "│...(You.got.my.point)...*│",
            "└─────────────────────────┘"],
        posX : 44,
        posY : 22,
        initialiser : function() {}
    }
};

/**
 * Tableau contenant le nom des salles
 */
var nomsSalles = ["Centre", "Haut", "GaucheHaut", "GaucheBas", "BasGauche",
    "BasDroite", "Droite"];

/**
 * Fonction auxiliaire ajoutant automatiquement les portes à une carte. Ne
 * renvoie rien, change le tableau donné en argument.
 */
function ajouterPortes(carte,portes) {
    var nbPortes = portes.length;
    var symbolePorte = objet["portefermee"].code;
    for (var i = 0 ; i < nbPortes ; i++) {
        var porte = portes[i];
        var x = porte.posX;
        var y = porte.posY;
        carte[y] = remplacer(carte[y],symbolePorte,x);
    }
}
