var WeMo = require('../wemo');

WeMo.Search('WeMo Switch 1', function(err, device) {
	if (err) throw err;
	console.log(device);
});
