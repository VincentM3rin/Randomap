document.addEventListener('DOMContentLoaded', async () => {
    const lienConnexion = document.getElementById('pasconnecte');
    const liensConnectes = document.querySelectorAll('.connecte');
    const btnDeconnexion = document.getElementById('deconnexion');
    const estConnecte = localStorage.getItem('estConnecte') === 'true';

    if (estConnecte) {
        if (lienConnexion) {
            lienConnexion.style.display = 'none';
        }
        liensConnectes.forEach(lien => {
            lien.style.display = 'inline-block';
        });
    } else {
        if (lienConnexion) {
            lienConnexion.style.display = 'inline-block';
        }
        liensConnectes.forEach(lien => {
            lien.style.display = 'none';
        });
    }

    if (btnDeconnexion) {
        btnDeconnexion.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.clear();
            window.location.reload();
        });
    }

    const iconeDepart = L.icon({
        iconUrl: './image/logorandomap.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32]
    });

    const iconeArrivee = L.icon({
        iconUrl: './image/logoarrive.png',
        iconSize: [64, 64],
        iconAnchor: [32, 32],
        popupAnchor: [0, -32]
    });
    const iconeEtape = L.icon({
        iconUrl: './image/logoarrive.png',
        iconSize: [20, 20]
    });

    const mapContainer = document.getElementById('map');
    if (mapContainer) {
        var map = L.map('map').setView([47.128118, 2.402549], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        try {
            const response = await fetch('http://localhost/Randomap/adminCarte.php?action=get');
            const randonnees = await response.json();

            randonnees.forEach(rando => {
                const latDep = parseFloat(rando.latRandoDepart);
                const lonDep = parseFloat(rando.longRandoDepart);
                const latArr = parseFloat(rando.latRandoArrivé);
                const lonArr = parseFloat(rando.longRandoArrivé);

                if (!isNaN(latDep) && !isNaN(lonDep) && latDep !== 0) {
                    if (!isNaN(latArr) && !isNaN(lonArr) && latArr !== 0) {
                        L.Routing.control({
                            waypoints: [
                                L.latLng(latDep, lonDep),
                                L.latLng(latArr, lonArr)
                            ],
                            router: L.Routing.osrmv1({
                                serviceUrl: 'https://routing.openstreetmap.de/routed-foot/route/v1',
                                profile: 'foot',
                                language: 'fr'
                            }),
                            routeWhileDragging: false,
                            addWaypoints: false,
                            show: false,
                            createMarker: function(i, wp, nWps) {
                                let iconActuelle = (i === 0) ? iconeDepart : ((i === nWps - 1) ? iconeArrivee : iconeEtape);
                                return L.marker(wp.latLng, {
                                    draggable: true,
                                    icon: iconActuelle
                                });
                            }
                        }).addTo(map);
                    } else {
                        L.marker([latDep, lonDep], {icon: iconeDepart}).addTo(map)
                            .bindPopup(`<b>${rando.nomRandonné}</b><br>Départ: ${rando.villeRandonné}`);
                    }
                }
            });

            function majListeRandonneesVisibles() {
                const listeContainer = document.getElementById('liste-randonnees-ul');
                if (!listeContainer) return;
                listeContainer.innerHTML = '';
                const limitesCarte = map.getBounds();

                randonnees.forEach(rando => {
                    const latDep = parseFloat(rando.latRandoDepart);
                    const lonDep = parseFloat(rando.longRandoDepart);
                    if (!isNaN(latDep) && !isNaN(lonDep) && latDep !== 0) {
                        const pointDepart = L.latLng(latDep, lonDep);
                        if (limitesCarte.contains(pointDepart)) {
                            const li = document.createElement('li');
                            li.innerHTML = `<strong>${rando.nomRandonné || 'Sans nom'}</strong>
                            <br>
                            Départ: ${rando.villeRandonné}
                            <br>
                            <a href="randonne.html?idRandonné=${rando.idRandonné}">Voir les détails de la randonnée</a>`;
                            listeContainer.appendChild(li);
                        }
                    }
                });
            }
            map.on('moveend', majListeRandonneesVisibles);
            map.on('zoomend', majListeRandonneesVisibles);
            majListeRandonneesVisibles();
        } catch (error) {
            console.error(error);
        }

        var control = L.Routing.control({
            waypoints: [],
            router: L.Routing.osrmv1({
                serviceUrl: 'https://routing.openstreetmap.de/routed-foot/route/v1',
                profile: 'foot',
                language: 'fr'
            }),
            routeWhileDragging: true,
            addWaypoints: false,
            show: false,
            createMarker: function(i, wp, nWps) {
                let iconActuelle = (i === 0) ? iconeDepart : ((i === nWps - 1) ? iconeArrivee : iconeEtape);
                return L.marker(wp.latLng, {
                    draggable: true,
                    icon: iconActuelle
                });
            }
        }).addTo(map);

        map.on('click', function (e) {
            var waypoints = control.getWaypoints();
            var validWaypoints = waypoints.filter(function (wp) {
                return wp.latLng !== null;
            });
            validWaypoints.push(L.Routing.waypoint(e.latlng));
            control.setWaypoints(validWaypoints);
        });
    }
});