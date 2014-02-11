var http = require('http');
var EventEmitter = require('events').EventEmitter;

var WeMo = function(ip, port) {
	this.ip   = ip;
	this.port = port || 49154;
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
