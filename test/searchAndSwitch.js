var WeMo = require('../wemo');

WeMo.Search('Hecomi WeMo Switch 1', function(err, device) {
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
