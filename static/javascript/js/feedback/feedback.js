function feedback(){
    var topic=$("#topic").val();
    var content=$("#content").val();
    if(topic&&content){
             $.ajax({
                url: "/feedback/saveFeedBack",
                type: "POST",
                data: {
                    TOPIC: topic,
                    CONTENT: content,
                },
                dataType: "json",
                success: function (data) {
                    if (data.resultDesc == "Success") {
                        opt_commons.dialogShow("成功信息", "您反馈的宝贵意见我们会尽快改正", 2000);
                        $("#topic").val("");
                        $("#content").val("");
                        return;
                    }
                }
            });
    }else{
        opt_commons.dialogShow("提示信息", "请输入您的主题和您宝贵的意见！", 2000);
    }



}


// 到  出所有的反馈意见
function exportFeedback(){
       $.ajax({
                url: "/feedback/export/allFeedback",
                type: "POST",
                dataType: "json",
                success: function (data) {
                    if (data.resultDesc == "Success") {
                        opt_commons.dialogShow("成功信息", "导出成功!", 2000);
                        downloadExcel(data.filepath);
                        return;
                    }
                }
            });
}


function downloadExcel(filepath){
        window.open("/feedback/export/allFeedback/download?filepath="+filepath);
}