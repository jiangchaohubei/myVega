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
    var oTable_playbook = new TableInit_playbook();
    oTable_playbook.Init();

})

var TableInit_playbook= function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
       $('#playbook_table').bootstrapTable({
            url: '/app_tower/playbook/select',

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
                title: '名称',
                align : 'center',
                sortable : true,


            },{
                field: 'fields.DESCRIPTION',
                title: '描述',
                align : 'center',
                sortable : true

            }, {
                    field: 'fields.PLAYBOOK_PATH',
                    title: 'playbook路径',
                    align : 'center',
                    sortable : true

                },{
                    field: 'fields.CREATE_TIME',
                    title: '创建时间',
                    align : 'center',
                    sortable : true

                },{
                    field: 'fields.CREATE_USER_NAME',
                    title: '创建人',
                    align : 'center',
                    sortable : true

                },{
                //field: 'count',
                title: '操作',
                align : 'center',
                sortable : true,
                formatter:function(value, row, index){
                    var data=JSON.stringify(row);
                    //var group=row.pk+","+row.fields.NAME+","+ row.fields.DESCRIPTION+","+row.fields.VARIABLES+","+row.fields.OWNER_NAME+","+row.fields.OWNER_ID+","+row.fields.OWNER_PROJECT_ID+","+row.fields.OWNER_ALL;
                        return "<a class='btn btn-warning btn-xs' title=" + '编辑' +
            " href='javascript:updatePlaybookModal(" + data + ");'>" +
            "<i class='ace-icon fa fa-pencil bigger-130'></i>编辑</a>" +
            "    <a  class='btn btn-danger btn-xs' title=" + '删除' +
            " href='javascript:showDeletePlaybookModal(" + data +");'>" +
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
            name:$("#search_Name").val().trim(),
            userName:$("#search_userName").val().trim(),
        };
        return temp;
    };


return oTableInit;
};


 //删除主机组模态框
 function showDeletePlaybookModal(data){

     $("#deletePlaybookModal").modal("show");
     $("#delete_id").val(data.pk);
     $("#deleteName").html(data.fields.NAME);
     $("#deleteDescription").html(data.fields.DESCRIPTION);
     $("#deleteDir").html(data.fields.FILEDIR);
     $('#reviewTextarea').val(data.fields.PLAYBOOK_CONTENT)

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
 //删除PLAYBOOK
function deletePlaybook(){
    var id=$("#delete_id").val();
     $.ajax({
       url:"/app_tower/playbook/delete",
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
           if(data.resultCode=="SUCCESS"){
                opt_commons.dialogShow("成功信息","删除信息成功！",2000);
               $("#playbook_table").bootstrapTable('refresh');
               return;
           }
           if(data.resultCode=="FAILED"){
               opt_commons.dialogShow("失败信息",data.resultDesc,2000);
               $("#playbook_table").bootstrapTable('refresh');
               return;
           }
       },
       error: function(data) {

                console.log("error");

        },
   });
}

 //修改playbook模态框
function updatePlaybookModal(data){

     $("#updatePlaybookModal").modal("show");
     $("#updatePlaybook_id").val(data.pk);
     $("#updatePlaybook_name").val(data.fields.NAME);
     $("#updatePlaybook_description").val(data.fields.DESCRIPTION);
    $("#updatePlaybook_dir").val(data.fields.FILEDIR);
    $('#editTextarea').val(data.fields.PLAYBOOK_CONTENT)

    $("#updatePlaybook_owner").html('');
    $('#updatePlaybook_owner').append('<option value="onlyOne" selected>'+'仅自己'+'</option>')
    $('#updatePlaybook_owner').append('<option value="all" >'+'所有人'+'</option>')
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

            if (data.fields.OWNER_ID!='null'&& data.fields.OWNER_ID!=''){
                $("#updatePlaybook_owner").val('onlyOne');
            }else if(data.fields.OWNER_ALL=='true'){
                $("#updatePlaybook_owner").val('all');
            }

            for (var i=0;i<result.projectList.length;i++){
                if (result.projectList[i].pk==data.fields.OWNER_PROJECT_ID){
                    $('#updatePlaybook_owner').append('<option value="'+result.projectList[i].pk+'" selected>'+result.projectList[i].fields.NAME+'</option>')
                }else{
                    $('#updatePlaybook_owner').append('<option value="'+result.projectList[i].pk+'" >'+result.projectList[i].fields.NAME+'</option>')
                }
            }


        },
        error: function(result) {

            console.log("error");

        },
    });

}
function updatePlaybook(){
    opt_commons.query_validate("#update_playbook_form");
    //校验不成功
    if (!$('#update_playbook_form').valid()){
        return;
    }
    var id=$("#updatePlaybook_id").val();
    var name=$("#updatePlaybook_name").val();
    var description=$("#updatePlaybook_description").val();
    var content=$("#editTextarea").val() ;
    var dir=$("#updatePlaybook_dir").val() ;
    $.ajax({
       url:"/app_tower/playbook/update",
       type:"POST",
       data:{
           id:id,
           name:name,
           description:description,
           content:content,
           dir:dir,
           owner:$("#updatePlaybook_owner").val()
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
           if(data.resultCode=="0000"){
               opt_commons.dialogShow("成功信息","修改信息成功！",2000);
               $("#playbook_table").bootstrapTable('refresh');
                return;
           }
       },
        error: function(data) {

                console.log("error");

        },
   });

}
  function search() {
    $("#playbook_table").bootstrapTable('refresh');
  }

  function searchReset(){
       $("#search_Name").val("");
       $("#search_userName").val("");
       search();
   }



   function showPlaybookReviewModal(){
        $('#reviewPlaybookModal').modal('show')

   }
   function editContent(){
       $('#editPlaybookModal').modal('show')
   }





//@ sourceURL=playbook.js