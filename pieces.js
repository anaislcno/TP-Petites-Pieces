// Récupérer fonction de l'autre fichier 
import { ajoutListenersAvis, ajoutListenerEnvoyerAvis, afficherAvis, afficherGraphiqueAvis } from "./avis.js";
// Récupération des pièces éventuellement stockées dans le localStorage
let pieces = window.localStorage.getItem('pieces');

if (pieces === null) {
    // Récupération des pièces depuis le fichier JSON
    const reponse = await fetch('http://localhost:8081/pieces');
    const pieces = await reponse.json();
    // Transformation des pièces en JSON
    const valeurPieces = JSON.stringify(pieces);
    // Stockage des informations dans le localStorage
    window.localStorage.setItem("pieces", valeurPieces);
}else{
    pieces = JSON.parse(pieces);
}

// Fonction qui génère toute la page web
function genererPieces(pieces){
    // Boucle pour tous les éléments
    for (let i = 0; i < pieces.length; i++) {

        const article = pieces[i];
        // Récupération de l'élément du DOM qui accueillera les fiches
        const sectionFiches = document.querySelector(".fiches");
        // Création d’une balise dédiée à une pièce automobile
        const pieceElement = document.createElement("article");

        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = article.image;
        const nomElement = document.createElement("h2");
        nomElement.innerText = article.nom;
        const prixElement = document.createElement("p");
        prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`;
        const categorieElement = document.createElement("p");
        categorieElement.innerText = article.categorie ?? "(aucune catégorie)";
        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = article.description ?? "Pas de description pour le moment.";
        const stockElement = document.createElement("p");
        stockElement.innerText = article.stock ? "En stock" : "Rupture de stock";
        // Ajout pour avis 
        const avisBouton = document.createElement ("button")
        avisBouton.dataset.id = article.id;
        avisBouton.textContent = "Afficher les avis"
    
        // On rattache la balise article a la section Fiches
        sectionFiches.appendChild(pieceElement);
        // On rattache l’image à pieceElement (la balise article)
        pieceElement.appendChild(imageElement);
        pieceElement.appendChild(nomElement);
        pieceElement.appendChild(prixElement);
        pieceElement.appendChild(categorieElement);
        //Ajout des éléments au DOM pour l'exercice
        pieceElement.appendChild(descriptionElement);
        pieceElement.appendChild(stockElement);
        // Ajout pour avis 
        pieceElement.appendChild(avisBouton);

    }
    // Appeler fonction de l'autre fichier 
    ajoutListenersAvis();
    ajoutListenerEnvoyerAvis();
}

// Premier affichage de la page 
genererPieces(pieces);

for(let i = 0; i < pieces.length; i++) {
    const id = pieces[i].id;
    const avisJSON = window.localStorage.getItem(`avis-piece-${id}`);
    const avis = JSON.parse(avisJSON);

    if(avis !== null) {
        const pieceElement = document.querySelector(`article[data-id="${id}"]`);
        afficherAvis(pieceElement, avis)
    }
}

//Gestion des boutons 
const boutonTrier = document.querySelector(".btn-trier");

boutonTrier.addEventListener("click", function () {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a, b) {
        return a.prix - b.prix;
     });
     document.querySelector(".fiches").innerHTML = "";
     genererPieces(piecesOrdonnees)
});

const boutonFiltrer = document.querySelector(".btn-filtrer");

boutonFiltrer.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= 35;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees)
});

const boutonDecroissant = document.querySelector(".btn-decroissant");

boutonDecroissant.addEventListener("click", function () {
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a, b) {
        return b.prix - a.prix;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesOrdonnees);
});

const boutonNoDescription = document.querySelector(".btn-nodesc");

boutonNoDescription.addEventListener("click", function () {
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.description;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees)
});

// Suppression pièces non abordables dans liste
const noms = pieces.map(piece => piece.nom);
for(let i = pieces.length -1 ; i >= 0; i--){
    if(pieces[i].prix > 35){
        noms.splice(i,1);
    }
}
console.log(noms)

// Création de l'ent-tête
const pElement = document.createElement('p')
pElement.innerText = "Pièces abordables :"
//Création de la liste
const abordablesElements = document.createElement('ul');
//Ajout de chaque nom à la liste
for(let i=0 ; i < noms.length ; i++){
    const nomElement = document.createElement('li');
    nomElement.innerText = noms[i];
    abordablesElements.appendChild(nomElement)
}
// Ajout de l'en-tête puis de la liste au bloc résultats filtres
document.querySelector('.abordables')
    .appendChild(pElement)
    .appendChild(abordablesElements)

// Suppression pièces non dispos
const nomDispo = pieces.map(piece => piece.nom);
const prixDispo = pieces.map(piece => piece.prix);
for(let i = pieces.length -1 ; i >= 0; i--){
    if(pieces[i].stock === false){
        nomDispo.splice(i,1);
        prixDispo.splice(i,1);
    }
}

// Création de l'ent-tête
const pElementDispo = document.createElement('p')
pElementDispo.innerText = "Pièces disponibles :"
//Création de la liste
const disponiblesElements = document.createElement('ul');
//Ajout de chaque nom à la liste
for(let i=0 ; i < nomDispo.length ; i++){
    const nomElement = document.createElement('li');
    nomElement.innerText = `${nomDispo[i]} - ${prixDispo[i]} €`;
    disponiblesElements.appendChild(nomElement)
}
// Ajout de l'en-tête puis de la liste au bloc résultats filtres
document.querySelector('.disponibles')
    .appendChild(pElementDispo)
    .appendChild(disponiblesElements)

// Barre de prix 
const inputPrixMax = document.querySelector('#prix-max')
inputPrixMax.addEventListener('input', function(){
    const piecesFiltrees = pieces.filter(function (piece) {
        return piece.prix <= inputPrixMax.value;
    });
    document.querySelector(".fiches").innerHTML = "";
    genererPieces(piecesFiltrees);
})

// Ajout du listener pour mettre à jour des données du localStoage 
const boutonMAJ = document.querySelector(".btn-maj");
boutonMAJ.addEventListener("click", function(){
    window.localStorage.removeItem("pieces");
});

await afficherGraphiqueAvis();