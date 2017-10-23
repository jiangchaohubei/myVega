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
$(function(){
    var oTable_inventories = new TableInit_inventories();
    oTable_inventories.Init();


})

var TableInit_inventories = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#job_table').bootstrapTable({
            url: '/app_tower/job/select',

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
                $.each(data, function (i, row) {
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
                visible:true
            },
                {
                field: 'fields.NAME',
                title: '任务名称',
                align : 'center',
                sortable : true,
                formatter:function(value, row, index){
                    return  value;
                    //'<a href="/static/templates/pages/jobTemplate_run.html?id='+row.pk+'&name='+row.fields.NAME+'">'+value+'</a>'
                }

            },{
                field: 'fields.DESCRIPTION',
                title: '描述',
                align : 'center',
                sortable : true

            },{
                    field: 'fields.PLAYBOOK_ID',
                    title: 'playbook',
                    align : 'center',
                    sortable : true

                },{
                    field: 'fields.PLAYBOOK_FILE',
                    title: 'playbook路径',
                    align : 'center',
                    sortable : true

                },{
                field: 'fields.JOB_TYPE',
                title: '执行类型',
                align : 'center',
                sortable : true

            }, {
                    field: 'fields.CREATE_USER_NAME',
                    title: '创建人',
                    align : 'center',
                    sortable : true

                }, {
                    field: 'fields.CREATE_TIME',
                    title: '创建时间',
                    align : 'center',
                    sortable : true

                }, {
                //field: 'count',
                title: '操作',
                align : 'center',
                sortable : true,
                formatter:function(value, row, index){
                        var id=row.pk;
                    // var jobTemplate=row.pk+","+row.fields.NAME+","+row.fields.DESCRIPTION+","+row.fields.JOB_TYPE
                    // +","+row.fields.GROUP_ID+","+row.fields.PLAYBOOK_FILE+","+row.fields.FORKS+","
                    // +row.fields.JOB_TAGS+","+row.fields.SKIP_TAGS;
                        var data=JSON.stringify(row);
                        return "<a class='btn btn-primary btn-xs' title=" + '执行' +
            " href='javascript:runJob(" + data + ");'>" +
            "<i class='ace-icon fa fa-rocket bigger-130'></i>执行</a>" +
            " <a class='btn btn-warning btn-xs' title=" + '编辑' +
            " href='javascript:showUpdateJobModal("+data+");'>" +
            "<i class='ace-icon fa fa-pencil bigger-130'></i>编辑</a>" +
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

    var credential_machine_id=data.fields.CREDENTIAL_MACHINE_ID;
    var GROUP_ID=data.fields.GROUP_ID;
    $.ajax({
        type: 'POST',
        url: "/app_tower/job/init_commands_select",
        data: {},
        dataType: "json",
        success: function (data) {
            for (var i = 0; i < data.credentialsList.length; i++) {
                if(data.credentialsList[i].pk==credential_machine_id){
                     $("#deleteLogin_credentials").html(data.credentialsList[i].fields.NAME);
                }
            }

            for (var i = 0; i < data.groupList.length; i++) {
                if(data.groupList[i].pk==GROUP_ID){
                    $("#deleteGroup_id").html(data.groupList[i].fields.NAME);
                }
            }
        },
        error: function () {
            console.log("error");
        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })




    $("#deletePlaybook_file").html(data.fields.PLAYBOOK_ID);
    $("#deleteForks").html(data.fields.FORKS);
    $("#deleteJob_tags").html(data.fields.JOB_TAGS);
    $("#deleteSkip_tags").html(data.fields.SKIP_TAGS);
    $("#deleteExtra_variable").html(data.fields.EXTRA_VARIABLES);
    $("#deleteLabels").html(data.fields.LABELS);
    if (data.fields.OWNER_ID){
        $("#deleteOwner").html('仅自己');
    }else if(data.fields.OWNER_ALL){
        $("#deleteOwner").html('所有人');
    }else if (data.fields.OWNER_PROJECT_ID){

        $.ajax({
            url:"/app_tower/project/init_ProjectModal",
            type:"POST",
            data:{
                id:data.fields.OWNER_PROJECT_ID
            },
            dataType:"json",
            success:function(result){
                if(result.resultCode=="0057"){
                    opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                    return;
                }
                $("#delete_owner").html(result.projectName);
            },
            error: function(result) {
                console.log("error");
            },
        });
    }
}
//删除任务
function deleteJobTemplate(){
         var id=$("#delete_id").val();
     $.ajax({
       url:"/app_tower/job/delete",
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
           if(data.result=="FAILED"){
               opt_commons.dialogShow("失败信息","删除失败，禁止删除！",2000);
               $("#job_table").bootstrapTable('refresh');
               return;
           }
       },
        error: function(data) {

                console.log("error");
                 $("#job_table").bootstrapTable('refresh');

        },
   });
}

//修改模态框
function showUpdateJobModal(data){
    $("#updateLogin_credentials").html("");
    $("#updateGroup_id").html("");
    $("#updatePlaybook_file").html("");

    var credential_machine_id=data.fields.CREDENTIAL_MACHINE_ID;
    var GROUP_ID=data.fields.GROUP_ID;
    var playbookName=data.fields.PLAYBOOK_ID;
     $.ajax({
        type: 'POST',
        url: "/app_tower/job/init_commands_select",
        data: {},
        dataType: "json",
        success: function (data) {
            for (var i = 0; i < data.credentialsList.length; i++) {
                if(data.credentialsList[i].pk==credential_machine_id){
                     $("#updateLogin_credentials").append("<option selected value='" + data.credentialsList[i].pk + "'>" + data.credentialsList[i].fields.NAME + "</option>");
                }else{
                     $("#updateLogin_credentials").append("<option  value='" + data.credentialsList[i].pk + "'>" + data.credentialsList[i].fields.NAME + "</option>");
                }
            }

            for (var i = 0; i < data.groupList.length; i++) {
                if(data.groupList[i].pk==GROUP_ID){
                     $("#updateGroup_id").append("<option selected value='" + data.groupList[i].pk + "'>" + data.groupList[i].fields.NAME + "</option>");
                }else{
                     $("#updateGroup_id").append("<option  value='" + data.groupList[i].pk + "'>" + data.groupList[i].fields.NAME + "</option>");
                }
            }
            for (var i = 0; i < data.playbooksList.length; i++) {
                if(data.playbooksList[i].fields.NAME==playbookName){
                    $("#updatePlaybook_file").append("<option selected value='" + data.playbooksList[i].pk + "'>" + data.playbooksList[i].fields.NAME + "</option>");
                }else{
                    $("#updatePlaybook_file").append("<option  value='" + data.playbooksList[i].pk + "'>" + data.playbooksList[i].fields.NAME + "</option>");
                }
            }
            if (playbookName==null){
                $("#updatePlaybook_file").append("<option selected value=''>" + "无" + "</option>");
            }



        },
        error: function () {
            console.log("error");
        },
        complete: function (XMLHttpRequest, textStatus) {
            console.log("complete");
        }
    })

    $("#updateJobModal").modal("show");
    $("#update_id").val(data.pk);
    $("#updateName").val(data.fields.NAME);
    $("#updateDescription").val(data.fields.DESCRIPTION);
    $("#updateJob_type").val(data.fields.JOB_TYPE);
   // $("#updatePlaybook_file").val(data.fields.PLAYBOOK_FILE);
    $("#updateForks").val(data.fields.FORKS);
    $("#updateJob_tags").val(data.fields.JOB_TAGS);
    $("#updateSkip_tags").val(data.fields.SKIP_TAGS);
    $("#updateExtra_variable").val(data.fields.EXTRA_VARIABLES);
    $("#updateLabels").val(data.fields.LABELS);
    $("#update_owner").html('');
    $('#update_owner').append('<option value="onlyOne" >'+'仅自己'+'</option>')
    $('#update_owner').append('<option value="all" selected>'+'所有人'+'</option>')
    $.ajax({
        url:"/app_tower/project/init_project_select",
        type:"POST",
        data:{

        },
        dataType:"json",
        success:function(result){
            if(result.resultCode=="0057"){
                opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                return;
            }

            if (data.fields.OWNER_ID){
                $("#update_owner").val('onlyOne');
            }else if(data.fields.OWNER_ALL){
                $("#update_owner").val('all');
            }

            for (var i=0;i<result.projectList.length;i++){
                if (result.projectList[i].pk==data.fields.OWNER_PROJECT_ID){
                    $('#update_owner').append('<option value="'+result.projectList[i].pk+'" selected>'+result.projectList[i].fields.NAME+'</option>')
                }else{
                    $('#update_owner').append('<option value="'+result.projectList[i].pk+'" >'+result.projectList[i].fields.NAME+'</option>')
                }
            }


        },
        error: function(result) {

            console.log("error");

        },
    });
}

function updateJobTemplate(){
    opt_commons.query_validate("#update_jobtemplete_form");
    //校验不成功
    if (!$('#update_jobtemplete_form').valid()){
        return;
    }
    var id=$("#update_id").val();
    var NAME=$("#updateName").val();
    var DESCRIPTION=$("#updateDescription").val();
    var JOB_TYPE=$("#updateJob_type").val();
    var GROUP_ID=$("#updateGroup_id").val();
    var PLAYBOOK_FILE=$("#updatePlaybook_file").val();
    var FORKS=$("#updateForks").val();
    var JOB_TAGS=$("#updateJob_tags").val() ? $('#updateJob_tags').val():"";
    var SKIP_TAGS=$("#updateSkip_tags").val() ? $('#updateSkip_tags').val():"";
    var EXTRA_VARIABLES=$("#updateExtra_variable").val() ? $('#updateExtra_variable').val():"";
    var Login_credentials=$("#updateLogin_credentials").val() ? $('#updateLogin_credentials').val():"";
    var Labels=$("#updateLabels").val() ? $('#updateLabels').val():"";
    $.ajax({
       url:"/app_tower/job/update",
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
           EXTRA_VARIABLES:EXTRA_VARIABLES,
           Login_credentials:Login_credentials,
           Labels:Labels,
           owner:$("#update_owner").val(),
       },
       dataType:"json",
       success:function(data){
           if(data.resultCode=="0057"){
               opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
               return;
           }
           if(data.resultCode=="0001"){
               opt_commons.dialogShow("提示信息",data.resultDesc,2000);
               return;
           }
           if(data.result=="Success"){

               opt_commons.dialogShow("成功信息","修改信息成功！！",2000);
               $("#job_table").bootstrapTable('refresh');
               return;
           }
       },

       error:function(data){

               console.log('error')
               $("#job_table").bootstrapTable('refresh');

       },
   });
}
var JOB_HOST=[]
function runJob(data){

    $('#jobTempleteId').html(data.pk);
    $('#groupId').html(data.fields.GROUP_ID);
    $('#jobTags').val(data.fields.JOB_TAGS);
    $('#skipTags').val(data.fields.SKIP_TAGS);
    $('#variable').val(data.fields.EXTRA_VARIABLES);
    $('#tipInfo').html("你确定要执行任务：[ "+data.fields.NAME+" ]?")
    $("#chooseHost").html('')
    if ($('#groupId').html()=='' || $('#groupId').html()==null){
        $('#chooseHost').change(function() {
            JOB_HOST=$(this).val()
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
                JOB_HOST=$(this).val()
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
    $('#sureRunModal').modal('show');
}

function beSureRun(){

    $.ajax({
        type: 'POST',
        url: "/app_tower/job/run_job",
        data: {
            id: $('#jobTempleteId').html(),
            hostList:JSON.stringify(JOB_HOST),
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
            window.location.href='/static/templates/pages/app_tower_pages/jobTemplete/jobTemplate_run.html?taskid='+ data.data.taskid+
                '&name='+data.data.name+'&from=jobTemplete'+'&logfile='+data.data.logfile+'&jobsid='+data.jobsid+'&userName='+data.data.userName+'&userId='+data.data.userId
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


function jobTemplatesearch(){
     $("#job_table").bootstrapTable('refresh');
}

function jobTemplatesearchReset(){
      $("#name").val("");
      $("#description").val("");
      $("#Labels").val("");
       jobTemplatesearch();
}
//预览
function showReviewModal() {

    $.ajax({
        type: 'POST',
        url: "/app_tower/review_file",
        data: {
            filePath:$('#updatePlaybook_file').val()
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

//@ sourceURL=jobTemplate.js