(* Ce travail a pour but d'exhiber la proposition indémontrable dans l'arithmétique de Peano, suivant la méthode de Tarski.
   Il montre que cette arithmétique (que l'on abrègera P.A.) est incomplète pour peu qu'on la suppose correcte.

   Pour cela, on va suivre la méthode décrite dans l'ouvrage "Les théorèmes d'incomplétude de Gödel", écrit par Raymond Smullyan 
     et publié aux éditions Dunod. 
   On utilisera un alphabet à 13 symboles : "0", "'", "(", ")", "f", ",", "v", "~", "=>", "\/", "=", "<=", et "#".
   Les expressions "0", "0'", "0''", ... sont les noms formels des entiers naturels 0, 1, 2, ... On les abrègera en écrivant l'entier
     naturel correspondant.
   Le symbole "'" sert de nom à la fonction successeur.
   Les expressions "f,", "f,," et "f,,," sont les noms formels des opérations d'addition, de multiplication et d'exponentiation,
     que l'on abrègera respectivement par les symboles "+", "." et "e".
   Le symbole "~" représente la négation, le "=>" l'implication.
   Le symbole "\/" est le quantificateur universel (le "pour tout", impossible à décrire sur un clavier classique).
   Le symbole "=" désigne la relation d'égalité et le "<=" la relation "inférieur ou égal".
   Les expressions de la forme "(v,)", "(v,,)", "(v,,,)", ... seront nos variables, que l'on abrègera en utilisant les entiers 
     -1, -2, -3, ... (qui ne servent pas, en effet l'arithmétique de Peano ne travaille qu'avec des entiers naturels).
   
   Pour cela, on va créer un type qui va contenir nos termes (expressions mathématiques) et un autre qui va contenir nos formules. *)

type variable = int ;;
type nombre = int ;;

type terme =
	| Variable of variable (* Une variable *)
	| Nombre of nombre (* Un nombre *)
	| Addition of terme * terme (* L'addition *)
	| Multiplication of terme * terme (* La multiplication *)
	| Exponentiation of terme * terme (* L'exponentiation *)
	| Successeur of terme (* La fonction successeur *)
;;

type formule = 
	| Egal of terme * terme (* Égalité entre deux termes *)
	| InferieurOuEgal of terme * terme (* Relation "<=" *)
	| Negation of formule (* La négation d'une expression *)
	| Implication of formule * formule (* L'implication entre deux expressions *)
	| PourTout of variable * formule (* Le quantificateur universel *) 
;; 

(* On crée des fonctions d'affichange de formules *)

let rec imprimeTerme = function
	|Variable v -> 	Printf.printf "v{%d}" (-v);
	|Nombre a -> 		Printf.printf "%d" a;
	|Addition (a,b) ->	begin
					Printf.printf "(";
					imprimeTerme a;
					Printf.printf "+";
					imprimeTerme b;
					Printf.printf ")";
				end
	|Multiplication(a,b) -> begin
					Printf.printf "(";
					imprimeTerme a;
					Printf.printf ".";
					imprimeTerme b;
					Printf.printf ")";
				end
	|Exponentiation(a,b) ->	begin
					Printf.printf "(";
					imprimeTerme a;
					Printf.printf "^";
					imprimeTerme b;
					Printf.printf ")";
				end
	| Successeur a ->	begin
					imprimeTerme a;
					Printf.printf "'";
				end
;; 

let rec imprimeFormule = function
	| Negation (Negation f) ->	imprimeFormule f;
	| Implication (Negation (f1),f2) -> begin
						Printf.printf "(";
						imprimeFormule f1;
						Printf.printf " V ";
						imprimeFormule f2;
						Printf.printf ")";
					    end
	| Negation (Implication (f1,Negation (f2))) -> begin
							Printf.printf "(";
							imprimeFormule f1;
							Printf.printf " * ";
							imprimeFormule f2;
							Printf.printf ")";
						       end
	| Negation (PourTout (v,Negation(f))) -> begin
							Printf.printf "Ev{%d}" (-v);
							imprimeFormule f;
						 end
	| Egal (t1,t2) ->		begin
						Printf.printf "(";
						imprimeTerme t1;
						Printf.printf " = ";
						imprimeTerme t2;
						Printf.printf ")";
					end
	| InferieurOuEgal (t1,t2) ->	begin
						Printf.printf "(";
						imprimeTerme t1;
						Printf.printf " <= ";
						imprimeTerme t2;
						Printf.printf ")";
					end
	| Negation f ->			begin
						Printf.printf "~";
						imprimeFormule f;
					end
	| Implication (f1,f2) ->	begin
						Printf.printf "(";
						imprimeFormule f1;
						Printf.printf " => ";
						imprimeFormule f2;
						Printf.printf ")";
					end
	| PourTout (v,f) -> 		begin
						Printf.printf "Av{%d}" (-v);
						imprimeFormule f;
					end
;;

(* On définit maintenant les abréviations classiques : le "et", le "ou", etc. *)

let ou f1 f2 =
	Implication (Negation (f1),f2)
;;

let et f1 f2 =
	Negation (Implication (f1,Negation (f2)))
;;

let equivalent f1 f2 =
	et (Implication (f1,f2)) (Implication (f2,f1))
;;

let ilExiste v f =
	Negation (PourTout (v,Negation(f)))
;;

let different t1 t2 =
	Negation (Egal (t1,t2))
;;

let strictementInferieur t1 t2 =
	et (InferieurOuEgal (t1,t2)) (Negation (Egal (t1,t2)))
;;

let pourToutBorne v t f =
	PourTout (v,Implication (InferieurOuEgal (Variable v,t),f))
;;

let ilExisteBorne v t f =
	Negation (pourToutBorne v t (Negation f))
;;

(* Les deux dernières fonctions signifient respectivement "Pour toute variable v inférieure au terme t, f est vérifiée" et
     "Il existe une variable v inférieure au terme t telle que f soit vérifiée". Bien qu'elles paraissent pour l'instant assez
     dénuées d'intérêt, elles seront très utiles par la suite. *)

(* La notion de vérité de l'arithmétique de Peano est définie par récurrence :
	- Si un énoncé est de la forme "t1 = t2" où t1 et t2 sont des termes, il est vrai ssi t1 = t2.
	- Si un énoncé est de la forme "t1 <= t2" où t1 et t2 sont des termes, il est vrai ssi t1 <= t2.
	- Si un énoncé est de la forme "~f" où f est une formule, il est vrai ssi f est faux.
	- Si un énoncé est de la forme "f1 => f2" où f1 et f2 sont des formules, il est vrai ssi f1 est faux ou f2 est vrai.
	- Si un énoncé est de la forme "A(v)F", il est vrai ssi pour tout nombre n, l'énoncé F(n) est vrai.
   Et on dira qu'un énoncé est faux si et seulement si il n'est pas vrai.
   On rappelle que supposer P.A. correct revient à dire "Toute formule prouvable est vraie et tout formule réfutable est fausse".
     (on définira plus tard la notion de prouvabilité et de réfutabilité) *)

(* On va maintenant créer des fonctions chargées d'aller chercher à l'intérieur d'une formule (ou d'un terme) la variable ayant 
     l'indice le plus grand (ceci pour être capable d'éviter les collisions entre variables) *)

let rec plusGrandeVariableDansTerme t = match t with
	| Variable (v) -> v
	| Nombre (n) -> 0
	| Addition (t1,t2) -> min (plusGrandeVariableDansTerme t1) (plusGrandeVariableDansTerme t2)
	| Multiplication (t1,t2) -> min (plusGrandeVariableDansTerme t1) (plusGrandeVariableDansTerme t2)
	| Exponentiation (t1,t2) -> min (plusGrandeVariableDansTerme t1) (plusGrandeVariableDansTerme t2)
	| Successeur (t1) -> plusGrandeVariableDansTerme t1
;; (* Cette fonction renvoie la variable ayant l'indice le plus grand dans un terme t *)

let rec plusGrandeVariableDansFormule f = match f with
	| Egal (t1,t2) -> min (plusGrandeVariableDansTerme t1) (plusGrandeVariableDansTerme t2)
	| InferieurOuEgal (t1,t2) -> min (plusGrandeVariableDansTerme t1) (plusGrandeVariableDansTerme t2)
	| Negation (f1) -> plusGrandeVariableDansFormule f1
	| Implication (f1,f2) -> min (plusGrandeVariableDansFormule f1) (plusGrandeVariableDansFormule f2)
	| PourTout (v,f1) -> min v (plusGrandeVariableDansFormule f1)
;; (* Cette fonction recherche la variable ayant l'indice le plus grand dans une formule f *)

(* Pour simplifier les formules à suivre, on va faire des alias *)

let pgvdt = plusGrandeVariableDansTerme ;;
let pgvdf = plusGrandeVariableDansFormule ;;

let (++) x y = Addition (x,y) ;;
let ( ** ) x y = Multiplication (x,y) ;;
let (^^) x y = Exponentiation (x,y) ;;
let succ x = Successeur x ;;

let (===) x y = Egal (x,y) ;;
let (<<=) x y = InferieurOuEgal (x,y) ;;
let (=/=) x y = different x y ;;
let (<<<) x y = strictementInferieur x y ;;

let (==>) x y = Implication (x,y) ;;
let pt x y = PourTout (x,y) ;;
let ie x y = ilExiste x y ;;
let (~~~) x = Negation x ;;
let (^^^) x y = et x y ;;
let (|/) x y = ou x y ;;
let (<=>) x y = equivalent x y ;;
let ptb (x,y) z = pourToutBorne x y z ;;
let ieb (x,y) z = ilExisteBorne x y z ;;

let var x = Variable x ;;
let nb x = Nombre x ;;
let v1 = var (-1) ;;

(* On va maintenant définir les formules exprimant la concaténation de deux formules en base 13 *)

let puiss13 x =
	let v = (pgvdt x) - 1 in (* On calcule la variable qu'on va utiliser pour éviter les collisions *)
	ie v (x === (nb 13) ^^ (var v))
;; (* La formule "puiss13 x" est vraie si et seulement si x est une puissance de 13 *)

let s x y =
	let v = (min (pgvdt x) (pgvdt y)) - 1 in
	(puiss13 y) ^^^ (x <<< y) ^^^ (pt v ((puiss13 (var v)) ^^^ (x <<< (var v))) ==> (y <<= (var v)))
;; (* La formule "s x y" est vraie si et seulement si y est la plus plus petite puissance de b plus grande que x *)

let puissl13 x y =
	((x === (nb 0)) ^^^ (y === (nb 13))) |/ ((x =/= (nb 0)) ^^^ (s x y))
;; (* La formule "puissl13 x y" est vraie si et seulement si 13^(l13(x))=y, où l13(x) est la longueur de x écrit en base 13 *)

let concat13 x y z =
	let v1 = (min (min (pgvdt x) (pgvdt y)) (pgvdt z)) - 1 in
	let v2 = v1 - 1 in
	ie v1 (ie v2 ((puissl13 y (var v1)) ^^^ ((x ** (var v1)) === (var v2)) ^^^ (((var v2) ++ y) === z)))
;; (* La formule concat13 x y z est vraie si et seulement si x*y=z en base 13, où * est l'opérateur de concaténation *)

let rec grosseConcat13 liste y = match liste with
	| [] -> failwith "Problème !"
	| [x] -> failwith "Problème !"
	| [x1;x2] -> concat13 x1 x2 y
	| x::reste -> begin
			let precedent = grosseConcat13 reste y in
			let v = (pgvdf precedent) - 1 in
			ie v ((grosseConcat13 reste (Variable v)) ^^^ (concat13 (Variable v) x y))
		      end
;; (* Le formule grosseConcat13 [x1,x2,...,xn] y est vraie si et seulement si x1*x2*...*xn=y en base 13
      La méthode utilisée est algorithmiquement monstrueuse, mais je n'en vois pas d'autre évidente. *)

let rec grosseConcat tableau y = 
	let taille = Array.length tableau in
	let vrairenvoi = ref (Egal (nb 17,nb 42)) in
	if taille > 2 then
	begin
		let variableMin = ref 0 in
		for i = 0 to (taille - 1) do
			variableMin := min !variableMin (pgvdt tableau.(i))
		done;
		let v = Array.make (taille-2) (-1) in
		for i = 0 to (taille - 3) do
			v.(i) <- (!variableMin - (i+1))
		done;
		let renvoi = ref (concat13 tableau.(0) tableau.(1) (var v.(0))) in
		for i = 1 to (taille-3) do
			renvoi := !renvoi ^^^ (concat13 (var v.(i-1)) tableau.(i+1) (var v.(i)));
		done;
		renvoi := !renvoi ^^^ (concat13 (var v.(taille-3)) tableau.(taille-1) y);
		for i = 0 to (taille-3) do
			renvoi := ie v.(i) !renvoi;
		done;
		vrairenvoi := !renvoi;
	end
	else if taille = 2 then
		vrairenvoi := concat13 tableau.(0) tableau.(1) y;
	!vrairenvoi
;; (* La formule grosseConcat [|x1;x2;...;xn|] est équivalente à la formule grosseConcat13 [x1;x2;...;xn], mais elle 
        est beaucoup plus efficace algorithmiquement parlant : elle est linéaire au lieu d'être exponentielle, que ce soit
        en temps ou en nombre de variables utilisées. *)


(* On va faire une petite pause théorique. *)

(* On dit qu'une partie P de IN est représentée par une formule ayant une unique variable libre F(v) lorsqu'on a l'équivalence :
		"F(n) est vraie <=> n appartient à P"
   Il existe un nombre dénombrable de formules mais un nombre indénombrable de parties de IN : il existe donc forcément des parties de
     IN impossibles à représenter par une formule.

   On appelle ensemble arithmétique tout ensemble "représentable", autrement dit tel qu'il existe une formule F(v) qui le représente.
   Une relation R(x1,x2,...,xn) est arithmétique s'il existe une formule F(x1,...,xn) qui est vraie si et seulement si R(x1,...,xn).
   Une fonction f(x1,...,xn) est arithmétique si la relation R(x1,...,xn,y) équivalente à f(x1,...,xn)=y est arithmétique.

   On a donc vu par exemple, que l'addition, la multiplication, ou plus compliqué, la concaténation en base 13, étaient toutes des
     fonctions arithmétiques.

   Une des idées géniales de Gödel, c'est d'établir une bijection entre l'ensemble des expressions et IN : ainsi, on pourra associer à 
     chaque formule un nombre unique, et considérer des ensembles de formules comme des ensembles de nombres. Ce procédé sera appelé la
     numérotation de Gödel. Il existe plusieurs manières de créer des fonctions bijectives de l'ensemble des expressions dans IN : on 
     utilisera ici une modification de la méthode de Quine (Mathematical Logic, 1940), en décomposant nos expressions en base 13. À 
     chacun des 13 symboles de notre alphabet, on associe le chiffre suivant :
          0   '   (   )   f   ,   v   ~   =>  \/  =   <=  #
	  1   0   2   3   4   5   6   7   8   9   a   b   c
     l'expression correspondant à la variable v2 par exemple, qui s'écrit sans abréviation "(v,,)", a pour numéro de Gödel 26553.
   Le fait que le chiffre 0 a été attribué à "'" et pas à "0", s'explique par la simplification obtenue : pour tout nombre entier n, 
     le numéro de Gödel de sa représentation dans cet alphabet est 13^n.

   Maintenant qu'on a une correspondance entre des entiers et des formules, on peut se demander si certains ensembles de formules sont
     ou non représentables. Par exemple, l'ensemble des expressions prouvables est-il représentable ? On va voir que oui, et la
     formule qui exprime cet ensemble est à la base de l'énoncé indécidable que nous allons exhiber ici.

   Intéressons-nous au système formel d'axiomes qui est à la base de l'arithmétique de Peano. Ce système est composé de 19 schémas
     d'axiomes et de deux règles de déduction. Ces 19 schémas d'axiomes peuvent être classés en 4 groupes :

   Groupe I : schémas d'axiomes du calcul propositionnel
   	L1 : F => (G => F)
	L2 : (F => (G => H)) => ((F => G) => (F => H))
	L3 : (~F => ~G) => (G => F)
   
   Groupe II : schémas d'axiomes additionnels, pour la logique du premier ordre avec identité
   	L4 : (\/v (F => G)) => ((\/v F) => (\/v G))
	L5 : F => (\/v F)               (si v n'apparaît pas dans F)
	L6 : ~(\/v ~(v = t))            (si v n'apparaît pas dans t)
	L7 : (v = t) => (XvY => XtY)    (si X et Y sont deux expressions telles que XvY soit une formule atomique)

   (On peut remarquer que ces schémas d'axiomes comportent chacun une infinité d'axiomes : toutes les formules de la forme L1 
     sont vraies, par exemple, et ceci pour n'importe quelles formules F et G. Plus généralement, les schémas d'axiomes L1 à L7 
     sont vrais si F, G et H sont des formules, si v est une variable, et si t est un terme.)

   Groupe III : schémas ne comportant qu'un axiome (contrairement à ceux du groupe I et II)
   	N1  : (v1' = v2') => (v1 = v2)
	N2  : ~(0 = v1')
	N3  : (v1 + 0) = v1
	N4  : (v1 + v2') = (v1 + v2)'
	N5  : (v1.0) = 0
	N6  : (v1.v2') = ((v1.v2) + v1)
	N7  : (v1 <= 0) eq (v1 = 0)
	N8  : (v1 <= v2') eq ((v1 <= v2) ou (v1 = v2'))
	N9  : (v1 <= v2) ou (v2 <= v1)
	N10 : (v1 e 0) = 0'
	N11 : (v1 e v2') = ((v1 e v2).v1)
     (on a ici écrit "eq" et "ou" pour les symboles "équivalence" et "disjonction", pour éviter une écriture trop lourde)

   Groupe IV : récurrence mathématique
   	N12 : F(0) => ((\/v1 (F(v1) => F(v1'))) => (\/v1 F(v1)))
     (où F(a) désigne le résultat de la substitution du terme a à toutes les occurrences libres de v1 dans F(v1))

   Et les règles de déduction sont les suivantes :
   	Règle 1 (Modus Ponens)   : De F et de (F => G), on en déduit G
	Règle 2 (Généralisation) : De F, on déduit (\/v F)

   
   On appelle preuve (dans le système P.A.) une suite finie de formules telles que chaque terme de la suite soit ou bien un 
     axiome, ou bien directement dérivable à partir de deux termes antérieurs par application de la règle 1, ou bien directement
     dérivable à partir d'un terme antérieur par application de la règle 2.
   
   Une formule F est dite prouvable s'il existe une preuve dont le dernier terme est F ; et une telle suite est appellée preuve
     de F. Une formule F est dite réfutable si sa négation est prouvable.

   On va prouver que l'ensemble des formules prouvables est un ensemble arithmétique, et à partir de la relation qui l'exprime, 
     exhiber un énoncé indécidable. Pour ça, on va procéder par étapes. On va prouver que certaines relations et fonctions sont
     arithmétiques, jusqu'à arriver à l'ensemble des formules prouvables. Beau programme non ? ^^ *)

let commence x y =
	let z = (min (pgvdt x) (pgvdt y)) - 1 in
	let w = z - 1 in
	(x === y) |/ (ieb (z,y) (ieb (w,y) ((puiss13 (var w)) ^^^ (concat13 (x ** (var w)) (var z) y))))
;; (* La formule "commence x y" est vraie si et seulement sila décomposition en base 13 de x est un préfixe de celle de y *)

let termine x y =
	let z = (min (pgvdt x) (pgvdt y)) - 1 in
	(x === y) |/ (ieb (z,y) (concat13 (var z) x y ))
;; (* La formule "termine x y" est vraie si et seulement si la décomposition en base 13 en x est un suffixe de celle de y *)

let partie x y =
	let z = (min (pgvdt x) (pgvdt y)) - 1 in
	ieb (z,y) ((termine (var z) y) ^^^ (commence x (var z)))
;; (* La formule "partie x y" est vraie si et seulement si la décomposition en base 13 de x est un sous-mot de celle de y *)

let grossePartie tableau y =
	let v = ref 0 in
	Array.iter (fun x -> v := min (!v) (pgvdt x)) tableau;
	decr v;
	let z = !v in
	ieb (z,y) ((grosseConcat tableau (var z)) ^^^ (partie (var z) y))
;; (* La formule "grossePartie [x1;x2;...;xn] y" est vraie si et seulement si la décomposition en base 13 de x1*x2*...*xn 
      est un sous-mot de celle de y *)

(* Jusqu'ici, on ne s'est pas servi du symbole "#". Ce symbole va nous être utile pour définir une suite finie de termes.
   Le n-uplet d'expressions (dont chacune ne comporte pas #) (X1,...,Xn) va être représenté formellement par l'expression
     #X1#...#Xn#, et son numéro de Gödel sera appelé "numéro de suite" *)

let diese = Nombre 12 ;;

let seq x =
	let y = (pgvdt x) - 1 in
	(commence diese x) ^^^ (termine diese x) ^^^ (diese =/= x) ^^^ (~~~ (grossePartie [|diese;diese|] x))
	    ^^^ (ptb (y,x) ((grossePartie [|diese;(nb 0);(var y)|] x) ==> (commence diese (var y))))
;; (* La formule "seq x" est vraie si et seulement si x est un numéro de liste *)

let appartient x y =
	(seq y) ^^^ (grossePartie [|diese;x;diese|] y) ^^^ (~~~ (partie diese x))
;; (* La formule "appartient x y" est vraie si et seulement si y est un numéro de suite et x un terme de cette suite. *)

let estSitueAvant x y z =
	let w = (min (min (pgvdt x) (pgvdt y)) (pgvdt z)) - 1 in
	(appartient x z) ^^^ (appartient y z) 
	  ^^^ ieb (w,z) ((commence (var w) z) ^^^ (appartient x (var w)) ^^^ (~~~ (appartient y (var w))))
;; (* La formule "estSitueAvant x y z" est vraie si et seulement si z est un numéro de suite, que x et y sont des termes de
      cette suite, et que la première occurence de x dans z précède la première occurence de y. *)

let pourToutAppartenant x y f =
	pt x ((appartient (var x) y) ==> f)
;; (* Une simple abréviation *)
let pta = pourToutAppartenant ;;

let ilExisteSitueAvant x y z w f =
	ie x (ie y ((estSitueAvant (var x) z w) ^^^ (estSitueAvant (var y) z w) ^^^ f))
;; (* Une autre abréviation un peu plus tordue *)
let iesa = ilExisteSitueAvant ;;

(* On a défini par récurrence ce qu'étaient des termes et des formules, il faut remplacer ces définitions par des définitions
     explicites, en s'aidant de l'outil des suites que l'on vient de définir.
   
   On définit une relation Rt comme suit : pour tout triplet d'expressions (X,Y,Z), Rt(X,Y,Z) est vraie si et seulement si Z est
     une des expressions (X+Y), (X.Y), (XeY) ou (X'). On désignera par la dénomination "suite de constructions de termes" une 
     suite finie d'expressions (X1,...,Xn) telles que pour chaque élément Xi de la suite, Xi est soit une variable, soit un nombre,
     soit une expression telle que Rt(Xj,Xk,Xi), où j et k sont dans [[1,i-1]]. Du coup, on peut dire qu'une expression X est un
     terme si et seulement s'il existe une suite de construction de termes dont X est un élément. 
   
   De même, on définit Rf comme suit : pour tout triplet de formules (X,Y,Z), Rf(X,Y,Z) est vraie si et seulement si Z est une
     des expressions (~X), (X=>Y), ou (\/v X) pour une variable v. On pourra dire de la même façon que X est une formule si et 
     seulement s'il existe une "suite de construction de formules" dont X est un élément. *)

let imp x y z =
	grosseConcat [|(nb 2);x;(nb 8);y;(nb 3)|] z
;; (* La formule "imp x y z" est vraie si et seulement si E{z}=(E{x}=>E{y}) *)

let neg x y =
	concat13 (nb 7) x y
;; (* La formule "neg x y" est vraie si et seulement si E{y}=~E{x} *)

let pl x y z =
	grosseConcat [|(nb 2);x;(nb 4);(nb 5);y;(nb 3)|] z
;; (* La formule "pl x y z" est vraie si et seulement si E{z}=(E{x}+E{y}) *)

let mult x y z =
	grosseConcat [|(nb 2);x;(nb 4);(nb 5);(nb 5);y;(nb 3)|] z
;; (* La formule "mult x y z" est vraie si et seulement si E{z}=(E{x}.E{y}) *)


let exp x y z =
	grosseConcat [|(nb 2);x;(nb 4);(nb 5);(nb 5);(nb 5);y;(nb 3)|] z
;; (* La formule "exp x y z" est vraie si et seulement si E{z}=(E{x}eE{y}) *)


let suc x y =
	concat13 x (nb 0) y
;; (* La formule "suc x y" est vraie si et seulement si E{y}=E{x}' *)


let id x y z =
	grosseConcat [|x;(nb 10);y|] z
;; (* La formule "id x y z" est vraie si et seulement si E{z}="E{x}=E{y}" *)


let ie x y z =
	grosseConcat [|x;(nb 11);y|] z
;; (* La formule "ie x y z" est vraie si et seulement si E{z}="E{x}<=E{y}" *)

let estChaineDIndices x =
	let y = (pgvdt x) - 1 in
	ptb (y,x) ((partie (var y) x) ==> (partie (nb 5) (var y)))
;; (* La formule "estChaineDIndices x" est vraie si et seulement si E{x} est de la forme ",,,[...]," *)

let estUneVariable x =
	let y = (pgvdt x) - 1 in
	ieb (y,x) ((estChaineDIndices (var y)) ^^^ (grosseConcat [|(nb 2);(nb 6);(var y);(nb 3)|] x))
;; (* La formule "estUneVariable x" est vraie si et seulement si E{x} est une variable *)

let estUnNombre x =
	puiss13 x
;; (* La formule "estNombre x" est vraie si et seulement si x est un nombre *)

let rt x y z =
	(pl x y z) |/ (mult x y z) |/ (exp x y z) |/ (suc x y)
;; (* La formule "rt x y z" est vraie si et seulement si la relation Rt(x,y,z) est vérifiée *)

let seqt x =
	let y = (pgvdt x) - 1 in
	let z = y - 1 in
	let w = z - 1 in
	(seq x) ^^^ (pta y x ((estUneVariable (var y)) |/ (estUnNombre (var y)) 
	                          |/ (iesa z w (var y) x (rt (var z) (var w) (var y)))))
;; (* La formule "seqt x" est vraie si et seulement si E{x} est une suite de construction de terme *)

let tm x =
	let y = (pgvdt x) - 1 in
	ie y ((seqt (var y)) ^^^ (appartient x (var y)))
;; (* La formule "tm x" est vraie si et seulement si E{x} est un terme *)

let estFormuleAtomique x =
	let y = (pgvdt x) - 1 in
	let z = y - 1 in
	ieb (y,x) (ieb (z,x) ((tm (var y)) ^^^ (tm (var z)) ^^^ ((id x (var y) (var z)) |/ (ie x (var y) (var z)))))
;; (* La formule "estFormuleAtomique x" est vraie si et seulement si E{x} est une formule atomique *)

let gen x y =
	let z = (min (pgvdt x) (pgvdt y)) - 1 in
	ieb (z,y) ((estUneVariable (var z)) ^^^ (grosseConcat [|(nb 9);(var z);x|] y))
;; (* La formule "gen x y" est vraie si et seulement si il existe une variable w telle que E{y}=\/w E{x} *)

let genbis v x y =
	(estUneVariable v) ^^^ (grosseConcat [|(nb 9);v;x|] y)
;; (* La formule "genbis v x y" est vraie si et seulement si E{y}=\/v E{x} *)

let rf x y z =
	(imp x y z) |/ (neg x z) |/ (gen x z)
;; (* La formule "rf x y z" est vraie si et seulement si la relation Rf(x,y,z) est vérifiée *)

let seqf x =
	let y = (pgvdt x) - 1 in
	let z = y - 1 in
	let w = z - 1 in
	(seq x) ^^^ (pta y x ((estFormuleAtomique (var y)) |/ (iesa z w (var y) x (rf (var z) (var w) (var y)))))
;; (* La formule "seqf x" est vraie si et seulement si E{x} est une suite de construction de formule *)

let fm x =
	let y = (pgvdt x) - 1 in
	ie y ((seqf (var y)) ^^^ (appartient x (var y)))
;; (* La formule "fm x" est vraie si et seulement si E{x} est une formule *)

(* On atteint une partie pas très drôle : on va montrer que l'ensemble des formules de la forme L1, ... , L7, 
     N1, ... , N12 est un ensemble arithmétique. Ça ne pose aucune difficulté théorique, mais il faut le faire si
     on veut obtenir notre ensemble des numéros de Gödel des propositions démontrables. *)

let l1 x =
	let va = (pgvdt x) - 1 in
	let vb = va - 1 in
	let vc = vb - 1 in
	(ieb (va,x) (ieb (vb,x) (ieb (vc,x) 
		((fm (var va)) ^^^ (fm (var vb)) ^^^ (fm (var vc)) 
		  ^^^ (imp (var vb) (var va) (var vc))
		  ^^^ (imp (var va) (var vc) x)))))
;;

let l2 x = (* Attention les yeux *)
	let va = (pgvdt x) - 1 in
	let vb = va - 1 in
	let vc = vb - 1 in
	let vd = vc - 1 in
	let ve = vd - 1 in
	let vf = ve - 1 in
	let vg = vf - 1 in
	let vh = vg - 1 in
	(ieb (va,x) (ieb (vb,x) (ieb (vc,x) (ieb (vd,x) (ieb (ve,x) (ieb (vf,x) (ieb (vg,x) (ieb (vh,x)
		((fm (var va)) ^^^ (fm (var vb)) ^^^ (fm (var vc)) ^^^ (fm (var vd)) ^^^ 
		 (fm (var ve)) ^^^ (fm (var vf)) ^^^ (fm (var vg)) ^^^ (fm (var vh)) 
		 ^^^ (imp (var vb) (var vc) (var vd))
		 ^^^ (imp (var va) (var vb) (var ve))
		 ^^^ (imp (var va) (var vc) (var vf))
		 ^^^ (imp (var va) (var vd) (var vg))
		 ^^^ (imp (var ve) (var vf) (var vh))
		 ^^^ (imp (var vg) (var vh) x))))))))))
;;

let l3 x =
	let va = (pgvdt x) - 1 in
	let vb = va - 1 in
	let vc = vb - 1 in
	let vd = vc - 1 in
	let ve = vd - 1 in
	let vf = ve - 1 in
	(ieb (va,x) (ieb (vb,x) (ieb (vc,x) (ieb (vd,x) (ieb (ve,x) (ieb (vf,x)
		((fm (var va)) ^^^ (fm (var vb)) ^^^ (fm (var vc)) ^^^ (fm (var vd)) ^^^ (fm (var ve)) ^^^ (fm (var vf))
		 ^^^ (neg (var va) (var vc))
		 ^^^ (neg (var vb) (var vd))
		 ^^^ (imp (var vb) (var va) (var ve))
		 ^^^ (imp (var vc) (var vd) (var vf))
		 ^^^ (imp (var vf) (var ve) x))))))))
;;

let l4 x =
	let va = (pgvdt x) - 1 in
	let vb = va - 1 in
	let vc = vb - 1 in
	let vd = vc - 1 in
	let ve = vd - 1 in
	let vf = ve - 1 in
	let vg = vf - 1 in
	let vi = vf - 1 in
	(ieb (va,x) (ieb (vb,x) (ieb (vc,x) (ieb (vd,x) (ieb (ve,x) (ieb (vf,x) (ieb (vg,x) (ieb (vi,x) 
		((fm (var va)) ^^^ (fm (var vb)) ^^^ (fm (var vc)) ^^^ (fm (var vd)) ^^^ 
		 (fm (var ve)) ^^^ (fm (var vf)) ^^^ (fm (var vg)) ^^^ (estUneVariable (var vi)) 
		 ^^^ (imp (var va) (var vb) (var vc))
		 ^^^ (genbis (var vi) (var vc) (var vd))
		 ^^^ (genbis (var vi) (var va) (var ve))
		 ^^^ (genbis (var vi) (var vb) (var vf))
		 ^^^ (imp (var ve) (var vf) (var vg))
		 ^^^ (imp (var vd) (var vg) x))))))))))
;;

let l5 x =
	let va = (pgvdt x) - 1 in
	let vb = va - 1 in
	let vi = vb - 1 in
	(ieb (va,x) (ieb (vb,x) (ieb (vi,x)
		((fm (var va)) ^^^ (fm (var vb)) ^^^ (estUneVariable (var vi))
		 ^^^ (genbis (var vi) (var va) (var vb))
		 ^^^ (~~~ (partie (var vi) (var va)))
		 ^^^ (imp (var va) (var vb) x)))))
;;

let l6 x =
	let t = (pgvdt x) - 1 in
	let va = t - 1 in
	let vb = va - 1 in
	let vc = vb - 1 in
	let vi = vc - 1 in
	(ieb (va,x) (ieb (vb,x) (ieb (vc,x) (ieb (t,x) (ieb (vi,x)
		((fm (var va)) ^^^ (fm (var vb)) ^^^ (fm (var vc)) ^^^ (estUneVariable (var vi)) ^^^ (tm (var t))
		 ^^^ (~~~ (partie (var vi) (var t)))
		 ^^^ (id (var vi) (var t) (var va))
		 ^^^ (neg (var va) (var vb))
		 ^^^ (genbis (var vi) (var vb) (var vc))
		 ^^^ (neg (var vc) x)))))))
;;

let l7 x =
	let t = (pgvdt x) - 1 in
	let x1 = t - 1 in
	let x2 = x1 - 1 in
	let va = x2 - 1 in
	let vb = va - 1 in
	let vc = vb - 1 in
	let vd = vc - 1 in
	let vi = vd - 1 in
	(ieb (t,x) (ieb (x1,x) (ieb (x2,x) (ieb (va,x) (ieb (vb,x) (ieb (vc,x) (ieb (vd,x) (ieb (vi,x)
		((fm (var va)) ^^^ (fm (var vb)) ^^^ (fm (var vc)) ^^^ (fm (var vd)) ^^^
		 (estUneVariable (var vi)) ^^^ (tm (var t))
		 ^^^ (id (var vi) (var t) (var va))
		 ^^^ (grosseConcat13 [(var x1);(var vi);(var x2)] (var vb))
		 ^^^ (grosseConcat13 [(var x1);(var t);(var x2)] (var vc))
		 ^^^ (imp (var vb) (var vc) (var vd))
		 ^^^ (imp (var va) (var vd) x))))))))))
;;

(* Les formules "li x" sont vraies si E{x} est de la forme du schéma d'axiome Li *)
(* Pour les axiomes du groupe III, il suffit de vérifier si x correspond à un numéro de Gödel d'un des axiomes N1 à N11*)

let godelv1 =
	nb (3 + 13 * (0 + 13 * (6 + 13 * 2)))
;; (* godelv1 est une constante égale à (Nombre k), où k est le numéro de Gödel de l'expression "(v')" *)

let godelv2 =
	nb (3 + 13 * (0 + 13 * (0 + 13 * (6 + 13 * 2))))
;; (* Idem pour l'expression "(v'')" *)

let godelplus = 
	nb (5 + 13 * 4)
;;

let godelfois =
	nb (5 + 13 * (5 + 13 * 4))
;;

let godelexp =
	nb (5 + 13 * (5 + 13 * (5 + 13 * 4)))
;;

let trad = function
	| '0' -> (nb 1)
	| '\'' -> (nb 0)
	| '(' -> (nb 2)
	| ')' -> (nb 3)
	| 'f' -> (nb 4)
	| ',' -> (nb 5)
	| 'v' -> (nb 6)
	| '~' -> (nb 7)
	| '>' -> (nb 8)
	| 'A' -> (nb 9)
	| '=' -> (nb 10)
	| '<' -> (nb 11)
	| '#' -> (nb 12)
	|  _  -> failwith "wat"
;;

(* Les formules l1 à l7 sont valables mais sont très lourdes algorithmiquement. Aussi je vais les recoder, en utilisant le moins
     de formules intermédiaires possibles, et en ne vérifiant pas si ce sont bien des formules ; cette vérification sera faite 
     uniquement à la fin, dans la fonction "estUnAxiome". En effet, si F n'est pas une formule, (F => (G => F)) est une expression
     bien définie, mais certainement pas une formule. *)

let l1bis x =
	let f = (pgvdt x) - 1 in
	let g = f - 1 in
	(ieb (f,x) (ieb (g,x) ( 
	  grosseConcat [| trad '(' ; var f ; trad '(' ; var g ; trad '>' ; var f ; trad ')' ; trad ')' |] x)))
;;

let l2bis x =
	let f = (pgvdt x) - 1 in
	let g = f - 1 in
	let h = f - 1 in
	(ieb (f,x) (ieb (g,x) (ieb (h,x) ( 
	  grosseConcat [| trad '(' ; var f ; trad '>' ; trad '(' ; var g ; trad '>' ; var h ; trad ')' ; trad ')' ; 
	                  trad '>' ; trad '(' ; trad '(' ; var f ; trad '>' ; var g ; trad ')' ; trad '>' ; trad '(' ; 
	                  var f ; trad '>' ; var h ; trad ')' ; trad ')' |] x))))
;;

let l3bis x =
	let f = (pgvdt x) - 1 in
	let g = f - 1 in
	(ieb (f,x) (ieb (g,x) ( 
	  grosseConcat [| trad '(' ; trad '~' ; var f ; trad '>' ; trad '~' ; var g ; trad ')' ; 
	                  trad '>' ; trad '(' ; var g ; trad '>' ; trad 'f' ; trad ')' |] x)))
;;

let l4bis x =
	let vi = (pgvdt x) - 1 in
	let f = vi - 1 in
	let g = f - 1 in
	(ieb (vi,x) (ieb (f,x) (ieb (g,x) (
	  grosseConcat [| trad '(' ; trad 'A' ; var vi ; trad '(' ; var f ; trad '>' ; var g ; trad ')' ; trad '>' ; trad '(' ;
	                  trad 'A' ; var vi ; var f ; trad '>' ; trad 'A' ; var vi ; var g ; trad ')' ; trad ')' ; |] x))))
;;

let l5bis x =
	let vi = (pgvdt x) - 1 in
	let f = vi - 1 in
	(ieb (vi,x) (ieb (f,x) ((~~~ (partie (var vi) (var f))) ^^^
	  grosseConcat [| trad '(' ; var f ; trad 'A' ; var vi ; var f ; trad ')' |] x)))
;;

let l6bis x =
	let vi = (pgvdt x) - 1 in
	let t = vi - 1 in
	(ieb (vi,x) (ieb (t,x) ((~~~ (partie (var vi) (var t))) ^^^
	  grosseConcat [| trad '~' ; trad 'A' ; var vi ; trad '~' ; trad '(' ; var vi ; trad '=' ; var t ; trad ')' |] x)))
;;

let l7bis x = 
	let vi = (pgvdt x) - 1 in
	let t = vi - 1 in
	let x1 = t - 1 in
	let x2 = x1 - 1 in
	(ieb (vi,x) (ieb (t,x) (ieb (x1,x) (ieb (x2,x) (
	  grosseConcat [| trad '(' ; var vi ; trad '=' ; var t ; trad '>' ; trad '(' ; var x1 ; var vi ; var x2 ; trad '>' ;
	                  var x1 ; var t ; var x2; trad ')' ; trad ')' |] x)))))
;;

(* La formule "libis x" est vraie si et seulement si E{x} est de la forme du schéma d'axiomes li, i allant de 1 à 7.
   Enfin, pas exactement.  E{x} pourrait par exemple être de la forme du schéma d'axiomes l1, mais avec F et G deux expressions
     ne signifiant rien et n'étant pas des formules. Il faudra donc vérifier par la suite que l'on obtient bien une formule.
     (ce choix est fait pour éviter le nombre d'appels à la fonction "fm x", fonction qui s'écrit en plusieurs centaines de
     milliers de caractères...)
   À propos de la formule l7bis, on ne vérifie nulle part que X1viX2 soit une formule atomique : je considère qu'étant donné
     l'impossibilité théorique d'obtenir une formule du type "\/vi ( [...] \/vi ([...]))", cette vérification est inutile. *)

let n12bis x =
	let f = (pgvdt x) - 2 in
	let vi = f - 1 in
	let f0 = vi - 1 in
	let fvi = f0 - 1 in
	let fviprime = fvi - 1 in
	(ieb (f,x) (ieb (vi,x) (ieb (f0,x) (ieb (fvi,x) (ieb (fviprime,x) ((~~~ (partie (var vi) (var f)))
	 ^^^ grosseConcat [| trad 'A' ; var (-1) ; trad '(' ; var (-1) ; trad '=' ; nb 0 ; trad '>' ; var f ; trad ')' |] (var f0)
	 ^^^ grosseConcat [| trad 'A' ; var vi ; trad '(' ; var (-1) ; trad '=' ; nb 0 ; trad '>' ; var f ; trad ')' |] (var fvi)
	 ^^^ grosseConcat [| trad 'A' ; var vi ; trad '\'' ; trad '(' ; var (-1) ; trad '=' ; nb 0 ; trad '>' ; var f ; trad ')' |] (var fviprime)
	 ^^^ grosseConcat [| trad '(' ; var f0 ; trad '>' ; trad '(' ; trad 'A' ; var vi ; trad '(' ; var fvi ; trad '>' ;
	                     var fviprime ; trad ')' ; trad '>' ; trad 'A' ; var (-1) ; var f ; trad ')' |] x))))))
;;



let estAxiomeDuGroupeIII x =
	   grosseConcat [| trad '(' ; godelv1 ; trad '\'' ; trad '=' ; godelv2 ; trad '\'' ;
	                   trad '>' ; godelv1 ; trad '=' ; godelv2 ; trad ')' |] x
	|/ grosseConcat [| trad '~' ; trad '0' ; trad '=' ; godelv1 ; trad '\'' |] x
	|/ grosseConcat [| trad '(' ; godelv1 ; godelplus ; trad '0' ; trad ')' ; trad '=' ; godelv1 |] x
	|/ grosseConcat [| trad '(' ; godelv1 ; godelplus ; godelv2 ; trad '\'' ; trad ')' ; trad '=' ;
			   trad '(' ; godelv1 ; godelplus ; godelv2 ; trad ')' ; trad '\'' |] x
	|/ grosseConcat [| trad '(' ; godelv1 ; godelfois ; trad '0' ; trad ')' ; trad '=' ; trad '0' |] x
	|/ grosseConcat [| trad '(' ; godelv1 ; godelfois ; godelv2 ; trad '\'' ; trad ')' ; trad '=' ;
			   trad '(' ; trad '(' ; godelv1 ; godelfois ; godelv2 ; trad ')' ; godelplus ; 
			   godelv1 ; trad ')' |] x
	|/ grosseConcat [| trad '~' ; trad '(' ; trad '(' ; godelv1 ; trad '=' ; trad '0' ; trad '>' ;
			   godelv1 ; trad '<' ; trad '0' ; trad ')' ; trad '>' ; trad '~' ; trad '(' ;
			   godelv1 ; trad '<' ; trad '0' ; trad '>' ; godelv1 ; trad '=' ; trad '0' ;
			   trad ')' ; trad ')' |] x
	|/ grosseConcat [| trad '~' ; trad '(' ; trad '(' ; trad '(' ; trad '~' ; godelv1 ; trad '<' ; 
			   godelv2  ; trad '>' ; godelv1 ; trad '=' ; godelv2 ; trad '\'' ; trad ')' ; 
			   trad '>' ; godelv1 ; trad '<' ; godelv2 ; trad '\''  ; trad ')' ; trad '>' ; 
			   trad '~' ; trad '(' ; godelv1 ; trad '<' ; godelv2 ; trad '\''  ; trad '>' ; 
			   trad '(' ; trad '~' ; godelv1 ; trad '<' ; godelv2  ; trad '>' ; godelv1 ; 
			   trad '=' ; godelv2 ; trad '\'' ; trad ')' ; trad ')' ; trad ')' |] x
	|/ grosseConcat [| trad '(' ; trad '~' ; godelv1 ; trad '<' ; godelv2 ; trad '>' ;
			   godelv2 ; trad '<' ; godelv1 ; trad ')' |] x
	|/ grosseConcat [| trad '(' ; godelv1 ; godelexp ; trad '0' ; trad ')' ; trad '=' ; trad '0' ; trad '\'' |] x
	|/ grosseConcat [| trad '(' ; godelv1 ; godelexp ; godelv2 ; trad '\'' ; trad ')' ; trad '=' ;
			   trad '(' ; trad '(' ; godelv1 ; godelexp ; godelv2 ; trad ')' ; 
			   godelv1 ; trad ')' |] x
;; (* La formule "estAxiomeDuGroupeIII x" est vraie si et seulement si E{x} est un axiome du groupe III.
      Le lecteur observateur aura sans doute remarqué que ce qui est le plus simple d'un point de vue théorique est
        le plus pénible à écrire en pratique... *)

let n12 x =
	let va = pgvdt x in
	let vb = va - 1 in
	let vc = vb - 1 in
	let vd = vc - 1 in
	let ve = vd - 1 in
	let vf = ve - 1 in
	let vg = vf - 1 in
	let vh = vg - 1 in
	let vi = vh - 1 in
	let vj = vi - 1 in
	let vk = vj - 1 in
	let vl = vk - 1 in
	let vm = vl - 1 in
	let vn = vm - 1 in
	let f = vn - 1 in
	let v1 = (var (-1)) in
	(ieb (va,x) (ieb (vb,x) (ieb (vc,x) (ieb (vd,x) (ieb (ve,x) (ieb (vf,x) (ieb (vg,x) 
	(ieb (vh,x) (ieb (vi,x) (ieb (vj,x) (ieb (vk,x) (ieb (vl,x) (ieb (vm,x) (ieb (vn,x)
		((fm (var va)) ^^^ (fm (var vb)) ^^^ (fm (var vc)) ^^^ (fm (var vd)) ^^^ (fm (var ve)) ^^^ 
		 (fm (var vf)) ^^^ (fm (var vg)) ^^^ (fm (var vh)) ^^^ (estUneVariable (var vi)) ^^^ (fm (var vj)) ^^^ 
		 (fm (var vk)) ^^^ (fm (var vl)) ^^^ (fm (var vm)) ^^^ (fm (var vn)) ^^^ (fm (var f))
		 ^^^ (id v1 (nb 0) (var va))
		 ^^^ (id v1 (var vi) (var vb))
		 ^^^ (id v1 (succ (var vi)) (var vc))
		 ^^^ (genbis v1 (var f) (var vd))
		 ^^^ (imp (var va) (var f) (var ve))
		 ^^^ (imp (var vb) (var f) (var vf))
		 ^^^ (imp (var vc) (var f) (var vg))
		 ^^^ (genbis v1 (var ve) (var vh))
		 ^^^ (genbis v1 (var vf) (var vj))
		 ^^^ (genbis v1 (var vg) (var vk))
		 ^^^ (imp (var vj) (var vk) (var vl))
		 ^^^ (genbis (var vi) (var vl) (var vm))
		 ^^^ (imp (var vm) (var vd) (var vn))
		 ^^^ (imp (var vh) (var vn) x))))))))))))))))
;; (* La formule "n12 x" est vraie si et seulement si E{x} est de la forme du schéma d'axiomes n12.
      Point négatif : il faut plus que plisser les yeux pour comprendre ce charabia, mais je n'y peux rien.
      J'ai opté ici pour une autre solution que celle de l'ouvrage, qui me paraissait assez peu valable. En effet, 
        en suivant rigoureusement les instructions de l'énoncé, j'aurais obtenu un schéma d'axiomes du type 
	"\/v1 ( [...] (\/v1 ([...])))", et je ne suis pas certain qu'une telle expression ait un sens. 
      Ma solution est une reformulation de ce schéma d'axiomes qui évite le problème. *)

(* On peut maintenant écrire ce pour quoi l'on s'est embêtés à écrire les 200 dernières lignes *)

let estAxiomeBis x =
	(fm x) ^^^ ((l1bis x) |/ (l2bis x) |/ (l3bis x) |/ (l4bis x)
	 |/ (l5bis x) |/ (l6bis x) |/ (l7bis x)
	 |/ (estAxiomeDuGroupeIII x)
	 |/ (n12bis x))
;;

let estAxiome x =
	(l1 x) |/ (l2 x) |/ (l3 x) |/ (l4 x)
	 |/ (l5 x) |/ (l6 x) |/ (l7 x) 
	 |/ (estAxiomeDuGroupeIII x)
	 |/ (n12 x)
;; (* La formule "estAxiome x" est vraie si et seulement si E{x} est un axiome de P.A. \o/ *)

let mp x y z =
	imp x z y
;; (* La formule "mp x y z" est vraie si et seulement si on peut déduire E{z} de E{x} et de E{y} par la règle 1 *)

let der x y z =
	(mp x y z) |/ (gen x z)
;; (* La formule "der x y z" est vraie si et seulement si on peut déduire logiquement E{z} de E{x} et de E{y} *)

let pv x =
	let y = (pgvdt x) - 1 in
	let z = y - 1 in
	let w = z - 1 in
	(seq x) ^^^ (pta y x ((estAxiomeBis (var y)) |/ (iesa z w (var y) x (der (var z) (var w) (var y)))))
;; (* La formule "pv x" est vraie si et seulement si E{x} est une preuve dans P.A. *)

let estProuvable x =
	let y = (pgvdt x) - 1 in
	ie y ((pv (var y)) ^^^ (appartient x (var y)))
;; (* La formule "estProuvable x" est vraie si et seulement si E{x} est prouvable dans P.A. *)

(* L'ensemble des propositions démontrables dans l'arithmétique de Peano (noté PE) est donc un ensemble arithmétique.

   Encore quelques petits points de théorie et on a fini ^^

   On appelle "énoncé de Gödel" d'une partie A de IN un énoncé X qui vérifie les conditions suivantes :
       - Soit X est vrai et son numéro de Gödel est dans A
       - Soit X est faux et son numéro de Gödel n'est pas dans A
   et pour arriver au théorème de Tarski, on va prouver le lemme suivant :
       Tout ensemble arithmétique possède un énoncé de Gödel.

   Si F(v) est une formule à une unique variable libre v, l'énoncé F(n) est équivalent à l'énoncé "\/v((v=n)=>F(v))". L'avantage de 
     cette écriture, c'est que pour n'importe quelle expression E, "\/v((v=n)=>E)" est une expression bien définie (alors que F(v) 
     est plus difficile à traduire formellement, si F est une expression quelconque). Pour cette raison, on n'utilisera plus que cette
     écriture, que l'on notera F[n]. En d'autres termes, pour toute expression E et pour tout nombre n :
       E[n] est l'abréviation de l'expression "\/v((v=n)=>E)".
   
   Maintenant, pour tout couple d'entiers naturels (e,n), on désigne par r(e,n) le numéro de Gödel de l'expression E[n], où E est
     l'expression unique ayant e pour numéro de Gödel. La fonction r est arithmétique. En effet, si on note k le numéro de Gödel de
     l'expression "\/v1(v1=", on a r(x,y) = k*13^y*8*x*3. On peut donc coder la fonction correspondante : *) 

(* k vaut, en base 13, 9260322603a, ce qui est trop grand pour être stocké par un entier CamL standart. On va donc le couper en deux =D *)

let r x y z =
	let v = (min (min (pgvdt x) (pgvdt y)) (pgvdt z)) - 1 in
	ie v (((var v) === ((nb 13)^^y)) ^^^ grosseConcat [|(nb 262460);(nb 812939);(var v);(nb 8);x;(nb 3)|] z)
;; (* La formule "r x y z" est vraie si et seulement si r(x,y)=z *)

(* Maintenant, on va introduire la fonction d, appellée fonction diagonale du système, qui jouera un rôle clé dans la suite. Elle est 
     simplement définie par d(x) = r(x,x). En d'autres termes, si on désigne par E{n} l'expression ayant pour n pour numéro de Gödel,
     d(x) est le numéro de Gödel de l'expression E{n}[n]. Elle est trivialement arithmétique, en effet : *)

let d x y =
	r x x y
;; (* La formule "d x y" est vraie si et seulement si d(x)=y *)

(* Pour tout ensemble de nombres A, on désigne par A* l'ensemble de tous les entiers n tels que d(n) soit dans A. On a alors une
     proposition intéressante : si A est arithémtique, alors A* l'est aussi. En effet, si F(v1) est une formule qui exprime l'ensemble
     A, A* est exprimé par la formule suivante (dépendant de la variable vi) "\/v1 ((d(vi)=v1) => (F(v1)))", où vi est une variable 
     n'apparaissant pas dans F (là encore, je ne suis pas d'accord avec l'ouvrage sur lequel je me base).

   La proposition précédente en implique une autre qui va nous fournir le dernier outil dont nous avons besoin pour exhiber l'énoncé
     indédicable de Gödel : pour tout ensemble arithmétique A, il existe un énoncé de Gödel pour A. En effet, comme A* est aussi 
     arithmétique, on peut trouver une formule H(v1) qui l'exprime. Soit h le numéro de Gödel de cette formule. Alors la formule H[h],
     qui s'écrit "\/v1 ((v1=h) => H)". Alors H[h] est vraie si et seulement si h appartient à A*, donc si et seulement si d(h) 
     appartient à A. Mais comme d(h) est le numéro de Gödel de H[h], H[h] est un énoncé de Gödel pour A.

   Soit P(v1) la formule "estProuvable v1". Elle exprime l'ensemble des propositions démontrables de P.A. La formule
     ~P(v1) exprime donc le complémentaire de PE dans l'ensemble LE des expressions de P.A. D'après ce qu'on vient de voir, on peut
     trouver une formule H(v1) exprimant l'ensemble (LE\PE)* : sa diagonalisation H[h] est un énoncé de Gödel pour l'ensemble PE.

   Et la magie apparaît : H[h] est donc vrai si et seulement si H[h] n'est pas prouvable dans P.A. Comme P.A. est un système que l'on 
     a supposé correct, H[h] est nécessairement vrai. Puisqu'il est vrai, il est non prouvable dans P.A., ce qui achève la démonstration.

   Puisqu'on n'a pas fait tout ce code CamL pour rien, on va quand même écrire cette proposition. Soit "var 0" le nombre h ; on pourrait
     exhiber de manière précise ce nombre mais pour le coup, ça serait franchement monstrueux. *)

let v1 = -1 ;;
let v2 = -2 ;;

let propositionIndecidable =
	pt v1 (((var v1) === (var 0)) ==> (pt v2 ((d (var v1) (var v2)) ==> ( ~~~ (estProuvable (var v2))))))
;;

imprimeFormule propositionIndecidable ;;

let log10 n =
	let renvoi = ref 1 in
	let hop = ref 10 in
	while !hop < n do
		incr renvoi;
		hop := !hop * 10
	done;
	!renvoi
;;

let rec tailleTerme = function
	| Variable v -> 4
	| Nombre n -> log10 n
	| Addition (a,b) -> 3 + (tailleTerme a) + (tailleTerme b)
	| Multiplication (a,b) -> 3 + (tailleTerme a) + (tailleTerme b)
	| Exponentiation (a,b) -> 3 + (tailleTerme a) + (tailleTerme b)
	| Successeur a -> 1 + (tailleTerme a)
;;

let rec tailleFormule = function
	| Egal (t1,t2) -> 5 + (tailleTerme t1) + (tailleTerme t2)
	| InferieurOuEgal (t1,t2) -> 6 + (tailleTerme t1) + (tailleTerme t2)
	| Negation f -> 1 + (tailleFormule f)
	| Implication (f1,f2) -> 6 + (tailleFormule f1) + (tailleFormule f2)
	| PourTout (v,f) -> 1 + (tailleTerme (var v)) + (tailleFormule f) 
;;

let tf = tailleFormule ;;

