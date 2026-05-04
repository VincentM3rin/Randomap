document.addEventListener('DOMContentLoaded', async () => {
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
                                profile: 'pedestrian',
                                language: 'fr'
                            }),
                            routeWhileDragging: false,
                            addWaypoints: false,
                            show: false
                        }).addTo(map);
                    } else {
                        L.marker([latDep, lonDep]).addTo(map)
                            .bindPopup(`<b>${rando.nomRandonné}</b><br>Départ: ${rando.villeRandonné}`);
                    }
                }
            });
        } catch (error) {
            console.error(error);
        }

        var control = L.Routing.control({
            waypoints: [],
            router: L.Routing.osrmv1({
                serviceUrl: 'https://routing.openstreetmap.de/routed-foot/route/v1',
                profile: 'pedestrian',
                language: 'fr'
            }),
            routeWhileDragging: true,
            addWaypoints: false
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
});