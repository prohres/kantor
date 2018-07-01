
var exchangeNbu = new XMLHttpRequest();
exchangeNbu.onreadystatechange = function()
{
  if (exchangeNbu.readyState == 4 && exchangeNbu.status == 200)
  {
	var exchangeData = JSON.parse(exchangeNbu.responseText);
    
    var currencyCode = ["USD", "EUR", "GBP", "RUB", "CAD", "PLN"];

    for (var i = 0; i < exchangeData.length; i++) {
		for (var j = 0; j < currencyCode.length; j++) {
			if (exchangeData[i]["cc"] === currencyCode[j]) {
				document.getElementById(currencyCode[j]).innerHTML = exchangeData[i]["rate"].toFixed(3);
			}		
		}
	}
  }
};
exchangeNbu.open("GET", "https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json", true);
exchangeNbu.send();


