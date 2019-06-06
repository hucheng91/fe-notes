
// 匿名函数 立即执行函数
// 用处： 保护某些
function ges(){}
var t = function(){}
var a = {
    b: function(){

    }
}
ges();

(function tet(){console.log("执行1把");}());
//();

(function(){console.log("执行2把");})();

!function(){console.log("执行3把");}();
+function(){console.log("执行4把");}();
~function(){console.log("执行4把");}();
-function(){console.log("执行4把");}();



// 通过立即执行函数 来存储 某些变量，模拟块级作用域(一般框架都喜欢用这个种方式)

var a = (function (a) {
    var a = 3;
    console.log(a);

})(10);
console.log(a);


// 立即执行函数 相当于 var a = function(){console.log(1)} ;a();



// 闭包
// 定义： 一个函数记得 它周围发生的事 


var a = 1;
function test1(){
    var b = 2;
    return function(){
        b= b +1;
        console.log(b);
    }
}
var tt = test1;
console.log(tt.b);
var cc = tt(); // b =3
var mm = cc();
cc(); // b =4
cc(); // b =5
cc = null;
cc = tt();
cc();
cc();
test1()();
test1()();
var b = 2;
function test2(){
  b = b+1;
  console.log(b);
}
test2();
test2();

//以上代码，我们对应着函数的作用域一起来看

// 闭包的好处

// 1 保存变量,私有化变量，使得变量不被污染，如上



// 2 模块模式

var singleton =  function () {

    var obj = {count:0};
    var count = 0;
    return   function  privateFunc() {
      obj.count ++ ;
      count ++ ;
      console.log(JSON.stringify({ obj: obj,count: count}));
        return { obj: obj,count: count};
    }
}
var result = singleton()();

test1()();
 function test1(){
     var a = 1; 
 }
 console.log(1);  // error

 function closure1(){}


 // 所有高阶函数 都需要用到 闭包

 // reduce


  // 函数防抖, 函数节流

  function throttle(method, context) {
    clearTimeout(methor.tId);
    method.tId = setTimeout(function(){
        method.call(context);
    }, 100);
  }
 

 // 高级函数

 // compose

 var compose = function(f,g,m) {
    return function(x) {
      return f(g(m(x)));
    };
  };

  const add = x => x+1;
  const mul = x => x*3;
  const div = x => x/2;
  const ttt = x => x%10;

  // 正常写法
  function operate(){
    var v1 = div(x);
    var v2 = mul(v2);
    var v3 = add(v2);
    var v4 = add(v3);
  
    return v4;
  }
  // compose 合并函数
  const operate = compose(div,mul,add,ttt);
  operate(2);

 //  map reduce

 // 柯里化
 

  var array = [];


  // compose 使得代码看起来是从左往右走，常见的写法 是让代码从上往下走，



  var a = [1,2,3,4];
  console.log(a.slice(0,1));
  console.log(a.slice(1));
  console.log(a.slice(1).slice(1));
  console.log(a.slice(1).slice(1).slice(1));
  let compose = (...fns) => x => {
    if(fns.length>0){
      if(fns.length==1){
        return fns[0](x);
      }
      return fns.slice(0,1)[0](compose(...fns.slice(1))(x));
    }
  }

  let compose = (option) => x => {
    var fns = Array.prototype.slice.call(arguments);
    if(fns.length>0){
      if(fns.length==1){
        return fns[0](x);
      }
      return fns.slice(0,1)[0](compose(fns.slice(1))(x));
    }
  }



// 参考资料；
 // https://llh911001.gitbooks.io/mostly-adequate-guide-chinese/content/ch3.html#%E8%BF%BD%E6%B1%82%E2%80%9C%E7%BA%AF%E2%80%9D%E7%9A%84%E7%90%86%E7%94%B1





