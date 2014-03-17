

function Comparaison(parameters){
    var matrice = parameters.matrix;
    //seq obtenu par la function Sequence
    var seq1 = parameters.seq1; // prompt("entrez la seq1")
    var seq2 = parameters.seq2;
    var w = seq1.length, h = seq2.length;
    var dotplot = new Uint8Array(w * h * 4);
    //pour l'instant on ne gère la comparaison que pour 2 meme types de sequences
    //Et on verifie que le type de matrice correspond bien au type de sequence
    if (seq1.dna === matrice.dna){
        if (seq1.dna){
            var typeSeq = matrice.dnaSeq;
        }else {
            var typeSeq = matrice.aaSeq;
        }
    } else {
        throw "matrice not match";
    }
    for (var i = 0; i < w; i++) {
		    for (var j = 0; j < h; j++) {
                for(var k = 0; i<typeSeq.length;k++){
                    //Pour chaque acide amine de chaque sequence, on retient sa position dans acideAmine,
                    //afin de trouver le score de gris dans internalMatrix.
                    if (seq1.charCodeAt(i) === typeSeq[k]){
                        var a1 = k;
                            }
                    if (seq2.charCodeAt(j) === typeSeq[k]){
                        var a2 = k;
                            }
			        }
                var valeur = matrice.score(a1,a2);
                //Creation de l'image point par point original, sans le flou diagonal.
                dotplot[(i*w+j)*4] = valeur;
                dotplot[(i*w+j)*4+1] = valeur;
                dotplot[(i*w+j)*4+2] = valeur;
			    }
		    }
	return dotplot;

                
}
// MATRICE A MODIFIER : CARACTERES SPECIAUX A AJOUTER
var matb = new Matrix({
    name: "Blosum62",
    matrix: [
        [ 4, -1, -2, -2,  0, -1, -1,  0, -2, -1, -1, -1, -1, -2, -1,  1,  0, -3, -2,  0, -2, -1,  0],
        [-1,  5,  0, -2, -3,  1,  0, -2,  0, -3, -2,  2, -1, -3, -2, -1, -1, -3, -2, -3, -1,  0, -1],
        [-2,  0,  6,  1, -3,  0,  0,  0,  1, -3, -3,  0, -2, -3, -2,  1,  0, -4, -2, -3,  3,  0, -1],
        [-2 ,-2,  1,  6, -3,  0,  2, -1, -1, -3, -4, -1, -3, -3, -1,  0, -1, -4, -3, -3,  4,  1, -1],
        [ 0, -3, -3, -3,  9, -3, -4, -3, -3, -1, -1, -3, -1, -2, -3, -1, -1, -2, -2, -1, -3, -3, -2],
        [-1,  1,  0,  0, -3,  5,  2, -2,  0, -3, -2,  1,  0, -3, -1,  0, -1, -2, -1, -2,  0,  3, -1],
        [-1,  0,  0,  2, -4,  2,  5, -2,  0, -3, -3,  1, -2, -3, -1,  0, -1, -3, -2, -2,  1,  4, -1],
        [ 0, -2,  0, -1, -3, -2, -2,  6, -2, -4, -4, -2, -3, -3, -2,  0, -2, -2, -3, -3, -1, -2, -1],
        [-2,  0,  1, -1, -3,  0,  0, -2,  8, -3, -3, -1, -2, -1, -2, -1, -2, -2,  2, -3,  0,  0, -1],
        [-1, -3, -3, -3, -1, -3, -3, -4, -3,  4,  2, -3,  1,  0, -3, -2, -1, -3, -1,  3, -3, -3, -1],
        [-1, -2, -3, -4, -1, -2, -3, -4, -3,  2,  4, -2,  2,  0, -3, -2, -1, -2, -1,  1, -4, -3, -1],
        [-1,  2,  0, -1, -3,  1,  1, -2, -1, -3, -2,  5, -1, -3, -1,  0, -1, -3, -2, -2,  0,  1, -1],
        [-1, -1, -2, -3, -1,  0, -2, -3, -2,  1,  2, -1,  5,  0, -2, -1, -1, -1, -1,  1, -3, -1, -1],
        [-2, -3, -3, -3, -2, -3, -3, -3, -1,  0,  0, -3,  0,  6, -4, -2, -2,  1,  3, -1, -3, -3, -1],
        [-1, -2, -2, -1, -3, -1, -1, -2, -2, -3, -3, -1, -2, -4,  7, -1, -1, -4, -3, -2, -2, -1, -2],
        [ 1, -1,  1,  0, -1,  0,  0,  0, -1, -2, -2,  0, -1, -2, -1,  4,  1, -3, -2, -2,  0,  0,  0],
        [ 0, -1,  0, -1, -1, -1, -1, -2, -2, -1, -1, -1, -1, -2, -1,  1,  5, -2, -2,  0, -1, -1,  0],
        [-3, -3, -4, -4, -2, -2, -3, -2, -2, -3, -2, -3, -1,  1, -4, -3, -2, 11,  2, -3, -4, -3, -2],
        [-2, -2, -2, -3, -2, -1, -2, -3,  2, -1, -1, -2, -1,  3, -3, -2, -2,  2,  7, -1, -3, -2, -1],
        [-2, -1,  3,  4, -3,  0,  1, -1,  0, -3, -4,  0, -3, -3, -2,  0, -1, -4, -3, -3,  4,  1, -1],
        [ 0, -3, -3, -3, -1, -2, -2, -3, -3,  3,  1, -2,  1, -1, -2, -2,  0, -3, -1,  4, -3, -3, -2],
        [-1,  0,  0,  1, -3,  3,  4, -2,  0, -3, -3,  1, -1, -3, -1,  0, -1, -3, -2, -2,  1,  4, -1],
        [ 0, -1, -1, -1, -2, -1, -1, -1, -1, -1, -1, -1, -1, -1, -2,  0,  0, -2, -1, -1, -1, -1, -1]
    ]
  });

//Test 

var comp = new Comparaison({
    matrix: matb,
    seq1: Sequence(a),
    seq2: Sequence(b)
});
//Fonction pour recuperer une matrice propre avec son type et son nom
function Sequence(parameters){
	this.name = parameters.name; // On prend le nom comme sur dotlet ? A la limite si on recois un fichier fasta, on peut recup le nom dans la premiere ligne
	var dnaSeq = ["A", "C", "G", "T", "X"];
	var STRING1 = parameters.strg;
	STRING1 = STRING1.toUpperCase();
	STRING1 = STRING1.toUpperCase();
	for (var i = 0; i < w; i++) {
		for (var j = 0; j < w; j++) {
			if (seq2.charCodeAt(j) !== dnaSeq[j]) {
				this.dna = false;
			}
		}
	}
}

