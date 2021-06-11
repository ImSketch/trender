var chart = new CanvasJS.Chart("chartContainer", {
	zoomEnabled: true,
	animationEnabled: true,
    title: {
        text: $('form[name=search] > input[name=query]').val()
    },
    data: [{
        type: "line",
        dataPoints: []
    }]
});