// 函数参数

/**
 *    对传入的数据进行HTML的生成
 *    @param    describe 详细日志的内容 / 为空的时候(false)就会不执行HTML的生成
 *    @param    name 操作人的姓名
 *    @param    time 操作执行的时间
 *    @param    type 日志的类型
 *    @return    一段HTML的代码
 *    @author hugo
 *    @2015 - 12 - 12 update
 */

 // 1.不知道哪个是那个
 //2， createHistoryHTML(1,2,3); 实际参数 不确定
 //3,createHistoryHTML('','','','',gg)
 createHistoryHTML2({
    describe:"123",
    name: "",
    time: new Date()
 });
 $.dialog({
    title: "",
    html:"",
    success: function(){
        
    }
});
var a = {a:1,b:function(){}};
console.log(a);
console.log(a.b);
a["cc"];
a.cc;
  /**
   * 
   * @option
   **/
 function commonDialog(option){
   var title = option.tilte;
   var html = option.html;
   var successFunc = option.successFunc;
   var cancelFunc = option.cancelFunc;
   $.dialog({
    title: title,
    html:html,
    success: function(data){
        successFunc(data);
    },
    cancel:function(){
        cancelFunc();
    }
});

  

 }
 function createHistoryHTML2(obtion){
    var describe = option.describe;
    var name = option.name;
    var time =option.time;
 }
function createHistoryHTML(describe, name, time, type, id, obj, feedbackId, formId, mailId, noteId, otherData,xiaobiao) {
    var formatedTime = {},
        historyBlockHTML = "";
    if (describe || type == 5) {
        describe = MK_ESCAPE.unescape(describe); //.replace(/<br>/g,'').replace(/\n/g,'');
        describe = MK_ESCAPE.tohtmlStr(describe).replace(/&lt;br&gt;/g, '<br>').replace(/&lt;BR&gt;/g, '<br>'); // 字符串的特殊符号转义处理

        var formName,
            generatedCode = "",
            historyType, historyHint, historyImage;
        //获取处理好的时间对象
        formatedTime = mkHistoryDateFormat(time);

        //表单反馈部分
        if (type == "15") {
            historyType = 'history_feedback';
            historyImage = "history_icon_feedback";
            historyHint = "收到了一封反馈";
        }
        //邮件发送部分
         else if(type == 20) {
         historyType  = 'history_mail';
         historyImage = "history_icon_mail";
         var time = formatedTime.shortFormateTime;
        formatedTime.shortFormateTime = "";
         var log = otherData;
         var $a = $("<a target='_blank'  class='feedback_open_email' style='color: #3586C1' ></a>");
         $a.attr("href","?cmd=pageSearchMassEmailStatistics&emailId="+log.emailId+"&case=contanct"+"#"+log.emailSendId);
         $a.html("[预览]");
         historyHint = "发送了一封邮件&nbsp;&nbsp;&nbsp;&nbsp;"+time+"<br><span style='color: #443'>"+describe+"</span>&nbsp;"+$a[0].outerHTML;
       //  if(type == 9) historyHint = "发送了"+describe+"邮件";
        // if(type == 10) historyHint = "发送的邮件已被阅读";
         }
        historyBlockHTML = "<div class=" + historyType + " id=\"history_" + id + "\">" + "<p class=\"week\">" + formatedTime.weekCN + "</p>" + "<p class=\"day\">" + ((formatedTime.dayInMonth < 9) ? ("0" + formatedTime.dayInMonth) : formatedTime.dayInMonth) + "</p>" + "<div class=\"history_text\">" + "<div class='" + historyImage + "'></div>" + "<div style=\"margin-left:20px;line-height:22px;\">" + "<span class=\"name\">" + name + "</span>" + "<span class=\"dowhat\">" + historyHint + "&nbsp;&nbsp;&nbsp;&nbsp;" + formatedTime.shortFormateTime + "</span><br/>";
        $(document).queue('_historyAjax', function () {
            if (type == "10") {
                historyBlockHTML += describe;
            } else if (type == "5") {
                historyBlockHTML += "<div class=\"note_edit_input\">" + describe + "</div>";
                historyBlockHTML += "<span class=\"note_edit\" noteId=\"" + noteId + "\">编辑</span>" + "<span class=\"note_delete\" noteId=\"" + noteId + "\">移除</span>";

                historyBlockHTML += "<div class=\"popwin\" id=\"popwin_noteDelete\">" + "<p class=\"popwin_title\">" + "删除笔记" + "</p>" + "<div class=\"popwin_content\">" + "<img class=\"mgb10\" src=\"/public/img/icon/popwin_eroteme.png\" />" + "<p class=\"popwin_tips\">您确认要删除该条笔记吗？</p>" + "<a class=\"button btn_red popwin_confirm noteDelete_confirm\" onclick=\"TINY.box.hide();\">确认</a>" + "<a class=\"button btn_gray popwin_cancel\" onclick=\"TINY.box.hide();\">取消</a>" + "</div>" + "</div>";
            } else if (type == 15) {
                historyBlockHTML += '<div class="feedback_describe">' + describe + '<a class="feedback_open" feedbackId="' + feedbackId + '" formId="' + formId + '"> [ 展开<span class="pullDown"></span>]</a></div><a class="viewForm" href="./?cmd=pageFormFeedback&formId=' + formId + '">查看表单</a><div class="clearB"></div><div class="feedbackForm"></div>';
            }
            historyBlockHTML += "</div>" + "</div>" + "<div class=\"clearB\"></div>";
            historyBlockHTML += "</div>";
            $(document).dequeue('_historyAjax');
        });

        $(document).queue('_historyAjax', function () {
            obj.html = historyBlockHTML;
            obj.obj = $(historyBlockHTML);
            $(document).dequeue('ajaxGetHistoryFeedback');
        });

        $(document).dequeue('_historyAjax');
    } else {
        if (type == "15" && formId) {
            formatedTime = mkHistoryDateFormat(time);
            historyBlockHTML = "<div class=\"history_feedback\" id=\"history_" + id + "\">" + "<p class=\"week\">" + formatedTime.weekCN + "</p>" + "<p class=\"day\">" + ((formatedTime.dayInMonth < 9) ? ("0" + formatedTime.dayInMonth) : formatedTime.dayInMonth) + "</p>" + "<div class=\"history_text\">" + "<div class='history_icon_feedback'></div>" + "<div style=\"margin-left:20px;\">" + "<span class=\"name\">" + name + "</span>" + "<span class=\"dowhat\">收到了一封反馈&nbsp;&nbsp;&nbsp;&nbsp;" + formatedTime.shortFormateTime + "</span><br/>";
            $(document).queue('_historyAjax', function () {
                historyBlockHTML += '<div class="feedback_describe">[该表单已被删除]<a class="feedback_open" feedbackId="' + feedbackId + '"> [ 展开<span class="pullDown"></span>]</a></div><div class="clearB"></div><div class="feedbackForm"></div>';
                historyBlockHTML += "</div>" + "</div>" + "<div class=\"clearB\"></div>";
                historyBlockHTML += "</div>";
                $(document).dequeue('_historyAjax');
            });
            $(document).queue('_historyAjax', function () {
                obj.html = historyBlockHTML;
                obj.obj = $(historyBlockHTML);
                $(document).dequeue('ajaxGetHistoryFeedback');
            });
            $(document).dequeue('_historyAjax');
        } else {
            obj = false;
        }

        $(document).dequeue('ajaxGetHistoryFeedback');
    }
}

// arguments

 function test(){
     console.log(arguments);
 }
 test("王五","赵六");
