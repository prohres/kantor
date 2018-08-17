
fetch('https://forex.1forge.com/1.0.3/quotes?pairs=EURUSD,GBPUSD,USDRUB,USDCAD,USDPLN,CHFUSD&api_key=vEugMMlFdNVX0U5qQuiQ4n8YCUDuEUha')
.then(response => response.json())
.then(json => {
	var currencyPairs = ["EURUSD", "GBPUSD", "USDRUB","USDCAD", "USDPLN", "CHFUSD"];
	for (var i = 0; i < 6; i++) {
		document.getElementById(currencyPairs[i] + "BID").innerHTML = json[i].bid.toFixed(5);
		document.getElementById(currencyPairs[i] + "ASK").innerHTML = json[i].ask.toFixed(5);
	}
});

fetch('https://allow-any-origin.appspot.com/https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
.then(response => response.json())
.then(json => {
	for (var i = 0; i < json.length; i++) {
		var currencyCode = ["USD", "EUR", "GBP", "RUB", "CAD", "PLN"];
		for (var j = 0; j < currencyCode.length; j++) {
			if (json[i].cc == currencyCode[j]) {
				document.getElementById('RATE' + currencyCode[j]).innerHTML = json[i].rate.toFixed(3);
			}		
		}
	}
});



var rateData = [
	{
	"cc": "USD",
	"rateBay": 26.00,
	"rateSell": 26.20},
	{
	"cc": "EUR",
	"rateBay": 30.30,
	"rateSell": 30.48},
	{
	"cc": "GBP",
	"rateBay": 34.00,
	"rateSell": 34.25},
	{
	"cc": "RUB",
	"rateBay": 0.405,
	"rateSell": 0.410},
	{
	"cc": "CAD",
	"rateBay": 19.40,
	"rateSell": 19.70},
	{
	"cc": "PLN",
	"rateBay": 6.90,
	"rateSell": 6.96},
]

for (var i = 0; i < 6; i++) {
	document.getElementById(rateData[i]["cc"] + "BAY").innerHTML = rateData[i].rateBay.toFixed(3);
	document.getElementById(rateData[i]["cc"] + "SELL").innerHTML = rateData[i].rateSell.toFixed(3);
}
