
var currencyPair = 'EURUSD';
buildGraphForex(currencyPair);

$('.forex-grid tr').click(function() {
	buildGraphForex($(this).attr('class'));
});

function buildGraphForex (currencyPair) {
	var container = 'forex-chart';
	currencyPair = `${currencyPair.slice(0, 3)}_${currencyPair.slice(3, 6)}`;
	var objDateRateForex = {};
	for (var i = 1; i < 31; i++) {
		var yyyymmdd = countDays(i);
		var forexUri = `https://allow-any-origin.appspot.com/https://free.currencyconverterapi.com/api/v6/convert?q=${currencyPair}&compact=ultra&date=${yyyymmdd.slice(0, 4)}-${yyyymmdd.slice(4, 6)}-${yyyymmdd.slice(6, 8)}`;
		fetch(forexUri)
			.then(response => response.json())
			.then(json => {
				objDateRateForex[Object.keys(json[`${currencyPair}`])[0].split('-').join('')] = parseFloat(Object.values(json[`${currencyPair}`])[0].toFixed(5));
				var plotChartForex = addChart (container, currencyPair.split('_').join(''), objDateRateForex);
			}
		);
	}
}

var currencyCode = 'USD';
buildGraphNbu(currencyCode);
$('.nbu-grid tr').click(function() {
	buildGraphNbu($(this).attr('class'));
});

function buildGraphNbu (currencyCode) {
	var container = 'nbu-chart';
	var objDateRateNbu = {};
	for (var i = 1; i < 31; i++) {
		var yyyymmdd = countDays(i);
		var nbuUri = `https://allow-any-origin.appspot.com/https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${currencyCode}&date=${yyyymmdd}&json`;
		fetch(nbuUri)
			.then(response => response.json())
			.then(json => {
				objDateRateNbu[Object.values(json[0])[4].split('.').reverse().join('')] = parseFloat(Object.values(json[0])[2].toFixed(3));
				var plotChartNbu = addChart (container, currencyCode, objDateRateNbu);
			}
		);
	}
}

function countDays (i) {
	var nowDate = new Date();
	nowDate.setDate(nowDate.getDate() + (-i));
	var year = nowDate.getFullYear().toString();
	var month = (nowDate.getMonth() + 1).toString();
	var day = nowDate.getDate().toString();
	(month.length < 2) ? month = "0" + month : month;
	(day.length < 2) ? day = "0" + day : day;
	return `${year + month + day}`;
}

function addChart (container, name, objDateRate) {
	Highcharts.chart( container, {
		chart: {
			ignoreHiddenSeries: true,
			height: 341,
			zoomType: 'x',
			margin: [0, 0, 50, 0]
		},
		title: false,
		subtitle: false,
		xAxis: {
			type: 'datetime',
			tickPixelInterval: 110
		},
		yAxis: {
			title: false
		},
		legend: false,
		plotOptions: {
			area: {
				fillColor: {
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: 1
					},
					stops: [
						[0, Highcharts.getOptions().colors[0]],
						[1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
						]
					},
					marker: {
						radius: 3,
					},
					lineWidth: 3,
						states: {
							hover: {
								lineWidth: 3
							}
						},
				threshold: null
			}
		},
		series: [{
			type: 'area',
			name: name,
			shadow: true,
			pointStart: Date.UTC(Object.keys(objDateRate)[0].slice(0, 4), parseInt(Object.keys(objDateRate)[0].slice(4, 6)) - 1, Object.keys(objDateRate)[0].slice(6, 8)),
			pointIntervalUnit: 'day',
			data: Object.values(objDateRate)
		}]
	});
}

/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 *
 * Dark theme for Highcharts JS
 * @author Torstein Honsi
 */

Highcharts.theme = {
    colors: ['#d9c5b2'],
    chart: {
        backgroundColor: {
            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
            stops: [
                [0, '#f3f3f4'],
                [1, '#f3f3f4']
            ]
        },
        style: {
            fontFamily: '\'Maven Pro\', sans-serif'
        },
        plotBorderColor: '#34312d'
    },
    xAxis: {
        gridLineColor: '#f3f3f4',
        labels: {
            style: {
                color: '#34312d',
                fontSize: '20px'
            }
        },
        lineColor: '#f3f3f4',
        minorGridLineColor: '#f3f3f4',
        tickColor: '#f3f3f4',
        title: {
            style: {
                color: '#34312d'
            }
        }
    },
    yAxis: {
        gridLineColor: '#f3f3f4',
        labels: {
            style: {
                color: '#34312d',
                fontSize: '20px'
            }
        },
        lineColor: '#f3f3f4',
        minorGridLineColor: '#f3f3f4',
        tickColor: '#f3f3f4',
        tickWidth: 5,
        title: {
            style: {
                color: '#34312d'
            }
        }
    },
    tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        style: {
            color: '#f3f3f4'
        }
    },
    plotOptions: {
        series: {
            dataLabels: {
                color: '#34312d'
            },
            marker: {
                lineColor: '#34312d'
            }
        },
        boxplot: {
            fillColor: '#d9c5b2'
        },
        candlestick: {
            lineColor: '#f3f3f4'
        },
        errorbar: {
            color: '#f3f3f4'
        }
    },
    legend: {
        itemStyle: {
            color: '#f3f3f4'
        },
        itemHoverStyle: {
            color: '#ffffff'
        },
        itemHiddenStyle: {
            color: '#7e7f83'
        }
    },
    credits: {
        style: {
            color: '#7e7f83'
        }
    },
    labels: {
        style: {
            color: '#7e7f83'
        }
    },

    drilldown: {
        activeAxisLabelStyle: {
            color: '#f3f3f4'
        },
        activeDataLabelStyle: {
            color: '#f3f3f4'
        }
    },

    navigation: {
        buttonOptions: {
            symbolStroke: '#f3f3f4',
            theme: {
                fill: '#7e7f83'
            }
        }
    },

    // scroll charts
    rangeSelector: {
        buttonTheme: {
            fill: '#7e7f83',
            stroke: '#14110f',
            style: {
                color: '#7e7f83'
            },
            states: {
                hover: {
                    fill: '#7e7f83',
                    stroke: '#14110f',
                    style: {
                        color: '#f3f3f4'
                    }
                },
                select: {
                    fill: '#14110f',
                    stroke: '#14110f',
                    style: {
                        color: '#f3f3f4'
                    }
                }
            }
        },
        inputBoxBorderColor: '#7e7f83',
        inputStyle: {
            backgroundColor: '#34312d',
            color: '#7e7f83'
        },
        labelStyle: {
            color: '#7e7f83'
        }
    },

    navigator: {
        handles: {
            backgroundColor: '#7e7f83',
            borderColor: '#f3f3f4'
        },
        outlineColor: '#7e7f83',
        maskFill: '#ffffff',
        series: {
            color: '#7e7f83',
            lineColor: '#f3f3f4'
        },
        xAxis: {
            gridLineColor: '#7e7f83'
        }
    },

    scrollbar: {
        barBackgroundColor: '#7e7f83',
        barBorderColor: '#7e7f83',
        buttonArrowColor: '#f3f3f4',
        buttonBackgroundColor: '#7e7f83',
        buttonBorderColor: '#7e7f83',
        rifleColor: '#ffffff',
        trackBackgroundColor: '#34312d',
        trackBorderColor: '#34312d'
    },

    // special colors for some of the
    legendBackgroundColor: '#14110f',
    background2: '#7e7f83',
    dataLabelsColor: '#f3f3f4',
    textColor: '#7e7f83',
    contrastTextColor: '#f3f3f4',
    maskColor: '#ffffff'
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);
