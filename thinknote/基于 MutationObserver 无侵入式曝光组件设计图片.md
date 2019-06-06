# 基于 MutationObserver 无侵入式曝光组件设计



现在很多APP都需要统计用户行为的需求，比方有一个列表页，有20条行信息，点击列表进入详情，用户点进页面后，运营可能想知道，用户进入这个页面，停留了多长时间，是否点击了详情，那前端在用户进入列表页，点击详情的时候，调用后端接口下，发送当前的数据，这样根据数据就能还原用户的行为，就能更好的分析数据了，还有各种切换tab，链接，等等，这种统计用户行为俗称 埋点。

曝光是埋点里面的一个小点，主要当用户看到我的数据，我就调接口上报数据，这个叫曝光上报，也就是看到才调用上报接口，具体可看下面这个图

![expose_sdk.gif-497.6kB][1]


比方上面举例子的列表页，用户点进来就上报，如果做的惊喜些的话，进来列表页只上报当前屏幕内的内容，往下滚动的时候，其他内容进入视野后，再调用上报接口，像上面图一样，1，2，3数据上报，滚动后4开始上报，回滚的时候已经上报了的不上报，还有可能是用户进列表页后，跳出去，接着有跳进来，这种频繁操作，你在某个时间内（比方一分钟）应该只上报一次，这样做下来，用户的行为数据就会非常精准，产品。运营，算法同学在做数据分析，流量转化的时候参考价值就比较高

每个业务线都有这种需求，封装成一个通用的组件，来满足这种曝光需求，是很有必要的

其实本质上，只要监听 scroll 事件，计算当前屏幕内有的条目数然后上报，常见的这个组件的设计思路是

1. 组件暴露一个初始方法，将当前页面元素存储到组件内部维护的一个队列里
2. 用组件的人，在下拉分页的时候，调用组件的一个方法，把新增的页面元素放到组件队列里面去

伪代码如下

![1.png-133.3kB][2]

这样实现有一个问题,组件必须暴露 addQueue 方法，要是使用方忘了调用这个方法，那数据上报就不完整，而且已经开发了的项目，上这个组件的时候就要在很多地方新增代码，比较麻烦，不利于组件的推广,能不能有一种方式只需要```new Exposure().init({boxClass:".wow"})```,就接入了曝光组件，组件能自己监听 Dom 的变化，这个时候 MutationObserver 要登场了(前面啰嗦了这么多,主角终于出来了)

MutationObserver 接口提供了监视对DOM树所做更改的能力,是DOM3 Event规范的一部分，常见的浏览器,Android4.4以上,IE11 都支持, 当监视的 DOM 发生变动时 MutationObserver 将收到通知并触发事先设定好的回调函数

类似于事件，但是异步触发 添加监视时，MutationObserver 上的 observer 函数与 addEventListener 有相似之处，但不同于addEventListener的同步触发(比方 click 点击一次调用一次)，MutationObserver 是异步触发，意思是等整个列表 Dom 不改变后，才会调用 callback ，不会造成浏览器卡顿

画重点 ,监听Dom树更改，还是异步的，实在太适合我需要的这种场景,在组件里监听 boxClass Dom元素改变就好了
![jignxin.gif-466.3kB][3]
简单来个 MutationObserver 例子

![carbon (3).png-19.5kB][4]


网上 MutationObserver 具体的 API 介绍挺多的，不细讲；但具体的应用场景没发现一个，埋点曝光的场景用 MutationObserver 是相当的舒服

用上 MutationObserver 后 ，这个曝光组件一点都没有侵入业务代码，推广起来，信心大了不少

## 在整个组件开发的过程还有些其他知识点

如何判断一个元素是否在屏幕内？

![4.png-58.5kB][5]

scroll太频繁，IOS下scroll 事件 停止才触发

scroll太频繁 我用了 函数 防抖，IOS 下 我用的是 setInterval ,短时间内判断

![5.png-21.6kB][6]

MutationObserver callback 怎么把当前 Exposure 的this传进去

为了避免 代码报错,影响业务代码执行 try catch 的使用


基本就这些了,写这个组件，自己学到了很多东西，晚上在家把思路梳理下，感觉清晰了很多，还是要多写东西

上面这些代码图片是通过 carbon 生成的，看着不错，代码片段可以通过github 获取 https://github.com/hucheng91/frontend-note/blob/master/thinknote/%E5%9F%BA%E4%BA%8E%20MutationObserver%20%E6%97%A0%E4%BE%B5%E5%85%A5%E5%BC%8F%E6%9B%9D%E5%85%89%E7%BB%84%E4%BB%B6%E8%AE%BE%E8%AE%A1.md 

![6.png-12.8kB][7]


  [1]: http://static.zybuluo.com/hucheng91/0mioqgan6lso6v8bij6dtsxt/expose_sdk.gif
  [2]: http://static.zybuluo.com/hucheng91/1c3ks8zq57hq03dvu3gaq0sw/1.png
  [3]: http://static.zybuluo.com/hucheng91/oy0fw3nvird7d8dfzppmlw73/jignxin.gif
  [4]: http://static.zybuluo.com/hucheng91/cgoi41uoloel26xi4jj9foyh/carbon%20%283%29.png
  [5]: http://static.zybuluo.com/hucheng91/hyzsl88lh65c1sncgpidafmn/4.png
  [6]: http://static.zybuluo.com/hucheng91/ndy3qui3znvyhv1nkw6gykak/5.png
  [7]: http://static.zybuluo.com/hucheng91/r83yqm4kvcz7wg31yae7rnid/6.png