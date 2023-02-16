// Rendre fonction dispo hors du fichier 
export function ajoutListenersAvis() {

    // Récupération références buttons des fiches produits 
    const piecesElements = document.querySelectorAll(".fiches article button");
    // Boucle pour parcourir boutton et rajouter un eventListener
    for (let i = 0; i < piecesElements.length; i++) {
      piecesElements[i].addEventListener("click", async function (event) {
           
        const id = event.target.dataset.id;
        // Réponse de l'API dans une constante 
        const reponse = await fetch(`http://localhost:8081/pieces/${id}/avis`);
        // Reconstituer données en mémoire
        const avis = await reponse.json();
        // Ajout au DOM 
        const pieceElement = event.target.parentElement;

        // Afficher les avis avec p 
        const avisElement = document.createElement("p");
        for (let i = 0; i < avis.length; i++) {
            avisElement.innerHTML += `<b>${avis[i].utilisateur}:</b> ${avis[i].commentaire} <br>`;
        }
        // Rattacher au parent
        pieceElement.appendChild(avisElement);

      });
    }
}

export function ajoutListenerEnvoyerAvis () {

    const formulaireAvis = document.querySelector(".formulaire-avis");
    formulaireAvis.addEventListener("submit", function (event) {
    // Pour ne pas que le navigateur charge une nouvelle page 
    event.preventDefault();
    // Création de l'objet du nouvel avis
    const avis = {
        pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
        utilisateur: event.target.querySelector("[name=utilisateur]").value,
        commentaire: event.target.querySelector("[name=commentaire]").value,
        nbEtoiles: parseInt (event.target.querySelector("[name=nbEtoiles").value),
    };
    // Création de la charge utile au format JSON
    const chargeUtile = JSON.stringify(avis);
    // Appel de la fonction fetch avec toutes les infos nécessaires 
    fetch("http://localhost:8081/avis", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: chargeUtile
    });
    });
}