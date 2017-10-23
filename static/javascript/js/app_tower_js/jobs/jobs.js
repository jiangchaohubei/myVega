/**
 * Created by PC on 2017/7/14.
 */
var selectionIds = [];  //保存选中ids
Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}
var statusList=[]
$(function(){
    var oTable_jobs = new TableInit_jobs();
    oTable_jobs.Init();
    setInterval(function () {
        for (var i=0;i<statusList.length;i++){
            if (statusList[i]=='STARTED'||statusList[i]=='PENDING'){
                $("#job_table").bootstrapTable('refresh');
                break;
            }
        }
    },3000)

})

var TableInit_jobs = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#job_table').bootstrapTable({
            url: '/app_tower/jobs/select',
            method:"GET",
            striped: true, //是否显示行间隔色
            cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true, //是否显示分页（*）
            sortable: true, //是否启用排序
            sortOrder: "asc",
            queryParams: oTableInit.queryParams,//传递参数（*）
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            pageNumber:1, //初始化加载第一页，默认第一页
            pageSize: 5, //每页的记录行数（*）
            pageList: [5, 20, 50, 100], //可供选择的每页的行数（*）
            strictSearch: true,
            showColumns: true, //是否显示所有的列
            showRefresh: true, //是否显示刷新按钮
            minimumCountColumns: 2, //最少允许的列数
            clickToSelect: false, //是否启用点击选中行
            height: 345, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            showToggle:true, //是否显示详细视图和列表视图的切换按钮
            cardView: false, //是否显示详细视图
            detailView: false, //是否显示父子表
            onCheck: function (row) {
                //单行最前面的checkbox被选中
                console.log(row)
                if ($.inArray(row.pk, selectionIds)== -1){//不存在
                    selectionIds.push(row.pk);
                }
            },
            onUncheck: function (row) {
                //单行最前面的checkbox被取消
                console.log(row)
                if ($.inArray(row.pk, selectionIds)!= -1){//存在
                    selectionIds.removeByValue(row.pk)
                }


            },
            onCheckAll: function (rows) {
                //最顶上的checkbox被选中
                console.log(rows)
                for (var i=0;i<rows.length;i++){
                    if ($.inArray(rows[i].pk, selectionIds)== -1){//不存在
                        selectionIds.push(rows[i].pk)
                    }
                }
            },
            onUncheckAll: function (rows) {
                //最顶上的checkbox被取消
                console.log(rows)
                for (var i=0;i<rows.length;i++){
                    if ($.inArray(rows[i].pk, selectionIds)!= -1){//存在
                        selectionIds.removeByValue(rows[i].pk)
                    }
                }
            },
            responseHandler: function(res) { //返回数据处理
                if(res.resultCode=="0057"){
                    $('.fixed-table-loading').html('你没有查看权限！')
                    return;
                }

                var data=JSON.parse(res.rows);
                statusList.splice(0,statusList.length);
                $.each(data, function (i, row) {
                    statusList.push(row.fields.STATUS);
                    row.checkStatus = $.inArray(row.pk, selectionIds) != -1;  //判断当前行的数据id是否存在与选中的数组，存在则将多选框状态变为true
                });
                return {
                    "total": res.total,//总页数
                    "rows": data  //数据
                 };
            },
            columns: [
                {field: 'checkStatus',checkbox: true},
                {
                field: 'pk',
                title: 'ID',
                align : 'center',
                sortable : true,
                hidden:true

            },{
                    field: 'fields.TEMPLETE_ID',
                    title: '模板ID',
                    align : 'center',
                    sortable : true,
                    hidden:true
                },
                {
                field: 'fields.NAME',
                title: '任务名称',
                align : 'center',
                sortable : true,
                formatter:function(value, row, index){

                    return  '<a href="/static/templates/pages/app_tower_pages/jobTemplete/jobTemplate_run.html?taskid=taskid='+
                        row.fields.CELERY_TASK_ID +'&name='+row.fields.NAME+'&from=jobs'+'&logfile='+row.fields.LOGFILE+'&jobsid='+row.pk+
                        '&userName='+row.fields.CREATE_USER_NAME+'&userId='+row.fields.CREATE_USER_ID+'&runType='+row.fields.JOB_TYPE+'&credentialId='+row.fields.CREDENTIAL_MACHINE_ID+'">'+value+'</a>'
                }

            },{
                    field: 'fields.START_TIME',
                    title: '开始时间',
                    align : 'center',
                    sortable : true,

                },{
                    field: 'fields.FINISH_TIME',
                    title: '结束时间',
                    align : 'center',
                    sortable : true,
                },{
                    field: 'fields.ELAPSED',
                    title: '耗时',
                    align : 'center',
                    sortable : true,

                },{
                field: 'fields.DESCRIPTION',
                title: '描述',
                align : 'center',
                sortable : true

            },{
                field: 'fields.JOB_TYPE',
                title: '执行类型',
                align : 'center',
                sortable : true

            },{
                field: 'fields.PLAYBOOK_FILE',
                title: 'playbook',
                align : 'center',
                sortable : true

            },
                {
                    field: 'fields.CELERY_TASK_ID',
                    title: '任务ID',
                    align : 'center',
                    sortable : true,
                    visible: false   //可见
                },
                {
                field: 'fields.STATUS',
                title: '任务状态',
                align : 'center',
                sortable : true

            }, {
                //field: 'count',
                title: '操作',
                align : 'center',
                sortable : true,
                formatter:function(value, row, index){
                    row.fields.LOGCONTENT=""
                    var data=JSON.stringify(row);
                    var c=JSON.stringify({"TEMPLETE_ID":row.fields.TEMPLETE_ID,"NAME":row.fields.NAME})
                    // var job=row.pk+","+row.fields.NAME+","+row.fields.DESCRIPTION+","+row.fields.JOB_TYPE
                    // +","+row.fields.GROUP_ID+","+row.fields.PLAYBOOK_FILE+","+row.fields.FORKS+","
                    // +row.fields.JOB_TAGS+","+row.fields.SKIP_TAGS+","+row.fields.STATUS+","+row.fields.CANCEL_FLAG+","
                    //     +row.fields.CELERY_TASK_ID+","+row.fields.TEMPLETE_ID+","+row.fields.START_TIME+","+row.fields.FINISH_TIME+","+row.fields.ELAPSED;
                        return "<a class='btn btn-primary btn-xs' title=" + '重新执行' +
            " href='javascript:runJob(" + data + ");'>" +
            "<i class='ace-icon fa fa-refresh bigger-130'></i>重新执行</a>" +
            " <a class='btn btn-info btn-xs' title=" + '详情' +
            " href='javascript:showUpdateJobModal("+data+");'>" +
            "<i class='ace-icon fa fa-book bigger-130'></i>详情</a>" +
            "  <a class='btn btn-danger btn-xs' title=" + '删除' +
            " href='javascript:showDeleteJobModal("+data+");'>" +
            "<i class='ace-icon fa fa-trash-o bigger-130'></i>删除</a>";
                 }
            }, ]
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function (params) {
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            limit: params.limit, //页面大小
            offset: params.offset, //页码
            order: params.order,
            ordername: params.sort,
            name:$("#name").val().trim(),
            description:$("#description").val().trim(),
            jobType:$("#job_type").val().trim(),
            jobTaskid:$("#job_taskid").val().trim(),
            jobStatus:$("#job_status").val().trim(),
        };
        return temp;
    };
    return oTableInit;
};
//删除模态框
function showDeleteJobModal(data){
    $("#deleteJobModal").modal("show");
    $("#delete_id").val(data.pk);
    $("#deleteName").html(data.fields.NAME);
    $("#deleteDescription").html(data.fields.DESCRIPTION);
    $("#deleteJob_type").html(data.fields.JOB_TYPE);
    $("#deleteGroup_id").html(data.fields.GROUP_ID);
    $("#deletePlaybook_file").html(data.fields.PLAYBOOK_FILE);
    $("#deleteForks").html(data.fields.FORKS);
    $("#deleteJob_tags").html(data.fields.JOB_TAGS);
    $("#deleteSkip_tags").html(data.fields.SKIP_TAGS);
    $("#deleteExtra_variable").html(data.fields.EXTRA_VARIABLES);
    $("#deleteCelery_taskid").val(data.fields.CELERY_TASK_ID);
    $("#deleteStatus").html(data.fields.STATUS);
    $("#deleteCancelflag").html(data.fields.CANCEL_FLAG);

    $("#deleteLogin_credentials").html(data.fields.CREDENTIAL_MACHINE_ID);
    $("#deleteLabels").html(data.fields.LABELS);
}
//删除任务
function deleteJobTemplate(){
         var id=$("#delete_id").val();
     $.ajax({
       url:"/app_tower/jobs/delete",
       type:"POST",
       data:{
           id:id
       },
       dataType:"json",
       success:function(data){
           if(data.resultCode=="0057"){
               opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
               return;
           }
           if(data.result=="Success"){
               opt_commons.dialogShow("成功信息","删除信息成功！",2000);
               $("#job_table").bootstrapTable('refresh');
               return;
           }
       },
        error: function(data) {
            if(data.result="FAIELD!"){
                opt_commons.dialogShow("失败信息","删除信息失败！！",2000);
                console.log("error");
                 $("#job_table").bootstrapTable('refresh');
                return;

            }
        },
   });
}

//修改模态框
function showUpdateJobModal(data){
    $("#updateJobModal").modal("show");
    $("#update_id").val(data.pk);
    $("#updateName").val(data.fields.NAME);
    $("#updateDescription").val(data.fields.DESCRIPTION);
    $("#updateJob_type").val(data.fields.JOB_TYPE);
    $("#updateGroup_id").val(data.fields.GROUP_ID);
    $("#updatePlaybook_file").val(data.fields.PLAYBOOK_FILE);
    $("#updateForks").val(data.fields.FORKS);
    $("#updateJob_tags").val(data.fields.JOB_TAGS);
    $("#updateSkip_tags").val(data.fields.SKIP_TAGS);
    $("#updateStatus").val(data.fields.STATUS);
    $("#updateCancelflag").val(data.fields.CANCEL_FLAG);
    $("#updateCelery_taskid").val(data.fields.CELERY_TASK_ID);
    $("#updateExtra_variable").val(data.fields.EXTRA_VARIABLES);

    $("#updateLogin_credentials").val(data.fields.CREDENTIAL_MACHINE_ID);
    $("#updateLabels").val(data.fields.LABELS);

}

function updateJobTemplate(){
    var id=$("#update_id").val();
    var NAME=$("#updateName").val();
    var DESCRIPTION=$("#updateDescription").val();
    var JOB_TYPE=$("#updateJob_type").val();
    var GROUP_ID=$("#updateGroup_id").val();
    var PLAYBOOK_FILE=$("#updatePlaybook_file").val();
    var FORKS=$("#updateForks").val();
    var JOB_TAGS=$("#updateJob_tags").val();
    var SKIP_TAGS=$("#updateSkip_tags").val();
    var STATUS=$("#updateStatus").val();
    var CANCELFLAG=$("#updateCancelflag").val();
    var CELERYTASKID=$("#updateCelery_taskid").val();
    var EXTRA_VARIABLES=$("#updateExtra_variable").val();
    var Login_credentials=$("#updateLogin_credentials").val() ? $('#updateLogin_credentials').val():"";
    var Labels=$("#updateLabels").val() ? $('#updateLabels').val():"";
    $.ajax({
       url:"/app_tower/jobs/update",
       type:"POST",
       data:{
           id:id,
           NAME:NAME,
           DESCRIPTION:DESCRIPTION,
           JOB_TYPE:JOB_TYPE,
           GROUP_ID:GROUP_ID,
           PLAYBOOK_FILE:PLAYBOOK_FILE,
           FORKS:FORKS,
           JOB_TAGS:JOB_TAGS,
           SKIP_TAGS:SKIP_TAGS,
           STATUS:STATUS,
           CANCELFLAG:CANCELFLAG,
           CELERYTASKID:CELERYTASKID,
           EXTRA_VARIABLES:EXTRA_VARIABLES,
           Login_credentials:Login_credentials,
           Labels:Labels,
       },
       dataType:"json",
       success:function(data){
           if(data.resultCode=="0057"){
               opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
               return;
           }
           if(data.result=="Success"){
               opt_commons.dialogShow("成功信息","修改信息成功！！",2000);
               $("#job_table").bootstrapTable('refresh');
               return;
           }
       },

       error:function(data){
           if(data.result=="FAIELD!"){
               opt_commons.dialogShow("失败信息","修改信息失败！！",2000);
               $("#job_table").bootstrapTable('refresh');
               return ;
           }
       },
   });
}
var JOBS_HOST=[]
function runJob(data){

    $('#jobTempleteId').html(data.fields.TEMPLETE_ID);
    $('#groupId').html(data.fields.GROUP_ID);
    $('#jobTags').val(data.fields.JOB_TAGS);
    $('#skipTags').val(data.fields.SKIP_TAGS);
    $('#variable').val(data.fields.EXTRA_VARIABLES);
    $('#tipInfo').html("你确定要重新执行任务：[ "+data.fields.NAME+" ]?")
    $("#chooseHost").html('')
    if ($('#groupId').html()=='' || $('#groupId').html()==null){
        $('#chooseHost').change(function() {
            JOBS_HOST=$(this).val()
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
            groupId:$('#groupId').html(),
        },
        dataType: "json",
        success: function (data) {

            for (var i = 0; i < data.hostList.length; i++) {
                $("#chooseHost").append("<option value='" + data.hostList[i].fields.NAME + "' selected>" + data.hostList[i].fields.NAME + "</option>");

            }
            $('#chooseHost').change(function() {
                JOBS_HOST=$(this).val()
            }).multipleSelect({
                width: '62%',
                filter:true
            });
            console.log($('#chooseHost').val())

        },
        error: function () {
            console.log("error");
        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })
    $('#sureReRunModal').modal('show');
}

function beSureReRun(){
    $.ajax({
        type: 'POST',
        url: "/app_tower/job/run_job",
        data: {
            id: $('#jobTempleteId').html(),
            hostList:JSON.stringify(JOBS_HOST),
            jobTags:$('#jobTags').val(),
            skipTags:$('#skipTags').val(),
            variable:$('#variable').val(),
        },
        dataType: "json",
        success: function (data) {
            if(data.resultCode=="0057"){
                opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                return;
            }
            //alert(data.data.taskid)
            window.location.href='/static/templates/pages/app_tower_pages/jobTemplete/jobTemplate_run.html?taskid='+ data.data.taskid
                +'&name='+data.data.name+'&from=jobs'+'&logfile='+data.data.logfile+'&jobsid='+data.jobsid+'&userName='+data.data.userName+'&userId='+data.data.userId
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


function jobsSearch(){
     $("#job_table").bootstrapTable('refresh');
}

function jobsSearchReset(){
      $("#name").val("");
      $("#description").val("");
      $("#job_type").val("-1");
      $("#job_taskid").val("");
      $("#job_status").val("-1");
       jobsSearch();
}



//@ sourceURL=jobs.js