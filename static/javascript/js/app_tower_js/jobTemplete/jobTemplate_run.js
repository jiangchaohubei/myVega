/**
 * Created by PC on 2017/7/21.
 */
String.prototype.replaceAll = function (s1, s2) {
    return this.replace(new RegExp(s1, "gm"), s2);
}
var from=""
function onload_jobrun() {
    //textarea全屏
    $('#textscroll').textareafullscreen();
    C1 = window.location.href.split("?")[1];
    C2 = C1.split("&");
    var taskid = C2[0].split("=")[1]
    var name = decodeURI(C2[1].split("=")[1])
    from = C2[2].split("=")[1]
    var logfile = C2[3].split("=")[1]
    var jobsid = C2[4].split("=")[1]
    var userName = C2[5].split("=")[1]
    var userId = C2[6].split("=")[1]
    var runType=decodeURI(C2[7].split("=")[1])
    var credentrialId=C2[8].split("=")[1]
    if (from == 'jobs') {
        $('#beforepage').attr('href', '/static/templates/pages/app_tower_pages/jobs/jobs.html');
        $('#beforepage').html('任务');
    }

    $('#taskid').html(taskid);
    $('#jobsid').html(jobsid);
    $('#credentrialId').html(credentrialId);
    $('#name').html(name);
    $('#logfile').html(logfile);
    $('#runUser').html(userName);
    $('#runType').html(runType);



    $('#collapseThree').collapse('show');
    $('#collapseOne').collapse('show');


    //taskid=$('#result').html()
    //alert(taskid)
    var seek = 0;
    getlog(seek);
    function getlog(se) {
        $.ajax({
            type: 'POST',
            url: "/app_tower/job/read_job_log",
            data: {
                taskid: taskid,
                logfile: logfile,
                seek: se,
                jobsid: jobsid,
            },
            dataType: "json",
            success: function (data) {
                if(data.resultCode=="0057"){
                    opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                    return;
                }
                console.log(data);
                result = data
                seek = result.seek;
                $('#textscroll').val(result.log)
                $('#state').html(result.state);
                if (result.state == 'REVOKED' || result.state == 'SUCCESS' || result.state == 'FAILURE') {
                    $('#stopbtn').css('display', 'none');
                }
                if (result.state == 'REVOKED') {
                    $('#startTime').html("- - -");
                } else if (result.jobs.startTime == 'null') {
                    $('#startTime').html("执行中");
                } else {
                    $('#startTime').html(result.jobs.startTime.substring(1, result.jobs.startTime.length - 1));
                }
                if (result.state == 'REVOKED') {
                    $('#endTime').html("- - -");
                } else if (result.jobs.endTime == 'null') {
                    $('#endTime').html("执行中");
                } else {
                    $('#endTime').html(result.jobs.endTime.substring(1, result.jobs.endTime.length - 1));
                }
                if (result.state == 'REVOKED') {
                    $('#elapsed').html("- - -");
                } else if (result.jobs.elapsed == 0) {
                    $('#elapsed').html(0);
                } else if (!result.jobs.elapsed) {
                    $('#elapsed').html("执行中");
                } else {
                    $('#elapsed').html(result.jobs.elapsed);
                }
                $('#hostGroup').html(result.groupName);
                $('#runType').html(result.jobs.runType);
                $('#playbookPath').html(result.jobs.playbookPath);

                $("#textscroll").scrollTop($("#textscroll")[0].scrollHeight);
                setTimeout(function () {
                    if (result.read_flag == 'True') {
                        getlog(seek)
                    }else{
                        event_sumarise_init(jobsid)
                    }}

                , 1000)

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


function stoprun() {
    var taskid = $('#taskid').html();
    var jobsid = $('#jobsid').html();
    $.ajax({
        type: 'POST',
        url: "/app_tower/job/stop_job",
        data: {
            taskid: taskid,
            jobsid: jobsid
        },
        dataType: "json",
        success: function (data) {
            if(data.resultCode=="0057"){
                opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                return;
            }
            console.log(data);


        },
        error: function () {
            console.log("error");
        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })
}
function event_sumarise_init(id) {

    var jobsid = id;
    $.ajax({
        type: 'POST',
        url: "/app_tower/job/get_event",
        data: {
            jobsid: jobsid
        },
        dataType: "json",
        success: function (data) {
            if(data.resultCode=="0057"){
                opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                return;
            }
            console.log(data);
            eventList = data.eventList
            for (var i=0;i<eventList.length;i++){
                $('#eventTable').find('tbody').append(
                    '<tr>'+
                    '<td>'+eventList[i].pk+'</td>'+
                    '<td>'+eventList[i].fields.HOST_ID+'</td>'+
                    '<td>'+eventList[i].fields.HOST_NAME+'</td>'+
                    '<td>'+eventList[i].fields.SUCCESS+'</td>'+
                    '<td>'+eventList[i].fields.FAILED+'</td>'+
                    '<td>'+eventList[i].fields.CHANGED+'</td>'+
                    '<td>'+eventList[i].fields.UNREACHABLE+'</td>'+
                    '<td>'+eventList[i].fields.SKIPPED+'</td>'+
                    '</tr>')
                var str=''+eventList[i].fields.HOST_NAME+" ";
                if (eventList[i].fields.SUCCESS!=0){
                    str+='ok'+eventList[i].fields.SUCCESS+" ";
                }
                if (eventList[i].fields.FAILED!=0){
                    str+='faield'+eventList[i].fields.FAILED+" ";
                }
                if (eventList[i].fields.CHANGED!=0){
                    str+='changed'+eventList[i].fields.CHANGED+" ";
                }
                if (eventList[i].fields.UNREACHABLE!=0){
                    str+='unreachable'+eventList[i].fields.UNREACHABLE+" ";
                }
                if (eventList[i].fields.SKIPPED!=0){
                    str+='skipped'+eventList[i].fields.SKIPPED+" ";
                }

                $('#backHostSelect').append('<option value="'+eventList[i].fields.HOST_ID+'">'+str+'</option>')
            }
            //初始化双向列表
            init_dualListbox();
            /*
            * 还要初始化主机组，凭证的下拉选择框
            *
            * */



        },
        error: function () {
            console.log("error");
        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })
}
function init_dualListbox(){
    var demo2 = $('.demo1').bootstrapDualListbox({
        nonSelectedListLabel: '未选中',
        selectedListLabel: '已选中',
        preserveSelectionOnMove: 'moved',
        moveOnSelect: false,
        nonSelectedFilter: ''
    });

    $('[class="glyphicon glyphicon-arrow-right').each(function (n,v) {

        $(v).removeClass("glyphicon");
        $(v).removeClass("glyphicon-arrow-right");
        $(v).addClass("fa fa-arrow-right");

    })
    $('[class="glyphicon glyphicon-arrow-left').each(function (n,v) {

        $(v).removeClass("glyphicon");
        $(v).removeClass("glyphicon-arrow-left");
        $(v).addClass("fa fa-arrow-left");

    })
}

function showCreateGroupModal(){
    $('#createGroupModal').modal("show");
    $('#input_groupName').val($('#name').html()+'_'+$('#jobsid').html());
    $('#input_desc').val($('#name').html()+'任务回滚');

    $('#job_name').val($('#name').html()+'_'+$('#jobsid').html());
    $('#job_desc').val($('#name').html()+'任务回滚');
    $('#job_labels').val('rollback,'+$('#name').html());
    $('#job_forks').val('4')
    $.ajax({
        url:"/app_tower/project/init_project_select",
        type:"POST",
        data:{

        },
        dataType:"json",
        success:function(data){
            $("#input_owner").html('');
            $('#input_owner').append('<option value="onlyOne" selected>'+'仅自己'+'</option>')
            $('#input_owner').append('<option value="all" >'+'所有人'+'</option>')
            for (var i=0;i<data.projectList.length;i++){
                $('#input_owner').append('<option value="'+data.projectList[i].pk+'">'+data.projectList[i].fields.NAME+'</option>')
            }

        },
        error: function(data) {
            console.log('error')
        }

    })
    opt_commons.query_validate("#createGroupForm");
    opt_commons.query_validate("#runBackJobForm");

    // $('#collapseGroup').collapse('show');
    // $('#collapseBack').collapse('hide');

}

function  createGroup() {
    //校验不成功
    if (!$('#createGroupForm').valid()){
        return;
    }
    var hosts=$('[name="duallistbox_demo1"]').val()+',';
    var hostList=hosts.split(',');
    hostList.pop();
    group_name ='rb_'+$('#input_groupName').val(),
    $.ajax({
        type: 'POST',
        url: "/app_tower/group/create_backGroup",
        data: {
            hostList:hostList,
            name:group_name,
            desc:$('#input_desc').val(),
            vars:$('#input_vars').val(),
            owner:$("#input_owner").val(),
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
            if(data.resultCode=="0000"){
                console.log(data.resultCode)
                opt_commons.dialogShow("成功信息","添加成功！",2000);
                $('#createGroupForm')[0].reset();  //通过调用 DOM 中的reset方法来重置表单
                var groupList=JSON.parse(data.groupList);
                var credentialsList=JSON.parse(data.credentialsList);
                var projectList=JSON.parse(data.projectList);
                var playbooksList=JSON.parse(data.playbooksList);
                $('#job_group').html("")
                $('#job_credentials').html("")
                $('#job_playbook').html("")
                for (var i=0;i<playbooksList.length;i++){
                        $('#job_playbook').append('<option value="'+playbooksList[i].pk+'">'+playbooksList[i].fields.NAME+'</option>')
                }
                for (var i=0;i<groupList.length;i++){
                    if (groupList[i].fields.NAME==group_name){
                        $('#job_group').append('<option value="'+groupList[i].pk+'" selected>'+groupList[i].fields.NAME+'</option>')
                    }else{
                        $('#job_group').append('<option value="'+groupList[i].pk+'">'+groupList[i].fields.NAME+'</option>')
                    }
                }
                for (var i=0;i<credentialsList.length;i++){
                    if (credentialsList[i].pk==$('#credentrialId').html()){
                        $('#job_credentials').append('<option value="'+credentialsList[i].pk+'" selected>'+credentialsList[i].fields.NAME+'</option>')
                    }else{
                        $('#job_credentials').append('<option value="'+credentialsList[i].pk+'">'+credentialsList[i].fields.NAME+'</option>')
                    }

                }
                $("#job_owner").html('');
                $('#job_owner').append('<option value="onlyOne" selected>'+'仅自己'+'</option>')
                $('#job_owner').append('<option value="all" >'+'所有人'+'</option>')
                for (var i=0;i<projectList.length;i++){
                        $('#job_owner').append('<option value="'+projectList[i].pk+'">'+projectList[i].fields.NAME+'</option>')
                }
                $('#runBackJobCollapse').css('display','block');
                return;
            }


        },
        error: function () {

                console.log("error");

        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })
}
//执行回滚
function runBackBt() {
    //校验不成功
    if (!$('#runBackJobForm').valid()){
        return;
    }
    $.ajax({
        type: 'POST',
        url: "/app_tower/job/save_run_job",
        data: {
            NAME: 'rb_'+$('#job_name').val(),
            DESCRIPTION: $('#job_desc').val(),
            JOB_TYPE: $('#job_type').val(),
            GROUP_ID: $('#job_group').val(),
            credentials:$('#job_credentials').val(),
            PLAYBOOK_FILE: $('#job_playbook').val(),
            LABELS:$('#job_labels').val(),
            job_owner: $('#job_owner').val(),
            FORKS:$('#job_forks').val(),
            JOB_TAGS: $('#job_tags').val() ? $('#job_tags').val():"",
            SKIP_TAGS: $('#job_skipTags').val() ? $('#job_skipTags').val():"",
            EXTRA_VARIABLES: $('#job_extravariable').val() ? $('#job_extravariable').val():"",
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
            // alert(data.data.taskid)
            window.location.href='/static/templates/pages/app_tower_pages/jobTemplete/jobTemplate_run.html?taskid='+ data.data.taskid+'&name='
                +data.data.name+'&from='+from+'&logfile='+data.data.logfile+'&jobsid='+data.jobsid+'&userName='+data.data.userName+'&userId='+data.data.userId
                +'&runType='+data.data.runType+'&credentialId='+data.data.credentialId;



        },
        error: function () {

                console.log("error");

        },
        complete: function () {
            console.log("complete");
        }
    })

}

//预览
function showReviewModal() {

    $.ajax({
        type: 'POST',
        url: "/app_tower/review_file",
        data: {
            filePath:$('#job_playbook').val()
        },
        dataType: "json",
        success: function (data) {
            if (data.resultCode=="0001"){
                opt_commons.dialogShow("提示信息","文件不存在！",2000);
                return;
            }
            $('#reviewTextarea').val(data.fileContent);
            $('#reviewModal').modal('show');

        },
        error: function () {
            console.log("error");
            opt_commons.dialogShow("错误","输入格式有误，请修改！",2000);
        },
        complete: function () {
            console.log("complete");
        }
    })
}

//@ sourceURL=jobTemplate_run.js