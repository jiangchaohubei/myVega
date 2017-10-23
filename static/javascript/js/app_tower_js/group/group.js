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
       $('#inventories_table').bootstrapTable({
            url: '/app_tower/group/select',

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
                    return '<a href="/static/templates/pages/app_tower_pages/group/group_name.html?id='+row.pk+'&name='+value+'">'+row.fields.NAME+'</a>'
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
                    var group=row.pk+","+row.fields.NAME+","+ row.fields.DESCRIPTION+","+row.fields.VARIABLES+","+row.fields.OWNER_NAME+","+row.fields.OWNER_ID+","+row.fields.OWNER_PROJECT_ID+","+row.fields.OWNER_ALL;
                        return "<a class='btn btn-warning btn-xs' title=" + '编辑' +
            " href='javascript:updateGroupModal(\"" + group + "\");'>" +
            "<i class='ace-icon fa fa-pencil bigger-130'></i>编辑</a>" +
            "    <a  class='btn btn-danger btn-xs' title=" + '删除' +
            " href='javascript:showDeleteGroupModal(\"" + group +"\");'>" +
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
 function showDeleteGroupModal(data){
    var group = data.split(',');
     $("#myModal").modal("show");
     $("#delete_id").val(group[0]);
     $("#deleteName").html(group[1]);
     $("#deleteDescription").html(group[2]);
     $("#deleteVariables").html(group[3]);
     if (group[5]!='null'&& group[5]!=''){
         $("#deleteOwner").html('仅自己');
     }else if(group[7]=='true'){
         $("#deleteOwner").html('所有人');
     }else if (group[6]!='null'&& group[6]!=''){

         $.ajax({
             url:"/app_tower/project/init_ProjectModal",
             type:"POST",
             data:{
                 id:group[6]
             },
             dataType:"json",
             success:function(result){
                 if(result.resultCode=="0057"){
                     opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                     return;
                 }
                 $("#deleteOwner").html(result.projectName);
             },
             error: function(result) {
                 console.log("error");
             },
         });
     }



}
 //删除主机组
function deleteGroup(){
    var id=$("#delete_id").val();
     $.ajax({
       url:"/app_tower/group/delete",
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
               $("#inventories_table").bootstrapTable('refresh');
               return;
           }
           if(data.result=="FAILED"){
               opt_commons.dialogShow("失败信息","删除失败，禁止删除！",2000);
               $("#inventories_table").bootstrapTable('refresh');
               return;
           }
       },
       error: function(data) {

                console.log("error");

        },
   });
}

 //修改主机组模态框
function updateGroupModal(data){
    var group = data.split(',');
     $("#updateGroupModal").modal("show");
     $("#updateGroup_id").val(group[0]);
     $("#updateGroup_name").val(group[1]);
     $("#updateGroup_description").val(group[2]);
     $("#updateGroup_variables").val(group[3]);
    $("#updateGroup_owner").html('');
    $('#updateGroup_owner').append('<option value="onlyOne" >'+'仅自己'+'</option>')
    $('#updateGroup_owner').append('<option value="all" selected>'+'所有人'+'</option>')
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

            if (group[5]!='null'&& group[5]!=''){
                $("#updateGroup_owner").val('onlyOne');
            }else if(group[7]=='true'){
                $("#updateGroup_owner").val('all');
            }

            for (var i=0;i<result.projectList.length;i++){
                if (result.projectList[i].pk==group[6]){
                    $('#updateGroup_owner').append('<option value="'+result.projectList[i].pk+'" selected>'+result.projectList[i].fields.NAME+'</option>')
                }else{
                    $('#updateGroup_owner').append('<option value="'+result.projectList[i].pk+'" >'+result.projectList[i].fields.NAME+'</option>')
                }
            }


        },
        error: function(result) {

            console.log("error");

        },
    });

}
function updateGroup(){
    opt_commons.query_validate("#update_group_form");
    //校验不成功
    if (!$('#update_group_form').valid()){
        return;
    }
    var id=$("#updateGroup_id").val();
    var name=$("#updateGroup_name").val();
    var description=$("#updateGroup_description").val();
    var variables=$("#updateGroup_variables").val() ? $('#updateGroup_variables').val():"";
    $.ajax({
       url:"/app_tower/group/update",
       type:"POST",
       data:{
           id:id,
           name:name,
           description:description,
           variables:variables,
           owner:$("#updateGroup_owner").val()
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
               $("#inventories_table").bootstrapTable('refresh');
                return;
           }
       },
        error: function(data) {

                console.log("error");

        },
   });

}
  function search() {
    $("#inventories_table").bootstrapTable('refresh');
  }

  function searchReset(){
       $("#name").val("");
       $("#description").val("");
       search();
   }



   function exportGroups(){
      $.ajax({
        type: 'POST',
        url: "/app_tower/group/export",
        dataType: "json",
        success: function (data) {
            if(data.resultDesc=="Success"){
                downloadExcel(data.filepath);
            }
        },
        error: function () {
            console.log("error");
        },
        complete: function () {
            console.log("complete");
        }
    })
    $("#exportModal").modal('hide');

   }

   function downloadExcel(filepath){
      window.open("/app_tower/group/export/download?filepath="+filepath);
      // window.open("/app_tower/group/export/download?filepath="+filepath+'&filename='+filename);
   }



//@ sourceURL=group.js