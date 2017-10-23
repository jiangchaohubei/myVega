/**
 * Created by PC on 2017/9/7.
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
    var oTable_project = new TableInit_project();
    oTable_project.Init();

})

var TableInit_project = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#project_table').bootstrapTable({
            url: '/app_tower/project/select',

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
                    visible: true   //可见
                },
                {
                    field: 'fields.NAME',
                    title: '组名称',
                    align : 'center',
                    sortable : true,
                    formatter:function(value, row, index){
                        return value;
                        //'<a href="/static/templates/pages/app_tower_pages/project/project_name.html?id='+row.pk+'&name='+value+'">'+row.fields.NAME+'</a>'
                    }

                },{
                    field: 'fields.DESCRIPTION',
                    title: '描述',
                    align : 'center',
                    sortable : true

                }, {
                    //field: 'count',
                    title: '操作',
                    align : 'center',
                    sortable : true,
                    formatter:function(value, row, index){
                        var data=JSON.stringify(row);
                        return "<a class='btn btn-warning btn-xs' title=" + '编辑' +
                            " href='javascript:updateprojectModal(" + data + ");'>" +
                            "<i class='ace-icon fa fa-pencil bigger-130'></i>编辑</a>" +
                            "    <a class='btn btn-danger btn-xs' title=" + '删除' +
                            " href='javascript:showDeleteprojectModal(" + data +");'>" +
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


//删除主机组模态框
function showDeleteprojectModal(data){

        $.ajax({
            url:"/app_tower/project/init_ProjectModal",
            type:"POST",
            data:{
                id:data.pk
            },
            dataType:"json",
            success:function(result){
                if(result.resultCode=="0057"){
                    opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                    return;
                }

                if (data.fields.OWNER_NAME){
                    $("#deleteOwner").html('仅自己');
                }else if(data.fields.OWNER_ALL){
                    $("#deleteOwner").html('所有人');
                }else if (data.fields.OWNER_PROJECT_ID){
                    $("#deleteOwner").html(result.projectName);
                }
                $("#delete_id").val(data.pk);
                $("#deleteName").html(data.fields.NAME);
                $("#deleteDescription").html(data.fields.DESCRIPTION);
                ownerUsers=''
                for (var i=0;i<result.owner_user_List.length;i++){
                    if (i==(result.owner_user_List.length-1)){
                        ownerUsers+=result.owner_user_List[i].fields.username
                    }else{
                        ownerUsers+=result.owner_user_List[i].fields.username+','
                    }
                }
                $("#deleteUser").html(ownerUsers);
                $("#deleteProjectModal").modal("show");
            },
            error: function(result) {

                console.log("error");

            },
        });

}
//删除主机组
function deleteproject(){
    var id=$("#delete_id").val();
    $.ajax({
        url:"/app_tower/project/delete",
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
                $("#project_table").bootstrapTable('refresh');
                return;
            }
        },
        error: function(data) {

            console.log("error");

        },
    });
}

//修改主机组模态框
function updateprojectModal(data){
    $.ajax({
        url:"/app_tower/project/init_ProjectModal",
        type:"POST",
        data:{
            id:data.pk
        },
        dataType:"json",
        success:function(result){
            if(result.resultCode=="0057"){
                opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                return;
            }
            if (data.fields.OWNER_NAME){
                $("#updateProject_owner").val('onlyOne');
            }else if(data.fields.OWNER_ALL){
                $("#updateProject_owner").val('all');
            }else if (data.fields.OWNER_PROJECT_ID){
                $("#updateProject_owner").val('onlyProject');
            }
            $("#updateProject_id").val(data.pk);
            $("#updateProject_name").val(data.fields.NAME);
            $("#updateProject_description").val(data.fields.DESCRIPTION);
            var ownerUsers=[]
            for (var i=0;i<result.owner_user_List.length;i++){
                ownerUsers.push(result.owner_user_List[i].pk)
            }
            $("#updateProject_users").empty();
            for (var i=0;i<result.user_List.length;i++){
                if ($.inArray(result.user_List[i].pk, ownerUsers)!= -1){//存在
                    $('#updateProject_users').append('<option value="'+result.user_List[i].pk+'" selected>'+result.user_List[i].fields.username+'</option>')
                }else{
                    $('#updateProject_users').append('<option value="'+result.user_List[i].pk+'">'+result.user_List[i].fields.username+'</option>')
                }
            }
            $('#updateProject_users').append('</optgroup>')
            $('#updateProject_users').selectpicker('render');
            $('#updateProject_users').selectpicker('refresh');
            $("#updateProjectModal").modal("show");
        },
        error: function(result) {

            console.log("error");

        },
    });


}
function updateproject(){
    opt_commons.query_validate("#update_project_form");
    //校验不成功
    if (!$('#update_project_form').valid()){
        console.log('校验不成功')
        return;
    }
    var id=$("#updateProject_id").val();
    var project_name=$('#updateProject_name').val();
    var project_discription=$('#updateProject_description').val();
    var project_owner=$('#updateProject_owner').val()
    var project_users=$('#updateProject_users').val()+',';
    var project_usersList=project_users.split(',');
    project_usersList.pop();
    $.ajax({
        url:"/app_tower/project/update",
        type:"POST",
        data:{
            id:id,
            NAME:project_name,
            DESCRIPTION:project_discription,
            OWNER:project_owner,
            USERS:project_usersList,
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
                opt_commons.dialogShow("成功信息","修改信息成功！",2000);
                $("#project_table").bootstrapTable('refresh');
                return;
            }
        },
        error: function(data) {

            console.log("error");

        },
    });

}
function search() {
    $("#project_table").bootstrapTable('refresh');
}

function searchReset(){
    $("#name").val("");
    $("#description").val("");
    search();
}







//@ sourceURL=project.js