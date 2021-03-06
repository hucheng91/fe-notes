# function 常见使用方式

## 作为 函数(最常用)
```javascript

    function test(){}
```
##  作为对象方法 
```javascript
    var  basePanel = {
        init: function(){ 
            console.log(basePanel.userName)
        },
        userName:"ni hao",
        getUseName: function(){
             return basePanel.userName;
            }
    };
    basePanel.init();
    basePanel["init"]();    // 这种方式也是可以的 
    常见获取对象属性  
    var  myObject = {userName: "王五"} ;
    console.log(myObject.userName) ; 
    console.log(myObject["userName"])
```
##  使用场景
当一个方法 有可能会有很多状态的时候，每个状态对应不同的行为，可以把各种状态抽象成一个对象，每个状态是对象的一个属性，属性的值是一个 function，这个function 就是描述某个状态下的动作;
![functionOftenUseExampl1.png-218.3kB][1]
切换到发送成功tab
![functionOftenUseExample2.png-120.5kB][2]
看目录下的 图片 functionOftenUseExample1.png ，这个列表 tab 点击可以查询 all，成功，打开等状态的列表，没状态下，table长的是不一样的，这样在不同的状态下，就需要绘制样式不同的table

```javascript  
      $("#selectAll").onClick(function(){
           var html =  doWhatByStatus("all");
           $("#container").append(html);
        });
        $("#selectSuccess").onClick(function(){
            var html =  doWhatByStatus("succeed");
            $("#container").append(html);
         });
        function doWhatByStatus(type){
            var doWhat = {
                    all: function(e) {
                        return [DOM.span({
                            "class": "madi_item"
                        }, e.receiverEmail), DOM.span({
                            "class": "madi_item"
                        }, [DOM.a({
                            href: "?cmd=pageMdfContact&ID=" + e.cttId,
                            traget: "_blank",
                            "class": "madi_link"
                        }, e.receiverName)]), o(e), DOM.span({
                            "class": "madi_item"
                        }, e.displaySendTime)]
                    },
                    succeed: function(e) {
                        return [DOM.span({
                            "class": "madi_item"
                        }, e.receiverEmail), DOM.span({
                            "class": "madi_item"
                        }, [DOM.a({
                            href: "?cmd=pageMdfContact&ID=" + e.cttId,
                            traget: "_blank",
                            "class": "madi_link"
                        }, e.receiverName)]), DOM.span({
                            "class": "madi_item"
                        }, function() {
                            return "2" === e.openFlag ? "已打开" : "未打开"
                        }()), DOM.span({
                            "class": "madi_item"
                        }, e.displaySendTime)]
                    },
                    click: function(e) {
                        return [DOM.span({
                            "class": "madi_item"
                        }, e.receiverEmail), DOM.span({
                            "class": "madi_item"
                        }, [DOM.a({
                            href: "?cmd=pageMdfContact&ID=" + e.cttId,
                            traget: "_blank",
                            "class": "madi_link"
                        }, e.receiverName)]), DOM.span({
                            "class": "madi_item"
                        }, e.displayClickTime), DOM.span({
                            "class": "madi_item"
                        }, e.displayOpenTime)]
                    },
                }
        return  doWhat[type]();
        } 
  
```
## 方法链式调用

```javascript 
    function   chainF(){
        var $dom = {
            width:0,
            height:0,
            background:"#fff",
            value:"",
            setWidth: function(width){ 
                this.width = width; 
                console.log("宽度："+this.width);
                return this
            },
            addWidth:function(addWidthLength){
                console.log("增加前宽度："+this.width);
                 this.width = this.width + addWidthLength;
                 console.log("增加后宽度："+this.width);
                 return this;
                 },
            setHeight: function(height){ 
                this.height = height; 
                console.log("高度："+this.width);
                return this
            },
            setValue: function(value){ 
                this.value = value; 
                console.log("$dom值为："+this.width);
                return this
            },
        }
        $dom.setWidth(10).setHeight(20).setValue(123).addWidth(10);
        
    }
```

## 作为构造函数，方法名大写
```javascript 
function People(name){
    this.name = name;
}    
var people = new People("王二麻子");
console.log(people.name);

```




f(x) = x













        


  [1]: http://static.zybuluo.com/hucheng91/ha9gmiiwbga4x16fgaten1da/functionOftenUseExampl1.png
  [2]: http://static.zybuluo.com/hucheng91/mjhsasl636d2hsutyfxm2y31/functionOftenUseExample2.png