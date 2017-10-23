var opt_commons = {
    dialogShow: function (title, message, time) {
        var dialog = bootbox.dialog({
            title: title,
            message: '<p class="text-center" style="color:#8a6d3b;word-break:break-word;"><b>' + message + '</b></p>',
            closeButton: true,
            size: 'small'
        });
        if (!time) {
            time = 9999999;
        }
        dialog.init(function () {
            setTimeout(function () {
                dialog.modal('hide');
            }, time);
        });
    },


    disabledButton: function (buttonId) {
        var obj = $("#" + buttonId);
        obj.attr("disabled", "disabled");
        var time = 59;
        var timer = setInterval(function () {
            var temp = time--;
            obj.html('<span class="bigger-110">' + temp + 'S后再次获取</span>');
            if (temp < 0) {
                obj.removeAttr("disabled");
                obj.html('<span class="bigger-110">再次发送</span>');
                clearInterval(timer);
                return
            }
        }, 1000);
    },


    query_validate: function (str) {
        // 在键盘按下并释放及提交后验证提交表单

        $(str).validate({
            rules: {
                capcha2: {
                    required: true,
                    remote: {
                        url: "/app_tower/user/check/capcha",     //后台处理程序
                        type: "post",               //数据发送方式
                        data: {                     //要传递的数据
                            capcha: function () {
                                return $("#login_capcha").val();
                            }
                        }
                    }
                },
                register_userName: {
                    isNotEmail: true,
                    required: true,
                    minlength: 6,
                    remote: {
                        url: "/app_tower/user/checkUserName",     //后台处理程序
                        type: "post",               //数据发送方式
                        data: {                     //要传递的数据
                            userName: function () {
                                return $("#register_userName").val();
                            }
                        }
                    }
                },
                email: {
                    required: false,
                    email: true
                },

                oldpassword:{
                    required: true,
                    remote: {
                        url: "/app_tower/user/oldpassword",     //后台处理程序
                        type: "post",               //数据发送方式
                        data: {                     //要传递的数据
                            oldpassword: function () {
                                return $("#id_oldpassword").val();
                            }
                        }
                    }
                } ,

                nick: {
                    required: true,
                    minlength: 2
                },
                password: {
                    required: true,
                    minlength: 6
                },
                confirm_password: {
                    required: true,
                    minlength: 6,
                    equalTo: "#register_password"
                },
                 newpassword:{
                    required: true,
                    minlength: 6
                },
                confirmpassword:{
                    required: true,
                    minlength: 6,
                    equalTo: "#id_newpassword"
                },
                name:{
                    required: true,
                    minlength: 2,
                    maxlength: 32
                },
                name1:{
                    required: true,
                    minlength: 2,
                    maxlength: 32
                },
                name2:{
                    required: true,
                    minlength: 2,
                    maxlength: 32
                },
                agree: {
                    required: true,
                },
                agree1: {
                    required: true,
                },
                agree2: {
                    required: true,
                },
                playBook_path:{
                    required: true,
                },
                ip:{
                    required:true,
                    ipCheck:''
                },
                number:{
                    required:true,
                    integerCheck:''
                },
                mobile: {
                    required: true,
                    mobileCheck: ''
                },
                login_UserName: {
                    required: true,
                    minlength: 5
                },
                forgot_mobile: {
                    required: true,
                    mobileCheck1: ''
                },
                forgot_email: {
                    required: true,
                    email: true
                },
            },
            errorElement: "i",
            errorPlacement: function (error, element) {
                $(error).addClass("ace-icon fa fa-times-circle");
                $(error).attr("data-toggle", "popover");
                $(error).attr("title", "错误");
                $(error).attr("data-trigger", "hover");
                $(error).attr("data-container", "body");
                $(error).attr("data-placement", "bottom");
                $(error).css("color", "red");
                $(error).css("top", "0px");
                $(error).attr("data-content", $(error).find("b")[0].innerHTML);
                $(element).parent().append(error);
                $("[data-toggle='popover']").popover();
            },
            highlight: function (element, errorClass, validClass) { // element出错时触发
                $(element).closest('.col-xs-2').removeClass('has-info').addClass(
                    'has-error');
            },
            unhighlight: function (element, errorClass) { // element通过验证时触发
                $(element).closest('.col-xs-2').removeClass(
                    'has-error'); //.addClass('has-info');
            },
            messages: {
                required: "<b style='display:none;'>这是必填字段</b>",
                login_UserName: {
                    required: "<b style='display:none;'>请输入用户名</b>",
                    minlength: "<b style='display:none;'>用户名长度不能小于5位</b>"
                },
                register_userName: {
                    isNotEmail: "<b style='display:none;'>用户名不能为邮箱</b>",
                    required: "<b style='display:none;'>请输入用户名</b>",
                    remote: "<b style='display:none;'>用户名已存在</b>",
                    minlength: "<b style='display:none;'>用户名长度不能小于6位</b>",
                },
                nick: {
                    required: "<b style='display:none;'>请输入昵称</b>",
                    minlength: "<b style='display:none;'>昵称长度不能小于2位</b>"
                },
                forgot_mobile: {
                    required: "<b style='display:none;'>请输入你绑定的手机</b>",
                    mobileCheck: "<b style='display:none;'>手机号码必须是11位如：13512341234</b>"
                },
                forgot_email: {
                    required: "<b style='display:none;'>请输入你绑定的邮箱</b>",
                    email: "<b style='display:none;'>请输入正确的邮箱地址</b>"
                },
                password: {
                    required: "<b style='display:none;'>请输入密码</b>",
                    minlength: "<b style='display:none;'>密码不得少于6位</b>"
                },
                confirm_password: {
                    required: "<b style='display:none;'>请确认密码</b>",
                    minlength: "<b style='display:none;'>密码不得少于6位</b>",
                    equalTo: "<b style='display:none;'>两次输入的密码不同</b>"
                },
                capcha2: {
                    required: "<b style='display:none;'>请输入验证码</b>",
                    remote: "<b style='display:none;'>验证码错误</b>"
                },
                oldpassword: {
                    required: "<b style='display:none;'>请输入旧密码</b>",
                    remote: "<b style='display:none;'>密码错误</b>"
                },
                newpassword: {
                    required: "<b style='display:none;'>请输入新密码</b>",
                    minlength: "<b style='display:none;'>新密码不得少于6位</b>"
                },
                confirmpassword: {
                    required: "<b style='display:none;'>请确认新密码</b>",
                    minlength: "<b style='display:none;'>新密码不得少于6位</b>",
                    equalTo: "<b style='display:none;'>两次输入的密码一致</b>"
                },
                email: "<b style='display:none;'>该输入项必须是电子邮件地址，格式如\'user@example.com\'</b>",
                agree: {
                    required: "<b style='display:none;'>该项为必填字段</b>",
                },
                agree1: {
                    required: "<b style='display:none;'>该项为必填字段</b>",
                },
                agree2: {
                    required: "<b style='display:none;'>该项为必填字段</b>",
                },
                name:{
                    required: "<b style='display:none;'>该项为必填字段</b>",
                    minlength: "<b style='display:none;'>长度不得少于2位</b>",
                },
                name1:{
                    required: "<b style='display:none;'>该项为必填字段</b>",
                    minlength: "<b style='display:none;'>长度不得少于2位</b>",
                },
                name2:{
                    required: "<b style='display:none;'>该项为必填字段</b>",
                    minlength: "<b style='display:none;'>长度不得少于2位</b>",
                },
                number:"<b style='display:none;'>必须为非零正整数</b>",
                mobile: "<b style='display:none;'>手机号码必须是11位如：13512341234</b>",
                ip: "<b style='display:none;'>ip输入有误请重新输入！格式如\'10.10.10.10\'</b>",
                playBook_path:{
                    required: "<b style='display:none;'>请填写正确的playbook路径</b>",
                }

            }
        });
        $.validator.addMethod("jobTempletePathCheck", function (value, element) {
            var reg = /^[\s]*(-)?[\d]+[\s]*$/;
            return this.optional(element) || (reg.test(value));
        }, "只能是数字和空格");
        $.validator.addMethod("numberCheck", function (value, element) {
            var reg = /^[\s]*(-)?[\d]+[\s]*$/;
            return this.optional(element) || (reg.test(value));
        }, "只能是数字和空格");
        $.validator.addMethod("integerCheck", function (value, element) {
            var reg = /^[1-9]\d*$/;
            return this.optional(element) || (reg.test(value));
        }, "只能是非零正整数");
        $.validator.addMethod("mobileCheck", function (value, element) {
            var reg = /^1[34578]\d{9}$/;
            return this.optional(element) || (reg.test(value));
        }, "<b style='display:none;'>请输入正确的手机号码</b>");
        $.validator.addMethod("mobileCheck1", function (value, element) {
            var reg = /^1[34578]\d{9}$/;
            return this.optional(element) || (reg.test(value));
        }, "<b style='display:none;'>请输入正确的手机号码</b>");
        $.validator.addMethod("idCardCheck", function (value, element) {
            var reg = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
            return this.optional(element) || (reg.test(value));
        }, "18位身份证验证");
        $.validator.addMethod("ipCheck", function (value, element) {
            var reg = /((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))/;
            return this.optional(element) || (reg.test(value));
        }, "ip不正确");

    },


}
