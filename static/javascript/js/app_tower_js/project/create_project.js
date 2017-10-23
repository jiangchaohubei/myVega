/**
 * Created by PC on 2017/8/17.
 */
$(function () {

    opt_commons.query_validate("#project_form");
    // var str='3,4,5,6';
    // var arr=str.split(',');
    // $('#usertype').selectpicker('val', arr);
    $.ajax({
        url:"/app_tower/project/init_user_select",
        type:"POST",
        data:{
        },
        dataType:"json",
        success:function(data){
            $("#project_users").empty();
            for (var i=0;i<data.userList.length;i++){
                $('#project_users').append('<option value="'+data.userList[i].pk+'">'+data.userList[i].fields.username+'</option>')
            }
            $('#project_users').append('</optgroup>')
            $('#project_users').selectpicker('render');
            $('#project_users').selectpicker('refresh');

        },
        error: function(data) {
            console.log('error')
        }

    })

    $('#project_users').selectpicker({
        'selectedText': 'cat'
    });

})
function save_project(){
    //校验不成功
    if (!$('#project_form').valid()){
        return;
    }
    var project_name=$('#project_name').val();
    var project_discription=$('#project_discription').val();
    var project_owner=$('#project_owner').val()
    var project_users=$('#project_users').val()+',';
    var project_usersList=project_users.split(',');
    project_usersList.pop();

    $.ajax({
        url:"/app_tower/project/add",
        type:"POST",
        data:{
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
            if(data.resultCode=="0000"){
                console.log(data.resultCode)
                opt_commons.dialogShow("成功信息","添加成功！",2000);
                $('#project_form')[0].reset();  //通过调用 DOM 中的reset方法来重置表单
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






//@ sourceURL=create_group.js