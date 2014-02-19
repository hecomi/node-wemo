var WeMo = require('../wemo');

WeMo.Search('Hecomi WeMo Switch 1', function(err, device) {
	console.log(device);
});
