const socket = io();

/**
 * Insertar o reemplazar en un array
 * 
 * @param {array} arr 
 * @param {object} obj 
 */
function pushToArray(arr, obj) {
    const index = arr.findIndex((e) => e.label === obj.label);

    if (index === -1) {
        arr.push(obj);
    } else {
        arr[index] = obj;
    }
}

/**
 * Cuando arranque la pagina
 */
$(document).ready(function () {

    var session_tweets = [];
    var chart_points = [];

    /**
     * Botones para interaccionar con la app
     * @type {{download: (*|jQuery|HTMLElement), stop: (*|jQuery|HTMLElement), query: (*|jQuery|HTMLElement), start: (*|jQuery|HTMLElement)}}
     */
    const inputs = {
        start: $('form[name=search] > button[role=start]'),
        stop: $('form[name=search] > button[role=stop]'),
        download: $('form[name=search] > button[role=download]'),
        query: $('form[name=search] > input[name=query]')
    }

    /**
     * Descargar datos del ultimo streaming en formato .csv
     *
     * @returns {void}
     */
    inputs.download.on('click', function () {

        if (session_tweets.length == 0)
            return alert('No hay datos para descargar.');

            const name = prompt('¿Qué nombre le pondrá al archivo?', moment().format('d-m-Y'));

            downloadCSV({ 
                filename: `${name}.csv`,
                data: session_tweets
             });

    });

    /**
     * Detener el streaming
     *
     * @returns {void}
     */
    inputs.stop.on('click', function () {

        // Detener el streaming
        socket.emit('stopStreamTweets');

        // Cuando se detenga, configuramos los botones
        socket.on('stop', (tweets) => {
            inputs.start.attr('disabled', false);
            inputs.query.attr('disabled', false);
            inputs.stop.attr('disabled', true);
            $('div#listening_indicator').addClass('d-none');
        });

    });

    /**
     * Atendiendo el formulario para buscar palabras
     *
     * @returns {void}
     */
    $('form[name=search]').on('submit', function (e) {
        e.preventDefault();

        // Palabras a buscar
        const query = inputs.query.val();

        // Detectar si las palabra son suficientes
        if (query.length <= 2)
            return alert('Muy pocos caracteres, como mínimo deberían ser 3')

        // Preparar
        $('#streaming_results_count').html('0')
        $('div#streaming_results').empty()
        $('div#listening_indicator').removeClass('d-none')
        deleteMarkers();
        session_tweets = [];
        chart_points = [];

        // Configurar botones
        inputs.start.attr('disabled', true);
        inputs.query.attr('disabled', true);
        inputs.stop.attr('disabled', false);

        /**
         * Gráfica que se muestra
         */
        var chart = new CanvasJS.Chart("chartContainer", {
            exportEnabled: true,
            title: { text: inputs.query.val() },
            data: [{
                type: "spline",
                markerSize: 0,
                dataPoints: chart_points
            }]
        });

        // Iniciar streaming
        socket.emit('streamTweets', { keyword: query });

        // Colocar los tweets nuevos
        socket.on('tweets', (tweets) => {
            const { text, user: { name, screen_name, profile_image_url_https, created_at, location = null } } = JSON.parse(tweets);


            // Guardar tweets en variable
            session_tweets.push(JSON.parse(tweets));

            // Al superar los 200, reiniciar
            if (session_tweets.length % 200 == 0)
                $('div#streaming_results').empty();

            // Colocar el numero de tweets
            $('#streaming_results_count').html(session_tweets.length.toString())

            // Colocar en el DOM
            $('div#streaming_results')
                .prepend(`
                    <div class="toast showing w-100 mb-4">
                        <div class="toast-header">
                            <img src="${profile_image_url_https}" class="bd-placeholder-img rounded me-2" style="width: 25px; height: 25px;" alt="${name}">
                            <strong class="me-auto">@${screen_name}</strong>
                            <small>${name}</small>
                        </div>
                        <div class="toast-body">
                            ${text}
                        </div>
                    </div>
                `);

            // Añadir marcador
            if (typeof location !== 'undefined' && location !== null) {

                // BUG: se satura con tantas solicitudes y no se muestran todos
                if (inputs.start[0].disabled == true) {
                    $.ajax({
                        url: `https://us1.locationiq.com/v1/search.php?key=a60d1b393dd506&q=${location}&format=json`,
                        method: 'get',
                        success: (data) => {
                            const { lat = '', lon = '' } = data[0];
                            const latLng = new google.maps.LatLng(lat, lon);
                            map.setCenter(latLng);
                            map.setZoom(3);
                            addMarker(latLng, screen_name, text);
                        }
                    });
                }
            }

            // Asignar datos a la grafica
            let created_at_formatted = moment().format('LTS');
            let count = chart_points.find(e => e.label === created_at_formatted)?.y
                ? (chart_points.find(e => e.label === created_at_formatted).y + 1)
                : 1;

            pushToArray(chart_points, {
                x: session_tweets.length,
                y: count,
                label: created_at_formatted
            });

            chart.render();

        });

    });

});