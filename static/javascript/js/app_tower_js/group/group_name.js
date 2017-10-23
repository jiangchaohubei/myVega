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
function onload_group_name(){
      opt_commons.query_validate("#host_form");
        C1=window.location.href.split("?")[1];
         id=C1.split("&")[0].split('=')[1];
         name=decodeURI(C1.split("&")[1].split('=')[1]);
        $('#groupName').html(name);
        $('#groupId').val(id);
        $('#uploadGroupId').val(id);
        var oTable_host = new TableInit_host();

        oTable_host.Init();

}
function save_host(){
    //校验不成功
    if (!$('#host_form').valid()){
        return;
    }
    var id=$('#groupId').val();
    var NAME=$('#hostName').val();
    var DESCRIPTION=$('#description').val();
    var VARIABLES=$('#variables').val() ? $('#variables').val():"";
    $.ajax({
        url:"/app_tower/host/add",
        type:"POST",
        data:{
            id:id,
            NAME:NAME,
            DESCRIPTION:DESCRIPTION,
            VARIABLES:VARIABLES
        },
        dataType:"json",
        success:function(data){
            if(data.resultCode=="0057"){
                opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                return;
            }
            if(data.resultCode=="0001"){
                console.log(data.resultCode)
                opt_commons.dialogShow("失败信息",data.resultDesc,2000);
                return;
            }
            if(data.resultCode=="0000"){
                console.log(data.resultCode)
                opt_commons.dialogShow("成功信息","添加成功！",2000);
                $("#host_table").bootstrapTable('refresh');
                $('#hostName').val('');
                $('#description').val('');
                $('#variables').val('');
                return;
            }
        },
        error: function(data) {

                opt_commons.dialogShow("提示信息","添加失败！",2000);
                console.log("error");

        },
    })

}
var TableInit_host = function () {

    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#host_table').bootstrapTable({
            url: '/app_tower/host/select',

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
                title: '主机地址',
                align : 'center',
                sortable : true,
                formatter:function(value, row, index){
                    return value
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
                    var host=row.pk+","+row.fields.NAME+","+ row.fields.DESCRIPTION+","+row.fields.VARIABLES;
                        return "<a class='btn btn-warning btn-xs' title=" + '编辑' +
            " href='javascript:showUpdateHostModal(\"" + host + "\");'>" +
            "<i class='ace-icon fa fa-pencil bigger-130'></i>编辑</a>" +
            "    <a class='btn btn-danger btn-xs' title=" + '删除' +
            " href='javascript:showDeleteHostModal(\"" + host + "\");'>" +
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
            id:$('#groupId').val(),
        };
        return temp;
    };
    return oTableInit;
};

//删除主机模态框
function showDeleteHostModal(data){
    var host = data.split(',');
    $("#deleteHostModal").modal("show");
    $("#delete_id").val(host[0]);
    $("#deleteName").html(host[1]);
    $("#deleteDescription").html(host[2]);
    $("#deleteVariables").html(host[3]);


}
//删除主机
function deleteHost(){
    var id=$("#delete_id").val();
    $.ajax({
        url:"/app_tower/host/delete",
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
            if(data.result=="SUCCESS"){
                opt_commons.dialogShow("成功信息","删除信息成功！",2000);
                $("#host_table").bootstrapTable('refresh');
                return;
            }
        },
        error: function(data) {

                console.log("error");
                $("#host_table").bootstrapTable('refresh');

        },
    });
}

//修改主机模态框
function showUpdateHostModal(data){
    var host = data.split(',');
    $("#updateHostModal").modal("show");
    $("#updateHost_id").val(host[0]);
    $("#updateHost_name").val(host[1]);
    $("#updateHost_description").val(host[2]);
    $("#updateHost_variables").val(host[3]);

}
function updateHost(){
    opt_commons.query_validate("#update_host_form");
    //校验不成功
    if (!$('#update_host_form').valid()){
        return;
    }

    var id=$("#updateHost_id").val();
    var name=$("#updateHost_name").val();
    var description=$("#updateHost_description").val();
    var variables=$("#updateHost_variables").val() ? $('#variables').val():"";
    $.ajax({
        url:"/app_tower/host/update",
        type:"POST",
        data:{
            id:id,
            groupId:$('#groupId').val(),
            name:name,
            description:description,
            variables:variables
        },
        dataType:"json",
        success:function(data){
            if(data.resultCode=="0057"){
                opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                return;
            }
            if(data.resultCode=="0000"){
                opt_commons.dialogShow("成功信息","修改信息成功！",2000);
                $("#host_table").bootstrapTable('refresh');
                return;
            }
            if(data.resultCode=="0001"){
                opt_commons.dialogShow("失败信息",data.resultDesc,2000);

                return;
            }
        },
        error: function(data) {

                console.log("error");
                $("#host_table").bootstrapTable('refresh');

        },
    });

}
function importHosts(){
    var formData = new FormData($( "#importForm" )[0]);
    formData.append("delete","false")
    $.ajax({
        url:"/app_tower/hosts/import",
        type:"POST",
        data: formData,
        cache: false,
        contentType: false,
        processData: false,
        dataType:"json",
        success:function(data){
            if(data.resultCode=="0057"){
                opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                return;
            }
            if(data.resultCode=="0001"){
                opt_commons.dialogShow("提示信息","错误！",2000);
                return;
            }

            if(data.resultCode=="0000"){
                console.log(data.resultDesc)
                $("#exampleModal").modal("hide");
                str ="上传成功！"
                repeatHost=data.resultDesc.repeatHost
                if(repeatHost.length!=0){
                    str+="重复IP："+repeatHost
                }
                opt_commons.dialogShow("成功信息",str);
                $("#host_table").bootstrapTable('refresh');
                return;
            }
        },
        error: function(data) {
                console.log("error");
                $("#host_table").bootstrapTable('refresh');

        },
    }
    )
}
function importAndDeleteHosts() {
    var formData = new FormData($( "#importAndDeleteForm" )[0]);
    formData.append("delete","true")
    formData.append("uploadGroupId",$('#groupId').val())
    $.ajax({
            url:"/app_tower/hosts/import",
            type:"POST",
            data: formData,
            cache: false,
            contentType: false,
            processData: false,
            dataType:"json",
            success:function(data){
                if(data.resultCode=="0057"){
                    opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                    return;
                }
                if(data.resultCode=="0001"){
                    opt_commons.dialogShow("提示信息","错误！",2000);
                    return;
                }
                if(data.resultCode=="0000"){
                    console.log(data.resultDesc)
                    $("#importAndDeleteModal").modal("hide");
                    str ="上传成功！"
                    repeatHost=data.resultDesc.repeatHost
                    if(repeatHost.length!=0){
                        str+="重复IP："+repeatHost
                    }
                    opt_commons.dialogShow("成功信息",str);
                    $("#host_table").bootstrapTable('refresh');
                    return;
                }
            },
            error: function(data) {
                console.log("error");
                $("#host_table").bootstrapTable('refresh');

            },
        }
    )
}


//@ sourceURL=group_name.js