var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let obj = {id:"123",name:" 我是王二麻子"};
  let fn = req.query.callback ? req.query.callback : "callback";
  console.log(fn + '('+ JSON.stringify(obj) + ');');
  res.send(fn + '('+ JSON.stringify(obj) + ');');
    
});
router.get('/user', function(req, res, next) {
  let obj = {};
	let id = req.query.id;
  let fn = req.query.callback ? req.query.callback : "callback";
  res.send(fn + '('+ JSON.stringify(id) + ');');
    
});

module.exports = router;
