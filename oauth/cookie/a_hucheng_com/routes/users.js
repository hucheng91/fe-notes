var express = require('express');
var router = express.Router();
const usersHah = {};
/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/login', async (req, res, next) => {
  usersHah[req.body.userName] =req.body.userName.userName;
  //res.cookie("sessionId", "1234", { domain: "*", expires: new Date(), maxAge: new Date(), httpOnly: true });
  /** name value 这个2个属性是必须得 */
  // res.cookie("sessionId", req.body.userName);


  /**  maxAge 过期时间设置 ,单位是 毫秒 */
  // res.cookie("sessionId", req.body.userName,{maxAge: -1});


  /**  httpOnly,设置了这个就不能通过js 里的 document.cookie 获取到了  */
   //res.cookie("sessionId", req.body.userName,{httpOnly: true});

  /** domain*/
  //res.cookie("sessionId", req.body.userName);
  res.cookie("sessionId", req.body.userName,{domain:"hucheng.com"});

  /**SameSite */
  //res.cookie("sessionId", req.body.userName,{sameSite:"Lax"});
  res.send({code:1})
});
module.exports = router;
