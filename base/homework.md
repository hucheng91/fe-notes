



# 作业
  
   有一个commAjax方法，是对各种常见 http 提交方式封装 伪代码如下，请对其优化，使得可读性更强


   ```javascript
    function commAjax(methordName,url,data){

        if(methordName == "get"){
            return $.get({methord:methordName,data});
        }
        if(methordName == "post"){
            return $.post({methord:methordName,data});
        }
        if(methordName == "put"){
            return $.put({methord:methordName,data});
        }
        if(methordName == "delete"){
            return $.delete({methord:methordName,data});
        }
    }
   ```
   