
function ajax() {
    console.log(13);
}
function ajax2() {
    console.log(56);
}
function addFruit(param){
    console.log(param);
}
export {
    ajax,
    ajax2,
    addFruit
}
// 测试class,失败，会把2个方法都打进去
export class ClassExport{

    test1(){
        console.log('test1');
    }
    test2(){
        console.log('test2');
    }
}


