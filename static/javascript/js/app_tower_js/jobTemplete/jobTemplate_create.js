/**
 * Created by PC on 2017/7/21.
 */
$(function () {

    opt_commons.query_validate("#jobTemplete_form");
    $.ajax({
        url:"/app_tower/project/init_project_select",
        type:"POST",
        data:{

        },
        dataType:"json",
        success:function(data){
            for (var i=0;i<data.projectList.length;i++){
                $('#job_owner').append('<option value="'+data.projectList[i].pk+'">'+data.projectList[i].fields.NAME+'</option>')
            }

        },
        error: function(data) {
            console.log('error')
        }

    })
})
function save_jobTemplete(){
    //校验不成功
    if (!$('#jobTemplete_form').valid()){
        return;
    }

    $.ajax({
        type: 'POST',
        url: "/app_tower/job/add",
        data: {
            NAME: $('#job_name').val(),
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
            if(data.resultCode=="0000"){
                console.log(data.resultCode)
                opt_commons.dialogShow("成功信息","添加成功！",2000);
                $('#jobTemplete_form')[0].reset();  //通过调用 DOM 中的reset方法来重置表单
                return;
            }
        },
        error: function () {
            if(data.resultCode="0001"){
                opt_commons.dialogShow("提示信息","添加失败！",2000);
                console.log("error");

                return;

            }
        },
        complete: function () {
            console.log("complete");
        }
    })

}
function saveAndRun(){
    //校验不成功
    if (!$('#jobTemplete_form').valid()){
        return;
    }
    $.ajax({
        type: 'POST',
        url: "/app_tower/job/save_run_job",
        data: {
            NAME: $('#job_name').val(),
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
                +data.data.name+'&from=jobTemplete'+'&logfile='+data.data.logfile+'&jobsid='+data.jobsid+'&userName='+data.data.userName+'&userId='+data.data.userId
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

//@ sourceURL=jobTemplate_create.js