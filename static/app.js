$(function () {

    var RELOAD = 5000, TIMEOUT = 2000, SHIFT = 20, PERCISION = 2;

    var SERIES = {};

    var table = $('#location_code').DataTable({
	"ajax": "/api/location_code",
	"columns": [
            { "title": "City", "data": "location_code" },
            { "title": "current_condition", "data": "Image" },
            { "title": "current_temp", "data": "Command" },
            { "title": "forecasts", "data": "Created" },
            { "title": "region", "data": "Status" },
            { "title": "units", "data": "Ports[0].PublicPort" }
	],
        "aoColumnDefs": [{
            "aTargets": [ 0 ],
            "mRender": function (data, type, full) {
                return data.slice(0, 12);
            }
        }],
	"fnInitComplete": function (settings) {

            if (settings.json) {

		for (var i = 0; i < settings.json.data.length; i++) {

                    var hash = settings.json.data[i].Id.slice(0, 12);

                    SERIES[hash] = chart.addSeries({
                        name: settings.json.data[i].Names[0]
                    });

		}
		updateCharts();
		setInterval(updateCharts, TIMEOUT);
            }
	},

	"fnDrawCallback": function(settings) {

            if (settings.json) {

		for (var i = 0; i < settings.json.data.length; i++) {
                    console.log(settings.json.data[i].Id);
		}
            }
	}

    });

    setTimeout(function () {
	table.ajax.reload(null, false);
    }, RELOAD);


    function getStats(hash) {

        $.getJSON('/api/curated/' + hash, function (data) {

            var series = SERIES[hash], shift = series.data.length > SHIFT;
            series.addPoint(parseFloat(data.cpu_percent.toFixed(PERCISION)), true, shift);

        });

    }

    function updateCharts() {

	for (var hash in SERIES) {
            getStats(hash);
	}
    }

    var chart = new Highcharts.Chart({

	chart: {
            renderTo: 'charts'
	},
	credits: {
            enabled: false
	},

	title: {
            text : 'CPU %'
	},

	exporting: {
            enabled: false
	}

    });

});
