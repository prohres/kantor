var date = document.getElementById('date');

function simpleDate() {
  var nowDate = new Date();
  var d = nowDate.getDate().toString();
  var m = (nowDate.getMonth() + 1).toString();
  var y = nowDate.getFullYear().toString();

  if (d.length < 2) {
    d = "0" + d;
  }

  if (m.length < 2) {
    m = "0" + m;
  }

  var dateString = d + "/" + m + "/" + y;

  date.textContent = dateString;
}

simpleDate();
