


// callback 使用,以下是常见的和一个ajax ，
//我们的success 就是一个回调
callbackLearn();
function callbackLearn(){

    //ajax success 回调是一种常见的 callback 使用方法 
    var user =   $.get("/assets/mock.json",{},function (data) {
        var user = data;
        return user;
    });
    var user1 =   $.get("/assets/mock.json",{},function (data) {
        var user = data;
        return user;
    });
    $.when(user,user1).done(function(data1,data2){

    });
    console.log(user1.id);
    setTimeout
    setInterval

   


    // forEach 使用回调函数
    var array = [1,2,3,4];
    array.forEach(function(item){
        console.log(item);
    })


    function myForEach(array,callback){
        for (var i in array){
            callback(array[i]);
        }
    }

   var user =  myForEach([1,2,3,4],function (item) {
        console.log(item);
    });
     console.log(user);


}



  // callback 定义，1 用匿名函数,2 表达式 使用 ，本质上可以对比 java 的AOP
function test(callback){
    var user  = {id:"123",name:"rt"};
    callback(user);
}
test(function(data){
    console.log(data);
});

var callback2 = function(data){
    console.log(data);
};
test(callback2);



// 应用场景1: 常见项目我们都会有很多的弹出框 alert，confirm框，
//思考下我们是不是可以统一起来，这样就可以很好的统一页面的样式
//比方某个项目一个公共的弹出框
function commDialog(option) {
    // {
    //     type: "success",
    //     title: "成功提示",
    //     text: "这里显示点啥好",
    //     aa: function (data) {
    //             $.post("/user/delete")
    //        // alert("成功弹出框");  // 一般这里写 关闭，确认后的回调事件
    //     }
    // }
    var operate = {
        "success": function (param){
            param["aa"](value);
            swal({
                title: param.title,
                text: param.text,
                icon: "success",
            }).then((value) => {
            
            });

        },
        "error": function(param){
            swal({
                title: param.title,
                text: param.text,
                icon: "error",
            }).then((value) => {
                option.callback(value)
            });
        },
        "warning": function(param){
            swal({
                title: param.title,
                text: param.text,
                icon: "warning",
                buttons: {
                    cancel: true,
                    confirm: true,
                },
            }).then((value) => {
                option.callback(value);
            });
        }
    };

    operate[option.type](option);


}

$(function(){

    $("#alert_btn").bind("click",function () {
        debugger;
        var test = {
            type: "success",
            title: "成功提示",
            text: "这里显示点啥好",
            aa: function (data) {
                    $.post("/user/delete")
               // alert("成功弹出框");  // 一般这里写 关闭，确认后的回调事件
            }
        }
        commDialog(test);
    });
var test = {
    userName:1,
    b: 2,
    c: function(){console.log("c")}
}
test.c()
test["c"]();

    $("#warning_btn").bind("click",function () {
        commDialog({
            type: "warning",
            title: "。。。。",
            text: "这里显示点啥好",
            callback: function (data) {
                alert("warning弹出框");  // 一般这里写 关闭，确认后的回调事件
            }
        });
    });

});

 //callback 和异步的差别
 // callback 不是异步 ，只是常常和异步出现在一起，callback 只是一种类似java aop 的写法，在执行 某些代码块之前 或者之后 干的一些事 ，独立在代码块之外

// 异步 javascript 在浏览器环境 主要有 ajax ,setTimeout,setInterval

function test(c1,c2){
    c1();
    console.log(1)
    c2();
}
function test(){
    var tt = 1;
    var user =   $.get("/assets/mock.json",function(data){
        console.log("再走这里么？");
        console.log(data);
        console.log(tt);
        return data;
    });
    console.log("先走这里么？");
    console.log(user);
}

function test2(cllback){
    var a = 1;
    callback(a);
    console.log("先走这？");
}
test2(function (data) {
    console.log("再走这？");
});


// 为了解决 callback 回调，以及 异步的时候 参数值丢失问题 出现了promise(); promise 讲解（https://javascript.ruanyifeng.com/advanced/promise.html）

// callback 回调存在的问题 当回调非常多以后，
//代码可读性，可维护性 特别差，这种情况叫做回调地狱
var a = 1;
function test1(callback){
    console.log(a);
    callback();
}
var c1 = functon() {

}
var a = function(data,c1){
    console.log(data);

    c1(data);
    
}
test1();

// 为了解决回调地狱问题 出现了 promise，

function promiseMethod(){
    // 传统写法
    step1(function (value1) {
        step2(value1, function(value2) {
            step3(value2, function(value3) {
                step4(value3, function(value4) {
                    // ...
                });
            });
        });
    });

// Promise 的写法
    (new Promise(step1))
        .then(step2)
        .then(step3)
        .then(step4);
    var a = 1;
    $.get("/assets/mock.json").then(function (data) {
        console.log(a);
        console.log(data);
    });

}




// var goAjax = function (data){
//     $.post("/user/add",data);
// };
// function test(){}
// initUserUi(goAjax);

//

