var WeMo = require('./wemo.js');

var wemoSwitch = new WeMo('192.168.0.16');
wemoSwitch.setBinaryState(0, function(err, result) {
	if (err) console.error(err);
	console.log(result);
});
setTimeout(function() {
	wemoSwitch.setBinaryState(1, function(err, result) {
		if (err) console.error(err);
		console.log(result);
	});
}, 2000);

var wemoMotion = new WeMo('192.168.0.2');
wemoMotion.state = 0;
setInterval(function() {
	wemoMotion.getBinaryState(function(err, result) {
		if (err) console.error(err);
		switch (parseInt(result) - wemoMotion.state) {
			case 1  : console.log('move!');     break;
			case 0  : console.log('.');         break;
			case -1 : console.log('no motion'); break;
			default : console.error('unexpected error'); break;
		}
		wemoMotion.state = parseInt(result);
	});
}, 1000);
