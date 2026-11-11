// Date and clock in the header (Kyiv time), updated every second
(function () {
	var zone = 'Europe/Kyiv';
	var dateFormat = new Intl.DateTimeFormat('en-GB', { timeZone: zone, weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
	var timeFormat = new Intl.DateTimeFormat('en-GB', { timeZone: zone, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
	var dateEl = document.getElementById('clock-date');
	var timeEl = document.getElementById('clock-time');

	function tick() {
		var now = new Date();
		dateEl.textContent = dateFormat.format(now);
		timeEl.textContent = timeFormat.format(now);
	}

	tick();
	setInterval(tick, 1000);
})();
