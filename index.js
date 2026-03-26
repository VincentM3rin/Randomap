document.addEventListener('DOMContentLoaded', () => {
    const mapElement = document.getElementById('map');
    
    if (mapElement) {
        var map = L.map('map').setView([46.603354, 1.888334], 5);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> Contributors',
            maxZoom: 18,
        }).addTo(map);

        fetch('recuperer_randos.php')
            .then(response => response.json())
            .then(data => {
                data.forEach(rando => {
                    const lat = parseFloat(rando.latRandoDepart);
                    const lon = parseFloat(rando.longRandoDepart);
                    
                    if (!isNaN(lat) && !isNaN(lon)) {
                        L.marker([lat, lon])
                            .bindPopup(`<b>${rando.nomRandonné}</b><br>Départ : ${rando.villeRandonné}`)
                            .addTo(map);
                    }
                });
            })
            .catch(error => console.error(error));
    }
});