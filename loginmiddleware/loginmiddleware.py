# -*- coding: utf-8 -*-
"""
 功能： 拦截器
 说明： Django中间件
 修订： v2.0
"""
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.contrib.auth import SESSION_KEY
from urllib import quote


# 不需要拦截的请求
FILTER_URL = ['/index', '/authority/user/select/capcha', '/authority/user/login', '/login',
             '/authority/user/checkUserName','/authority/user/check/capcha','/authority/user/checkUserQuestion',
              '/authority/user/loginCapcha','/authority/user/reset/password/mobile',
              '/authority/user/reset/password/email']


class LoginMiddleware(object):
    def process_request(self, request):
        response = HttpResponse()
        req_path = request.path
        if req_path == "/":
            response.write("<script>top.location.href='/login'</script>")
            return response

        if req_path not in FILTER_URL:
            if 'static' not in req_path:
                username = request.session.get("username", '')
                if username == '':
                    # 这里要跳出整个frameset
                    response.write("<script>alert('抱歉，会话过期，请登录系统！');top.location.href='/login'</script>")
                    return response
                    # return HttpResponseRedirect("/index")