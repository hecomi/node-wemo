WeMo client library for Node.js
=============

これは何？
--------------
Belkin 社の WeMo を操作する Node.js 用モジュールです。

インストール
--------------
	$ npm install wemo

使い方
--------------
以下のように getBinaryState/setBinaryState で WeMo が操作出来ます。

```javascript
var WeMo = new require('wemo')
var wemoSwitch = new WeMo('192.168.0.16');
wemoSwitch.setBinaryState(1, function(err, result) { // switch on
	if (err) console.error(err);
	console.log(result); // 1
	wemoSwitch.getBinaryState(function(err, result) {
		if (err) console.error(err);
		console.log(result); // 1
	});
});
```

使用例は test.js をご覧ください。

その他
--------------
WeMo の IP は付属の wemo_search.js を実行することで調べることができます。

詳細
--------------
その他詳細は Twitter:@hecomi へご質問いただくか、http://d.hatena.ne.jp/hecomi/ をご参照下さい。

