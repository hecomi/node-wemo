var WeMo    = require('./wemo');
var http    = require('http');
var SSDP    = require('node-ssdp');
var client  = new SSDP();
var request = require('request');
var xml2js  = require('xml2js');

var wemoSt = 'urn:Belkin:service:basicevent:1';

client.on('response', function (msg, rinfo) {
	msg = msg.split('\r\n').reduceRight(function(map, item) {
		var data = item.match(/^(.*?): (.*?)$/);
		if (data) map[data[1].toLowerCase()] = data[2];
		return map;
	}, {});
	if (msg.st === wemoSt) {
		var location = require('url').parse(msg.location);
		request.get(location.href, function(err, res, xml) {
			xml2js.parseString(xml, function(err, json) {
				console.log(json.root);
			});
		});
	}
	// if (msg.match('Belkin')) {
	// 	var url = msg.match(/LOCATION: (.*?\.xml)/)[1];
	// 	if (url !== undefined) {
	// 		http.get(url, function(res) {
	// 			var xml = '';
	// 			res.on('data', function(chunk) { xml += chunk.toString(); });
	// 			res.on('end',  function() {
	// 				var name = xml.match(/<friendlyName>(.*?)<\/friendlyName>/)[1];
	// 				var info = url.match(/https?:\/\/([0-9.]*?):([0-9]+?)\//);
	// 				console.log('name: %s, ip: %s, port: %d', name, info[1], info[2]);
	// 			});
	// 		});
	// 	}
	// }
});
client.search(wemoSt);
