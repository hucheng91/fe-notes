# 基于 MutationObserver 无侵入式曝光组件设计



现在很多APP都需要统计用户行为的需求，比方有一个列表页，有20条行信息，点击列表进入详情，用户点进页面后，运营可能想知道，用户进入这个页面，停留了多长时间，是否点击了详情，那前端在用户进入列表页，点击详情的时候，调用后端接口下，发送当前的数据，这样根据数据就能还原用户的行为，就能更好的分析数据了，还有各种切换tab，链接，等等，这种统计用户行为俗称 埋点。

曝光是埋点里面的一个小点，主要当用户看到我的数据，我就调接口上报数据，这个叫曝光上报，也就是看到才调用上报接口，具体可看下面这个图

![expose_sdk.gif-497.6kB][1]


比方上面举例子的列表页，用户点进来就上报，如果做的惊喜些的话，进来列表页只上报当前屏幕内的内容，往下滚动的时候，其他内容进入视野后，再调用上报接口，像上面图一样，1，2，3数据上报，滚动后4开始上报，回滚的时候已经上报了的不上报，还有可能是用户进列表页后，跳出去，接着有跳进来，这种频繁操作，你在某个时间内（比方一分钟）应该只上报一次，这样做下来，用户的行为数据就会非常精准，产品。运营，算法同学在做数据分析，流量转化的时候参考价值就比较高

每个业务线都有这种需求，封装成一个通用的组件，来满足这种曝光需求，是很有必要的

其实本质上，只要监听 scroll 事件，计算当前屏幕内有的条目数然后上报，常见的这个组件的设计思路是，
1. 组件暴露一个初始方法，将当前页面元素存储到组件内部维护的一个队列里
2. 用组件的人，在下拉分页的时候，调用组件的一个方法，把新增的页面元素放到组件队列里面去

伪代码如下
```javascript
class Exposure {
        constructor(isBridgeReport = true, envConfig) {
            this.queue = [];
            this.all = []; // 这个存放
        }

        init(scrollConfig){
            let boxClass = scrollConfig.boxClass;
            this.queue = document.querySelectorAll(this.config.boxClass);
            Util.addEvent(window, 'scroll', this.scrollHandler);
        }

        addQueue(array){
            this.queue = this.queue.concat(array);
        }

        scrollHandler(){
            this.queue = this.queue.reduce((acm,ele) => {
                if (this.isVisible(box)) { // isVisible判断当前是否在屏幕内
                  this.uploadData(box);   // 在屏幕内就上报数据
                }else{
                  acm.push(ele); // 不在屏幕内就放在数组里
                }
            },[]);
        }    
}

// 使用组件的用户使用如下
<div id="container">
  <div class="row  wow"  v-for="item in dataList" :key="item" v-bind:storage-key="item" >
            {{item}}
        </div>
</div>

const exposure = new Exposure().init({boxClass:".wow"})

// 下拉分页,把新增的Dom节点扔进去
$.get(url).then(data => exposure.addQueue(operateDataToDomFun(data)) );
   
```

这样实现有一个问题,组件必须暴露 addQueue 方法，要是使用方忘了调用这个方法，那数据上报就不完整，而且已经开发了的项目，上这个组件的时候就要在很多地方新增代码，比较麻烦，不利于组件的推广,能不能有一种方式只需要```new Exposure().init({boxClass:".wow"})```,就接入了曝光组件，组件能自己监听 Dom 的变化，这个时候 MutationObserver 要登场了(前面啰嗦了这么多,主角终于出来了)

MutationObserver 接口提供了监视对DOM树所做更改的能力,是DOM3 Event规范的一部分，常见的浏览器,Android4.4以上,IE11 都支持

 当监视的 DOM 发生变动时 MutationObserver 将收到通知并触发事先设定好的回调函数。

类似于事件，但是异步触发 添加监视时，MutationObserver 上的 observer 函数与 addEventListener 有相似之处，但不同于addEventListener的同步触发(比方 click 点击一次调用一次)，MutationObserver 是异步触发，意思是等整个列表 Dom 不改变后，才会调用 callback ，不会造成浏览器卡顿

画重点 ,监听Dom树更改，还是异步的，实在太适合我需要的这种场景,在组件里监听 boxClass Dom元素改变就好了

简单来个 MutationObserver 例子
```
var observer = new MutationObserver(function (doms, observer) {
console.log(doms); // 这里就能把新增的 dom 节点放入队列中了
});
var boxs = document.querySelector('.wow');
var  options = {
  'childList': true, // observe有很多参数，主要定义监听dom元素改变的维度和颗粒度
  'attributes':true
} ;
observer.observe(boxs, options);
```

网上 MutationObserver 具体的 API 介绍挺多的，不细讲；但具体的应用场景没发现一个，埋点曝光的场景用 MutationObserver 是相当的舒服

用上 MutationObserver 后 ，这个曝光组件一点都没有侵入业务代码，推广起来，信心大了不少

在整个组件开发的过程还有些其他知识点

如何判断一个元素是否在屏幕内？
```
// 需要考虑到 display:none; visibility, 滚动高度
isVisible(box) {

    // 我这个代码比较low
    var style = box.style;
    if ((box.offsetWidth <= 0 && box.offsetHeight <= 0) || box.hidden || ((style.opacity.length > 0) && (style.opacity < 1)) || style.display == 'none' || ['collapse', 'hidden'].indexOf(style.visibility) > -1) {
      return false;
    }
    var coverHeight = 0;
    if(this.config.coverClass){
      var coverELe = document.querySelector(this.config.coverClass);
      if(coverELe){coverHeight = coverELe.offsetHeight}
    }
    
    var bottom, offset, top, viewBottom, viewTop;
    offset = this.config.offset + coverHeight;
    viewTop = (this.config.scrollContainer && this.config.scrollContainer.scrollTop) || window.pageYOffset; // 滚动过的高度
    viewBottom = viewTop + Math.min(this.element.clientHeight, this.util().innerHeight()) - offset; //滚动过的高度 + 屏幕高度
    top = this.offsetTop(box); // 元素顶部距离
    bottom = top + box.clientHeight; // bottom 距离
    // 下面这个判断是考虑了 某个元素只有一部分在屏幕中
    return top <= viewBottom && bottom >= viewTop;  //  元素顶部高度 <=  滚动过的高度 + 屏幕高度  &&  元素底部高度  >= 滚动过的高度
  };
```
scroll太频繁，IOS下scroll 事件 停止才触发

scroll太频繁 我用了 函数 防抖，IOS 下 我用的是 setInterval ,短时间内判断

```javascript
 this.debounce(() => {
      this.operateData();
    }, 250)();
  debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this, args = arguments;
      var later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };
```

MutationObserver callback 怎么把当前 Exposure 的this传进去

```javascript
var observer = new MutationObserver(function (_this, observer) {
   // 通过，_this Exposure 对象就可以获取到了，谁再说闭包没用，我加打他 

   return function(doms){
      // 这里就可以拿到 改变后的 Dom 元素
   }
}.call(this));
```


  [1]: http://static.zybuluo.com/hucheng91/0mioqgan6lso6v8bij6dtsxt/expose_sdk.gif