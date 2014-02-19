WeMo client library for Node.js
===============================

これは何？
----------
Belkin 社の **WeMo Switch / Motion** を操作する Node.js 用モジュールです。

インストール
------------
	$ npm install wemo

使い方
------
以下のように `getBinaryState` / `setBinaryState` で操作出来ます。

```javascript
var WeMo = new require('wemo')
var wemoSwitch = new WeMo('192.168.0.16', 49154);
wemoSwitch.setBinaryState(1, function(err, result) { // switch on
	if (err) console.error(err);
	console.log(result); // 1
	wemoSwitch.getBinaryState(function(err, result) {
		if (err) console.error(err);
		console.log(result); // 1
	});
});
```
WeMo Motion は `getBinaryState` のみ可能です。

家にある WeMo の検索には `Search` を使います。

```javascript
var WeMo = require('../wemo');

var client = WeMo.Search();
client.on('found', function(device) {
	console.log(device);
	setTimeout(function() {
		client.exit();
	}, 3000);
});
```

アプリから設定した Friendly Name で検索することも可能です。

```javascript
var WeMo = require('wemo');

WeMo.Search('Hecomi WeMo Switch 1', function(err, device) {
	var wemoSwitch = new WeMo(device.ip, device.port);
	...
});
```

その他サンプルは `./test` 以下をご覧ください。

LICENSE
-------
Copyright (c) 2014 hecomi

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
