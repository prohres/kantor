
var quotesForex = new XMLHttpRequest();
quotesForex.onreadystatechange = function()
{
  if (quotesForex.readyState == 4 && quotesForex.status == 200)
  {
	var quotesData = JSON.parse(quotesForex.responseText);

	var currencyPairs = ["EURUSD", "GBPUSD", "USDRUB","USDCAD", "USDPLN", "CHFUSD"];
	for (var i = 0; i < 6; i++) {
		document.getElementById(currencyPairs[i] + "BID").innerHTML = quotesData[i].bid.toFixed(5);
		document.getElementById(currencyPairs[i] + "ASK").innerHTML = quotesData[i].ask.toFixed(5);
	}
  }
};
quotesForex.open("GET", "https://forex.1forge.com/1.0.3/quotes?pairs=EURUSD,GBPUSD,USDRUB,USDCAD,USDPLN,CHFUSD&api_key=vEugMMlFdNVX0U5qQuiQ4n8YCUDuEUha", true);
quotesForex.send();


