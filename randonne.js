document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const randonneID = urlParams.get('idRandonné');
    const conteneur = document.getElementById('conteneur-randonne');

    if (randonneID) {
        fetch(`http://localhost/Randomap/adminCarte.php?action=get&idRandonné=${randonneID}`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    const rando = data[0];
                    const API_BASE_URL = "http://localhost/Randomap/";
                    const imageSrc = rando.photoRandonné ? (API_BASE_URL + rando.photoRandonné) : '';
                    
                    conteneur.innerHTML = `
                        <div style="display: flex; gap: 30px; align-items: flex-start; background-image: url('./fondcarte.jpg');">
                            <img src="${imageSrc}" style="max-width: 50%; border-radius: 8px; flex-shrink: 0; object-fit: cover;">
                            <div style="flex: 1; background-color: rgb(255, 255, 255); border-radius: 8px;">
                                <h1 style="margin-top: 0;">${rando.nomRandonné}</h1>
                                <p><strong>Ville :</strong> ${rando.villeRandonné}</p>
                                <p><strong>Nombre de kilomètres :</strong> ${rando.nombreKilomètres} km</p>
                            </div>
                        </div>
                    `;
                } else {
                    conteneur.innerHTML = "<h2>La randonnée n'existe pas.</h2>";
                }
            })
            .catch(err => {
                console.error(err);
                conteneur.innerHTML = "<h2>Erreur de communication avec le serveur.</h2>";
            });
    } else {
        conteneur.innerHTML = "<h2>Aucun identifiant de randonnée fourni.</h2>";
    }
});