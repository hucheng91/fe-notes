var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/login',async (req, res, next) => {
  res.cookie("hc_test", "1234",{domain:"*",expires:new Date(),httpOnly:true,maxAge: new Date(),httpOnly: true} );
   res.send('success');
});
module.exports = router;
