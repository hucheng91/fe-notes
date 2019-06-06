
# 函数定义，命令规范


## 定义

 - 声明式, 特点是变量提升
```javascript
 function test(){
            console.log("test: 声明式");
 }
```
 - 表达式
```javascript
        var test = function(){
            console.log("test:表达式");
        } 
```
- 二者之间的差别，申明式 变量提升，表达式不会 eg：
```javascript
        sayName1();  // 我是王五
        function sayName1(){
            console.log(" 我是王五");
        }

        sayName2();  // error
        var sayName2 = function(){
            console.log(" 我是赵六");
        }
```
- 2种声明方式特点在具体业务中的用处
   
         // 声明式特点，我们可以把代码抽成很多个function 放在尾部，这样一看function 就知道是做什么的 eg：

```javascript
 
    function initPage(){
        var param = {};
        var userName = $("#useName").val();
        var phoneNum = $("#phoneNum").val();
        param.userName = userName;
        param.phoneNum = phoneNum;
        $("input",".condition_detail").each(function(index,item){
            var attrName = $(this).attr("name");
            var array = [];
            array.push($(this).val());
            param[attrName] = array;
        })
        $.post("select",param,function(data){
            console.log(data);
        });
    }
```

    /** 上面这段代码 意思是根据 页面参数 查询数据，但看着这些代码上面很大一部分是组装ajax的查询参数，一看到initPage这个方法不能直观的明白这个function 的语义 ，变换成下面这样后，把组装 ajax 参数拆成一个 getParam 的 function ，
                getParam funciton 利用 声明式函数 变量提升的特性 放在调用的之后，这样 initPage 方法就很清晰明白，
                */
```javascript

    function initPage(){
        var param = getParam();
        $.post("select",param,function(data){
            console.log(data);
        });
        function getParam(){
            var param = {};
            var userName = $("#useName").val();
            var phoneNum = $("#phoneNum").val();
            param.userName = userName;
            param.phoneNum = phoneNum;
            $("input",".condition_detail").each(function(index,item){
            var attrName = $(this).attr("name");
            var array = [];
            array.push($(this).val());
            param[attrName] = array;
            })
           
            return param;
        }
    }

```
 表达式,一般用在对象的方法上，在函数调用 章节讲



## 命令规范

通常已动词为前缀，第一个字母小写，一般用like_this(),这种下划线或者驼峰命名，函数内部函数一般用_开头
```javascript
    function get_usename(){}
    function getUseName(){}

    function getUserName(){
    _test();
    function _test(){}
    }  
                
```                



