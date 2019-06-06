const babel = require('babel-core')
const babelPlugin = require("../plugins/frist-simple");
const input = `foo === bar;`
const { code } = babel.transform(input, {
  plugins: [babelPlugin]
})

console.log(input)
console.log('⇣⇣⇣')
console.log(code)
