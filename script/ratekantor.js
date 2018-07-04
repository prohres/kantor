
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