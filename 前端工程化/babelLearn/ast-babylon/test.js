
const babylon = require("babylon");

let code = `function sum(a,b){
    return a + b;
}`

console.log(babylon.parse(code));