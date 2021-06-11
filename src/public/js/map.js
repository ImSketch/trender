var markers = [];
var map;

/**
 * Mostrar mapa de Google
 * 
 * @returns {void}
 */
function initMap() {
    geocoder = new google.maps.Geocoder;
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: { lat: 18.9036037, lng: -70.4022973 }
    });

}

/**
 * Añadir marcador en el mapa
 * 
 * @param {string} location 
 * @param {string} title 
 * @param {string} contentString 
 */
function addMarker(location = '', title, contentString) {

    let infowindow = new google.maps.InfoWindow({
        content: `<p class="m-t-1"><span>${contentString}</span></p><span>@${title}</span>`
    });

    let marker = new google.maps.Marker({
        position: location,
        map: map,
        title: `@${title}`,
        icon: './img/twitter.png',
    });

    marker.addListener('click', function () {
        infowindow.open(map, marker);
    });

    markers.push(marker);
}

/**
 * Setear todos los marcadores del mapa
 * 
 * @param {object|null} map 
 * @return {void}
 */
const setMapOnAll = (map) => {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

/**
 * Remueve los marcadores del mapa, pero los conserva
 * en el array
 * 
 * @return {void}
 */
const clearMarkers = () => {
    setMapOnAll(null);
}

/**
 * Remueve todos los marcadores del mapa y del array
 * 
 * @return {void}
 */
const deleteMarkers = () => {
    clearMarkers();
    markers = [];
}