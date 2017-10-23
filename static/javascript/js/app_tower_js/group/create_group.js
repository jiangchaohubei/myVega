/**
 * Created by PC on 2017/8/17.
 */
$(function () {

    opt_commons.query_validate("#group_form");
    $.ajax({
        url:"/app_tower/project/init_project_select",
        type:"POST",
        data:{

        },
        dataType:"json",
        success:function(data){
            for (var i=0;i<data.projectList.length;i++){
                $('#group_owner').append('<option value="'+data.projectList[i].pk+'">'+data.projectList[i].fields.NAME+'</option>')
            }

        },
        error: function(data) {
            console.log('error')
        }

    })
})
function save_group(){
    //校验不成功
    if (!$('#group_form').valid()){
        return;
    }
    var group_name=$('#group_name').val();
    var group_discription=$('#group_discription').val();
    var group_variables=$('#group_variables').val() ? $('#group_variables').val():"";
    var group_owner=$('#group_owner').val();

    $.ajax({
        url:"/app_tower/group/add",
        type:"POST",
        data:{
            NAME:group_name,
            DESCRIPTION:group_discription,
            VARIABLES:group_variables,
            group_owner:group_owner,

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
                $('#group_form')[0].reset();  //通过调用 DOM 中的reset方法来重置表单
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