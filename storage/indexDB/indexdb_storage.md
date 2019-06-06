

# indexDB 存储

IndexDB的出现 是为了存储更大量的结构化数据


## 简介
IndexedDB是一个事务型数据库系统，类似于基于SQL的RDBMS。 然而不同的是它使用固定列表（只有 key，value），IndexedDB是一个基于JavaScript的面向对象的数据库。
IndexedDB允许您存储和检索用键索引的对象; 可以存储structured clone algorithm支持的任何对象。
您只需要指定数据库模式，打开与数据库的连接，然后检索和更新一系列事务中的数据。


IndexedDB 是非关系型数据库


## IndexDB 和 WebSql的差别
WebSql 是关系型数据库， 前端需要写sql ，目前 WebSql已经浏览器基本已经放弃




## 基本使用
1.打开数据库并且开始一个事务。
2.创建一个 object store。
3.构建一个请求来执行一些数据库操作，像增加或提取数据等。
4.通过监听正确类型的 DOM 事件以等待操作完成。
5.在操作结果上进行一些操作（可以在 request 对象中找到）


```


var dbName = "the_name";
var db ;

// 连接数据库，没有就创建数据库
var request = indexedDB.open(dbName, 2);

request.onsuccess = function(event){

    db = request.result;
}
// 错误处理程序在这里。
request.onerror = function(event) {
    console.log(event);
};
request.onupgradeneeded = function(event) {

  db = event.target.result;
  // 创建一个对象存储空间来, 自增主键
  var objectStore = db.createObjectStore("customers");
};


// 添加数据
var customerData = [
  { id:"1", name: "Bill", age: 35, email: "bill@company.com" },
  {  id:"2", name: "Donna", age: 32, email: "donna@home.org" }
];

var transaction = db.transaction(dbName, "readwrite");
// 打开存储对象
var objectStore = transaction.objectStore('customers');
// 添加到数据对象中

customerData.forEach(function(item){
    objectStore.put(item,item.id);
});

// 查询
db.transaction("customers").objectStore("customers").get("1").onsuccess = function(event) {
  console.log(event.target.result.name);
};
```

## 存储大小  50MB 左右

## 应用场景

 - 跨 Tab 通信
 - 存储二进制 文件
 -



