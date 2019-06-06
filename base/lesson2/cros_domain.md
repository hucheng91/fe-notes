#  跨域

## 浏览器 同源策略





##  jsonp

dir: ./crosDomain/jsonp

原理: 浏览器是允许 script 跨域的，所以将请求模拟成一个 script 标签，将数据放在 回调函数里。

注意点: 由于 script 标签是 get 请求方式，所以 jsonp 只支持 get 请求

这种实现方式 需要 服务端和前端配合使用

服务器端
```javascript
router.get('/', function(req, res, next) {
  let obj = {id:"123",name:" 我是王二麻子"};
  let fn = req.query.callback ? req.query.callback : "callback";
  console.log(fn + '('+ JSON.stringify(obj) + ');');
  res.send(fn + '('+ JSON.stringify(obj) + ');');
    
});
```
客户端
```javascript
<script type="application/javascript">
function callback(data) {
        console.log(data);
     }
</script>
<script src="http://127.0.0.1:3001?callback=callback"></script>
```
如上 ，后端代码需要 用一个函数包裹起来，比方 ```callback(data) ```




## cros



## fetch 


## location.hash：

在 url 中，http://www.baidu.com#helloworld 的 "#helloworld" 就是 location.hash，改变 hash 值不会导致页面刷新，所以可以利用 hash 值来进行数据的传递，当然数据量是有限的。

假设 localhost:8080 下有文件 index.html 要和 localhost:8081 下的 data.html 传递消息，index.html 首先创建一个隐藏的 iframe，iframe 的 src 指向 localhost:8081/data.html，这时的 hash 值就可以做参数传递。

```javascript
// hash/client/index.html 对应 localhost:8080/index.html
<script>
	let ifr = document.createElement('iframe');
	ifr.style.display = 'none';
	ifr.src = "http://localhost:8081/data.html#data";
	document.body.appendChild(ifr);
	
	function checkHash() {
		try {
			let data = location.hash ? location.hash.substring(1) : '';
			console.log('获得到的数据是：', data);
		}catch(e) {

		}
	}
	window.addEventListener('hashchange', function(e) {
		console.log('获得的数据是：', location.hash.substring(1));
	});
</script>
```
data.html 收到消息后通过 parent.location.hash 值来修改 index.html 的 hash 值，从而达到数据传递。
```javascript
// hash/server/data.html 对应 localhost:8081/data.html
<script>
	switch(location.hash) {
		case "#data":
			callback();
			break;
	}
	function callback() {
		const data = "data.html 的数据"
		try {
			parent.location.hash = data;
		}catch(e) {
			// ie, chrome 下的安全机制无法修改 parent.location.hash
			// 所以要利用一个中间的代理 iframe 
			var ifrproxy = document.createElement('iframe');
			ifrproxy.style.display = 'none';
			ifrproxy.src = 'http://localhost:8080/proxy.html#' + data;     // 该文件在 client 域名的域下
			document.body.appendChild(ifrproxy);
		}
	}
</script>
```
由于两个页面不在同一个域下 IE、Chrome 不允许修改 parent.location.hash 的值，所以要借助于 localhost:8080 域名下的一个代理 iframe 的 proxy.html 页面
```javascript
// hash/client/proxy.html 对应 localhost:8080/proxy.html
<script>
    parent.parent.location.hash = self.location.hash.substring(1);
</script>
```

## window.name


## postMessage

postMessage 是 HTML5 新增加的一项功能，跨文档消息传输(Cross Document Messaging)，目前：Chrome 2.0+、Internet Explorer 8.0+, Firefox 3.0+, Opera 9.6+, 和 Safari 4.0+ 都支持这项功能，使用起来也特别简单。

前端逻辑：
```javascript
// postMessage/client/index.html 对应 localhost:8080/index.html
<iframe src="http://localhost:8081/data.html" style='display: none;'></iframe>
<script>
	window.onload = function() {
		let targetOrigin = 'http://localhost:8081';
		window.frames[0].postMessage('index.html 的 data!', targetOrigin);
	}
	window.addEventListener('message', function(e) {
		console.log('index.html 接收到的消息:', e.data);
	});
</script>
```

创建一个 iframe，使用 iframe 的一个方法 postMessage 可以想 http://localhost:8081/data.html 发送消息，然后监听 message，可以获得其文档发来的消息。

数据端逻辑：

```javascript
// postMessage/server/data.html 对应 localhost:8081/data.html
<script>
	window.addEventListener('message', function(e) {
		if(e.source != window.parent) {
			return;
		}
		let data = e.data;
		console.log('data.html 接收到的消息:', data);
		parent.postMessage('data.html 的 data!', e.origin);
	});
</script>
```

## document.domain
对于主域相同而子域不同的情况下，可以通过设置 document.domain 的办法来解决，具体做法是可以在 http://www.example.com/index.html 和 http://sub.example.com/data.html 两个文件分别加上 document.domain = "example.com" 然后通过 index.html 文件创建一个 iframe，去控制 iframe 的 window，从而进行交互，

前端
```javascript
// domain/client/index.html 对应 sub1.example.com/index.html
<script>
	document.domain = 'example.com';
	let ifr = document.createElement('iframe');
	ifr.src = 'http://sub2.example.com/data.html';
	ifr.style.display = 'none';
	document.body.append(ifr);
	ifr.onload = function() {
		let win = ifr.contentWindow;
		alert(win.data);
	}
</script>
```

数据端逻辑：
```javascript
// domain/server/data 对应 sub2.example.com/data.html
<script>
	document.domain = 'example.com';
	window.data = 'data.html 的数据！';
</script>
```


