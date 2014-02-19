var WeMo = require('../wemo');

var wemoSwitch = new WeMo('192.168.0.15', 49153);
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

