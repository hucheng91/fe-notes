
# sessionStorage ,localStorage 存储



## 定义
sessionStorage ,localStorage  浏览器提供的api，
可以在当前域名下存储信息，只能存储 string



## 生命周期

sessionStorage 是关闭当前 tab页 就清楚了，localStorage 一直都在，关闭浏览器也会存在




## 语法

 存储

 sessionStorage.setItem(key,value);

```
 sessionStorage.setItem("userName","王五");
```

 获取

  var result = sessionStorage.getItem(key);

 清除
 sessionStorage.clear();


## 存储大小 5Mb 左右

 测试 当前浏览器存储大小  http://dev-test.nemikor.com/web-storage/support-test/

## 注意点

存储的时候 value 要是 string ，不要用数组 或者 对象

```
数组
// 错误处理方式
sessionStorage.setItem("a",[1,2,3,4,5])
sessionStorage.getItem("a")   // "1,2,3,4,5"  这样处理的话，返回成了一个 string，得自己在转换成 数组

// 正确处理方式
sessionStorage.setItem("a",JSON.stringify([1,2,3,4,5]))
JSON.parse(sessionStorage.getItem("a") )  // [1,2,3,4];


对象
// 错误处理方式
sessionStorage.setItem("a",{id:"134",name:"33"})
sessionStorage.getItem("a")  //  "[object Object]"  ,返回的这种数据都没得办法处理


// 正确处理方式
sessionStorage.setItem("a",JSON.stringify({id:"134",name:"33"}))
JSON.parse(sessionStorage.getItem("a") ); //  {id:"134",name:"33"}




## 常见使用方式

sessionStorage 可以存储些用户信息，在浏览器关闭前不怎么改变的 比方下拉框

```

getSelectData("userType",function(data){

  console.log(data);

});


 function  getSelectData(key,callback){

     var storeMap = {};

     var key_url = {
     "user": 'api/user',
     "orderStatus":'api/order/status',
     "userType": "api/user/type"

     }

     var result = getStore(key);
     if(result){
        callback(result);
        return ;
     }

     $.get(key_url[key],).done(function(data){
        setStore(key,data);
        callback(data);
     });

     function setStore(key,value){
            sessionStorage.setItem(key,JSON.stringify(value))
     }

     function getStore(key){
        var result = sessionStorage.getItem(key);
        if(!result){
            return null;
        }
        return JSON.parse(result)
     }

 }
```




