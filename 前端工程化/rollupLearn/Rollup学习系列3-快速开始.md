# Rollup学习系列3-输出文件模块模式

[Rollup学习系列1-tree-sharking的来源](./Rollup学习系列1-tree-sharking的来源)
[Rollup学习系列2-什么样的代码容易tree-sharking](./Rollup学习系列2-什么样的代码容易tree-sharking.md)

这篇手把手讲下怎么开始一个 Rollup 项目(咦,感觉有些多余了，想想还是写下吧)

## 开始装依赖
```
下面4个插件 是最常用的插件，具体作用在后面讲
npm i rollup --save-dev
npm i rollup-plugin-babel --save-dev 
npm i rollup-plugin-commonjs --save-dev
npm i rollup-plugin-node-resolve --save-dev
npm i rollup-plugin-serve --save-dev
```

## 准备项目的目录结构
```
├── build # 编译脚本
│   └── rollup.config.js
    └── dev.js // 开发者模式
├── lib # 编译结果
│   └── index.js
├── example # HTML引用例子
│   └── index.html
└── src # ES6源码
    └── index.js
├── package.json

```

## 打包脚本
```
// package.json
 "scripts": {
    "dev":"rollup  --config build/dev.js --watch",
    "build": "npm run rollup",
    "rollup": "rollup --config build/rollup.config.js",
  },
```
# rollup.confing.js
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
// dev.js

import serve from 'rollup-plugin-serve'
import baseConfig from './rollup.config'

const config = baseConfig;
config.plugins.concat([
    serve({
      open: true,
      port: 3001,
      contentBase: ['example', 'lib']  // 设置 exmaple的访问目录和dist的访问目录
    })
]);
export default config
```

好，这样简单的配置就可以干活了，是不是很简单啊，反正我是很喜欢这种简约的配置，特别在写 公共的 SDK,非常舒服

感觉这篇好水哦，哈哈，可能刚摸得人会用得上

