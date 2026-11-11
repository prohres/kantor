// Keyless open sources (CORS allowed): Frankfurter (ECB reference rates) and the NBU official rates.
// Accuracy and latency don't matter here: one daily rate per currency is enough.
var FRANKFURTER = 'https://api.frankfurter.dev/v1';
var NBU = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange';

// Pair -> how to read it from USD-based rates: USDxxx = rate, xxxUSD = 1 / rate
var forexPairs = {
	EURUSD: { cc: 'EUR', invert: true },
	GBPUSD: { cc: 'GBP', invert: true },
	USDCAD: { cc: 'CAD', invert: false },
	USDPLN: { cc: 'PLN', invert: false },
	CHFUSD: { cc: 'CHF', invert: true }
};

fetch(`${FRANKFURTER}/latest?base=USD&symbols=EUR,GBP,CAD,PLN,CHF`)
	.then(response => response.json())
	.then(json => {
		for (var pair in forexPairs) {
			var rate = json.rates[forexPairs[pair].cc];
			var value = forexPairs[pair].invert ? 1 / rate : rate;
			document.getElementById(pair + 'BID').innerHTML = value.toFixed(5);
			document.getElementById(pair + 'ASK').innerHTML = json.date;
		}
	});

var nbuCodes = ['USD', 'EUR', 'GBP', 'CAD', 'PLN'];

fetch(`${NBU}?json`)
	.then(response => response.json())
	.then(json => {
		json.filter(item => nbuCodes.includes(item.cc)).forEach(item => {
			document.getElementById('RATE' + item.cc).innerHTML = item.rate.toFixed(3);
			document.getElementById('DATE' + item.cc).innerHTML = item.exchangedate;
		});
	});

// Kantor's own buy / sell prices (static demo values: NBU rate of 2026-11-11 -1% / +0.5%)
var rateData = [
	{ cc: 'USD', rateBay: 45.05, rateSell: 45.73 },
	{ cc: 'EUR', rateBay: 50.57, rateSell: 51.33 },
	{ cc: 'GBP', rateBay: 60.51, rateSell: 61.42 },
	{ cc: 'CAD', rateBay: 31.88, rateSell: 32.37 },
	{ cc: 'PLN', rateBay: 11.52, rateSell: 11.70 }
];

rateData.forEach(item => {
	document.getElementById(item.cc + 'BAY').innerHTML = item.rateBay.toFixed(3);
	document.getElementById(item.cc + 'SELL').innerHTML = item.rateSell.toFixed(3);
});
