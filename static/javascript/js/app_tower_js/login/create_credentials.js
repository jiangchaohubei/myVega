/**
 * Created by PC on 2017/8/17.
 */
$(function () {

    opt_commons.query_validate("#create_credentials_form");
    $.ajax({
        url:"/app_tower/project/init_project_select",
        type:"POST",
        data:{

        },
        dataType:"json",
        success:function(data){
            for (var i=0;i<data.projectList.length;i++){
                $('#credentials_owner').append('<option value="'+data.projectList[i].pk+'">'+data.projectList[i].fields.NAME+'</option>')
            }

        },
        error: function(data) {
            console.log('error')
        }

    })
})
function save_credential(){
    //校验不成功
    if (!$('#create_credentials_form').valid()){
        return;
    }
    var credentials_name=$('#credentials_name').val();
    var credentials_desc=$('#credentials_desc').val();
    var credentials_owner=$('#credentials_owner').val();
    var credentials_type=$('#credentials_type').val();
    var credentials_loginUser=$('#credentials_loginUser').val();
    var credentials_password=$('#credentials_password').val();
    var credentials_privilege=$('#credentials_privilege').val();
    var privilege_password=$('#privilege_password').val();
    $.ajax({
        url:"/app_tower/credentials/add",
        type:"POST",
        data:{
            credentials_name:credentials_name,
            credentials_desc:credentials_desc,
            credentials_owner:credentials_owner,
            credentials_type:credentials_type,
            credentials_loginUser:credentials_loginUser,
            credentials_password:credentials_password,
            credentials_privilege:credentials_privilege,
            privilege_password:privilege_password,
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
                console.log(data.resultCode)
                opt_commons.dialogShow("成功信息","添加成功！",2000);
                $('#create_credentials_form')[0].reset();  //通过调用 DOM 中的reset方法来重置表单
                return;
            }
        },
        error: function(data) {
            if(data.resultCode="0001"){
                opt_commons.dialogShow("提示信息","添加失败！",2000);
                console.log("error");

                return;

            }
        },
    })

}






//@ sourceURL=create_credentials.js