const ADMIN_API_BASE = 'http://localhost/Randomap/adminCarte.php';
const authConnecte = localStorage.getItem('estConnecte') === 'true';
const authIdUser = localStorage.getItem('idUser');
const sectionAdmin = document.getElementById('section-admin');
const formRando = document.getElementById('formRando');

if (authConnecte && sectionAdmin) {
    sectionAdmin.style.display = 'block';
}

async function getCoordinates(city) {
    if (!city) return null;
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
    const data = await response.json();
    return data.length > 0 ? { lat: data[0].lat, lon: data[0].lon } : null;
}

let mapCreation = null;
let routingControlCreation = null;
let distanceCalculee = 0;

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('mapCreation')) {
        mapCreation = L.map('mapCreation').setView([46.603354, 1.888334], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(mapCreation);
    }

    const villeDepartInput = document.getElementById('ville_depart');
    const villeArriveeInput = document.getElementById('ville_arrivee');
    const radioBoucle = document.getElementById('horns');
    const radioAversB = document.getElementById('scales');
    const divArrivee = document.getElementById('div_arrivee');
    const affichageKm = document.getElementById('affichage_km');
    const valeurKm = document.getElementById('valeur_km');

    async function updateMapAndDistance() {
        const villeDepart = villeDepartInput.value.trim();
        const villeArrivee = villeArriveeInput.value.trim();
        const isBoucle = radioBoucle.checked;

        if (isBoucle) {
            distanceCalculee = 0;
            affichageKm.style.display = 'none';
            divArrivee.style.display = 'none';
            if (routingControlCreation) {
                mapCreation.removeControl(routingControlCreation);
                routingControlCreation = null;
            }
            if (villeDepart && mapCreation) {
                const coordDepart = await getCoordinates(villeDepart);
                if (coordDepart) {
                    mapCreation.setView([coordDepart.lat, coordDepart.lon], 12);
                }
            }
            return;
        }

        divArrivee.style.display = 'block';

        if (villeDepart && villeArrivee && mapCreation) {
            const coordDepart = await getCoordinates(villeDepart);
            const coordArrivee = await getCoordinates(villeArrivee);

            if (coordDepart && coordArrivee) {
                if (routingControlCreation) {
                    mapCreation.removeControl(routingControlCreation);
                }

                routingControlCreation = L.Routing.control({
                    waypoints: [
                        L.latLng(coordDepart.lat, coordDepart.lon),
                        L.latLng(coordArrivee.lat, coordArrivee.lon)
                    ],
                    router: L.Routing.osrmv1({
                        serviceUrl: 'https://routing.openstreetmap.de/routed-foot/route/v1',
                        profile: 'pedestrian',
                        language: 'fr'
                    }),
                    addWaypoints: false,
                    routeWhileDragging: false,
                    show: false
                }).addTo(mapCreation);

                routingControlCreation.on('routesfound', function(e) {
                    distanceCalculee = (e.routes[0].summary.totalDistance / 1000).toFixed(1);
                    valeurKm.textContent = distanceCalculee;
                    affichageKm.style.display = 'block';
                });
            }
        } else {
            affichageKm.style.display = 'none';
        }
    }

    villeDepartInput.addEventListener('change', updateMapAndDistance);
    villeArriveeInput.addEventListener('change', updateMapAndDistance);
    radioBoucle.addEventListener('change', updateMapAndDistance);
    radioAversB.addEventListener('change', updateMapAndDistance);

    fetch(`${ADMIN_API_BASE}?action=getTypes`)
        .then(response => response.json())
        .then(data => {
            const selectType = document.getElementById('idTypeLieu');
            data.forEach(type => {
                let option = document.createElement('option');
                option.value = type.idTypeLieu;
                option.textContent = type.libelTypeLieu;
                selectType.appendChild(option);
            });
        })
        .catch(error => console.error(error));

    fetch(`${ADMIN_API_BASE}?action=getDiffs`)
        .then(response => response.json())
        .then(data => {
            const selectDiff = document.getElementById('idDiff');
            data.forEach(diff => {
                let option = document.createElement('option');
                option.value = diff.idDiff;
                option.textContent = diff.libelDiff;
                selectDiff.appendChild(option);
            });
        })
        .catch(error => console.error(error));

    if (formRando) {
        formRando.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!authConnecte || !authIdUser) {
                alert("Erreur : Vous devez être connecté pour créer une randonnée.");
                window.location.href = "connexion.html";
                return;
            }
            
            const id = document.getElementById('rando-id').value;
            const action = id ? 'edit' : 'add';
            const fileInput = document.getElementById('photoFile');
            
            const villeDepart = document.getElementById('ville_depart').value;
            let villeArrivee = document.getElementById('ville_arrivee').value;
            
            if (radioBoucle.checked) {
                villeArrivee = villeDepart;
            }

            const coordDepart = await getCoordinates(villeDepart);
            const coordArrivee = await getCoordinates(villeArrivee);

            if (!coordDepart) {
                alert("Impossible de trouver les coordonnées de la ville de départ.");
                return;
            }

            const formData = new FormData();
            formData.append('action', action);
            formData.append('idUser', authIdUser);
            formData.append('nomRandonne', document.getElementById('nom_parcours').value);
            formData.append('villeRandonne', villeDepart);
            formData.append('nombreKilometres', distanceCalculee);
            formData.append('idTypeLieu', document.getElementById('idTypeLieu').value);
            formData.append('idDiff', document.getElementById('idDiff').value);
            formData.append('latRandoDepart', coordDepart.lat);
            formData.append('longRandoDepart', coordDepart.lon);
            
            if (coordArrivee && !radioBoucle.checked) {
                formData.append('latRandoArrive', coordArrivee.lat);
                formData.append('longRandoArrive', coordArrivee.lon);
            } else {
                formData.append('latRandoArrive', coordDepart.lat);
                formData.append('longRandoArrive', coordDepart.lon);
            }

            if (id) {
                formData.append('id', id);
            }

            if (fileInput.files.length > 0) {
                formData.append('photoRandonne', fileInput.files[0]);
            } else if (action === 'add') {
                alert("Veuillez sélectionner une image.");
                return;
            }

            fetch(ADMIN_API_BASE, {
                method: 'POST',
                body: formData 
            }).then(res => res.json()).then(data => {
                if(data.success) {
                    formRando.reset();
                    document.getElementById('rando-id').value = '';
                    document.getElementById('btn-submit').innerText = "Envoyer";
                    distanceCalculee = 0;
                    affichageKm.style.display = 'none';
                    if (routingControlCreation) {
                        mapCreation.removeControl(routingControlCreation);
                        routingControlCreation = null;
                    }
                    alert("Parcours enregistré avec succès !");
                } else {
                    alert("Erreur lors de l'opération : " + (data.error || "Inconnue"));
                }
            }).catch(err => {
                alert("Une erreur s'est produite avec le serveur.");
            });
        });
    }
});