
const babelParser = require("@babel/parser");

let code = `function sum(a,b){
    return a + b;
}`

console.log(babelParser.parse(code));