/*
 * Script JavaScript qui génère un simili-nethack pour une page perso.
 * Licence : Domaine public (CC0 1.0 -
 * http://creativecommons.org/publicdomain/zero/1.0/). De toute façon, il
 * faudrait être fou pour réutiliser du code aussi crade.
 * Fait en une nuit, entre le 6 et le 7 juillet 2012.
 */

/*
 * Oh, par ailleurs, essayez de gagner la partie sans lire le code source, c'est
 * largement faisable. J'estime à environ une dizaine de parties la durée
 * nécessaire pour arrêter de mourir à cause des divers pièges, et arriver à
 * gagner sans aide ni lecture du code source. Autrement dit, c'est *très*
 * gentil par rapport à, au hasard, le véritable NetHack.
 */

/*
 * Convention :
 *  /-----> x
 *  |
 *  |
 *  |
 *  v
 *  y

/*
 * TODO
 * - Des passages secrets
 * - Des pièges
 * - Des easter eggs débiles
 * - Un papier scientifique
 * - Thé & Fontaine
 * - Chocolat & Dragon
 */

//--------------
//- Constantes -
//--------------

// Cases
var PISCINE = "<span class='blue'>♦</span>";
var PORTEFERMEE = "<span class='brown'>+</span>";
var PORTEOUVERTE = "<span class='brown'>-</span>";
var NEWTVIVANT = "<span class='yellow'>:</span>";
var NEWTMORT = "<span class='yellow'>%</span>";
var POTIONVERTE = "<span class='green'>!</span>";
var POTIONROUGE = "<span class='red'>!</span>";
var GRIMOIRE = "<span class='green'>+</span>";
var ALBUM = "<span class='purple'>♫</span>";
var CV = '?';
var COFFRE = "<span class='brown'>(</span>";
var RUBIS = "<span class='red'>*</span>";
var SAPHIR = "<span class='blue'>*</span>";
var EMERAUDE = "<span class='green'>*</span>";
var GRAVURERUBIS = "<span class='red'>.</span>";
var GRAVURESAPHIR = "<span class='blue'>.</span>";
var GRAVUREEMERAUDE = "<span class='green'>.</span>";
var JOUEUR = "<span id='joueur'>@</span>";
var GOLEM = "<span class='yellow'>'</span>";
var SOUS = "<span class='yellow'>฿</span>";
var EPEE = "<span class='lightblue'>)</span>";
var FONTAINE = "<span class='blue'>{</span>";
var DRAGON = "<span class='red'>D</span>";
var DRAGONMORT = "<span class='red'>%</span>";
var PLAQUE = "<span class='lightgray'>-</span>";
var CLE = "⚷";
var AMULETTE = "<span class='gray'>,</span>";
var SAC = "<span class='lightbrown'>(</span>";
var CHOCOLAT = "<span class='brown'>/</span>";
var THE = "<span class='green'>%</span>";
var SAGE = "<span class='purple'>@</span>";
var AUTEL = "<span class='lightgray'>_</span>";

// Valeurs de personnage
var ALIGNEMENTS = ["loyal", "neutral", "chaotic"];
var GENRES = ["male", "female"];
var RACES = ["human", "elfic", "dwarven", "orcish", "gnomish"];
var CLASSES = ["Archeologist", "Barbarian", "Caveman", "Healer", "Knight", "Monk", "Priest", "Ranger", "Rogue", "Samurai", "Tourist", "Valkyrie", "Wizard"];


//--------------
//- Paramètres -
//--------------

// Grosse carte
var largeurCarre = 42;
var hauteurCarre = 17;
var margeX = 20;
var margeY = 5;
var largeur = largeurCarre + 2 * margeX;
var hauteur = hauteurCarre + 2 * margeY + 2;
var posXDepart = margeX + Math.floor(largeurCarre / 2);
var posYDepart = margeY + Math.floor(hauteurCarre / 2);
//var posXDepart = 21
//var posYDepart = 16

// Salles
var debutSalleX = [0 , 25, 62, 1 , 5 , 44];
var debutSalleY = [2 , 0 , 3 , 10, 22, 22];
var finSalleX =   [19, 60, 80, 19, 42, 70];
var finSalleY =   [8 , 4 , 21, 21, 27, 28];

// Portes
var portesX = [20, 36, 61, 20, 30, 50];
var portesY = [7 , 5 , 10, 15, 21, 21];

// Nombres de piscines
var nbMaxPiscines = 10;



//--------------------
//- Variables d'état -
//--------------------

// Temps écoulé
var temps = 0;

// Position
var posX = posXDepart;
var posY = posYDepart;
var casePrecedente = '.';

// Dragon
var dragonMort = false;
var posXDragon = 0;
var posYDragon = 0;
var casePrecedenteDragon = '.';

// Joueur
var niveau = 1;
var alignement = "";
var genre = "";
var race = "";
var classe = "";
var aRencontreSage = false;
var aGagne = false;
var dieuEnerve = false;
var estMort = false;
var estResistantAuFeu = true;
var aSaphir = false;
var aEmeraude = false;
var aRubis = false;
var aSous = false;
var aEpee = false;
var estEmpoisonnee = false;
var aExcalibur = false;
var aGrimoire = false;
var aCV = false;
var aPotionVerte = false;
var aPotionRouge = false;
var aAlbum = false;
var aCorpsDragon = false;
var aCle = false;
var aBouclier = false;
var aChocolat = false;
var aThe = false;
var aBougies = false;


//------------------
//- Initialisation -
//------------------

// Initialisation de la map
var carte = new Array(hauteur);
for(var y = 0 ; y < hauteur ; y++) {
    carte[y] = new Array(largeur);
}

// Initialisation des paramètres
initialisation();


//--------------
//- Évènements -
//--------------
document.addEventListener('keydown', function(e) {
    var ok = false;
    var touche = String.fromCharCode(e.keyCode).toLowerCase();
    var key = e.keyCode;
    temps++;
    if (estMort || aGagne) {
        return false;
    } else if (touche == "y" || key == 103) { // Déplacements...
        ok = true;
        bouger(-1, -1);
    } else if (touche == "k" || key == 38 || key == 104) {
        ok = true;
        bouger(0, -1)
    } else if (touche == "u" || key == 105) {
        ok = true;
        bouger(1, -1);
    } else if (touche == "h" || key == 37 || key == 100) {
        ok = true;
        bouger(-1, 0);
    } else if (touche == "l" || key == 39 || key == 102) {
        ok = true;
        bouger(1, 0);
    } else if (touche == "j" || key == 40 || key == 98) {
        ok = true;
        bouger(0, 1);
    } else if (touche == "b" || key == 97) {
        ok = true;
        bouger(-1, 1);
    } else if (touche == "n" || key == 99) {
        ok = true;
        bouger(1, 1);           // Fin des déplacements
    } else if (touche == "o") { // Touche "ouvrir"
        ok = true;
        if (casePrecedente == COFFRE) {
            if (aBouclier) {
                affficherMessage("This chest is already open, and is empty.");
            } else if (aCle) {
                afficherMessage("Using the key, you can unlock the chest... There is a big iron shield inside. You pick it up.");
                aBouclier = true;
                afficherInventaire();
            } else {
                afficherMessage("This chest is locked.");
            }
        } else if (casePrecedente == SAC) {
            afficherMessage("You carefully open the bag... It develops a huge set of teeth and eats you !");
            mort();
        } else {
            ouvrir(posX, posY);
        }
    } else if (touche == "r") { // Touche "lire"
        ok = true;
        if (casePrecedente == '|')
            afficherMessage("Something is engraved on the headstone. You read: \"ddfontaines (at) gmail (dot) com - RIP\".");
        else if (casePrecedente == PLAQUE) {
            if (posY == 6)
                afficherMessage("You read : \"Ska, Electro, Trip-hop, Metal, Soundtracks...\"");
            else if (posY == 7)
                afficherMessage("You read : \"NetHack, Team Fortress 2, Portal, World of Goo, Dance Dance Revolution...\"");
            else if (posY == 8)
                afficherMessage("You read : \"Pretty much the only sport I don't suck at!\"");
            else if (posY == 9)
                afficherMessage("You read : \"« <i>- Pourquoi ne me tues-tu pas ? - Je ne connais pas la combinaison du buffet.</i> »\"");
            else if (posY == 10)
                afficherMessage("You read : \"Finding names for your NPCs is the worst drudgery ever.\"");
            else if (posY == 12)
                afficherMessage("You read : \"« Talk is cheap. Show me the code. »\"");
            else if (posY == 14)
                afficherMessage("You read : \"¬¬P ⇒ P ? Could you prove me that ?\"");
            else if (posY == 16)
                afficherMessage("You read : \"Useless is beautiful.\"");
            else if (posY == 18)
                afficherMessage("You read : \"Until cannabis is legalized, probably the most legal psychoactive substance.\"");
            else if (posY == 19)
                afficherMessage("You read : \"« Tea is one of the main stays of civilization in this country. »\"");
            else if (posY == 24)
                afficherMessage("You read : \"Lalalaaa\"");
        } else if (casePrecedente == CV)
            afficherMessage("It seems to be really blank.");
        else if (casePrecedente == '`')
            afficherMessage("Something is engraved on the statue. You read \"LBHWHFGYBFGGURTNZR\". What does that mean?");
        else if (casePrecedente == ALBUM)
            afficherMessage("Something is written on the album. You read \"Rick Astley - Never gonna give you up\".");
        else if (casePrecedente == GRIMOIRE)
        afficherMessage("It seems to be a very modern spellbook. There is even <a href=\"./Colles/\" target=_blank>an hypertext link</a>");
        else if (casePrecedente == RUBIS || casePrecedente == GRAVURERUBIS)
            afficherMessage("Something is engraved here. You read \"You could have guessed by yourself, couldn't you ?\".");
        else if (casePrecedente == SAPHIR || casePrecedente == GRAVURESAPHIR)
            afficherMessage("Something is engraved here. You read \"You could have guessed that too...\"");
        else if (casePrecedente == EMERAUDE || casePrecedente == GRAVUREEMERAUDE)
            afficherMessage("Something is engraved here. You read \"My Skype ID is even TedTedTedTedTedTedTedTed...\"");
        else if (casePrecedente == NEWTMORT)
            afficherMessage("Erk! You're not seriously considering haruspex, are you?");
        else if (casePrecedente == SAC)
            afficherMessage("There is nothing to read on the bag, but when you approach it, you hear a slight growl...");
        else if (casePrecedente == CHOCOLAT)
            afficherMessage("This chocolate bar comes from <a href=\"http://www.chocolatsmococha.com/\" target=_blank>Mococha</a>. It is written \"Chuao, by Patrice Chapon\" on it.");
        else if (casePrecedente == THE)
            afficherMessage("So, you believe in Tasseography, huh ?");
        else
            afficherMessage("There's nothing to read here. Except this message telling you that there's nothing to read.");
    } else if (touche == "e") { // Touche "manger"
        ok = true;
        if (casePrecedente == NEWTMORT) {
            afficherMessage("Ulch - that meat was tainted! You feel deathly sick.");
            mort();
        } else if (casePrecedente == DRAGONMORT) {
            afficherMessage("You may be hungry, but I don't think you will manage to eat all of it...");
        } else if (casePrecedente == THE) {
            casePrecedente = '.';
            afficherMessage("You eat the tea leaves. You feel like a goat.");
        } else if (casePrecedente == CHOCOLAT) {
            casePrecedente = '.';
            afficherMessage("You eat the chocolate. Oh god, this is orgasmic.");
        } else if (aChocolat) {
            aChocolat = false;
            afficherMessage("You eat your chocolate bar. Oh god, this is orgasmic.");
            afficherInventaire();
        } else {
            afficherMessage("There's nothing to eat here. Except yourself.");
        }
    } else if (touche == "q") { // Touche "boire"
        ok = true;
        if (casePrecedente == POTIONVERTE) {
            casePrecedente = '.';
            if (niveau > 1) {
                afficherMessage("This potion was cursed! You lose a level.");
                niveau--;
            } else {
                afficherMessage("This potion was cursed! You lose a level. Which gets you to level 0. Which makes you die.");
                mort();
            }
        } else if (casePrecedente == POTIONROUGE) {
            casePrecedente = '.';
            afficherMessage("Wow! It burns! You see your skin turning dark, and you feel like dried...");
            estResistantAuFeu = true;
        } else if (aPotionRouge) {
            afficherMessage("You drink your potion. Wow! It burns! You see your skin turning dark, and you feel like dried...");
            estResistantAuFeu = true;
            aPotionRouge = false;
            afficherInventaire();
        } else if (aPotionVerte) {
            if (niveau > 1) {
                afficherMessage("You drink your potion. It was cursed! You lose a level.");
                niveau--;
            } else {
                afficherMessage("You drink your potion. It was cursed! You lose a level. Which gets you to level 0. Which makes you die.");
                mort();
            }
            aPotionVerte = false;
            afficherInventaire();
        }
    } else if (touche == 'p' || touche == ',') { // Touche "prendre"
        ok = true;
        if (casePrecedente == SOUS) {
            casePrecedente = '.';
            afficherMessage("You pick up the gold. Baby you're a rich man, baby you're a rich man...");
            aSous = true;
            afficherInventaire();
        } else if (casePrecedente == EMERAUDE) {
            casePrecedente = GRAVUREEMERAUDE;
            afficherMessage("You pick up the emerald. It looks nice...");
            aEmeraude = true;
            afficherInventaire();
        } else if (casePrecedente == SAPHIR) {
            casePrecedente = GRAVURESAPHIR;
            afficherMessage("You pick up the sapphire. What a beautiful gem...");
            aSaphir = true;
            afficherInventaire();
        } else if (casePrecedente == ALBUM) {
            casePrecedente = '.';
            afficherMessage("You pick up the album. Wow, the guy on the cover is sexy...");
            aAlbum = true;
            afficherInventaire();
        } else if (casePrecedente == RUBIS) {
            casePrecedente = GRAVURERUBIS;
            afficherMessage("You pick up the ruby. It is very pure...");
            aRubis = true;
            afficherInventaire();
        } else if (casePrecedente == GRIMOIRE) {
            casePrecedente = '.';
            afficherMessage("You pick up the spellbook.");
            aGrimoire = true;
            afficherInventaire();
        } else if (casePrecedente == CV) {
            casePrecedente = '.';
            afficherMessage("You pick up the scroll.");
            aCV = true;
            afficherInventaire();
        } else if (casePrecedente == POTIONVERTE) {
            casePrecedente = '.';
            if (aPotionRouge) {
                afficherMessage("You try to pick up the potion, but you stumble and accidentely drop it. CRASH !");
            } else {
                aPotionVerte = true;
                afficherInventaire();
            }
        } else if (casePrecedente == POTIONROUGE) {
            casePrecedente = '.';
            if (aPotionVerte) {
                afficherMessage("You try to pick up the potion, but you stumble and accidentely drop it. CRASH !");
            } else {
                aPotionRouge = true;
                afficherInventaire();
            }
        } else if (casePrecedente == NEWTMORT) {
            afficherMessage("Oh no, it would make your backpack dirty. You don't want to do that.");
        } else if (casePrecedente == DRAGONMORT) {
            casePrecedente = '.';
            afficherMessage("You pick up the dragon corpse. It is very heavy, and pretty hot.");
            aCorpsDragon = true;
            afficherInventaire();
        } else if (casePrecedente == EPEE) {
            casePrecedente = '.';
            afficherMessage("You pick up the sword.");
            aEpee = true;
            afficherInventaire();
        } else if (casePrecedente == CLE) {
            casePrecedente = '.';
            afficherMessage("You pick up the key with <a href=\"pubkey.txt\" target=_blank>those tiny characters</a>.");
            aCle = true;
            afficherInventaire();
        } else if (casePrecedente == CHOCOLAT) {
            casePrecedente = '.';
            afficherMessage("You pick up the chocolate bar.");
            aChocolat = true;
            afficherInventaire();
        } else if (casePrecedente == THE) {
            casePrecedente = '.';
            afficherMessage("You pick up the tea leaves.");
            aThe = true;
            afficherInventaire();
        } else if (casePrecedente == AMULETTE) {
            afficherMessage("You put on the amulet. It constricts your throat ! You cannot remove it ! You suffocate !");
            mort();
        } else if (casePrecedente == SAC) {
            afficherMessage("You try to pick up the bag... It develops a huge set of teeth and eats you !");
            mort();
        } else if (casePrecedente == COFFRE) {
            afficherMessage("This chest is way too heavy for you to pick it up.");
        } else {
            afficherMessage("There is nothing to pick up here...");
        }
    } else if (touche == 'd') { // Touche "plonger"
        ok = true;
        if (casePrecedente == FONTAINE) {
            if (aEpee) {
                afficherMessage("You dip your sword into the water... For the murky depths, a hand reaches up to bless the sword!")
                aEpee = false;
                aExcalibur = true;
                afficherInventaire();
            } else if (aExcalibur) {
                afficherMessage("Nothing happens. What did you expect, super-Excalibur?");
            } else {
                afficherMessage("You have nothing to dip into the fountain.");
            }
        } else if (casePrecedente == POTIONVERTE || aPotionVerte) {
            if (aEpee || aExcalibur) {
                afficherMessage("You dip your sword into the green potion. Hmmm, interesting...");
                estEmpoisonnee = true;
                afficherInventaire();
            } else {
                afficherMessage("You have nothing to dip into the potion.");
            }
        } else if (casePrecedente == POTIONROUGE || aPotionRouge) {
            if (aEpee || aExcalibur) {
                afficherMessage("You dip your sword into the red potion. Oh noes, it makes your sword melt!");
                aEpee = false;
                aExcalibur = false;
                afficherInventaire();
            } else {
                afficherMessage("You have nothing to dip into the potion.");
            }
        } else {
            afficherMessage("You don't have anything to dip into.");
        }
    } else if (touche == 's') { // Touche "sacrifier"
        ok = true;
        if (casePrecedente != AUTEL) {
            afficherMessage("You are not standing on an altar !");
        } else if (!aCorpsDragon) {
            afficherMessage("You have nothing to sacrifice !");
        } else if (!aBougies) {
            if (dieuEnerve) {
                afficherMessage("You hear the voice of your God echoing through the room : « STILL NO CANDLES? THEN DIE, MORTAL!»<br/>Suddenly, a bolt of lightning strikes you ! You fry to a crisp.");
                mort();
            } else {
                afficherMessage("You hear the voice of your God in your head : « Thou hast forgotten thy candles, fool! »");
                dieuEnerve = true;
            }
        } else {
            afficherMessage("You draw a heptadecagon on the altar with your compass and your ruler and dispose the candles.<br/>You offer the dragon corpse to your god...<br/>An invisible choir sings, and you are bathed in radiance...<br/> The voice of your god booms out: « Congratulations, mortal! »<br/> « In return to thy service, I grant thee the gift of Immortality! »<br/>You ascend to the status of Demigod" + (genre == "male" ? "dess" : "") + "...");
            gagne();
        }
    } else if (touche == '?') {
        window.open("./help.html"); 
    }
    if (ok && !estMort && !aGagne)
        bougerDragon();
    if (!aGagne)
        afficherCarte(carte);
    return false;
}, false);

//---------
//- Debug -
//---------

//-------------------------
//- Fonctions auxiliaires -
//-------------------------

// Initialise tous les paramètres du jeu
function initialisation() {
    // Nettoyage
    for(var y = 0 ; y < hauteur ; y++) {
        for (var x = 0 ; x < largeur ; x++) {
            carte[y][x] = ' '; // Espace insécable
        }
    }

    // Première ligne
    carte[margeY][margeX] = '┌';
    for(var x = 1 ; x < largeurCarre - 1 ; x++) {
        carte[margeY][margeX + x] = '─';
    }
    carte[margeY][margeX + largeurCarre - 1] = '┐';
    // Coeur de la carte
    for (var y = 1 ; y < hauteurCarre - 1 ; y++) {
        carte[margeY + y][margeX] = '│';
            for(var x = 1 ; x < largeurCarre - 1 ; x++) {
                carte[margeY + y][margeX + x] = '.';
            }
        carte[margeY + y][margeX + largeurCarre - 1] = '│';
    }
    // Dernière ligne
    carte[margeY + hauteurCarre - 1][margeX] = '└';
    for(var x = 1 ; x < largeurCarre - 1 ; x++) {
        carte[margeY + hauteurCarre - 1][margeX + x] = '─';
    }
    carte[margeY + hauteurCarre - 1][margeX + largeurCarre - 1] = '┘';

    // Placement du personnage
    posY = posYDepart;
    posX = posXDepart;
    carte[posY][posX] = JOUEUR;
    casePrecedente = '.';

    // On met quelques trous d'eau
    var nbPiscines = Math.floor(Math.random() * nbMaxPiscines + 5);
    for (var i = 0 ; i < nbPiscines ; i++) {
        var x = Math.floor(Math.random() * (largeurCarre-2) + 1);
        var y = Math.floor(Math.random() * (hauteurCarre-2) + 1);
        if (posY != margeY+y || posX != margeX+x) {
            carte[margeY + y][margeX + x] = PISCINE;
        }
    }

    // On met trois fontaines
    var posXFontaine;
    var posYFontaine;
    for (var i = 1 ; i <= 3 ; i++) {
        posXFontaine = margeX + Math.floor(Math.random() * (largeurCarre-2) + 1);
        posYFontaine = margeY + Math.floor(Math.random() * (hauteurCarre-2) + 1);
        carte[posYFontaine][posXFontaine] = FONTAINE;
    }

    // On met un dragon
    posXDragon = margeX + Math.floor(Math.random() * (largeurCarre-2) + 1);
    posYDragon = margeY + Math.floor(Math.random() * (hauteurCarre-2) + 1);
    carte[posYDragon][posXDragon] = DRAGON;
    casePrecedenteDragon = '.';

    // On met un autel
    var posXAutel;
    var posYAutel;
    do {
        posXAutel = margeX + Math.floor(Math.random() * (largeurCarre-2) + 1);
        posYAutel = margeY + Math.floor(Math.random() * (hauteurCarre-2) + 1);
    } while (posXAutel == posXDragon && posYAutel == posYDragon);
    carte[posYAutel][posXAutel] = AUTEL;


    // On met les portes
    for (var i = 0 ; i < portesX.length ; i++) {
        carte[portesY[i]][portesX[i]] = PORTEFERMEE;
    }

    // On remet à zéro le temps
    temps = 0;

    // On fait vivre le dragon
    dragonMort = false;

    // On fait notre personnage
    alignement = ALIGNEMENTS[Math.floor(Math.random() * ALIGNEMENTS.length)];
    genre = GENRES[Math.floor(Math.random() * GENRES.length)];
    race = RACES[Math.floor(Math.random() * RACES.length)];
    classe = CLASSES[Math.floor(Math.random() * CLASSES.length)];
    if (genre == "female") {
        if (classe == "Priest") {
            classe = "Priestess";
        } else if (classe == "Caveman") {
            classe = "Cavewoman";
        }
    }
    niveau = 1;

    // On vide son inventaire
    estMort = false;
    estResistantAuFeu = false;
    dieuEnerve = false;
    aGagne = false;
    aRencontreSage = false;
    aSaphir = false;
    aEmeraude = false;
    aRubis = false;
    aSous = false;
    aEpee = false;
    aExcalibur = false;
    estEmpoisonnee = false;
    aGrimoire = false;
    aCV = false;
    aPotionRouge = false;
    aPotionVerte = false;
    aAlbum = false;
    aCorpsDragon = false;
    aCle = false;
    aBouclier = false;
    aChocolat = false;
    aThe = false;
    aBougies = false;

    // On affiche ce qu'on vient de générer :-)
    afficherMessage("Hello visitor, welcome to NetHack! You are a " + alignement + " " +
            genre + " " + race + " " + classe + ".");
    afficherInventaire();
    afficherCarte(carte);

    // Et on supprime le message de chargement
    var baliseCarte = document.getElementById('chargement');
    baliseCarte.innerHTML = "";
}

// Affiche la carte entre les deux balises d'identifiant "carte"
function afficherCarte(tab) {
    // Affiche le sol, les murs, etc.
    var text = "";
    for (var y = 0 ; y < hauteur ; y++) {
        for (var x = 0 ; x < largeur ; x++) {
            text += tab[y][x];
        }
        text += "<br/>";
    }
    var baliseCarte = document.getElementById('carte');
    baliseCarte.innerHTML = text;
}

// Bouge le bonhomme de dx selon l'axe des x et de dy selon l'axe des y
function bouger(dx, dy) {
    if (estValide(posX+dx, posY+dy) && estSol(posX+dx, posY+dy)) {
        carte[posY][posX] = casePrecedente;
        posY += dy;
        posX += dx;
        casePrecedente = carte[posY][posX];
        carte[posY][posX] = JOUEUR;
        if ((posY-posYDragon)*(posY-posYDragon) <= 1 && (posX-posXDragon)*(posX-posXDragon) <= 1) {
            if (estResistantAuFeu) {
                afficherMessage("The dragon breathes fire at you! It tickles a little.");
            } else {
                afficherMessage("The dragon breathes fire at you! You turn into a little pile of ashes.");
                mort();
            }
        }
        if (casePrecedente != '.') {
            marcherSur(casePrecedente)
        }
    } else {
        collision(posX+dx, posY+dy);
    }
}

function marcherSur(type) {
    if (type == PISCINE) {
        afficherMessage("You fall in the water. You sink like a rock!");
        mort();
    } else if (type == NEWTMORT)
        afficherMessage("You see here a newt corpse. It seems legit.");
    else if (type == CV)
        afficherMessage("You see here a scroll labeled <a href=\"CV.pdf\">PRATYAVAYAH</a>.");
    else if (type == COFFRE)
        afficherMessage("You see here a chest. Maybe there's something in it?");
    else if (type == PLAQUE)
        afficherMessage("You see here a marble slab. It seems to have a message engraved in it...");
    else if (type == '`')
        afficherMessage("You see here a statue of myself. It is way bigger than the original!");
    else if (type == '|')
        afficherMessage("You see here a headstone. It seems to have something engraved it it...");
    else if (type == GRIMOIRE)
        afficherMessage("You see here a green spellbook.");
    else if (type == ' ') {
        afficherMessage("There's a gaping hole here ! You fall...");
        mort();
    } else if (type == ALBUM)
        afficherMessage("You see an album lying on the floor.");
    else if (type == EPEE)
        afficherMessage("You see here a sword.");
    else if (type == POTIONVERTE)
        afficherMessage("You see here a green bubbly potion. It looks good, and you're thirsty.");
    else if (type == POTIONROUGE)
        afficherMessage("You see here a smoky red potion. It looks a little lethal.");
    else if (type == RUBIS)
        afficherMessage("You see here a ruby. It looks like someone has engraved something in the ground with it...");
    else if (type == SAPHIR)
        afficherMessage("You see here a sapphire. It looks like someone has engraved something in the ground with it...");
    else if (type == EMERAUDE)
        afficherMessage("You see here an emerald. It looks like someone has engraved something in the ground with it...");
    else if (type == SOUS)
        afficherMessage("You see here a nice pile of gold.");
    else if (type == GRAVURERUBIS || type == GRAVURESAPHIR || type == GRAVUREEMERAUDE)
        afficherMessage("Something seems to be engraved here.");
    else if (type == FONTAINE)
        afficherMessage("You see here a fountain.");
    else if (type == DRAGONMORT)
        afficherMessage("You see here a dragon corpse.");
    else if (type == CLE)
        afficherMessage("You see here a key. It looks like it have <a href=\"./pubkey.txt\" target=_blank>tiny characters</a> engraved on it...");
    else if (type == AMULETTE)
        afficherMessage("You see here a silver amulet.");
    else if (type == SAC)
        afficherMessage("You see here a bag.");
    else if (type == CHOCOLAT)
        afficherMessage("You see here a bar of chocolate. It looks delicious.");
    else if (type == THE)
        afficherMessage("You see here a little pile of <a href=\"./teas.txt\" target=_blank>tea leaves</a>.");
    else if (type == AUTEL)
        afficherMessage("You see here an altar.");
}


// Affiche le message correspondant à une collision avec un objet
function collision(x, y) {
    // Si on n'est pas dans les limites de la carte
    //if (x < 0 || x >= largeur || y < 0 || y >= hauteur) {
    if (!estValide(x,y)) {
        afficherMessage("You jump off the webpage...");
        mort();
    } else if (carte[y][x] == PORTEFERMEE) {
        afficherMessage("Ouch! You bump into a door.");
    } else if (estMur(x, y)) {
        afficherMessage("Ouch! You bump into a wall.");
    } else if (carte[y][x] == NEWTVIVANT) {
        niveau++;
        afficherMessage("You kill the newt! You feel more experienced... Welcome level " + niveau + "!");
        carte[y][x] = NEWTMORT;
    } else if (carte[y][x] == GOLEM) {
        if (aEpee || aExcalibur) {
            niveau++;
            afficherMessage("You kill the gold golem! In one shot, wow, impressive. Welcome level " + niveau + "!");
            carte[y][x] = SOUS;
        } else {
            afficherMessage("You hit the gold golem with your little hands. He doesn't appreciate it. He hits you back. Hard.");
            mort();
        }
    } else if (carte[y][x] == DRAGON) {
        if (aExcalibur) {
            if (aBouclier) {
                niveau += 9000;
                afficherMessage("Dodging the claws of the dragon with your shield, you cut his throat with your Excalibur. Hooray ! He yells, then dies. Welcome level " + niveau + "!");
                carte[y][x] = DRAGONMORT;
                posXDragon = 0;
                posYDragon = 0;
                dragonMort = true;
            } else {
                niveau += 9000;
                afficherMessage("You hit the dragon with your Excalibur, but as he yells, dying, he strikes a last claw blow which rips off your head.");
                carte[y][x] = DRAGONMORT;
                posXDragon = 0;
                posYDragon = 0;
                dragonMort = true;
                mort();
            }
        } else if (!aEpee) {
            afficherMessage("You try to punch the dragon. He eats your arm. Then, he eats your head.");
            mort();
        } else if (!aBouclier) {
            afficherMessage("You hit the dragon with your sword, but he doesn't seem to be hurt. However, his claws hurt you. Hard.");
            mort();
        } else {
            afficherMessage("You hit the dragon with your sword, but he doesn't seem to be hurt. However, you manage to dodge his blows with you shield.");
        }
    } else if (carte[y][x] == SAGE) {
        if (!aRencontreSage) {
            afficherMessage("There is an old man here. He tells you : « If thou askest me a question I cannot answer, I shall give thee a wonderful reward »");
            aRencontreSage = true;
        } else if (aBougies) {
            afficherMessage("You see the old man trying to solve the exercice, speaking to himself and scratching his head.");
        } else {
            aRencontreSage = true;
            if (aGrimoire) {
                afficherMessage("You give him a <a href=\"./ENSExercice.pdf\" target=_blank>little exercise</a> from your spellbook. He looks at it, and says : <br/>« Congratulations, mortal. Take these candles, thou hast deserved them. »");
                aBougies = true;
                afficherInventaire();
            } else {
                afficherMessage("The old man tells you : « I still await thy enigma... »");
            }
        }
    } else {
        afficherMessage("Ouch! You bump into a big letter...         Wait, what?");
    }
}

// Renvoie true ssi (x,y) est une case du tableau
function estValide(x,y) {
    return !(x < 0 || x >= largeur || y < 0 || y >= hauteur)
}

// Renvoie true ssi (x,y) est une case où on peut marcher
function estSol(x,y) {
    var type = carte[y][x];
    return (type == '.' || type == PORTEOUVERTE || type == NEWTMORT 
            || type == PISCINE || type == '|' || type == CV 
            || type == ' ' || type == '`' || type == COFFRE 
            || type == FONTAINE || type == '♫' || type == RUBIS 
            || type == POTIONVERTE || type == GRIMOIRE || type == SAPHIR 
            || type == EMERAUDE || type == SOUS || type == GRAVURERUBIS 
            || type == GRAVURESAPHIR || type == GRAVUREEMERAUDE || type == EPEE
            || type == POTIONROUGE || type == ALBUM || type == DRAGONMORT
            || type == PLAQUE || type == CLE || type == AMULETTE
            || type == SAC || type == CHOCOLAT || type == THE
            || type == AUTEL);
}

// Renvoie true ssi (x,y) est un mur
function estMur(x,y) {
    var type = carte[y][x];
    return (type == '│' || type == '─' || type == '┌' 
            || type == '┐' || type == '└' || type == '┘');
}

// Ouvre ce qu'il y a à proximité
function ouvrir(x, y) {
    var x = x;
    var y = y;
    for (var dy = -1 ; dy <= 1 ; dy++) {
        for (var dx = -1 ; dx <= 1 ; dx++) {
            if (carte[y+dy][x+dx] == PORTEFERMEE) {
                for (var i = 0 ; i < portesX.length ; i++) {
                    if (y+dy == portesY[i] && x+dx == portesX[i]) {
                        decouvrirSalle(i)
                        carte[y+dy][x+dx] = PORTEOUVERTE;
                        afficherMessage("The door opens.");
                    }
                }
            }
        }
    }
}

// Marche sur une case spéciale

// Fonction appelée lorsque le joueur découvre une nouvelle salle
function decouvrirSalle(n) {
    var debutX = debutSalleX[n];
    var debutY = debutSalleY[n];
    var finX = finSalleX[n];
    var finY = finSalleY[n];
    carte[debutY][debutX] = '┌';
    for(var x = debutX + 1 ; x < finX ; x++) {
        carte[debutY][x] = '─';
    }
    carte[debutY][finX] = '┐';
    afficherCarte(carte);
    // Coeur de la carte
    for (var y = debutY + 1 ; y < finY ; y++) {
        carte[y][debutX] = '│';
            for(var x = debutX + 1 ; x < finX ; x++) {
                carte[y][x] = '.';
            }
        carte[y][finX] = '│';
        afficherCarte(carte);
    }
    afficherCarte(carte);
    // Dernière ligne
    carte[finY][debutX] = '└';
    for(var x = debutX + 1 ; x < finX ; x++) {
        carte[finY][x] = '─';
    }
    carte[finY][finX] = '┘';

    // Trucs spéciaux pour chaque salle
    if (n == 0) { // Salle dans le coin en haut à gauche
        ajouterMessage("I.study", 4, 3);
        ajouterMessage("computer.science*", 2, 4);
        carte[4][18] = RUBIS;
        ajouterMessage("at.the.ENS.Paris", 3, 5);
        ajouterMessage("(in.France)", 1, 7);
        carte[7][1] = SAC;
        carte[7][11] = EPEE;
        carte[7][19] = '.';
    } else if (n == 1) { // Salle tout en haut
        carte[4][36] = '.';
        ajouterMessage("Hey.!.I.am.Damien.Desfontaines", 27, 1);
        carte[1][31] = POTIONVERTE;
        ajouterMessage("Nice.to.meet.you.!", 35, 2);
        carte[2][52] = POTIONROUGE;
        carte[3][40] = '`';
    } else if (n == 2) { // Salle en haut à droite
        carte[10][62] = '.';
        ajouterMessage("I.like.:", 64, 5);
        carte[5][71] = NEWTVIVANT;
        ajouterMessage("-.Music.♫", 65, 6);
        carte[6][65] = PLAQUE;
        carte[6][73] = ALBUM;
        ajouterMessage("-.Video.games*", 65, 7);
        carte[7][65] = PLAQUE;
        carte[7][78] = SAPHIR;
        ajouterMessage("-.Bicycle", 65, 8);
        carte[8][65] = PLAQUE;
        ajouterMessage("-.Theater", 65, 9);
        carte[9][65] = PLAQUE;
        ajouterMessage("-.Role-playing", 65, 10);
        carte[10][65] = PLAQUE;
        ajouterMessage("games", 69, 11);
        ajouterMessage("-.Open-source", 65, 12);
        carte[12][65] = PLAQUE;
        ajouterMessage("programming", 68, 13);
        ajouterMessage("-.Mathematical", 65, 14);
        carte[14][65] = PLAQUE;
        ajouterMessage("logic", 70, 15);
        carte[15][77] = SAGE;
        ajouterMessage("-.Useless", 65, 16);
        carte[16][65] = PLAQUE;
        ajouterMessage("things", 72, 17);
        ajouterMessage("-.Chocolate", 65, 18);
        carte[18][65] = PLAQUE;
        carte[18][77] = CHOCOLAT;
        ajouterMessage("-.Good.tea", 65, 19);
        carte[19][65] = PLAQUE;
        carte[19][76] = THE;
    } else if (n == 3) { // Salle de gauche, vers le bas
        carte[15][19] = '.';
        ajouterMessage("I.also.train", 3, 11);
        ajouterMessage("First-year-", 4, 12);
        ajouterMessage("students.of.the", 3, 13);
        ajouterMessage("Louis-le-Grand", 4, 14);
        ajouterMessage("french school", 5, 15);
        ajouterMessage("to.oral.exams", 3, 16);
        ajouterMessage("in.mathematics", 4, 17);
        ajouterMessage("Here.+.are.a.few", 2, 19);
        carte[19][7] = GRIMOIRE;
        ajouterMessage("vicious.problems", 3, 20);
    } else if (n == 4) { // Salle du bas, à gauche
        carte[22][30] = '.';
        ajouterMessage("Here.you.can.find.:", 13, 23);
        carte[23][31] = NEWTVIVANT;
        ajouterMessage("My.e-mail.:.|", 8, 24);
        carte[24][12] = PLAQUE;
        carte[24][18] = NEWTVIVANT;
        ajouterMessage("My.CV.:.?", 7, 25);
        carte[25][13] = NEWTVIVANT;
        ajouterMessage("My.PGP.key.:.⚷", 28, 25);
        carte[25][39] = NEWTVIVANT;
        carte[25][41] = CLE;
        ajouterMessage("My.publications.:. ", 6, 26);
        carte[26][22] = NEWTVIVANT;
    } else if (n == 5) { // Salle du bas, à droite
        carte[22][50] = '.';
        ajouterMessage("I'm.also.known.as.Ted", 45, 24);
        carte[24][46] = GOLEM;
        ajouterMessage("Or.sometimes,.TedTed", 47, 25);
        carte[25][59] = AMULETTE;
        ajouterMessage("Or.even.TedTedTed", 48, 26);
        ajouterMessage("(You.got.my.point)", 48, 27);
        carte[27][48] = COFFRE;
        carte[27][69] = EMERAUDE;
    }
}

// Affiche un message dans la barre du haut
function afficherMessage(message) {
    var baliseMessage = document.getElementById('barreHaut');
    baliseMessage.innerHTML = message;
}

// Fonction qui affiche un message dans la grille
function ajouterMessage(message, x, y) {
    for (var i = 0 ; i < message.length ; i++) {
        carte[y][x+i] = message.charAt(i);
    }
}

// Fonction qui affiche l'inventaire
function afficherInventaire() {
    var inventaire = "Inventory : <br/>";
    if (aSous)
        inventaire += "4217 gold pieces<br/>";
    if (aEpee) {
        if (estEmpoisonnee)
            inventaire += "a long poisoned sword<br/>";
        else
            inventaire += "a long sword<br/>";
    }
    if (aExcalibur)
        if (estEmpoisonnee)
            inventaire += "the blessed greased rustproof poisoned +6 Excalibur<br/>"
        else
            inventaire += "the blessed greased rustproof +6 Excalibur<br/>"
    if (aBouclier)
        inventaire += "a big iron shield<br/>";
    if (aPotionVerte)
        inventaire += "a bubbly green potion<br/>";
    if (aPotionRouge)
        inventaire += "a hot red potion<br/>";
    if (aCorpsDragon)
        inventaire += "a red dragon corpse<br/>";
    if (aGrimoire)
        inventaire += "a spellbook with an <a href=\"./Colles/\" target=_blank>hypertext link</a><br/>";
    if (aCle)
        inventaire += "a key with <a href=\"./pubkey.txt\" target=_blank>tiny numbers</a> engraved on it<br/>";
    if (aBougies)
        inventaire += "17 candles<br/>";
    if (aEmeraude)
        inventaire += "a shiny emerald<br/>";
    if (aRubis)
        inventaire += "a very pure ruby<br/>";
    if (aSaphir)
        inventaire += "a beautiful sapphire<br/>";
    if (aCV)
        inventaire += "a scroll labeled <a href=\"CV.pdf\">PRATYAVAYAH</a><br/>";
    if (aAlbum)
        inventaire += "a Rick Astley album<br/>";
    if (aThe)
        inventaire += "several <a href=\"teas.txt\" target=_blank>tea leaves</a><br/>";
    if (aChocolat)
        inventaire += "a bar of Patrice Chapon's Chuao chocolate from <a href=\"http://www.chocolatsmococha.com/\" target=_blank>Mococha</a><br/>";
    var baliseInventaire = document.getElementById('inventaire');
    if (!(aSous || aEmeraude || aRubis || aSaphir || aEpee || aGrimoire 
          || aPotionVerte || aPotionRouge || aCV || aExcalibur || aAlbum
          || aCorpsDragon || aCle || aThe || aChocolat || aBougies))
        inventaire = " ";
    baliseInventaire.innerHTML = inventaire;
}

// Fonction appelée lors de la mort du personnage
function mort() {
    estMort = true;
    setTimeout(function() {
        finDePartie();
    }, 2000);
}

// Fonction qui bouge le dragon d'une case aléatoire
function bougerDragon() {
    if (!dragonMort) {
        var dx = Math.floor(Math.random() * 3) - 1
        var dy = Math.floor(Math.random() * 3) - 1
        while (!estSol(posXDragon+dx, posYDragon+dy)) {
            dx = Math.floor(Math.random() * 3) - 1
            dy = Math.floor(Math.random() * 3) - 1
        }
        carte[posYDragon][posXDragon] = casePrecedenteDragon;
        posYDragon += dy;
        posXDragon += dx;
        casePrecedenteDragon = carte[posYDragon][posXDragon];
        carte[posYDragon][posXDragon] = DRAGON;
        if ((posY-posYDragon)*(posY-posYDragon) <= 1 && (posX-posXDragon)*(posX-posXDragon) <= 1) {
            if (estResistantAuFeu) {
                afficherMessage("The dragon breathes fire at you! It tickles a little.");
            } else {
                afficherMessage("The dragon breathes fire at you! You turn into a little pile of ashes.");
                mort();
            }
        }
    }
}

function gagne() {
    aGagne = true;
    setTimeout(function() {
        finDePartie();
    }, 2000);
}

// Fonction qui fait gagner la partie \o/
function finDePartie() {
    var texte = "";
        texte += "|-----------------------------------------------------------------------|<br/>";
        texte += "|.......................................................................|<br/>";

    if (aGagne)
        texte += "|................Congratulations!.You.just.won.the.game!................|<br/>";
    else if (estMort)
        texte += "|............................You.just.died.=(...........................|<br/>";

        texte += "|.......................................................................|<br/>";
        texte += "|................Let's.see.how.many.points.you.got.there................|<br/>";
        texte += "|.......................................................................|<br/>";
    var points = 0;
    if (aGagne) {
        texte += "|..demigod-ness..........................................100000.points..|<br/>";
        points += 100000
    }
    if (niveau >= 9000) {
        texte += "|..level."+niveau+".............................................."+niveau+".points..|<br/>";
        points += niveau;
    } else if (niveau > 1) {
        texte += "|..level."+niveau+"...................................................."+niveau+".points..|<br/>";
        points += niveau;
    } else {
        texte += "|..level.1...............(lol.noob)...........................1.point...|<br/>";
        points += niveau;
    }
    if (aSous) {
        texte += "|..4217.gold.pieces........................................4217.points..|<br/>";
        points += 4217;
    }
    if (aEpee && estEmpoisonnee) {
        texte += "|..a.poisoned.long.sword....................................255.points..|<br/>";
        points += 255;
    }
    if (aEpee && !estEmpoisonnee) {
        texte += "|..a.long.sword.............................................155.points..|<br/>";
        points += 155;
    }
    if (aExcalibur && estEmpoisonnee) {
        texte += "|..the.blessed.greased.rustproof.poisoned.+6.Excalibur....65535.points..|<br/>";
        points += 65535;
    }
    if (aExcalibur && !estEmpoisonnee) {
        texte += "|..the.blessed.greased.rustproof.+6.Excalibur.............63536.points..|<br/>";
        points += 63536
    }
    if (aBouclier) {
        texte += "|..a.big.iron.shield........................................497.points..|<br/>";
        points += 497;
    }
    if (aPotionVerte) {
        texte += "|..a.bubbly.green.potion....................................129.points..|<br/>";
        points += 129;
    }
    if (aPotionRouge) {
        texte += "|..a.hot.red.potion.........................................360.points..|<br/>";
        points += 360;
    }
    if (aCorpsDragon)
        texte += "|..a.red.dragon.corpse........................................0.point...|<br/>";
    if (aGrimoire) {
        texte += "|..a.spellbook..............................................253.points..|<br/>";
        points += 253;
    }
    if (aCle) {
        texte += "|..a.key.....................................................59.points..|<br/>";
        points += 59;
    }
    if (aBougies) {
        texte += "|..17.candles................................................17.points..|<br/>";
        points += 17;
    }
    if (aEmeraude) {
        texte += "|..a.shiny.emerald.........................................1500.points..|<br/>";
        points += 1500;
    }
    if (aRubis) {
        texte += "|..a.very.pure.ruby........................................4500.points..|<br/>";
        points += 4500;
    }
    if (aSaphir) {
        texte += "|..a.beautiful.sapphire....................................2500.points..|<br/>";
        points += 2500;
    }
    if (aCV) {
        texte += "|..a.scroll..................................................23.points..|<br/>";
        points += 23;
    }
    if (aAlbum) {
        texte += "|..a.Rick.Astley.album......................................142.points..|<br/>";
        points += 142;
    }
    if (aThe) {
        texte += "|..several.tea.leaves........................................99.points..|<br/>";
        points += 99;
    }
    if (aChocolat) {
        texte += "|..a.bar.of.Patrice.Chapon's.Chuao.chocolate.................34.points..|<br/>";
        points += 34;
    }
        texte += "|.......................................................................|<br/>";

    if (aGagne) {
        texte += "|.......................TOTAL.:."+points+".points.\\o/.......................|<br/>";
        texte += "|.......................................................................|<br/>";
        texte += "|...You.can.<a href=\"./index.html\">restart.a.new.game</a>.if.you.want.to.make.your.score.better....|<br/>";
    }
    else if (estMort) {
        pointstxt = "" + points;
        // Disclaimer : les 12 prochaines lignes sont vraiment dégueulasses.
        if (points == 1)
            texte += "|......................TOTAL.:.1.point,.HAHAHAHAHA!.....................|<br/>";
        else if (pointstxt.length == 1)
            texte += "|.........................TOTAL.:."+points+".points./o\\..........................|<br/>";
        else if (pointstxt.length == 2)
            texte += "|.........................TOTAL.:."+points+".points./o\\.........................|<br/>";
        else if (pointstxt.length == 3)
            texte += "|........................TOTAL.:."+points+".points./o\\.........................|<br/>";
        else if (pointstxt.length == 4)
            texte += "|........................TOTAL.:."+points+".points./o\\........................|<br/>";
        else if (pointstxt.length == 5)
            texte += "|.......................TOTAL.:."+points+".points./o\\........................|<br/>";
        else if (pointstxt.length == 6)
            texte += "|.......................TOTAL.:."+points+".points./o\\.......................|<br/>";
        texte += "|.......................................................................|<br/>";
        texte += "|....If.you.want.to.have.another.chance.to.leave.this.dungeon.alive,....|<br/>";
        texte += "|.....................you.can.<a href=\"./index.html\">restart.a.new.game</a>.=).....................|<br/>";
    }

        texte += "|.......................................................................|<br/>";
        texte += "|-----------------------------------------------------------------------|<br/>";

    // - "Oh mon Dieu non Damien tu ne peux pas faire ça c'est trop immonde"
    // - "J'ai déjà fait pire, jeune apprenti, j'ai déjà fait pire... Tiens,
    //      regarde ça par exemple : 
    //      http://www.eleves.ens.fr/home/desfonta/vimscript-Armes"
    // - "Oh mon Dieu mais... C'est trop horrible..." [il tourne de l'œil]
    // - *rire diabolique*
    var regex = /([^"x])(\.+)/g;
    texte = texte.replace(regex, "$1<span class='gray'>$2</span>");
    var baliseCarte = document.getElementById('carte');
    baliseCarte.innerHTML = texte;
    var baliseInventaire = document.getElementById('inventaire');
    inventaire = " ";
    baliseInventaire.innerHTML = inventaire;
}
