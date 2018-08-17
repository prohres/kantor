	var nowDate = new Date();

	var nowDays = $('.nowdays').FlipClock(nowDate.getDate(), {
		clockFace: 'Counter'
	});

 	var nowMonths = $('.nowmonths').FlipClock((nowDate.getMonth() + 1), {
		clockFace: 'Counter'
	});

	var nowYears = $('.nowyear').FlipClock(nowDate.getFullYear(), {
		clockFace: 'Counter'
	});

	var nowTimes = $('.nowtimes').FlipClock({
	clockFace: 'TwentyFourHourClock'
	});
	


