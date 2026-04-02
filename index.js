var map = L.map('map').setView([47.12811812018029, 2.402549683534604], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

var control = L.Routing.control({
    waypoints: [], 
    router: L.Routing.osrmv1({
        serviceUrl: 'https://routing.openstreetmap.de/routed-foot/route/v1',
        profile: 'driving', 
        language: 'fr'
    }),
    routeWhileDragging: true,
    addWaypoints: false 
}).addTo(map);

map.on('click', function(e) {
    var waypoints = control.getWaypoints();
    var validWaypoints = waypoints.filter(function(wp) {
        return wp.latLng !== null;
    });
    validWaypoints.push(L.Routing.waypoint(e.latlng));
    
    control.setWaypoints(validWaypoints);
});