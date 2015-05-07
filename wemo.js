var http    = require('http');
var Client  = require('node-ssdp').Client;
var request = require('request');
var url     = require('url');
var xml2js  = require('xml2js');

var WeMo = function(ip, port) {
	this.ip   = ip;
	this.port = port || 49154;
};

WeMo.Timeout = 2000; /* msec */
WeMo.SearchTimeout = 5000; /* msec */
WeMo.ST = 'urn:Belkin:service:basicevent:1';

WeMo.Search = function(friendlyName, callback) {
	if (friendlyName !== undefined) {
		return WeMo.SearchByFriendlyName(friendlyName, callback);
	}

	var client = new Client();
	client.on('response', function(headers, statusCode, rinfo) {
		if (headers.ST === WeMo.ST) {
			var location = url.parse(headers.LOCATION);
			request.get(location.href, function(err, res, xml) {
				xml2js.parseString(xml, function(err, json) {
					var device = { ip: location.hostname, port: location.port };
					for (var key in json.root.device[0]) {
						device[key] = json.root.device[0][key][0];
					}
					client.emit('found', device);
				});
			});
		}
	});
	client.search(WeMo.ST);
	return client;
};

WeMo.SearchByFriendlyName = function(name, callback) {
	var client = WeMo.Search();
	var timer = setTimeout(function() {
		callback('WeMoSearchTimeoutError', null);
		client._stop();
	}, WeMo.SearchTimeout);
	client.on('found', function(device) {
		if (device.friendlyName === name) {
			clearTimeout(timer);
			callback(null, device);
			client._stop();
		}
	});
	return client;
};

WeMo.prototype = {
	_sendSoapCommand : function(action, param, callback) {
		var data =
			'<?xml version="1.0" encoding="utf-8"?>\n' +
			'<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">\n' +
			' <s:Body>\n' +
			    param +
			' </s:Body>\n' +
			'</s:Envelope>\n';
		var options = {
			host   : this.ip,
			port   : this.port,
			path   : '/upnp/control/basicevent1',
			method : 'POST',
			headers: {
				'SOAPACTION'     : '"urn:Belkin:service:basicevent:1#' + action + '"',
				'Content-Length' : data.length,
				'Content-Type'   : 'text/xml; charset="utf-8"',
				'User-Agent'     : 'CyberGarage-HTTP/1.0'
			}
		};
		var req = http.request(options, function(res) {
			res.setEncoding('utf8');
			var body = '';
			res.on('data', function (chunk) {
				body += chunk.toString();
			});
			res.on('end', function() {
				if (res.statusCode === '200') {
					callback('STATUS CODE: ' + res.statusCode, body);
				} else {
					callback(null, body);
				}
			});
		});
		req.on('socket', function(socket) {
			socket.setTimeout(WeMo.Timeout);
			socket.on('timeout', function() {
				req.abort();
				callback('Timeout access to WeMo@' + options.host + ':' + options.port, null);
			});
		});
		req.on('error', function(e) {
			callback(e, null);
		});
		req.write(data);
		req.end();
	},
	getBinaryState : function(callback) {
		var param =
			'  <u:GetBinaryState xmlns:u="urn:Belkin:service:basicevent:1">\n' +
			'  </u:GetBinaryState>\n';
		this._sendSoapCommand('GetBinaryState', param, function(err, result) {
			if (err) {
				callback(err, null);
				return;
			}
			if (result.match(/<BinaryState>(\d)<\/BinaryState>/)) {
				callback(null, RegExp.$1);
			} else {
				callback('Unknown error', result);
			}
		});
	},
	setBinaryState : function(state, callback) {
		var param =
			'  <u:SetBinaryState xmlns:u="urn:Belkin:service:basicevent:1">\n' +
			'    <BinaryState>' + state + '</BinaryState>\n' +
			'  </u:SetBinaryState>\n';
		this._sendSoapCommand('SetBinaryState', param, function(err, result) {
			if (err) {
				callback(err, null);
				return;
			}
			if (result.match(/<BinaryState>(.*?)<\/BinaryState>/)) {
				callback(null, RegExp.$1);
			} else {
				callback('Unknown error', result);
			}
		});
	}
};

module.exports = WeMo;
