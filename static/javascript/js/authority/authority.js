var userselectionIds = [];  //保存选中ids
var roleselectionIds = [];  //保存选中ids
Array.prototype.removeByValue = function(val) {
    for(var i=0; i<this.length; i++) {
        if(this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}
$(function(){
     var usergrant_table = new TableInit_usergrant();
    usergrant_table.Init();
    var rolegrant_table = new TableInit_rolegrant();
    rolegrant_table.Init();

    opt_commons.query_validate("#formrolegrantSearch");
    opt_commons.query_validate("#formusergrantSearch");
    opt_commons.query_validate("#register_form");

    opt_commons.query_validate("#update_user_form");


});


// 用户授权管理
var TableInit_usergrant = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#usergrant_table').bootstrapTable({
            url: '/authority/select/user',
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
                if ($.inArray(row.pk, userselectionIds)== -1){//不存在
                    userselectionIds.push(row.pk);
                }
            },
            onUncheck: function (row) {
                //单行最前面的checkbox被取消
                console.log(row)
                if ($.inArray(row.pk, userselectionIds)!= -1){//存在
                    userselectionIds.removeByValue(row.pk)
                }


            },
            onCheckAll: function (rows) {
                //最顶上的checkbox被选中
                console.log(rows)
                for (var i=0;i<rows.length;i++){
                    if ($.inArray(rows[i].pk, userselectionIds)== -1){//不存在
                        userselectionIds.push(rows[i].pk)
                    }
                }
            },
            onUncheckAll: function (rows) {
                //最顶上的checkbox被取消
                console.log(rows)
                for (var i=0;i<rows.length;i++){
                    if ($.inArray(rows[i].pk, userselectionIds)!= -1){//存在
                        userselectionIds.removeByValue(rows[i].pk)
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
                    row.checkStatus = $.inArray(row.pk, userselectionIds) != -1;  //判断当前行的数据id是否存在与选中的数组，存在则将多选框状态变为true
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
                    field: 'fields.username',
                    title: '用户名',
                    align : 'center',
                    sortable : true,
                    hidden:true
                },{
                field: 'fields.role',
                title: '用户类型',
                align : 'center',
                sortable : true,


            },{
                field: 'fields.mobile',
                title: '手机号',
                align : 'center',
                sortable : true

            },{
                field: 'fields.email',
                title: '用户邮箱',
                align : 'center',
                sortable : true

            },
                {
                field: 'fields.nickname',
                title: '昵称',
                align : 'center',
                sortable : true,

            },{
                    field: 'fields.createTime',
                    title: '注册时间',
                    align : 'center',
                    sortable : true,

                },{
                    field: 'fields.updateTime',
                    title: '更新时间',
                    align : 'center',
                    sortable : true,
                }, {
                //field: 'count',
                title: '操作',
                align : 'center',
                sortable : true,
                formatter:function(value, row, index){
                    var user=row.pk+","+row.fields.username+","+row.fields.nickname+","+row.fields.role+
                        ","+row.fields.mobile+","+row.fields.email+","+row.fields.createTime+","
                        +row.fields.updateTime;
                        if (row.fields.role=='超级管理员'){
                            return '-'
                        }else{
                            return "<a class='btn btn-warning btn-xs' title=" + '编辑' +
                                " href='javascript:showUpdateUserModal(\"" + user + "\");'>" +
                                "<i class='ace-icon fa fa-pencil bigger-130'></i>编辑</a>" +
                                " <a class='btn btn-danger btn-xs' title=" + '删除' +
                                " href='javascript:showDeleteUserModal(\"" + user + "\");'>" +
                                "<i class='ace-icon fa fa-trash-o bigger-130'></i>删除</a>";
                        }

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
            username:$("#usergrant_username").val().trim(),
            mobile:$("#usergrant_mobile").val().trim(),
            nickname:$("#usergrant_nickname").val().trim(),
            email:$("#usergrant_email").val().trim(),
        };
        return temp;
    };
    return oTableInit;
};


//  角色授权管理
var TableInit_rolegrant = function () {
    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#rolegrant_table').bootstrapTable({
            url: '/authority/select/role',
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
            clickToSelect: true, //是否启用点击选中行
            height: 345, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            showToggle:true, //是否显示详细视图和列表视图的切换按钮
            cardView: false, //是否显示详细视图
            detailView: false, //是否显示父子表
            onClickRow:onClickRow,
            onCheck: function (row) {
                //单行最前面的checkbox被选中
                console.log(row)
                if ($.inArray(row.pk, roleselectionIds)== -1){//不存在
                    roleselectionIds.push(row.pk);
                }
            },
            onUncheck: function (row) {
                //单行最前面的checkbox被取消
                console.log(row)
                if ($.inArray(row.pk, roleselectionIds)!= -1){//存在
                    roleselectionIds.removeByValue(row.pk)
                }


            },
            onCheckAll: function (rows) {
                //最顶上的checkbox被选中
                console.log(rows)
                for (var i=0;i<rows.length;i++){
                    if ($.inArray(rows[i].pk, roleselectionIds)== -1){//不存在
                        roleselectionIds.push(rows[i].pk)
                    }
                }
            },
            onUncheckAll: function (rows) {
                //最顶上的checkbox被取消
                console.log(rows)
                for (var i=0;i<rows.length;i++){
                    if ($.inArray(rows[i].pk, roleselectionIds)!= -1){//存在
                        roleselectionIds.removeByValue(rows[i].pk)
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
                    row.checkStatus = $.inArray(row.pk, roleselectionIds) != -1;  //判断当前行的数据id是否存在与选中的数组，存在则将多选框状态变为true
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
                title: '序号',
                align : 'center',
                sortable : true,
                visible:true

            },{
                    field: 'fields.name',
                    title: '角色名',
                    align : 'center',
                    sortable : true,
                    hidden:true
                },
                {
                // field: 'fields.NAME',
                title: '查询',
                align : 'center',
                sortable : true,
                formatter:function(value, row, index){
                   var data=row.pk+","+row.fields.name+","+"查询";
                    return "<a title='详情' onclick='authority_showUpdateRoleModel(\""+data+"\")'>详情</a>";

                    }

            },{

                    title: '登录凭证操作',
                    align : 'center',
                    sortable : true,
                    formatter:function(value, row, index){
                        var data=row.pk+","+row.fields.name+","+"登录凭证操作";
                        return "<a title='详情' onclick='authority_showUpdateRoleModel(\"" + data + "\")'>详情</a>";

                    }

                },{

                    title: '项目组操作',
                    align : 'center',
                    sortable : true,
                    formatter:function(value, row, index){
                        var data=row.pk+","+row.fields.name+","+"项目组操作";
                        return "<a title='详情' onclick='authority_showUpdateRoleModel(\"" + data + "\")'>详情</a>";

                    }

                },{

                    title: '主机组操作',
                    align : 'center',
                    sortable : true,
                   formatter:function(value, row, index){
                     var data=row.pk+","+row.fields.name+","+"主机组操作";
                    return "<a title='详情' onclick='authority_showUpdateRoleModel(\"" + data + "\")'>详情</a>";

                    }

                },{

                    title: 'playbook操作',
                    align : 'center',
                    sortable : true,
                    formatter:function(value, row, index){
                        var data=row.pk+","+row.fields.name+","+"playbook操作";
                        return "<a title='详情' onclick='authority_showUpdateRoleModel(\"" + data + "\")'>详情</a>";

                    }

                },{
                    title: '任务模板操作',
                    align : 'center',
                    sortable : true,
                    formatter:function(value, row, index){
                     var data=row.pk+","+row.fields.name+","+"任务模板操作";
                    return "<a title='详情' onclick='authority_showUpdateRoleModel(\"" + data + "\")'>详情</a>";
                    }
                },
                {
                    title: '任务操作',
                    align : 'center',
                    sortable : true,
                    formatter:function(value, row, index){
                    var data=row.pk+","+row.fields.name+","+"任务操作";
                    return "<a title='详情' onclick='authority_showUpdateRoleModel(\"" + data + "\")'>详情</a>";

                    }

                },
                {
                    title: 'commands操作',
                    align : 'center',
                    sortable : true,
                    formatter:function(value, row, index){
                        var data=row.pk+","+row.fields.name+","+"commands操作";
                        return "<a title='详情' onclick='authority_showUpdateRoleModel(\"" + data + "\")'>详情</a>";

                    }

                },
                {
                    title: '数据统计',
                    align : 'center',
                    sortable : true,
                    formatter:function(value, row, index){
                        var data=row.pk+","+row.fields.name+","+"数据统计";
                        return "<a title='详情' onclick='authority_showUpdateRoleModel(\"" + data + "\")'>详情</a>";

                    }

                },
                {
                title: '权限管理',
                align : 'center',
                sortable : true,
                formatter:function(value, row, index){
                    var data=row.pk+","+row.fields.name+","+"权限管理";
                    return "<a title='详情' onclick='authority_showUpdateRoleModel(\"" + data + "\")'>详情</a>";
                    }

            },
                {
                //field: 'count',
                title: '操作',
                align : 'center',
                sortable : true,

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
            name:$("#rolegrantname").val().trim(),
        };
        return temp;
    };
    return oTableInit;
};





function authority_showUpdateRoleModel(data){
     var role=data.split(',');
     var id=role[0];
     var roleName=role[1];
     var title=role[2];
    $("#authority_role_Modal_Head").html(roleName + "---"+title);
    $('#authority_updateRolemodal').find(".modal-body").html("");
    $('#authority_updateRolemodal').find(".modal-body").load("/authority/select/parentPermission", {
        title:title,
        id:id
    });

     $("#authority_updateRolemodal").modal("show");
}

function showSaveUserModel () {
    $("#myModal").modal("show");
    $('#save_role').html("")
    $.ajax({
        url:"/authority/select/init_role",
        type:"POST",
        data:{

        },
        dataType:"json",
        success:function(data){
            rolesList = data.roles
            for (var i=0;i<rolesList.length;i++){
                $('#save_role').append("<option  value='" + rolesList[i].fields.name + "'>" + rolesList[i].fields.name + "</option>");

            }

        },
        error: function(data) {
            console.log("error");
        },
    });

}
function saveUser(){

    var username=$("#save_username").val();
    var role=$("#save_role").val();
    var mobile=$("#save_mobile").val();
    var email=$("#save_email").val();
    var nickname=$("#save_nickname").val();
    var createTime=$("#save_createTime").val();
     $.ajax({
       url:"/authority/save/user",
       type:"POST",
       data:{
           username:username,
           mobile:mobile,
           email:email,
           nickname:nickname,
           createTime:createTime,
           role:role,
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
           if(data.result=="FAIELD!"&&data.usernamemessage=="用户名长度不能少于5位!"){
                opt_commons.dialogShow("失败信息","添加用户失败,用户名长度不能少于5位！",2000);
                 $("#usergrant_table").bootstrapTable('refresh');
                return;
            }

            if(data.result=="FAIELD!"&&data.mobilememessage=="手机号码不正确!"){
                opt_commons.dialogShow("失败信息","添加用户失败,手机号码不正确!请重新输入",2000);
                 $("#usergrant_table").bootstrapTable('refresh');
                return;
            }
            if(data.result=="FAIELD!"&&data.emailmemessage=="邮箱不正确!"){
                opt_commons.dialogShow("失败信息","添加用户失败,邮箱不正确!请重新输入,格式'user@example.com",2000);
                 $("#usergrant_table").bootstrapTable('refresh');
                return;
            }

           if(data.result=="Success!"){
               opt_commons.dialogShow("成功信息","保存信息成功初始密码88888888！",2000);
               $("#save_username").val("");
               $("#save_role").val("运维人员");
               $("#save_mobile").val("");
               $("#save_email").val("");
               $("#save_nickname").val("");

               $("#usergrant_table").bootstrapTable('refresh');
                return;
           }
       },
        error: function(data) {
               console.log("error");
        },
   });

}

function showSaveRoleModel(){
      $("#addRolemodal").modal("show");
}

function saveRole(){
     var roleName=$("#roleName").val();
     $.ajax({
       url:"/authority/add/role",
       type:"POST",
       data:{
          roleName:roleName
       },
       dataType:"json",
       success:function(data){
           if(data.resultCode=="0057"){
               opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
               return;
           }
           if(data.result=="Success!"){
               $("#roleName").val("");
               opt_commons.dialogShow("成功信息","添加角色成功",2000);
               $("#rolegrant_table").bootstrapTable('refresh');
                return;
           }
       },
        error: function(data) {
            if(data.result="FAIELD!"){
                opt_commons.dialogShow("失败信息","添加角色失败！",2000);
                console.log("error");
                 $("#rolegrant_table").bootstrapTable('refresh');
                return;

            }
        },
   });

}


function showDeleteRoleModel(){
    var roleName = $("#deleteRole_Button").attr("roleName");
    if(roleName=="超级管理员"||roleName=="游客"||roleName=="管理员"||roleName=="运维人员"){
        opt_commons.dialogShow("提示信息", "无法删除默认角色", 2000);
        return;
    }else if (roleName) {
        $("#deleteRoleModal_body").html("<h3 style='margin-top: 5px'>注意:</h3><h4>角色删除后无法还原!</h4><div class='hr hr-dotted'></div><h5>确认需要删除角色：<b>" + roleName + "</b> 么？</h5>")
        $("#deleteRoleModal").modal("show");
    } else {
        opt_commons.dialogShow("错误信息", "请选择要删除的角色", 2000);
    }
}

function deleteRole() {
    $("#deleteRoleModal").modal("hide");
    var roleName = $("#deleteRole_Button").attr("roleName");
    $.ajax({
        type: 'POST',
        url: "/authority/delete/role",
        dataType: "json",
        data: {
            roleName: roleName
        },
        success: function (data) {
            if(data.resultCode=="0057"){
                opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                return;
            }
            if(data.result=="FAIELD!"&&data.message=="默认角色不能删除!"){
                opt_commons.dialogShow("提示信息","默认角色不能删除!",2000);
                return;
            }


             if(data.result=="Success!"){
                 $("#rolegrant_table").bootstrapTable('refresh');
               opt_commons.dialogShow("成功信息","删除角色成功！",2000);
                return;
           }
        },
        error: function (data) {
            console.log("error");
        },
        complete: function () {
            console.log("complete");
        }
    })
}


function showDeleteUserModal(data){
    var user=data.split(',');
     $("#deleteUserModal").modal("show");
     $("#delete_id").val(user[0]);
     $("#delete_username").html(user[1]);
     $("#delete_nickname").html(user[2]);
     $("#delete_role").html(user[3]);
     $("#delete_mobile").html(user[4]);
     $("#delete_email").html(user[5]);
     $("#delete_createTime").html(user[6]);
}


function deleteUser(){
     var id=$("#delete_id").val();
     var username=$("#delete_username").html();
     $.ajax({
       url:"/authority/delete/user",
       type:"POST",
       data:{
           id:id,
           username:username
       },
       dataType:"json",
       success:function(data){
           if(data.resultCode=="0057"){
               opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
               return;
           }
           if(data.result=="FAIELD!"&&data.message=="超级管理员不能删除!"){
               opt_commons.dialogShow("提示信息","超级管理员不能删除!",2000);
               return;
           }


           if(data.result=="Success"){
               opt_commons.dialogShow("成功信息","删除用户成功！",2000);
               $("#usergrant_table").bootstrapTable('refresh');
                return;
           }
       },
        error: function(data) {
            if(data.result="FAIELD!"){
                opt_commons.dialogShow("失败信息","删除失败！",2000);
                console.log("error");
                 $("#usergrant_table").bootstrapTable('refresh');
                return;

            }
        },
   });


}
function showUpdateUserModal(data){
    var user=data.split(',');
    $("#updateUserModal").modal("show");
    $("#update_id").val(user[0]);
    $("#update_username").val(user[1]);
    $("#update_nickname").val(user[2]);
    $("#update_role").val(user[3]);
    //$("#update_role option[text='"+user[3]+"']").attr("selected",true);
    //$("#update_role").find("option[value="+user[3]+"]").prop("selected",true);
    $("#update_mobile").val(user[4]);
    $("#update_email").val(user[5]);

    $('#update_role').html("")
    $.ajax({
        url:"/authority/select/init_role",
        type:"POST",
        data:{

        },
        dataType:"json",
        success:function(data){
            rolesList = data.roles
            for (var i=0;i<rolesList.length;i++){
                if (rolesList[i].fields.name!='超级管理员'){
                    if (user[3]==rolesList[i].fields.name){
                        $('#update_role').append("<option selected value='" + rolesList[i].fields.name + "'>" + rolesList[i].fields.name + "</option>");
                    }else {
                        $('#update_role').append("<option  value='" + rolesList[i].fields.name + "'>" + rolesList[i].fields.name + "</option>");

                    }
                }


            }

        },
        error: function(data) {
            console.log("error");
        },
    });

}
function updateUser() {
    //校验不成功
    if (!$('#update_user_form').valid()){
        console.log('校验不成功')
        return;
    }
    var id = $("#update_id").val();
    var username = $("#update_username").val();
    $.ajax({
        url: "/authority/update/user",
        type: "POST",
        data: {
            id: id,
            username: $("#update_username").val(),
            nickname:$("#update_nickname").val(),
            role:$("#update_role").val(),
            mobile:$("#update_mobile").val(),
            email:$("#update_email").val(),
        },
        dataType: "json",
        success: function (data) {

            if (data.resultCode == "0057") {
                opt_commons.dialogShow("提示信息", "您没有该操作权限！", 2000);
                return;
            }
            if (data.resultCode == "0001") {
                opt_commons.dialogShow("提示信息", data.resultDesc, 2000);
                return;
            }

            if (data.resultCode == "0000") {
                opt_commons.dialogShow("成功信息", data.resultDesc, 2000);
                $("#usergrant_table").bootstrapTable('refresh');
                return;
            }
        },
        error: function (data) {
            opt_commons.dialogShow("错误", "连接错误！", 2000);
        },
    });
}

function onClickRow(row,element){
  $(element).addClass('success')   //选中加亮
      .siblings().removeClass('success');           //去除其他想

   var roleName = row.fields.name;
   $("#deleteRole_Button").attr("roleName",roleName);

}

function update_role_permission() {
    var list=[]
  $('#container_div').find('input[type="checkbox"]').each(function (n,v) {
      var p={}
      var id=$(v).attr('id');
      var pname=$(v).attr('pname');
      p.id=id
      p.pname=pname
      if ($(v).is(':checked')){
          p.isOwn='true'
      }else{
          p.isOwn='false'
      }
      list.push(p);
  })
    $.ajax({
        url:"/authority/update/role_permission",
        type:"POST",
        traditional:true,
        data:{
            rolePermissionList:JSON.stringify(list),
        },
        dataType:"json",
        success:function(data){
            if(data.resultCode=="0057"){
                opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                return;
            }
            opt_commons.dialogShow("成功信息","修改成功！",1000);
        },
        error: function(data) {
            opt_commons.dialogShow("成功信息","修改失败！",1000);
        },
    });

}

// 权限管理  角色查询
function rolegrantSearch(){
      $("#rolegrant_table").bootstrapTable('refresh');
}

// 权限管理  角色查询重置
function rolegrantSearchReset(){
    $("#rolegrantname").val("");
    $("#rolegrant_table").bootstrapTable('refresh');
}

// 权限管理  用户查询重置
function usergrantSearchReset(){
    $("#usergrant_username").val("");
    $("#usergrant_mobile").val("");
    $("#usergrant_nickname").val("");
    $("#usergrant_email").val("");
    $("#usergrant_table").bootstrapTable('refresh');
}

// 权限管理  用户查询
function usergrantSearch() {
    $("#usergrant_table").bootstrapTable('refresh');
}


//@ sourceURL=authority.js