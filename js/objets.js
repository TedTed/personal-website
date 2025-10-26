/*
 * L'idée générale du codage des objets est que chaque « objet » (et ici, par
 * « objet », on entend « tous les trucs susceptibles de s'afficher ») est codé
 * comme un caractère unicode, parfois simple (" " pour un mur solide, "." pour
 * une case…) et parfois d'une plage unicode absurde genre \u5000 → \u6000. Ça
 * permet d'utiliser les fonctions de remplacement rapide de morceaux de carte
 * de string.js. Bien sûr, elles ne sont pas affichées tel quel, donc une table
 * inverse est nécessaire pour afficher, pour chaque objet, le code HTML
 * correspondant.
 */

// Noms de parchemin (TODO le mettre à un endroit plus pertinent)
var nomsParchemin = ["YUM YUM","VE FORBRYDERNE","XIXAXA XOXAXA XUXAXA","PRIRUTSENIE","HACKEM MUCHE"]

/** Map associant à un nom d'objet ses propriétés sous la forme d'un objet :
 *
 * - le champ html donne le code HTML à afficher sur la page ;
 * - le champ code donne le code Unicode pour la représentation interne ;
 * - la fonction marcherDessus donne ce qui se passe lorsque le joueur marche,
 *   ou essaie de marcher sur cet objet — elle existe ssi le déplacement est
 *   possible (potentiellement) et retourne « true » si le déplacement a réussi,
 *   et « false » si le joueur n'a en fait pas bougé ;
 * - la fonction prendre donne ce qui se passe lorsque le joueur essaie de
 *   prendre l'objet — elle existe ssi c'est possible (potentiellement), et
 *   retourne « true » ssi le joueur a réussi à prendre l'objet ;
 * - le champ « enDessous » donne le code de ce qu'il y a en-dessous de l'objet,
 *   pour savoir quoi afficher lorsqu'il est pris (s'il n'existe pas et que
 *   l'objet est prenable, alors on considère qu'il y a un sol simple
 *   en-dessous) ;
 * - le champ nomInventaire donne le nom qui doit s'afficher dans l'inventaire
 *   lorsque le joueur a pris l'objet ;
 */
var objetsParNom = {
    "sol" : {
        html : ".",
        code : ".",
        marcherDessus : function () { 
            return true; 
        }
    },
    "murVertical" : {
        html : "│",
        code : "│",
    },
    "murHorizontal" : {
        html : "─",
        code : "─",
    },
    "coinHautGauche" : {
        html : "┌",
        code : "┌",
    },
    "coinHautDroite" : {
        html : "┐",
        code : "┐",
    },
    "coinBasGauche" : {
        html : "└",
        code : "└",
    },
    "coinBasDroite" : {
        html : "┘",
        code : "┘",
    },
    "rien" : {
        html : " ",
        code : " ",
    },
    "piscine" : {
        html : "<span class='blue'>♦</span>",
        code : "\u5000",
        marcherDessus : function() {
            afficherMessage("You sink like a rock. You die…");
            mourir();
            return true; // TODO pas sûr qu'il faille retourner true lorsqu'on meurt
            // TODO marcher sur l'eau
        }
    },
    "portefermee" : {
        html : "<span class='brown'>+</span>",
        code : "+",
        marcherDessus : function() {
            afficherMessage("This door is closed.");
            return false;
        }
    },
    "porteouverte" : {
        html : "<span class='brown'>-</span>",
        code : "\u5002",
        marcherDessus : function() { }
    },
    /* TODO la gestion des monstres devrait se faire à part
    "newtvivant" : {
        html : "<span class='yellow'>:</span>",
        code : "\u5003",
    }, */
    "newtmort" : {
        html : "<span class='yellow'>%</span>",
        code : "\u5004",
        marcherDessus : function() {
            afficherMessage("You see here a newt corpse. It seems legit.");
            return true;
        },
        prendre : function () {
            // TODO
        }
    }, 
    "potionverte" : {
        html : "<span class='green'>!</span>",
        code : "\u5005",
        marcherDessus : function() {
            afficherMessage("You see here a green bubbly potion. It looks good, and you're thirsty.");
            return true;
        },
        prendre : function () {
            afficherMessage("You pick up the green potion. Damn, it looks so delicious…");
            return true;
        },
        nomInventaire : "a green bubbly potion",
    },
    "potionrouge" : {
        html : "<span class='red'>!</span>",
        code : "\u5006",
        marcherDessus : function() {
            afficherMessage("You see here a smoky red potion. It looks hot. Very hot.");
            return true;
        },
        prendre : function () {
            afficherMessage("You pick up the red potion, burning your fingers a little.");
            return true;
        },
        nomInventaire : "a smoky red potion"
    },
    "grimoire" : {
        html : "<span class='green'>+</span>",
        code : "\u5007",
        marcherDessus : function() {
            // TODO
            return true;
        },
        prendre : function () {
            afficherMessage("TODO");
            return true;
        },
        nomInventaire : "a spellbook with <a href=\"./Colles/\" target=_blank>complicated exercises</a><br/>",
    },
    "album" : {
        html : "<span class='purple'>♫</span>",
        code : "\u5008",
        marcherDessus : function() {
        },
        prendre : function () {
            afficherMessage("You pick up the album.");
            return true;
        },
        nomInventaire : "a <a href=\"TODO rickroll\" target=_blank>groovy album</a>",
    },
    /* TODO
    "cv" : {
        html : "?",
        code : "\u5009",
        marcherDessus : function() {
        }
    },
    */
    "coffre" : {
        html : "<span class='brown'>(</span>",
        code : "\u5010",
        marcherDessus : function() {
            afficherMessage("You see here a chest. Maybe there's something in it?"); 
            return true;
        },
        prendre : function() {
            afficherMessage("Let's see… Hmgnf! Nope. The chest is too heavy to be picked up.");
            return false;
        }
    },
    "rubis" : {
        html : "<span class='red'>*</span>",
        code : "\u5011",
        marcherDessus : function() {
            afficherMessage("You see here a ruby. It looks like someone has engraved something in the ground with it…
        },
        prendre : function() {
            afficherMessage("You pick up the ruby. It is very pure…");
            return true;
        },
        nomInventaire : "a very pure ruby",
    },
    "saphir" : {
        html : "<span class='blue'>*</span>",
        code : "\u5012",
        marcherDessus : function() {
            afficherMessage("You see here a sapphire. There seems to be something written beneath it…");
        },
        prendre : function() {
            afficherMessage("You pick up the sapphire. It is beautiful…");
            return true;
        },
        nomInventaire : "a beautiful sapphire",
    },
    "emeraude" : {
        html : "<span class='green'>*</span>",
        code : "\u5013",
        marcherDessus : function() {
            afficherMessage("You see here a shiny emerald.");
        },
        prendre : function() {
            afficherMessage("You pick up the emerald. It looks nice…");
            return true;
        },
        nomInventaire : "a shiny emerald",
    },
    "gravurerubis" : {
        html : "<span class='red'>.</span>",
        code : "\u5014",
        marcherDessus : function() {
        } // TODO
    },
    "gravuresaphir" : {
        html : "<span class='blue'>.</span>",
        code : "\u5015",
        marcherDessus : function() {
        } // TODO
    },
    "gravureemeraude" : {
        html : "<span class='green'>.</span>",
        code : "\u5016",
        marcherDessus : function() {
        } // TODO
    },
    "joueur" : {
        html : "<span id='joueur'>@</span>",
        code : "\u5017",
    },
    /*
    "golem" : {
        html : "<span class='yellow'>'</span>",
        code : "\u5018",
    },
    */
    "sous" : {
        html : "<span class='yellow'>฿</span>",
        code : "\u5019",
        marcherDessus : function() {
        },
        prendre : function() {
            afficherMessage("TODO");
            return true;
        },
        nomInventaire : "TODO",
    },
    "epee" : {
        html : "<span class='lightblue'>)</span>",
        code : "\u5020",
        marcherDessus : function() {
        },
        prendre : function() {
            afficherMessage("TODO");
            return true;
        },
        nomInventaire : "TODO",

    },
    "fontaine" : {
        html : "<span class='blue'>{</span>",
        code : "\u5021",
        marcherDessus : function() {
        },
        prendre : function() {
            afficherMessage("TODO");
            return false;
        },
        nomInventaire : "TODO",
    },
    "dragon" : {
        html : "<span class='red'>d</span>",
        code : "\u5022",
    },
    "dragonmort" : {
        html : "<span class='red'>%</span>",
        code : "\u5023",
        marcherDessus : function() {
        },
        prendre : function() {
            afficherMessage("TODO");
            return false;
        },
        nomInventaire : "TODO",
    },
    "plaque" : {
        html : "<span class='lightgray'>-</span>",
        code : "\u5024",
        marcherDessus : function() {
        }
    },
    "cle" : {
        html : "⚷",
        code : "\u5025",
        marcherDessus : function() {
        },
        prendre : function() {
            afficherMessage("TODO");
            return false;
        },
        nomInventaire : "TODO",

    },
    "amulette" : {
        html : "<span class='gray'>,</span>",
        code : "\u5026",
        marcherDessus : function() {
        },
        prendre : function() {
            afficherMessage("TODO");
            return false;
        },
        nomInventaire : "TODO",

    },
    "sac" : {
        html : "<span class='lightbrown'>(</span>",
        code : "\u5027",
        marcherDessus : function() {
        },
        prendre : function() {
            afficherMessage("TODO");
            return false;
        },
        nomInventaire : "TODO",

    },
    "chocolat" : {
        html : "<span class='brown'>/</span>",
        code : "\u5028",
        marcherDessus : function() {
        },
        prendre : function() {
            afficherMessage("TODO");
            return false;
        },
        nomInventaire : "TODO",

    },
    "the" : {
        html : "<span class='green'>%</span>",
        code : "\u5029",
        marcherDessus : function() {
        },
        prendre : function() {
            afficherMessage("TODO");
            return false;
        },
        nomInventaire : "TODO",
    },
    "sage" : {
        html : "<span class='purple'>@</span>",
        code : "\u5030",
    },
    "autel" : {
        html : "<span class='lightgray'>_</span>",
        code : "\u5031",
        marcherDessus : function() {
        }
    },
}

/**
 * Map associant à un caractère unicode l'objet correspondant
 */
var objetsParCode = {
    "."      : objetsParNom["sol"],
    "│"      : objetsParNom["murVertical"],
    "─"      : objetsParNom["murHorizontal"],
    "┌"      : objetsParNom["coinHautGauche"],
    "┐"      : objetsParNom["coinHautDroite"],
    "└"      : objetsParNom["coinBasGauche"],
    "┘"      : objetsParNom["coinBasDroite"],
    "+"      : objetsParNom["portefermee"],
    "\u5000" : objetsParNom["piscine"],
    "\u5002" : objetsParNom["porteouverte"],
    "\u5003" : objetsParNom["newtvivant"],
    "\u5004" : objetsParNom["newtmort"],
    "\u5005" : objetsParNom["potionverte"],
    "\u5006" : objetsParNom["potionrouge"],
    "\u5007" : objetsParNom["grimoire"],
    "\u5008" : objetsParNom["album"],
    "\u5009" : objetsParNom["cv"],
    "\u5010" : objetsParNom["coffre"],
    "\u5011" : objetsParNom["rubis"],
    "\u5012" : objetsParNom["saphir"],
    "\u5013" : objetsParNom["emeraude"],
    "\u5014" : objetsParNom["gravurerubis"],
    "\u5015" : objetsParNom["gravuresaphir"],
    "\u5016" : objetsParNom["gravureemeraude"],
    "\u5017" : objetsParNom["joueur"],
    "\u5018" : objetsParNom["golem"],
    "\u5019" : objetsParNom["sous"],
    "\u5020" : objetsParNom["epee"],
    "\u5021" : objetsParNom["fontaine"],
    "\u5022" : objetsParNom["dragon"],
    "\u5023" : objetsParNom["dragonmort"],
    "\u5024" : objetsParNom["plaque"],
    "\u5025" : objetsParNom["cle"],
    "\u5026" : objetsParNom["amulette"],
    "\u5027" : objetsParNom["sac"],
    "\u5028" : objetsParNom["chocolat"],
    "\u5029" : objetsParNom["the"],
    "\u5030" : objetsParNom["sage"],
    "\u5031" : objetsParNom["autel"],
}

/**
 * Fonction associant à un objet le fait qu'on puisse marcher dessus ou non.
 * Accepte en argument aussi bien une chaîne de caractères (nom ou code de
 * l'objet) que l'objet lui-même.
 */

function estMarchable(objet) {
    if (typeof objet == 'string') {
        if (objet in objetsParNom)
            return estMarchable(objetsParNom[objet]);
        else if (objet in objetsParCode)
            return estMarchable(objetsParCode[objet]);
        else
            console.log("Bug: estMarchable(" + objet + ")");
    }
    return ("marcherDessus" in objet);
}

