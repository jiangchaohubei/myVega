/**
 * Created by PC on 2017/7/14.
 */
$(function(){
$('.metismenu a').each(function (n, v) {
        var url = $(v).attr("menu-url");
        if (url) {
            $(v).unbind("click").click(function (e) {

                $("#content-main").load(url);
                // $('.nav-list .active').each(function (nn, vv) {
                //     $(vv).removeClass("active");
                //
                // });
                // $(this).parents("li").each(function (nn, vv) {
                //     $(vv).addClass("active");
                // });
            });
        }
    });

    opt_commons.query_validate("#register_form");
    opt_commons.query_validate("#login_form");
    opt_commons.query_validate("#updatePassword_form");
    opt_commons.query_validate("#forgot_form");
    opt_commons.query_validate("#forgot_email_form");
    opt_commons.query_validate("#forgot_mobile_form");




    $("#main1").keydown(function() {
        if (event.keyCode == "13") {
            $('#register_button').click();
        }
    });
    $("#updatePassword_form").keydown(function() {
        if (event.keyCode == "13") {
            $('#updatePassword').click();

        }
    });



})


function login() {
       var userName = $("#login_UserName").val().trim();
       var password = $("#login_Password").val().trim();
       var capcha = $("#login_capcha").val().trim();
    $.ajax({
       url:"/authority/user/login",
       type:"POST",
       data:{
           USERNAME:userName,
           PASSWORD:password,
           capcha: capcha
       },
       dataType:"json",
       success:function(data){
           if(data.resultCode=="0057"){
               opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
               return;
           }
           if(data.result=="FAIELD!"){
               opt_commons.dialogShow("错误",data.message,2000);
               return;
           }
           if(data.result=="Success!"){
                $('#userModalLabe').html("");
                $('#userModalBody').html("");
                var title = "登录成功";
                var text =
                    '<p style="text-align:center;font-size:16px">恭喜你登录成功,系统将自动跳转，如果未能跳转,<a href="/main" title="点击访问">请点击</a>。</p>'
                $('#userModalLabe').append(title);
                $('#userModalBody').append(text);
                $('#userModal').modal('show');
                window.setTimeout('location.href="/main"',0);
                return;
           }else if(data.message=="capcha error!"){
                $('#userModalLabe').html("");
                $('#userModalBody').html("");
                var title = "登录失败";
                var text =
                    '<p id="userModalBody" style="text-align:center;font-size:16px">登陆验证码错误！登录失败,系统将在 <span id="time">3</span> 秒钟后自动关闭此弹窗</p>'
                $('#userModalLabe').append(title);
                $('#userModalBody').append(text);
                $('#userModal').modal('show');
                window.setTimeout(
                    " $('#userModal').modal('hide')", 3000);
           }else if(data.message=="passowrd error!"){
                $('#userModalLabe').html("");
                $('#userModalBody').html("");
                var title = "登录失败";
                var text =
                    '<p id="userModalBody" style="text-align:center;font-size:16px">密码错误！登录失败,系统将在 <span id="time">3</span> 秒钟后自动关闭此弹窗</p>'
                $('#userModalLabe').append(title);
                $('#userModalBody').append(text);
                $('#userModal').modal('show');
                window.setTimeout(
                    " $('#userModal').modal('hide')", 3000);
           }else if(data.message=="username notExist!"){
                $('#userModalLabe').html("");
                $('#userModalBody').html("");
                var title = "登录失败";
                var text =
                    '<p id="userModalBody" style="text-align:center;font-size:16px">账号不存在！登录失败,系统将在 <span id="time">3</span> 秒钟后自动关闭此弹窗</p>'
                $('#userModalLabe').append(title);
                $('#userModalBody').append(text);
                $('#userModal').modal('show');
                window.setTimeout(
                    " $('#userModal').modal('hide')", 3000);
           }
       },
        error: function(data) {
            if(data.result="FAIELD!"){
                window.setTimeout('location.href="/login"',0);
                console.log("error");
                return;
            }
        },
    });

}


function updatePassword() {
    if (true) {
        var oldPassword = $("#old_password").val();
        var newPassword = $("#new_password").val();
        var new_repassword = $("#new_repassword").val();

        $.ajax({
            type: 'POST',
            url: "/authority/user/updatepassword",
            dataType: "json",
            data: {
                oldPassword: oldPassword,
                newPassword: newPassword,
                new_repassword:new_repassword

            },
            success: function (data) {
                if(data.resultCode=="0057"){
                    opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                    return;
                }
                if (data.result == "Success!") {
                    opt_commons.dialogShow("修改成功","修改成功，请重新登陆！系统将在3秒后自动转跳!",3000);
                    setTimeout('location.href="/login"', 3000)
                } else if (data.message == "oldPassword error!") {
                    opt_commons.dialogShow("错误信息","原密码错误，请重新输入!",2000);
                } else {
                    opt_commons.dialogShow("错误信息","二次密码不一致，请稍后重试!",2000);
                }
            },
            error: function () {
                console.log("error");
            },
            complete: function () {
                console.log("complete");
            }
        })
    } else {
        opt_commons.dialogShow("错误信息","请正确填写信息!",2000);
    }
}


function achieveCapcha(){
       var userName = $("#login_UserName").val().trim();
       var password = $("#login_Password").val().trim();
        if(userName && password){

            $.ajax({
            type: 'POST',
            url: "/authority/user/loginCapcha",
            dataType: "json",
            data:{
              userName:userName,
              password:password
            },
            success: function (data) {
                if(data.resultCode=="0057"){
                    opt_commons.dialogShow("提示信息","您没有该操作权限！",2000);
                    return;
                }
                if(data.result=="FAIELD!"){
                    opt_commons.dialogShow("提示信息",data.data,2000);
                    return;
                }
                if (data.result == "Success!") {
                    opt_commons.disabledButton("verifyMobile_button");
                    opt_commons.dialogShow("成功信息","登陆验证码已经发送到您手机",2000);
                }
            },
            error: function () {
                console.log("error");
            },
            complete: function () {
                console.log("complete");
            }
        });
        }else{
                opt_commons.dialogShow("错误信息", "请正确输入信息!", 2000);
        }


}

function nextStep() {
    var userName = $("#forgot_userName").val().trim();
    // var capcha = $("#forgot_capcha").val().trim();
    $.ajax({
        type: 'POST',
        url: "/authority/user/checkUserQuestion",
        dataType: "json",
        data: {
            userName: userName,
            // capcha: capcha
        },
        success: function (msg) {
            if (msg.result == "Success!") {
               $("#forgot_capcha").val("");
                $("#mobileLi").trigger("click");
                $("#forgot_email_userName").val(userName);
                $("#forgot_mobile_userName").val(userName);
                ul_left('main3', 'main4');
            } else if (msg.result == "FAIELD!") {
                opt_commons.dialogShow("错误信息", "用户名不存在", 2000);
            } else {
                opt_commons.dialogShow("错误信息", "系统异常请稍后重试", 2000);
            }
        }
    })
}





function ul_left(id1, id2) {
    //clearTimeout(timeres);
    var ul1 = document.getElementById(id1);
    var ul2 = document.getElementById(id2);

    var left1 = parseInt(ul1.style.left);
    var left2 = parseInt(ul2.style.left);

    left1 -= 10;
    left2 -= 10;

    if (left1 != -110) {
        ul1.style.left = left1 + "%";
        ul2.style.left = left2 + "%";
        timeres = setTimeout("ul_left(\'" + id1 + "\',\'" + id2 + "\')", 20);
    }
}



function lastStep(){
    ul_right('main3', 'main4');
    $("#forgot_email_email").val("");
    $("#forgot_mobile_mobile").val("");
}


function ul_right(id1, id2) {
    //clearTimeout(timeres);
    var ul1 = document.getElementById(id1);
    var ul2 = document.getElementById(id2);
    var left1 = parseInt(ul1.style.left);
    var left2 = parseInt(ul2.style.left);
    left1 += 10;
    left2 += 10;

    if (left1 != 10) {
        ul1.style.left = left1 + "%";
        ul2.style.left = left2 + "%";
        timeres = setTimeout("ul_right(\'" + id1 + "\',\'" + id2 + "\')", 20);
    }
}


//    用户根据绑定的邮箱来重置密码
function resetPasswordEmail(){
    var userName = $("#forgot_email_userName").val().trim();
    var email = $("#forgot_email_email").val().trim();
    //校验不成功
    if (!$('#forgot_email_form').valid()){
        opt_commons.dialogShow("提示信息", "邮箱的格式不正确,请重新输入", 2000);
        return;
    }
    $.ajax({
        type: 'POST',
        url: "/authority/user/reset/password/email",
        dataType: "json",
        data: {
            userName: userName,
            email: email
        },
        success: function (data) {
            if (data.result == "Success!") {
                var email = data.email;
                $("#resetPasswordText").html(userName+ "您的密码已重置,新的密码已发送至"+email+"！如需修改,请在登陆后点击右上角进行修改。")
                // $("#resetPasswordText").append("<button type='button' onclick='reSendEmail()' id='reSendEmail_button' class='width-50 pull-right btn btn-sm btn-primary'style='margin-top: 30px'>再次发送</button>")
                ul_left('main4','main5');
            } else if (data.message == "email is error") {
                opt_commons.dialogShow("错误信息", "邮箱和用户绑定的邮箱不一致", 2000);
            } else {
                opt_commons.dialogShow("错误信息", "系统异常请稍后重试!", 2000);
            }
        }
    })
}


//    用户根据绑定的手机号来重置密码
function resetPasswordMobile(){
    var userName = $("#forgot_mobile_userName").val().trim();
    var mobile = $("#forgot_mobile_mobile").val().trim();
    //校验不成功
    if (!$('#forgot_mobile_form').valid()){
        opt_commons.dialogShow("提示信息", "手机号的格式不正确,请重新输入", 2000);
        return;
    }
    $.ajax({
        type: 'POST',
        url: "authority/user/reset/password/mobile",
        dataType: "json",
        data: {
            userName: userName,
            mobile: mobile
        },
        success: function (data) {
            if (data.result=="resetPasswordByMobile Success!"&&data.mobile) {
                var mobile = data.mobile;
                $("#resetPasswordText").html(userName+ "您的密码已重置,新的密码已发送至"+mobile+"！如需修改,请在登陆后点击右上角进行修改")
                // $("#resetPasswordText").append("<button type='button' onclick='reSendmobile()' id='reSendMobile_button' class='width-50 pull-right btn btn-sm btn-primary'style='margin-top: 30px'>再次发送</button>")
                ul_left('main4','main5');
            } else if (data.result=="resetPasswordByMobile FAIELD!"&&data.message=="mobile is error") {
                opt_commons.dialogShow("错误信息", "手机不正确,请重新输入", 2000);
            } else if (data.result=="resetPasswordByMobile FAIELD!"&&data.message=="Script has not ran correctly") {
                opt_commons.dialogShow("错误信息", "短信发送失败", 2000);
            }  else {
                opt_commons.dialogShow("错误信息", "系统异常请稍后重试!", 2000);
            }
        }
    })
}

//@ sourceURL=index.js