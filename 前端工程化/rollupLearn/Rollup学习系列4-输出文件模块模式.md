# Rollup学习系列3-输出文件模块模式

[Rollup学习系列1-tree-sharking的来源](./Rollup学习系列1-tree-sharking的来源)
[Rollup学习系列2-什么样的代码容易tree-sharking](./Rollup学习系列2-什么样的代码容易tree-sharking.md)


Rollup 的打包配置文件非常少,常见的打包后的文件模块模式，Rollup都支持，列举下
- esm  es6 模式
- iife(Immediately-invoked function expression ) 立即调用模式
- AMD
- CommonJS
- UMD

 如果你对这个几个模式比较模糊，建议自己亲手打包下,看看代码，或者看下我打包后的例子
 https://github.com/hucheng91/rollupLean-demo/tree/master/quick-start/lib
 这里我简单 说下 iife 模式，这个是直接返回一个可以执行的函数块，举个例子
 ```
 // src/index.js
 export function test1(){
    console.log('test1');
}
// 经过 iife模式编译后
var Demo = (function (exports) {
    'use strict';

    function test1() {
      console.log('test1');
    }

    exports.test1 = test1;

    return exports;

}({}));

 ```
 这种方式非常适合浏览器直接引入的场合
 那有的人可能会讲 要支持这些模式，是不是配置会很麻烦,其实没有，非常简单，参照下我的配置
 ```
 import babel from 'rollup-plugin-babel';
import common from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'

export default {
  input: 'src/index.js',
  output: [
    {
      file: 'lib/index.js',
      name:"Demo",
      format: 'iife' // iife 表示立即执行函数
    },
    {
      format: 'esm',
      file: 'lib/index.esm.js',
    },
    {
      file: 'lib/index.umd.js',
      name:"Demo",
      format: 'umd' 
    },
    {
      file: 'lib/index.amd.js',
      name:"Demo",
      format: 'amd' 
    },
    {
      file: 'lib/index.cjs.js',
      name:"Demo",
      format: 'cjs' 
    },
  ],
  plugins: [
    resolve(), 
    babel(), 
    common()
  ]
}
 ``` 
 就上面这几行配置 就能完全支持 这几个模式，试试有着想上手试试的冲动，
 其他怎么装依赖，怎么配置热更新，配置开发者模式，我这就不细讲，可以直接看我的Demo
 https://github.com/hucheng91/rollupLean-demo/tree/master/quick-start

 

