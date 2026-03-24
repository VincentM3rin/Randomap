  var locations = [
    ["LOCATION_1", 43.300000, 5.400000],
    ["LOCATION_2", 43.4539098, 5.5608088],
    ["LOCATION_3", 43.5298424, 5.4474738],
    ["LOCATION_4", 43.455613, 5.4710661],
    ["LOCATION_5", 43.5374662, 6.4627333]
  ];

  var map = L.map('map').setView([43.300000, 5.400000], 8);
    mapLink =
  ' <a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' + mapLink + ' Contributors',
    maxZoom: 18,
  }).addTo(map);

for (var i = 0; i < locations.length; i++) {
  marker = new L.marker([locations[i][1], locations[i][2]])
    .bindPopup(locations[i][0])
    .addTo(map);
}