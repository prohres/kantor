
var quotes = new XMLHttpRequest();
quotes.onreadystatechange = function()
{
  if (quotes.readyState == 4 && quotes.status == 200)
  {
	var quotesData = JSON.parse(quotes.responseText);

	var curEventId = ['eurusd', 'gbpusd', 'usdrub','usdcad', 'usdpln'];
	for (var i = 0; i < 5; i++) {
		document.getElementById(curEventId[i] + 'bid').innerHTML = quotesData[i].bid.toFixed(5);
		document.getElementById(curEventId[i] + 'ask').innerHTML = quotesData[i].ask.toFixed(5);
	}
  }
};
quotes.open("GET", "https://forex.1forge.com/1.0.3/quotes?pairs=EURUSD,GBPUSD,USDRUB,USDCAD,USDPLN&api_key=vEugMMlFdNVX0U5qQuiQ4n8YCUDuEUha", true);
quotes.send();


