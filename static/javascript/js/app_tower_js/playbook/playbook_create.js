/**
 * Created by PC on 2017/8/17.
 */
$(function () {

    opt_commons.query_validate("#playbook_form");
    $.ajax({
        url:"/app_tower/project/init_project_select",
        type:"POST",
        data:{

        },
        dataType:"json",
        success:function(data){
            for (var i=0;i<data.projectList.length;i++){
                $('#playbook_owner').append('<option value="'+data.projectList[i].pk+'">'+data.projectList[i].fields.NAME+'</option>')
            }

        },
        error: function(data) {
            console.log('error')
        }

    })
})
function save_playbook(){
    //校验不成功
    if (!$('#playbook_form').valid()){
        return;
    }
    var playbook_name=$('#playbook_name').val();
    var playbook_discription=$('#playbook_discription').val();
    var playbook_content=$('#playbook_content').val() ? $('#playbook_content').val():"";
    var playbook_owner=$('#playbook_owner').val();
    var playbook_dir=$('#playbook_dir').val();
    var formData = new FormData($( "#playbook_form" )[0]);
    formData.append("name",playbook_name);
    formData.append("discription",playbook_discription);
    formData.append("content",playbook_content);
    formData.append("owner",playbook_owner);
    formData.append("dir",playbook_dir);
    $.ajax({
        url:"/app_tower/playbook/add",
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
                opt_commons.dialogShow("提示信息",data.resultDesc,2000);
                return;
            }
            if(data.resultCode=="0000"){
                console.log(data.resultCode)
                opt_commons.dialogShow("成功信息","添加成功！",2000);
                $('#playbook_form')[0].reset();  //通过调用 DOM 中的reset方法来重置表单
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






//@ sourceURL=playbook_create.js