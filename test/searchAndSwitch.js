var WeMo = require('../wemo');

WeMo.Search('WeMo Switch 1', function(err, device) {
	if (err) throw err;
	var wemoSwitch = new WeMo(device.ip, device.port);
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
});
