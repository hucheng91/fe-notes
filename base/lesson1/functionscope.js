// 函数作用域的问题



// javascript 变量的定义,没有用 var 声明的都是 全局变量
//var a = 1;

function test1(){
    var  b = 2 ;
  //  console.log(a);
}
test1();
console.log(b);

function test2(){
    console.log(a);
}
var test3 = function(){
    c = 3;
}
function test4(){
    console.log(c);
}
//test3();
test4();
//test1();
test2();
console.log(b);
console.log(c);
// javascipt 特点 定义在函数内部的 局部变量 外部是不能访问的
// 变量的作用域，作用域链
var a = 2;
function foo() {
    var a = 3;
    console.log( a );
}
foo(); //
console.log( a ); // 2




// 执行环境，是JavaScript中最重要的的一个概念，执行环境定义了变量或者函数 
//有权访问其他数据，每个执行环境都有
// 与之关联的 变量对象（关键字，划重点） ，
//函数中定义的所用变量和函数都保存在这个对象中，虽然我写代码的过程中，无法访问这个对象
// 但解析器在处理数据的时候会在后台使用它

// 每一个函数都有自己的的执行环境（关键字，划重点），
//代码运行进入这个函数的时候，函数的环境压进环境栈，执行完毕后，
//栈将环境弹出，把控制权返回给之前执行环境

// 全局执行环境是最外围的执行环境 
//，web浏览器中，全局执行环境被认为是window对象（这也是为啥我们在任何地方都能访问到 window，location，）
// 某个执行环境的所有代码执行完毕后，该环境销毁，
//保存在其中所用变量和函数定义随着销毁
//（提个问题： 全局执行环境 例如window 对象是什么时候销毁）


//

var color = "blue";

function changeColor(){

    var anotherColor = "red";

    function swapColors() {
        var tempColor = anotherColor;
        anotherColor = color;
       // window;
        var href = window.location;
        color = tempColor;  // 这里可以访问color、anotherColor和tempColor
    }
    swapColors();  // 这里可以访问color和anotherColor，但不能访问tempColor
}

changeColor();   // 这里只能访问color

// function test1(){
//     var a = 1;
//     return function() {

//     }
// }
// var test2 = test()();






// JavaScript 没有块级作用域 ,块级作用域： 
//由 { } 大括号扩起来的代码，里面声明的 变量外部是be不能访问的。

var isGo = true;
function tett(){

}
if(isGo){
    var color = "blue";
}
console.log(color);

function test1(){
    console.log(a);
}
function test2(){
    var a = 1;
    test1();
    //console.log(a);
}

test2();

    






