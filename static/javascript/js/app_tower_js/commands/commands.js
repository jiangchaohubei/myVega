/**
 * Created by PC on 2017/8/15.
 */

$(function () {
    //textarea全屏
    $('#log').textareafullscreen();

    $.ajax({
        type: 'POST',
        url: "/app_tower/job/init_commands_select",
        data: {},
        dataType: "json",
        success: function (data) {
            for (var i = 0; i < data.groupList.length; i++) {
                $("#group").append("<option value='" + data.groupList[i].pk + "'>" + data.groupList[i].fields.NAME + "</option>");
                $("#searchLog_group").append("<option value='" + data.groupList[i].pk + "'>" + data.groupList[i].fields.NAME + "</option>");
                $("#copy_group").append("<option value='" + data.groupList[i].pk + "'>" + data.groupList[i].fields.NAME + "</option>");
                $("#searchSN_group").append("<option value='" + data.groupList[i].pk + "'>" + data.groupList[i].fields.NAME + "</option>");
                $("#runSH_group").append("<option value='" + data.groupList[i].pk + "'>" + data.groupList[i].fields.NAME + "</option>");
            }
            for (var i = 0; i < data.credentialsList.length; i++) {
                $("#credentials").append("<option value='" + data.credentialsList[i].pk + "'>" + data.credentialsList[i].fields.NAME + "</option>");
                $("#searchLog_credentials").append("<option value='" + data.credentialsList[i].pk + "'>" + data.credentialsList[i].fields.NAME + "</option>");
                $("#copy_credentials").append("<option value='" + data.credentialsList[i].pk + "'>" + data.credentialsList[i].fields.NAME + "</option>");
                $("#searchSN_credentials").append("<option value='" + data.credentialsList[i].pk + "'>" + data.credentialsList[i].fields.NAME + "</option>");
                $("#auth_credentials").append("<option value='" + data.credentialsList[i].pk + "'>" + data.credentialsList[i].fields.NAME + "</option>");
                $("#searchProcess_credentials").append("<option value='" + data.credentialsList[i].pk + "'>" + data.credentialsList[i].fields.NAME + "</option>");
                $("#changeProcess_credentials").append("<option value='" + data.credentialsList[i].pk + "'>" + data.credentialsList[i].fields.NAME + "</option>");
                $("#runSH_credentials").append("<option value='" + data.credentialsList[i].pk + "'>" + data.credentialsList[i].fields.NAME + "</option>");
            }

            onSNGroupChange();
            onLOGGroupChange();
            onCOPYGroupChange();
            onRunSHGroupChange();

        },
        error: function () {
            console.log("error");
        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })

})
var SN_hosts=[]
var LOG_hosts=[]
var CopyFile_hosts=[]
var RunSH_hosts=[]
function onRunSHGroupChange() {
    $("#chooseRunSHHost").html('')
    if ($('#runSH_group').val()=='' || $('#runSH_group').val()==null){
        $('#chooseRunSHHost').change(function() {
            RunSH_hosts=$(this).val()
        }).multipleSelect({
            width: '62%',
            filter:true
        });
        return;
    }
    $.ajax({
        type: 'POST',
        url: "/app_tower/host/searchHostByGrooupId",
        data: {
            groupId:$('#runSH_group').val(),
        },
        dataType: "json",
        success: function (data) {

            for (var i = 0; i < data.hostList.length; i++) {
                $("#chooseRunSHHost").append("<option value='" + data.hostList[i].fields.NAME + "' selected>" + data.hostList[i].fields.NAME + "</option>");

            }
            $('#chooseRunSHHost').change(function() {
                RunSH_hosts=$(this).val()
            }).multipleSelect({
                width: '62%',
                filter:true
            });
            console.log($('#chooseRunSHHost').val())

        },
        error: function () {
            console.log("error");
        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })
}
function onLOGGroupChange() {
    $("#chooseLOGHost").html('')
    if ($('#searchLog_group').val()=='' || $('#searchLog_group').val()==null){
        $('#chooseLOGHost').change(function() {
            LOG_hosts=$(this).val()
        }).multipleSelect({
            width: '62%',
            filter:true
        });
        return;
    }
    $.ajax({
        type: 'POST',
        url: "/app_tower/host/searchHostByGrooupId",
        data: {
            groupId:$('#searchLog_group').val(),
        },
        dataType: "json",
        success: function (data) {

            for (var i = 0; i < data.hostList.length; i++) {
                $("#chooseLOGHost").append("<option value='" + data.hostList[i].fields.NAME + "' selected>" + data.hostList[i].fields.NAME + "</option>");

            }
            $('#chooseLOGHost').change(function() {
                LOG_hosts=$(this).val()
            }).multipleSelect({
                width: '62%',
                filter:true
            });
            console.log($('#chooseLOGHost').val())

        },
        error: function () {
            console.log("error");
        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })
}
function onCOPYGroupChange() {
    $("#chooseCOPYHost").html('')
    if ($('#copy_group').val()=='' || $('#copy_group').val()==null){
        $('#chooseCOPYHost').change(function() {
            CopyFile_hosts=$(this).val()
        }).multipleSelect({
            width: '62%',
            filter:true
        });
        return;
    }
    $.ajax({
        type: 'POST',
        url: "/app_tower/host/searchHostByGrooupId",
        data: {
            groupId:$('#copy_group').val(),
        },
        dataType: "json",
        success: function (data) {

            for (var i = 0; i < data.hostList.length; i++) {
                $("#chooseCOPYHost").append("<option value='" + data.hostList[i].fields.NAME + "' selected>" + data.hostList[i].fields.NAME + "</option>");

            }
            $('#chooseCOPYHost').change(function() {
                CopyFile_hosts=$(this).val()
            }).multipleSelect({
                width: '62%',
                filter:true
            });
            console.log($('#chooseCOPYHost').val())

        },
        error: function () {
            console.log("error");
        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })
}
function onSNGroupChange() {
    $("#chooseSNHost").html('')
    if ($('#searchSN_group').val()=='' || $('#searchSN_group').val()==null){
        $('#chooseSNHost').change(function() {
            SN_hosts=$(this).val()
        }).multipleSelect({
            width: '62%',
            filter:true
        });
        return;
    }
    $.ajax({
        type: 'POST',
        url: "/app_tower/host/searchHostByGrooupId",
        data: {
            groupId:$('#searchSN_group').val(),
        },
        dataType: "json",
        success: function (data) {

            for (var i = 0; i < data.hostList.length; i++) {
                $("#chooseSNHost").append("<option value='" + data.hostList[i].fields.NAME + "' selected>" + data.hostList[i].fields.NAME + "</option>");

            }
            $('#chooseSNHost').change(function() {
                SN_hosts=$(this).val()
            }).multipleSelect({
                width: '62%',
                filter:true
            });
            console.log($('#chooseSNHost').val())

        },
        error: function () {
            console.log("error");
        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })
}
//执行sh脚本
function runSH() {
    var groupid = $('#runSH_group').val();
    var credentialsid = $('#runSH_credentials').val();
    var vars=$('#runSH_vars').val()
    if (groupid=='' || groupid==null || credentialsid=='' || credentialsid==null || vars==''||vars==null| RunSH_hosts.length==0){
        opt_commons.dialogShow("提示信息","请填写完整！",2000);
        return;
    }
    $.ajax({
        type: 'POST',
        url: "/app_tower/job/run_commands_runSH",
        data: {
            groupid: groupid,
            hostList:JSON.stringify(RunSH_hosts),
            credentialsid: credentialsid,
            vars:vars,
        },
        dataType: "json",
        success: function (data) {
            if(data.resultCode=="0057"){
                opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                return;
            }
            $('#taskid').val(data.taskid);
            $('#logfile').val(data.file);
            readLog(data.taskid, data.file)
        },
        error: function () {
            console.log("error");
        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })
}
//查询进程
function searchProcess() {
    var hostName = $.trim($('#searchProcess_hostName').val());
    var credentialsid = $('#searchProcess_credentials').val();
    var processName=$('#searchProcess_processName').val();
    if (hostName==''||hostName==null || credentialsid==null || credentialsid==''||processName==''||processName==null){
        opt_commons.dialogShow("提示信息","请填写完整！",2000);
        return;
    }

    $.ajax({
        type: 'POST',
        url: "/app_tower/job/run_commands_searchProcess",
        data: {
            hostName: hostName,
            credentialsid: credentialsid,
            processName:processName,
        },
        dataType: "json",
        success: function (data) {
            if(data.resultCode=="0057"){
                opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                return;
            }
            if(data.resultCode=="0001"){
                opt_commons.dialogShow("提示信息",data.resultDesc,2000);
                return;
            }
            $('#taskid').val(data.taskid);
            $('#logfile').val(data.file);
            readLog(data.taskid, data.file)
        },
        error: function () {
            console.log("error");
                opt_commons.dialogShow("提示信息","错误！",2000);

        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })
}
//修改进程
function changeProcess() {
    var hostName = $.trim($('#changeProcess_hostName').val());
    var credentialsid = $('#changeProcess_credentials').val();
    var processName=$('#changeProcess_processName').val();
    var operation=$('#changeProcess_operation').val();
    if (hostName==''||hostName==null || credentialsid==null || credentialsid==''||processName==''||processName==null||operation==''||operation==null){
        opt_commons.dialogShow("提示信息","请填写完整！",2000);
        return;
    }

    $.ajax({
        type: 'POST',
        url: "/app_tower/job/run_commands_changeProcess",
        data: {
            hostName: hostName,
            credentialsid: credentialsid,
            processName:processName,
            operation:operation,
        },
        dataType: "json",
        success: function (data) {
            if(data.resultCode=="0057"){
                opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                return;
            }
            if(data.resultCode=="0001"){
                opt_commons.dialogShow("提示信息",data.resultDesc,2000);
                return;
            }
            $('#taskid').val(data.taskid);
            $('#logfile').val(data.file);
            readLog(data.taskid, data.file)
        },
        error: function () {
            console.log("error");
            opt_commons.dialogShow("提示信息","错误！",2000);

        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })
}
//增加/取消/查询权限
function changeAuth(action) {
    var hostName = $.trim($('#auth_hostName').val());
    var credentialsid = $('#auth_credentials').val();
    var userName=$.trim($('#auth_userName').val());
    var port=$.trim($('#auth_port').val());
    var requestUser=$.trim($('#auth_requestUser').val());
    if (requestUser==null){
        requestUser=""
    }
    if (hostName==''||hostName==null){
        opt_commons.dialogShow("提示信息","主机名必填！",2000);
        return;
    }
    if (userName=='root' ||  userName=='manage'){
        opt_commons.dialogShow("提示信息","不能修改root用户和manage用户",2000);
        return;
    }
    if ($('#auth_portCheckbox').val()){
        if (port=='' || port ==null){
            opt_commons.dialogShow("提示信息","请输入端口号",2000);
            return;
        }
    }
    if (action=='add' ||  action=='cancel'){
        if (requestUser=='' || requestUser==null){
            opt_commons.dialogShow("提示信息","修改权限时必须填写说明",2000);
            return;
        }

    }
    if (!$('#auth_portCheckbox').is(":checked")){
        port=22;
    }
    $.ajax({
        type: 'POST',
        url: "/app_tower/job/run_commands_changeSudoAuth",
        data: {
            hostName: hostName,
            credentialsid: credentialsid,
            userName:userName,
            action:action,
            port:port,
            requestUser:requestUser,
        },
        dataType: "json",
        success: function (data) {
            if(data.resultCode=="0057"){
                opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                return;
            }
            if(data.resultCode=="0001"){
                opt_commons.dialogShow("提示信息",data.resultDesc,2000);
                return;
            }
            $('#taskid').val(data.taskid);
            $('#logfile').val(data.file);
            readLog(data.taskid, data.file)
        },
        error: function () {
            console.log("error");
        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })
}

//查找SN号
function searchSN() {
    var groupid = $('#searchSN_group').val();
    var credentialsid = $('#searchSN_credentials').val();
    if (groupid=='' || groupid==null || credentialsid=='' || credentialsid==null || SN_hosts.length==0){
        opt_commons.dialogShow("提示信息","请填写完整！",2000);
        return;
    }
    $.ajax({
        type: 'POST',
        url: "/app_tower/job/run_commands_searchSN",
        data: {
            groupid: groupid,
            hostList:JSON.stringify(SN_hosts),
            credentialsid: credentialsid,
        },
        dataType: "json",
        success: function (data) {
            if(data.resultCode=="0057"){
                opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                return;
            }
            $('#taskid').val(data.taskid);
            $('#logfile').val(data.file);
            readLog(data.taskid, data.file)
        },
        error: function () {
            console.log("error");
        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })
}
//日志查询
function searchLog() {

    var groupid = $('#searchLog_group').val();
    var credentialsid = $('#searchLog_credentials').val();
    var cmd=$('#searchLog_cmd').val();
    var content=$('#searchLog_content').val();
    var path=$('#searchLog_filePath').val();
    if (groupid=='' || groupid==null || credentialsid=='' || credentialsid==null ||cmd=='' || cmd==null || content=='' || content==null || path=='' || path==null || LOG_hosts.length==0){
        opt_commons.dialogShow("提示信息","请填写完整！",2000);
        return;
    }
    $.ajax({
        type: 'POST',
        url: "/app_tower/job/run_commands_searchLog",
        data: {
            groupid: groupid,
            hostList:JSON.stringify(LOG_hosts),
            credentialsid: credentialsid,
            cmd:cmd,
            content:content,
            path:path,
        },
        dataType: "json",
        success: function (data) {
            if(data.resultCode=="0057"){
                opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                return;
            }
            $('#taskid').val(data.taskid);
            $('#logfile').val(data.file);
            readLog(data.taskid, data.file)
        },
        error: function () {
            console.log("error");
        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })
}
//分发文件
function copyFile(){
    var groupid = $('#copy_group').val();
    var credentialsid = $('#copy_credentials').val();
    var srcPath = $('#copy_srcPath').val();
    var desPath = $('#copy_desPath').val();
    if (groupid=='' || groupid==null || credentialsid=='' || credentialsid==null ||srcPath=='' || srcPath==null || desPath=='' || desPath==null  || CopyFile_hosts.length==0){
        opt_commons.dialogShow("提示信息","请填写完整！",2000);
        return;
    }
    $.ajax({
        type: 'POST',
        url: "/app_tower/job/run_commands_copyFile",
        data: {
            groupid: groupid,
            hostList:JSON.stringify(CopyFile_hosts),
            credentialsid: credentialsid,
            srcPath:srcPath,
            desPath:desPath,

        },
        dataType: "json",
        success: function (data) {
            if(data.resultCode=="0057"){
                opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                return;
            }
            $('#taskid').val(data.taskid);
            $('#logfile').val(data.file);
            readCopyLog(data.taskid, data.file,desPath,groupid,credentialsid)
        },
        error: function () {
            console.log("error");
        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })
}

function runCommands() {
    var commands = $('#commands').val();
    $.ajax({
        type: 'POST',
        url: "/app_tower/job/run_commands",
        data: {
            commands: commands,

        },
        dataType: "json",
        success: function (data) {
            if(data.resultCode=="0057"){
                opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                return;
            }
            $('#taskid').val(data.taskid);
            $('#logfile').val(data.file);
            readLog(data.taskid, data.file)
        },
        error: function () {
            console.log("error");
        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })
}
//读日志
function readLog(id, file) {
    var taskid = id;
    var logfile = file;
    seek();
    function seek() {
        $.ajax({
            type: 'POST',
            url: "/app_tower/job/read_commands_log",
            data: {
                taskid: taskid,
                logfile: logfile,
            },
            dataType: "json",
            success: function (data) {
                if(data.resultCode=="0057"){
                    opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                    return;
                }
                $('#log').val(data.log)
                $("#log").scrollTop($("#log")[0].scrollHeight);
                setTimeout(function () {
                    if (data.read_flag == 'True') {
                        seek();
                    }
                }, 1000)
            },
            error: function () {
                console.log("error");
            },
            complete: function (XMLHttpRequest, textStatus) {
                console.log("complete");
            }
        })
    }


}

function runAnsible() {
    var groupid = $('#group').val();
    var credentialsid = $('#credentials').val();
    var commandName = $('#commandName').val();
    var vars = $('#vars').val();
    $.ajax({
        type: 'POST',
        url: "/app_tower/job/run_commands2",
        data: {
            groupid: groupid,
            credentialsid: credentialsid,
            commandName: commandName,
            vars: vars,
        },
        dataType: "json",
        success: function (data) {
            if(data.resultCode=="0057"){
                opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                return;
            }
            $('#taskid').val(data.taskid);
            $('#logfile').val(data.file);
            readLog(data.taskid, data.file)
        },
        error: function () {
            console.log("error");
        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })
}
//读分发文件日志
function readCopyLog(id, file,path,groupId,credentialsid) {
    var taskid = id;
    var logfile = file;
    var desPath=path;
    var groupid=groupId
    var   credentialsid=credentialsid
    seek();
    function seek() {
        $.ajax({
            type: 'POST',
            url: "/app_tower/job/read_commands_log",
            data: {
                taskid: taskid,
                logfile: logfile,
            },
            dataType: "json",
            success: function (data) {
                if(data.resultCode=="0057"){
                    opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                    return;
                }
                $('#log').val(data.log)
                $("#log").scrollTop($("#log")[0].scrollHeight);
                setTimeout(function () {
                    if (data.read_flag == 'True') {
                        seek();
                    }else{
                        //分发完毕，查看文件
                            $.ajax({
                                type: 'POST',
                                url: "/app_tower/job/checkFile",
                                data: {
                                    taskid: taskid,
                                    groupid:groupid,
                                    hostList:JSON.stringify(CopyFile_hosts),
                                    credentialsid:credentialsid,
                                    logfile: logfile,
                                    desPath:desPath,
                                },
                                dataType: "json",
                                success: function (data) {
                                    $('#taskid').val(data.taskid);
                                    $('#logfile').val(data.file);
                                    readLog(data.taskid, data.file)

                                },
                                error: function () {
                                    console.log("error");
                                },
                                complete: function (XMLHttpRequest, textStatus) {
                                    console.log("complete");
                                }})
                    }
                }, 1000)
            },
            error: function () {
                console.log("error");
            },
            complete: function (XMLHttpRequest, textStatus) {
                console.log("complete");
            }
        })
    }


}



//@ sourceURL=commands.js