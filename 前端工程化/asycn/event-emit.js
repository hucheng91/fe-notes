
const fs = require("fs")
const path = require("path");
function EventEmiter(){

    this.array = []; // 中介者,
}

EventEmiter.prototype.on = function(callback){
    this.array.push(callback);
}

EventEmiter.prototype.emit = function(value){
    this.array.forEach(fn =>fn(value))
}

let ev = new EventEmiter();
ev.on(data => {
    console.log(data);
})
fs.readFile(path.join("name.txt"),"utf8",(error,data)=>{
    console.log(error)
    ev.emit(data);
})

