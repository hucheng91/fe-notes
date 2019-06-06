

// call
var person1 = {firstName: '王五', lastName: '赵六'};
var person2 = {firstName: '王二麻子', lastName: '李四'};


var dog  = {
    say: function() {

       // console.log(greeting + ' ' + this.firstName + ' ' + this.lastName);
    }
}

method.call(a,param);
dog.say.call(person1, 'Hello'); // Hello 王五 赵六
dog.say.call(person2, 'Hello'); // Hello 王二麻子 李四


// apply

var person1 = {firstName: '王五', lastName: '赵六'};
var person2 = {firstName: '王二麻子', lastName: '李四'};

var dog  = {
    say: function(greeting) {
        console.log(greeting + ' ' + this.firstName + ' ' + this.lastName);
    }
}

dog.say.apply(person1, ['Hello']); // Hello 王五 赵六
dog.apply(person2, ['Hello']); // Hello 王二麻子 李四



// bind

var person1 = {firstName: '王五', lastName: '赵六'};
var person2 = {firstName: '王二麻子', lastName: '李四'};

var dog  = {
    say: function(greeting) {
        console.log(greeting + ' ' + this.firstName + ' ' + this.lastName);
    }
}

var sayHelloJon = dog.say.bind(person1);
var sayHelloKelly = dog.say.bind(person2);

sayHelloJon(); // Hello 王五 赵六
sayHelloKelly(); // Hello 王二麻子 李四
var a  = {
    sum: 0,
    a: function(date){
        $.post("url",{date: ""},function(data){
            a.sum = a.sum + data;
            $.post("url",{date: ""},function(data){})
        });


        $.post("url",{date: ""},function(data){})
        $.post("url",{date: ""},function(data){})
        $.post("url",{date: ""},function(data){})
    }
}


// apply 和 call 使用的使用的地方
var a = $.get("/assets/mock.json")
var b = $.get("/assets/mock.json")
$.when(a,b).done(function(data1,data2){
    console.table(data1,data2);
});
var a = $.get
var id = "XDFREGK";
var displayCreateTime  = new Date();
var  array = createAjax(id,displayCreateTime,"apiSearchMassEmailStatisticsOpen");
$.when(a,b,c);
$.when.apply(null,array)
$.when.apply(null,array).done(function () {
    var dataArray = Array.prototype.slice.call(arguments);
    var openedData = meargeData(dataArray,"openNum");
    console.log(openedData);
});


function createAjax(id,filed,url){
    var promiseArray = [];
    var day = getDays(displayCreateTime);
    if(day == 0){
        promiseArray.push(createPromise(id));
        return promiseArray;
    }
    if(day > 7){
        day = 7; // 最多7天
    }

    for(var i=0;i< day; i++){
        promiseArray.push(createPromise(i));
    }
    return promiseArray;

    function createDate(day,addDay){
        var b = new Date(day);
        return  b.getFullYear() + "-" + (b.getMonth()+1 ) + "-" + (b.getDate() + addDay);
    }
    function createPromise(i) {
        return $.post(url,{post_data: JSON.stringify({emailSendId:id,theDate:createDate(displayCreateTime,i),independentFlag:false})})
    }
}

/**
 * 合并数据
 * @param array
 * @param field
 * @returns {any}
 */
function meargeData(array,field){
    try {
        JSON.parse(JSON.stringify(array[0][0].returnData.datas));
    }catch (e) {
        var dataArray = [];
        dataArray[0] = array;
        array = dataArray;
    }

    var base = JSON.parse(JSON.stringify(array.pop()[0].returnData.datas));
    $.each(array,function (index,item) {
        var data = item[0].returnData.datas;
        $.each(base,function(index1,item1){
            item1[field]  = parseInt(item1[field],10) + parseInt(data[index1][field],10)
        });

    });
    return base;
}
/**
 * 将生产日和当前时间做比较
 * @param date1
 * @returns {number}
 */
function getDays(date1){
    var date1Str = date1.split(" ")[0].split("-");
    //根据年 . 月 . 日的值创建Date对象
    var date1Obj = new Date(date1Str[0],(date1Str[1]-1),date1Str[2]);
    var date2Obj = new Date();
    var t1 = date1Obj.getTime();
    var t2 = date2Obj.getTime();
    var dateTime = 1000*60*60*24;
    var minusDays = Math.floor(((t2-t1)/dateTime));
    var days = Math.abs(minusDays);//取绝对值
    return days;
}













