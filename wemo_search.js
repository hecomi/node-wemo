var WeMo = require('./wemo');

client.on('response', function (msg, rinfo) {
	if (msg.match('Belkin')) {
		var url = msg.match(/LOCATION: (.*?\.xml)/)[1];
		if (url !== undefined) {
			http.get(url, function(res) {
				var xml = '';
				res.on('data', function(chunk) { xml += chunk.toString(); });
				res.on('end',  function() {
					var name = xml.match(/<friendlyName>(.*?)<\/friendlyName>/)[1];
					var info = url.match(/https?:\/\/([0-9.]*?):([0-9]+?)\//);
					console.log('name: %s, ip: %s, port: %d', name, info[1], info[2]);
				});
			});
		}
	}
});
client.search('urn:Belkin:service:basicevent:1');
