# JWT 认证 

这篇讲下 JWT 认证
JWT解决的不是数据传输安全，这是https，ssl等解决的问题
JWT解决的是服务器端不用存储Cookie或者SESSION
因为根据JWT就能获取到用户信息，单独使用用处不大，很鸡肋的玩意

只是取代了cookie sesssion这种服务端存储认证,放在了浏览器来存储


### 应用场景
- 一次性验证
 比如用户注册后需要发一封邮件让其激活账户，通常邮件中需要有一个链接，这个链接需要具备以下的特性：能够标识用户，该链接具有时效性（通常只允许几小时之内激活），不能被篡改以激活其他可能的账户…这种场景就和 jwt 的特性非常贴近，jwt 的 payload 中固定的参数：iss 签发者和 exp 过期时间正是为其做准备的。


 
### 组成
 Header.Payload.Signature   
 // 类似
 "eyJhbGciOiJIUzI1NiJ9.eyJuYW1lIjoiMTIyIiwidXNlcklkIjoiMTIyIiwiZXhwIjoiMjAxOC0xMS0zMFQwMzoxODo0NS45MDdaIn0.7aBqdLzuEX-h-eaUp2RtXyAer6ZvOgG6ach3yqeBJXw"

### Header 
```
{
  "alg": "HS256", // 标记加密算法
  "typ": "JWT"
}
```

### Payload 
这里是存我们的方存放的用户信息
```
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```
### Signature 签名 
 密钥 好好保存

 

### 伪代码如下 
```
// 核心
const signature = HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret);

//  伪代码

function base64url(buf) {
  return buf
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function jwsSecuredInput(header, payload, encoding) {
  encoding = encoding || 'utf8';
  var encodedHeader = base64url(toBuffer(header));
  var encodedPayload = base64url(toBuffer(payload, encoding));
  return util.format('%s.%s', encodedHeader, encodedPayload);
}

function jwsSign(opts) {
  var header = opts.header;
  var payload = opts.payload;
  var secretOrKey = opts.secret || opts.privateKey;
  var encoding = opts.encoding;
  var algo = jwa(header.alg);
  var securedInput = jwsSecuredInput(header, payload, encoding);
  var signature = algo.sign(securedInput, secretOrKey);
  return util.format('%s.%s', securedInput, signature);
}

function SignStream(opts) {
  var secret = opts.secret||opts.privateKey||opts.key;
  var secretStream = new DataStream(secret);
  this.readable = true;
  this.header = opts.header;
  this.encoding = opts.encoding;
  this.secret = this.privateKey = this.key = secretStream;
  this.payload = new DataStream(opts.payload);
  this.secret.once('close', function () {
    if (!this.payload.writable && this.readable)
      this.sign();
  }.bind(this));

  this.payload.once('close', function () {
    if (!this.secret.writable && this.readable)
      this.sign();
  }.bind(this));
}
util.inherits(SignStream, Stream);

SignStream.prototype.sign = function sign() {
    var signature = jwsSign({
      header: this.header,
      payload: this.payload.buffer,
      secret: this.secret.buffer,
      encoding: this.encoding
    });

    return  signature;
    
};

SignStream.sign = jwsSign;

module.exports = SignStream;
 ```