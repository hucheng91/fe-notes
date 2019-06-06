

// 第一版
function curry(fn) { 
  if (fn.length === 0) {
    return fn;
  }

  const args = [];

  return nest(fn, 1, args);

  function nest(fn, i, args) {

      return (x) => {

        args.push(x);

        if (i === fn.length) {
          return fn(...args);
        }

        return nest(fn, i + 1, args);

      };
}

}

 const log1 = curry(
  (x) => console.log(x)
);

const log2 = curry(
  (x, y) => console.log(x + y)
);

const log3 = curry(
  (x, y,z,d) => console.log(x + y +z + d)
);

log1(10);
log2(10,20);
log3(10)(20)(30)(40);



// 把参数存储起来，最后一次执行


// 第二版 不限制参数个数

!function(){


function curry(fn){
    
    if(fn.length == 0){
        return fn;
    }
    
    var args  = [].slice.call(arguments,1)// 存储参数
    var index = args.length // 统计参数传入个数，最后一次时 执行 fn；在curry 过程中 初始化可能已经传入值进来，下标存储起来

    return nest();
    function nest(){
        
        return  (...x) => {
            
            args = [...args,...x];

            index  += x.length ;

            if(index == fn.length) {
               
                return fn(...args);
            }

            return nest();

           
        }
    }


}

let tt = curry(
  (x, y,z,d) => console.log(x + y +z + d)
)

tt(1)(2,3)(4);
tt(1)(2)(3);
}()












