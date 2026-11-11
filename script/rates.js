// Rates, 30-day trends and charts for the FOREX, NBU and KANTOR sections.
// Keyless open sources (CORS allowed): Frankfurter (ECB reference rates) and the NBU official rates.
// Accuracy and latency don't matter here: one daily rate per currency is enough.
var FRANKFURTER = 'https://api.frankfurter.dev/v1';
var NBU = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange';
var DAYS = 30;
var FLAT = 0.1; // |change| below this many percent counts as flat

// Pair -> how to read it from USD-based rates: USDxxx = rate, xxxUSD = 1 / rate
var FOREX_PAIRS = {
	EURUSD: { cc: 'EUR', invert: true },
	GBPUSD: { cc: 'GBP', invert: true },
	USDCAD: { cc: 'CAD', invert: false },
	USDPLN: { cc: 'PLN', invert: false },
	CHFUSD: { cc: 'CHF', invert: true }
};
var NBU_CODES = ['USD', 'EUR', 'GBP', 'CAD', 'PLN'];

// Kantor prices are derived from the NBU rate with a spread that varies per day and currency.
// The spread is pseudo-random but seeded by (side, currency, date): the same day always gives
// the same prices, so the table, the chart and a page reload agree.
var SPREAD = { buy: [0.90, 0.99], sell: [1.01, 1.10] };

function isoDate(d) {
	return d.toISOString().slice(0, 10);
}

function daysAgo(n) {
	var d = new Date();
	d.setUTCDate(d.getUTCDate() - n);
	return d;
}

function toUtc(iso) {
	return Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
}

// FNV-1a hash -> mulberry32: a deterministic number in [0, 1) for any string
function seeded(text) {
	var h = 2166136261;
	for (var i = 0; i < text.length; i++) {
		h ^= text.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	h += 0x6D2B79F5;
	var t = Math.imul(h ^ (h >>> 15), h | 1);
	t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function kantorPrice(side, cc, iso, nbuRate) {
	var range = SPREAD[side];
	return nbuRate * (range[0] + seeded(side + '|' + cc + '|' + iso) * (range[1] - range[0]));
}

function setText(id, text) {
	document.getElementById(id).textContent = text;
}

// ▲ / ▼ / ▬ with the change in percent; the tooltip names the base date
function showTrend(id, from, to, sinceIso) {
	var pct = (to - from) / from * 100;
	var kind = Math.abs(pct) < FLAT ? 'flat' : (pct > 0 ? 'up' : 'down');
	var arrow = { up: '▲', down: '▼', flat: '▬' }[kind];
	var el = document.getElementById(id);
	el.innerHTML = '<span class="trend trend-' + kind + '">' + arrow + ' ' + (pct > 0 ? '+' : '') + pct.toFixed(2) + ' %</span>';
	el.title = 'vs ' + sinceIso;
}

// Row click selects what the section's chart shows
function selectable(tableId, initial, draw) {
	var table = document.getElementById(tableId);
	function select(key) {
		table.querySelectorAll('tbody tr').forEach(function (row) {
			row.classList.toggle('active', row.dataset.key === key);
		});
		draw(key);
	}
	table.addEventListener('click', function (event) {
		var row = event.target.closest('tbody tr');
		if (row) select(row.dataset.key);
	});
	select(initial);
}

// Public APIs sometimes drop a request (rate limits, network): retry twice with a pause
function getJson(url, retries) {
	retries = retries === undefined ? 2 : retries;
	return fetch(url)
		.then(function (response) {
			if (!response.ok) throw new Error(url + ': HTTP ' + response.status);
			return response.json();
		})
		.catch(function (error) {
			if (retries === 0) throw error;
			return new Promise(function (resolve) { setTimeout(resolve, 1000); })
				.then(function () { return getJson(url, retries - 1); });
		});
}

function showError(chartId, text) {
	document.getElementById(chartId).innerHTML = '<p class="chart-error">' + text + '</p>';
}

// FOREX: one range request gives today's rates, the trends and every chart
getJson(FRANKFURTER + '/' + isoDate(daysAgo(DAYS)) + '..' + isoDate(new Date()) + '?base=USD&symbols=EUR,GBP,CAD,PLN,CHF')
	.then(function (json) {
		var dates = Object.keys(json.rates).sort();
		var first = dates[0];
		var last = dates[dates.length - 1];
		function value(pair, iso) {
			var rate = json.rates[iso][FOREX_PAIRS[pair].cc];
			return FOREX_PAIRS[pair].invert ? 1 / rate : rate;
		}
		for (var pair in FOREX_PAIRS) {
			setText(pair + '-rate', value(pair, last).toFixed(5));
			showTrend(pair + '-trend', value(pair, first), value(pair, last), first);
		}
		setText('forex-source', 'ECB reference rates · ' + last + ' · trend vs ' + first);
		selectable('forex-table', 'EURUSD', function (pair) {
			drawArea('forex-chart', pair, dates.map(function (iso) { return [toUtc(iso), value(pair, iso)]; }), 5);
		});
	})
	.catch(function (error) {
		console.error(error);
		showError('forex-chart', 'ECB rates are not available right now.');
	});

// NBU: all currencies per day (31 small requests); a failed day is just a gap
var nbuDays = [];
for (var n = DAYS; n >= 0; n--) {
	var day = daysAgo(n);
	var iso = isoDate(day);
	nbuDays.push(getJson(NBU + '?date=' + iso.split('-').join('') + '&json')
		.then(function (iso) {
			return function (json) {
				var rates = {};
				json.forEach(function (item) { rates[item.cc] = item.rate; });
				return { iso: iso, rates: rates };
			};
		}(iso))
		.catch(function () { return null; }));
}

Promise.all(nbuDays).then(function (days) {
	days = days.filter(function (d) { return d && d.rates.USD; });
	if (!days.length) {
		showError('nbu-chart', 'NBU rates are not available right now.');
		showError('kantor-chart', 'Prices are not available right now.');
		return;
	}
	var first = days[0];
	var last = days[days.length - 1];

	NBU_CODES.forEach(function (cc) {
		setText('NBU-' + cc + '-rate', last.rates[cc].toFixed(3));
		showTrend('NBU-' + cc + '-trend', first.rates[cc], last.rates[cc], first.iso);
		setText('KANTOR-' + cc + '-buy', kantorPrice('buy', cc, last.iso, last.rates[cc]).toFixed(3));
		setText('KANTOR-' + cc + '-sell', kantorPrice('sell', cc, last.iso, last.rates[cc]).toFixed(3));
	});
	setText('nbu-source', 'Official UAH rates · ' + last.iso + ' · trend vs ' + first.iso);

	selectable('nbu-table', 'USD', function (cc) {
		drawArea('nbu-chart', cc, days.map(function (d) { return [toUtc(d.iso), d.rates[cc]]; }), 3);
	});
	selectable('kantor-table', 'USD', function (cc) {
		drawLines('kantor-chart', ['sell', 'buy'].map(function (side) {
			return {
				name: side === 'buy' ? 'Buy' : 'Sell',
				points: days.map(function (d) { return [toUtc(d.iso), kantorPrice(side, cc, d.iso, d.rates[cc])]; })
			};
		}), 3);
	});
});
