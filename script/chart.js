// Highcharts theme (site palette) and two chart helpers used by rates.js
Highcharts.setOptions({
	colors: ['#b89c80', '#7e7f83'],
	chart: {
		backgroundColor: 'transparent',
		style: { fontFamily: 'inherit' },
		zooming: { type: 'x' }
	},
	title: { text: null },
	credits: { enabled: false },
	legend: { enabled: false },
	xAxis: {
		type: 'datetime',
		tickPixelInterval: 110,
		lineColor: '#d8d8da',
		tickColor: '#d8d8da',
		labels: { style: { color: '#55524d', fontSize: '13px' } }
	},
	yAxis: {
		title: { text: null },
		gridLineColor: '#ececee',
		labels: { style: { color: '#55524d', fontSize: '13px' } }
	},
	tooltip: {
		backgroundColor: 'rgba(52, 49, 45, 0.9)',
		borderWidth: 0,
		style: { color: '#f3f3f4' },
		xDateFormat: '%a, %e %b %Y'
	}
});

// One series as a gradient area (FOREX, NBU)
function drawArea(container, name, points, decimals) {
	var color = Highcharts.getOptions().colors[0];
	Highcharts.chart(container, {
		plotOptions: {
			area: {
				threshold: null,
				lineWidth: 2.5,
				marker: { radius: 2.5 },
				fillColor: {
					linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
					stops: [[0, Highcharts.color(color).setOpacity(0.55).get('rgba')], [1, Highcharts.color(color).setOpacity(0).get('rgba')]]
				}
			}
		},
		tooltip: { valueDecimals: decimals },
		series: [{ type: 'area', name: name, data: points }]
	});
}

// Several line series with a legend (KANTOR buy / sell)
function drawLines(container, series, decimals) {
	Highcharts.chart(container, {
		legend: { enabled: true, itemStyle: { color: '#34312d', fontWeight: 'normal' } },
		plotOptions: { line: { lineWidth: 2.5, marker: { radius: 2.5 } } },
		tooltip: { shared: true, valueDecimals: decimals },
		series: series.map(function (s) { return { type: 'line', name: s.name, data: s.points }; })
	});
}
