# 生产环境压缩后JavaScript错误还原，快速定位异常


（如果你对 `source-map`有了解，但是不知道具体怎么实现，操作，可以跳过前面的，直接看底部列列举的参考文章）

大家都知道一般我们前端的JavaScript代码上线前都会压缩，混淆处理，减小代码体积的同时还相对安全些，线上代码一般是这样的

![carbon (17).png-182.5kB][1]

举一个具体例子
源代码是这样的
```
.......
function buyVip(){
    // 判断是否购买的是已经购买过的自动续费商品
   let { auto_renew } = this.vipData.vip;
   if( !this.isIOS == auto_renew.expire_type){
    console.log("you are ios vip")
   }    
}
.....
   
```
压缩后是这个样子

```
this.buyVip(this.selectInfo)},buyVip:function(t){var e=this;localStorage.setItem("vip_buy_goods",(0,l.default)(t)),this.timer=setTimeout(function(){if(!e.loginState)return e.loginActiveRouter="payVipOrder",u.default.openViewByRouter("bridge://user/login"),!1;var i=e.vipData.vip.auto_renew;if(!e.isIOS&&e.isSelect&&i&&1==i.auto_renew&&t.expire_type==i.expire_type&&t.expire_val==i.expire_val){var n=1==i.platform?
```
结果由于 auto_renew 是个null，代码报错了，报错信息如下
```
{
 message: "Cannot read property 'auto_renew' of undefined",
 url: "http://xxx.com/vip.024973a2.js",
 row:1,
 col:876
}
```
这样你根据错误信息来定位具体的代码很不容易，这个例子还有 `auto_renew` 这个关键字，能根据关键字查，有的是 `Cannot read property [0] of undefined" ` 只看错误行数，开发小哥哥想哭，肉眼很难定位的具体问题的

## 哪怎么样才能定位到具体错误啊？

要不不压缩代码，直接源码上，这是不可能的，代码体积太大，安全也是个大问题，那我们在本地开发的时候，默认也是打包后的文件，用Chrome 咋就能看到源码，其实就是利用的 SourceMap 技术来调试，SourceMap简单的讲，就是维护一个源代码和压缩后代码一一对应的文件，通过压缩后的错误信息反向推出源代码错误具体行号，刚才上面那段代码，map文件如下
```
{
    "version": 3,
    "sources": ["vip.024973a2.js"],
    "names": ["buyVip",],
    "mappings": "AAAA,QAASA,KAEL,GACIC,GAAW,UAAYC,IAC3BC,SAAQC,IAAIH,GAGhBD",
    "file": "hello.min.js",
    "sourceRoot": "",
    "sourcesContent": ["function buyVip()\n{\n  let { auto_renew } = this.vipData.vip\n ...."]
}
```
这里面的主要点是 mapings，是一个很长的字符串，它分成三层，记录了压缩前后代码对行关系，具体map怎么记录的可以参考文章末尾的参考文章

那现在前端打包工具（webpack，gulp，rollup）都支持这个SourceMap功能，打包后类似这样

![carbon (1).png-132.2kB][2]

我们需要做的是把 打包后的 SourceMap 文件保存起来，然后根据上报的错误信息来反推具体行号了，强调下 SourceMap 文件是不要跟着打包后的js一起部署的，这样你线上的代码人家是很容易拿到的，相当于裸笨，所以需要在打包脚本做文章，把 .js 和 .map 文件独立出来，看个图(图是从网上找到，参见参考文档)

![网上图][3]

这样在错误平台就能展示错误了

![企业微信截图_20190427225913.png-30.9kB][4]
错误的展示平台，我们用的 Node.js 实现的，Firefox 开源一个 `source-map` 的包，非常好用，具体可以看github，
实际上 `source-map` 是一套成熟的技术，网上资料很多，可以搜来看看
那这里仅仅是完成了一个最小的代码错误复现的闭环，
如何在gitlab ci 里统一剥离 source-map 文件和压缩后 js 文件，如何对多项目source-map 文件存储，如何对单项目多版本制定存储规则，都是需要考虑的
第一个 统一剥离，因为我们公司的前端部署是统一的部署脚本的，所以在公共的脚本里做了处理，这也说明了，前端有统一的部署是多重要，不然单独项目接，会把人烦死，项目多了，一定要，工程化，流程化，统一化
版本存储规则，目前是 项目名/gittag/

还有一个问题是 source-map 文件其实挺大的，而且是不变的，在Node.js 最好用Redis缓存，我们初期项目接入不多，我先在内存里做了缓存

这个最小的闭环已经能很好的协助解决JavaScript 错误问题，但是还不能做到页面的监控，
 - 页面错误的归类
 - 比方某天客服反应 ，武汉这个区域，大面积用户报错，或者是页面直接打不开
 - 根据手机平牌，时间点，地域，来筛选错误
 - 某个用户出现错误的前10秒，用户都有哪些操作行为
 - 网络请求大面积报错
 - CDN加载失败
 
这些都是需要解决的问题，出现了问题，怎么样预警，通知到开发，是不是能做到智能的处理，都是后面需要考虑的，所以还有很多任务要做，有了新的进展，我会同步记录下来。

插一句哈，Vue 抛出的异常是没有具体行号的，需要经过处理才能上报上去，可以在github搜下 `github.com/occ/TraceKit`,专门格式化异常的(吐槽下中文搜索到 处理 source-map 的文章，都是一样的还互相抄，说到Vue错误处理都是直接跳过，要处理Vue异常的一定记得看下这个库，帮助很大)

这周九天班，赶紧睡觉去了。

参考文章：

- [阮一峰老师的 source-map 介绍][5]
- [脚本错误量极致优化-让脚本错误一目了然 ][6]
- [sentry.io][7]
- [raven-js][8]
- [异常格式化,处理vue文件用的上][9]


  [1]: http://static.zybuluo.com/hucheng91/ehx6mvjud0d1x6k3f73gec4h/carbon%20%2817%29.png
  [2]: http://static.zybuluo.com/hucheng91/732ayxz8g0b2qaiiqvlvq7mj/carbon%20%281%29.png
  [3]: http://static.zybuluo.com/hucheng91/vnkcgo7a5lkmsyc47dhv60dh/977470e2-2f5b-11e7-8551-8099a4038f6f.jpg
  [4]: http://static.zybuluo.com/hucheng91/lfr32vy0pedizpl19m4q7vmt/%E4%BC%81%E4%B8%9A%E5%BE%AE%E4%BF%A1%E6%88%AA%E5%9B%BE_20190427225913.png
  [5]: http://www.ruanyifeng.com/blog/2013/01/javascript_source_map.html
  [6]: https://github.com/joeyguo/blog/issues/14
  [7]: https://sentry.io/organizations
  [8]: https://github.com/getsentry/sentry-javascript
  [9]: https://github.com/occ/TraceKit