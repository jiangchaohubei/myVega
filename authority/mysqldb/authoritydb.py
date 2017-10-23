# -*- coding: utf-8 -*
from django.http import JsonResponse
from django.core import serializers
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from json import dumps
from django.core.mail import send_mail
from vega import permission_config
from authority.permission import PermissionVerify
import json
import re
from django.db.models import Count
import time
import datetime
from django.shortcuts import render
from app_tower.models import User,T_JOB,RoleList,PermissionList,T_RoleList_PermissionList_ID,JobStatusControl,T_PROJECT
# python md5 加密
import hashlib
import logging
import urllib2
log = logging.getLogger("authoritydb")
import random


def login(request):
    log.info('login start')
    response_data = {}
    if request.POST['USERNAME'] == 'jzyuan':
        if User.objects.all().filter(username=request.POST['USERNAME']):
            if User.objects.all().filter(username=request.POST['USERNAME']).filter(
                    password=md5(request.POST['PASSWORD'])):
                response_data['result'] = 'Success!'
                request.session['username'] = request.POST['USERNAME']
                request.session['userId'] = User.objects.get(username=request.POST['USERNAME']).id
                loginUser=User.objects.get(username=request.POST['USERNAME'])
                roleName=loginUser.role.name
                request.session['isAdministrant']=False
                if loginUser.is_superuser or roleName==u'管理员':
                      request.session['isAdministrant']=True
                projects=loginUser.projects.all()
                List=serializers.serialize('json', projects, ensure_ascii=False)
                permissions=loginUser.role.permission.all()
                per_List=serializers.serialize('json', permissions, ensure_ascii=False)
                true = True
                null = None
                false=False
                project_list=eval(List)
                projectIdlist=[]
                permissions_list=eval(per_List)
                permissionsNamelist=[]
                for p in project_list:
                    projectIdlist.append(p['pk'])
                request.session['projectIdlist'] = projectIdlist
                for  per in permissions_list:
                    permissionsNamelist.append(per['fields']['name'])
                request.session['permissionsNamelist'] = permissionsNamelist
                response_data['message'] = "登录成功"
                log.info(str(request.session['username']) + "登陆成功")
            else:
                response_data['result'] = 'FAIELD!'
                response_data['message'] = "passowrd error!"
        else:
            response_data['result'] = 'FAIELD!'
            response_data['message'] = "username notExist!"
            log.info(str(request.session['username']) + "用户不存在")
    else:
        if request.session['check_capcha'] == request.POST['capcha']:
            log.info("request.session['check_capcha']==request.POST['capcha']")
            if User.objects.all().filter(username=request.POST['USERNAME']):
                if User.objects.all().filter(username=request.POST['USERNAME']).filter(
                        password=md5(request.POST['PASSWORD'])):
                    response_data['result'] = 'Success!'
                    request.session['username'] = request.POST['USERNAME']
                    request.session['userId'] = User.objects.get(username=request.POST['USERNAME']).id
                    loginUser=User.objects.get(username=request.POST['USERNAME'])
                    roleName=loginUser.role.name
                    request.session['isAdministrant']=False
                    if loginUser.is_superuser or roleName==u'管理员':
                        request.session['isAdministrant']=True
                    projects=loginUser.projects.all()
                    List=serializers.serialize('json', projects, ensure_ascii=False)
                    permissions=loginUser.role.permission.all()
                    per_List=serializers.serialize('json', permissions, ensure_ascii=False)
                    true = True
                    null = None
                    false=False
                    project_list=eval(List)
                    projectIdlist=[]
                    permissions_list=eval(per_List)
                    permissionsNamelist=[]
                    for p in project_list:
                        projectIdlist.append(p['pk'])
                    request.session['projectIdlist'] = projectIdlist
                    for  per in permissions_list:
                        permissionsNamelist.append(per['fields']['name'])
                    request.session['permissionsNamelist'] = permissionsNamelist
                    response_data['message'] = "登录成功"
                    log.info(str(request.session['username']) + "登陆成功")
                else:
                    response_data['result'] = 'FAIELD!'
                    response_data['message'] = "passowrd error!"
            else:
                response_data['result'] = 'FAIELD!'
                response_data['message'] = "username notExist!"
                log.info(str(request.session['username']) + "用户不存在")
        else:
            log.info("request.session['check_capcha']是" + str(request.session['check_capcha']))
            log.info("request.POST['capcha']" + str(request.POST['capcha']))
            log.info("request.session['check_capcha']!=request.POST['capcha']")
            log.info("capcha is error")
            response_data['result'] = 'FAIELD!'
            response_data['message'] = 'capcha error!'
            return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
    log.info('login end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
def logout(request):
        log.info('logout strat')
        log.info("user:" + request.session['username'] + " login out")
        request.session['username'] =""
        request.session['userId'] =""
        request.session['projectIdlist'] =[]
        request.session['permissionsNamelist'] =[]
        request.session['isAdministrant']=False
        log.info('logout end')
        return HttpResponseRedirect("/login")

# 检查用户注册的时候，，用户是否已经注册
def checkUserName(request):
    log.info('checkUserName start')
    true = True
    none=None
    false = False
    user=User.objects.all().filter(username=request.POST['userName'])
    if user:
        log.info('checkUserName end')
        return HttpResponse(json.dumps(false))
    else:
        log.info('checkUserName end')
        return HttpResponse(json.dumps(true))


# 忘记密码的时候 ，，，，检查用户的信息  是否存在
def checkUserQuestion(request):
    log.info('checkUserQuestion start')

    form = {}
    response_data = {}
    if request.POST:
        form['userName'] = request.POST['userName']
    user = User.objects.all().filter(username=form['userName'])
    if user:
        response_data['result'] = 'Success!'
        response_data['memessage'] = '用户存在!'
    else:
        response_data['result'] = 'FAIELD!'
        response_data['memessage'] = '用户不存在!'
    log.info('checkUserQuestion end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")

# 用户根据Email     重置密码
def resetPasswordByEmail(request):
    log.info('resetPasswordByEmail start')
    form = {}
    response_data = {}
    if request.POST:
        form['userName'] = request.POST['userName']
        form['email'] = request.POST['email']
        user = User.objects.get(username=form['userName'])
        if user:
            log.info('user exist')
            Useremail =User.objects.get(username=form['userName']).email
            if form['email']==Useremail:
                newPassword=createNewPasswordByEmail()
                user.password = md5(newPassword)
                log.info('newPassword'+newPassword)
                user.save()
                title=str(request.POST['userName'])+"您好,您的密码被重置了!"
                content = str(request.POST['userName']) + "您的新密码为:" + newPassword
                send_mail(title, content, '15221459431@163.com',
                          [str(Useremail)], fail_silently=False)
                response_data['result'] = 'Success!'
                response_data['email'] = Useremail
                log.info(str(request.POST['userName'])+"reset password success")
                return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
            else:
                log.info('email is error')
                response_data['result'] = 'FAIELD!'
                response_data['message'] = 'email is error'
                return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")

    else:
        log.info('user isnot exist')
        response_data['result'] = 'FAIELD!'
        response_data['message'] = 'user isnot exist'
        return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
    log.info('resetPasswordByEmail end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")


#    用户根据绑定的手机号 来重置密码
def resetPasswordByMobile(request):
    log.info('resetPasswordByMobile start')
    form = {}
    response_data = {}
    if request.POST:
        form['userName'] = request.POST['userName']
        form['mobile'] = request.POST['mobile']
        user = User.objects.get(username=form['userName'])
        if user:
            log.info('resetPasswordByMobile user exist')
            Usermobile = User.objects.get(username=form['userName']).mobile.encode('utf-8')
            if form['mobile'] == Usermobile:
                try:
                    newPassword = createNewPasswordByEmail()
                    log.info('resetPasswordByMobile is newPassword' + newPassword)
                    user.password = md5(newPassword)
                    user.save()
                    content = "【咪咕视讯】,重置密码:" + newPassword + "（切勿告诉他人)"
                    log.info("content:"+content)
                    url = 'http://172.16.9.132/mtv/HttpSendSM?userName=ZDHBS&password=1qaz!QAZ&srcId=1065802710111&channel=1&destMsisdn='+Usermobile+'&content='+content+'&needReport=1'
                    response_data['result'] = 'resetPasswordByMobile Success!'
                    response_data['mobile'] = Usermobile
                    getResponseData(url)
                except:
                    response_data['result'] = 'resetPasswordByMobile FAIELD!'
                    response_data['message'] = 'Script has not ran correctly'
                log.info(str(request.POST['userName']) + "reset password success")
                return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
            else:
                log.info('mobile is error')
                response_data['result'] = 'resetPasswordByMobile FAIELD!'
                response_data['message'] = 'mobile is error'
                return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")

    else:
        log.info('user isnot exist')
        response_data['result'] = 'resetPasswordByMobile FAIELD!'
        response_data['message'] = 'user isnot exist'
        return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
    log.info('resetPasswordByMobile end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")


# 检查用户登录的时候，，检查验证码是否一致
def checkCapcha(request):
    log.info('checkCapcha start')
    true = True
    false = False
    none=None
    capcha=request.POST['capcha']
    if capcha!=request.session['check_capcha']:
        log.info('checkCapcha end')
        return HttpResponse(json.dumps(false))
    else:
        log.info('checkCapcha end')
        return HttpResponse(json.dumps(true))

def md5(str):
    log.info('md5 start')
    hash = hashlib.md5()  # 以md5的方式进行加密，这里md5可以换成sha算法（sha1,sha256,sha384,sha512）
    hash.update(str)
    log.info('md5 end')
    return hash.hexdigest()


#用户修改密码
def updatepassword(request):
    log.info('updatepassword start')
    if request.session['username']:
        request.session['username'] = request.session['username']
        request.session['userId'] = User.objects.get(username=request.session['username']).id
    else:
        response = HttpResponse()
        response.write("<script>alert('抱歉，会话过期，请登录系统！');top.location.href='/login'</script>")
        return response
    response_data = {}
    log.info(request.session['username'] + "changePassword")
    if User.objects.all().filter(username=request.session['username']).filter(password=md5(request.POST['oldPassword'])):
        log.info("oldPassword right")
        if request.POST['newPassword']!=request.POST['new_repassword']:
            log.info("newPassword !=new_repassword")
            response_data['result'] = 'FAIELD!'
            response_data['message'] = 'newPassword !=new_repassword!'
            return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
        else:
            log.info("newPassword =new_repassword")
            #user=User.objects.all().filter(username=request.session['username'])
            user = User.objects.get(username=request.session['username'])
            user.password=md5(request.POST['newPassword'])
            user.save()

            response_data['result'] = 'Success!'
            return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
    else:
        log.info("oldPassword error")
        response_data['result'] = 'FAIELD!'
        response_data['message'] = 'oldPassword error!'
        return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
    log.info('updatepassword end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")


def loginCapcha(request):
    log.info("achieve loginCapcha start")
    response_data = {}
    if request.POST:
        userName=request.POST['userName'].encode('utf-8')
        if not User.objects.all().filter(username=request.POST['userName']).filter(
                password=md5(request.POST['password'])):
            response_data['result'] = 'FAIELD!'
            response_data['data'] = '用户名和密码不匹配'
            return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
        mobile=bind_mobile(userName).encode('utf-8')
        url = 'http://172.16.9.132/mtv/HttpSendSM?userName=ZDHBS&password=1qaz!QAZ&srcId=1065802710111&channel=1&destMsisdn='+mobile+'&content='+ createPhoneCode(request)+'&needReport=1'
        try:
           response_data['result'] = 'Success!'
           getResponseData(url)

        except:
            response_data['result'] = 'FAIELD!'
            response_data['data'] = 'Script has not ran correctly'
    log.info("achieve loginCapcha end")
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")


def bind_mobile(userName):
    log.info("achieve bind_mobile")
    mobile=""
    if User.objects.get(username=userName).mobile:
        mobile=User.objects.get(username=userName).mobile
    else:
        log.info("username isnot exist")
    return mobile

# 用于邮箱产生重置密码
def createNewPasswordByEmail():
    chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    x = random.choice(chars), random.choice(chars), random.choice(chars), random.choice(chars), random.choice(
        chars), random.choice(chars)
    password = "".join(x)
    return password




def createPhoneCode(request):
  chars=['0','1','2','3','4','5','6','7','8','9']
  x = random.choice(chars),random.choice(chars),random.choice(chars),random.choice(chars),random.choice(chars),random.choice(chars)
  verifyCode = "".join(x)
  request.session['check_capcha'] =verifyCode
  log.info("verifyCode: "+verifyCode)
  contnet="【咪咕视讯】，动态密码：" + verifyCode + "（切勿告诉他人）,该验证码用于自动化部署系统登陆,5分钟有效"
  return contnet


def getResponseData(url):
    request = urllib2.Request(url)
    request.add_header('Content-Type', 'application/json')
    request.add_header('cache-control', 'no-cache')
    response = urllib2.urlopen(request)
    str = response.read().decode('utf-8')
    return str

# 查询用户
@PermissionVerify()
def  selectUser(request):
    log.info('selectUser start')
    if request.session['username']:
        request.session['username'] = request.session['username']
        request.session['userId'] = User.objects.get(username=request.session['username']).id
    else:
        response = HttpResponse()
        response.write("<script>alert('抱歉，会话过期，请登录系统！');top.location.href='/login'</script>")
        return response
    # 本页第一条数据下标
    offset = request.GET.get('offset')
    # 每页数量
    limit = request.GET.get('limit')
    # 排序asc，desc
    order= ''
    if request.GET.get('order')=='desc':
        order='-'
    ordername='id'
    if request.GET.get('ordername'):
        ordername= str(request.GET.get('ordername'))
    ordername=ordername.replace('fields.','')
    orderBy=order+ordername
    username=""
    mobile=""
    nickname=""
    email=""
    if request.GET.get("username"):
        username = request.GET.get("username")
    if request.GET.get("mobile"):
        mobile = request.GET.get("mobile")
    if request.GET.get("nickname"):
        nickname = request.GET.get("nickname")
    if request.GET.get("email"):
        email = request.GET.get("email")

    # 排序字段
    # ordername= request.GET.get('ordername')
    # 通过objects这个模型管理器的all()获得所有数据行，相当于SQL中的SELECT * FROM     Test.objects.filter(name="runoob").order_by("id")
    user_List=User.objects.all().filter(username__contains=username).filter(mobile__contains=mobile).filter(nickname__contains=nickname).filter(email__contains=email).order_by(orderBy)
    total = len(user_List)
    try:
        list =user_List[int(offset):int(offset) + int(limit)]
        # [5:10]这是查找从下标5到下标10之间的数据，不包括10。
    except Exception, ex:
        print Exception, ex
    response_data = {}
    try:
        response_data['result'] = 'Success'
        response_data['rows'] = serializers.serialize('json', list, ensure_ascii=False,use_natural_keys=True)
        response_data['total'] = total
    except:
        response_data['result'] = 'FAIELD!'
        response_data['rows'] = 'Script has not ran correctly'
    log.info('selectUser end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")


# 查询角色
@PermissionVerify()
def selectRole(request):
    log.info('selectRole start')
    if request.session['username']:
        request.session['username'] = request.session['username']
        request.session['userId'] = User.objects.get(username=request.session['username']).id
    else:
        response = HttpResponse()
        response.write("<script>alert('抱歉，会话过期，请登录系统！');top.location.href='/login'</script>")
        return response
    # 本页第一条数据下标
    offset = request.GET.get('offset')
    # 每页数量
    limit = request.GET.get('limit')
    # 排序asc，desc
    order= ''
    if request.GET.get('order')=='desc':
        order='-'
    ordername='id'
    if request.GET.get('ordername'):
        ordername= str(request.GET.get('ordername'))
    ordername=ordername.replace('fields.','')
    orderBy=order+ordername
    name=''
    if request.GET.get("name"):
        name = request.GET.get("name")


    # 排序字段
    # ordername= request.GET.get('ordername')
    # 通过objects这个模型管理器的all()获得所有数据行，相当于SQL中的SELECT * FROM     Test.objects.filter(name="runoob").order_by("id")
    role_List=RoleList.objects.all().filter(name__contains=name).order_by(orderBy)
    total = len(role_List)
    try:
        list = role_List[int(offset):int(offset) + int(limit)]
    except Exception, ex:
        print Exception, ex
    response_data = {}
    try:
        response_data['result'] = 'Success'
        response_data['rows'] = serializers.serialize('json', list, ensure_ascii=False)
        response_data['total'] = total
    except:
        response_data['result'] = 'FAIELD!'
        response_data['rows'] = 'Script has not ran correctly'
    log.info('selectRole end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")


@PermissionVerify()
def delete(request):
    log.info('delete start')
    if request.session['username']:
        request.session['username'] = request.session['username']
        request.session['userId'] = User.objects.get(username=request.session['username']).id
    else:
        response = HttpResponse()
        response.write("<script>alert('抱歉，会话过期，请登录系统！');top.location.href='/login'</script>")
        return response
    form = {}
    response_data = {}
    if request.POST:
        form['id'] = request.POST['id']
        form['username']=request.POST['username']
        if request.POST['username']=="Admin":
            response_data['result']='FAIELD!'
            response_data['message']='超级管理员不能删除!'
            log.info('delete end because Supermaster cannot delete')
            return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
    # 删除id=1的数据
    user = User.objects.get(id=form['id'])
    user.delete()

    try:
        response_data['result'] = 'Success'
    except:
        response_data['result'] = 'FAIELD!'
    log.info('delete end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")




@PermissionVerify()
def saveUser(request):
    log.info('saveUser start')
    p2 = re.compile('^0\d{2,3}\d{7,8}$|^1[358]\d{9}$|^147\d{8}')
    str = r'^[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+){0,4}$'
    if request.session['username']:
        request.session['username'] = request.session['username']
        request.session['userId'] = User.objects.get(username=request.session['username']).id
    else:
        response = HttpResponse()
        response.write("<script>alert('抱歉，会话过期，请登录系统！');top.location.href='/login'</script>")
        return response
    form = {}
    response_data = {}
    if request.POST:
        form['username'] = request.POST['username']
        if User.objects.filter(username=form['username']):
            response_data['resultCode']='0001'
            response_data['resultDesc']='NAME已经存在，名称不能重复！'
            return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
        if len(request.POST['username'])<5:
            response_data['result'] = 'FAIELD!'
            response_data['usernamemessage'] = '用户名长度不能少于5位!'
            log.info('saveUser end')
            return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
        form['mobile'] = request.POST['mobile']
        if not p2.match(request.POST['mobile']):
            response_data['result'] = 'FAIELD!'
            response_data['mobilememessage'] = '手机号码不正确!'
            log.info('saveUser end')
            return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
        form['email'] = request.POST['email']
        if not re.match(str, request.POST['email']):
            response_data['result'] = 'FAIELD!'
            response_data['emailmemessage'] = '邮箱不正确!'
            log.info('saveUser end')
            return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
        form['nickname'] = request.POST['nickname']
        form['role'] = request.POST['role']
    user = User(username=form['username'],password=md5("88888888"), mobile=form['mobile'],email=form['email'],  nickname=form['nickname'],role=RoleList.objects.get(name=form['role']))
    user.save()
    response_data = {}
    try:
        log.info("添加用户成功")
        response_data['result'] = 'Success!'
    except:
        response_data['result'] = 'FAIELD!'
        log.info("添加用户失败")
    log.info('saveUser end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")

@PermissionVerify()
def updateUser(request):
    log.info('updateUser start')
    response_data={}
    if User.objects.get(id=request.POST['id']).is_superuser :
        response_data['resultCode']='0001'
        response_data['resultDesc']='超级管理员不能修改！'
        return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
    if User.objects.filter(username=request.POST['username']).exists():
        if not User.objects.get(username=request.POST['username']).id == int(request.POST['id']):
            response_data['resultCode']='0001'
            response_data['resultDesc']='NAME已经存在，名称不能重复！'
            return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")

    user=User.objects.get(id=request.POST['id'])

    user.username=request.POST['username']
    user.nickname=request.POST['nickname']
    user.mobile=request.POST['mobile']
    user.email=request.POST['email']
    user.role=RoleList.objects.get(name=request.POST['role'])
    user.save()
    response_data['resultCode']='0000'
    response_data['resultDesc']='修改成功！'
    log.info('updateUser end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")

@PermissionVerify()
def addRole(request):
    log.info('addRole start')
    if request.session['username']:
        request.session['username'] = request.session['username']
        request.session['userId'] = User.objects.get(username=request.session['username']).id
    else:
        response = HttpResponse()
        response.write("<script>alert('抱歉，会话过期，请登录系统！');top.location.href='/login'</script>")
        return response
    form = {}
    if request.POST:

        form['roleName'] = request.POST['roleName']
    rolelist=RoleList(name=form['roleName'])
    rolelist.save()
    response_data = {}
    try:
        log.info("add role success")
        response_data['result'] = 'Success!'
    except:
        log.info("add role faield")
        response_data['result'] = 'FAIELD!'
    log.info('addRole end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")

@PermissionVerify()
def deleteRole(request):
    log.info('deleteRole start')
    if request.session['username']:
        request.session['username'] = request.session['username']
        request.session['userId'] = User.objects.get(username=request.session['username']).id
    else:
        response = HttpResponse()
        response.write("<script>alert('抱歉，会话过期，请登录系统！');top.location.href='/login'</script>")
        return response
    form = {}
    if request.POST:
        form['roleName'] = request.POST['roleName']
    rolelist=RoleList.objects.get(name=form['roleName'])
    rolelist.delete()
    response_data = {}
    try:
        log.info("deleteRole success")
        response_data['result'] = 'Success!'
    except:
        log.info("deleteRole faield")
        response_data['result'] = 'FAIELD!'
    log.info('deleteRole end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")




def parentPermission(request):
    log.info('parentPermission start')
    if request.session['username']:
        request.session['username'] = request.session['username']
        request.session['userId'] = User.objects.get(username=request.session['username']).id
    else:
        response = HttpResponse()
        response.write("<script>alert('抱歉，会话过期，请登录系统！');top.location.href='/login'</script>")
        return response
    form={}
    form['permission']=''
    if request.POST:
        if request.POST['title'] == u'查询':
            form['title']=request.POST['title']
            li=permission_config.permissionList['queryPermissionList']
            form['permission'] = li

            form['id']=request.POST['id']
        elif request.POST['title']==u'登录凭证操作':
            form['title'] = request.POST['title']
            form['permission'] = permission_config.permissionList['credentialsPermissionList']
            form['id']=request.POST['id']
        elif request.POST['title']==u'项目组操作':
            form['title'] = request.POST['title']
            form['permission'] = permission_config.permissionList['projectPermissionList']
            form['id']=request.POST['id']
        elif request.POST['title']==u'主机组操作':
            form['title'] = request.POST['title']
            form['permission'] = permission_config.permissionList['groupPermissionList']
            form['id']=request.POST['id']
        elif request.POST['title']==u'playbook操作':
            form['title'] = request.POST['title']
            form['permission'] = permission_config.permissionList['playbookPermissionList']
            form['id']=request.POST['id']
        elif request.POST['title']==u'任务模板操作':
            form['title'] = request.POST['title']
            form['permission'] = permission_config.permissionList['jobTemplatePermissionList']
            form['id']=request.POST['id']
        elif request.POST['title']==u'任务操作':
            form['title'] = request.POST['title']
            form['permission'] = permission_config.permissionList['jobPermissionList']
            form['id']=request.POST['id']
        elif request.POST['title']==u'commands操作':
            form['title'] = request.POST['title']
            form['permission'] = permission_config.permissionList['commandsPermissionList']
            form['id']=request.POST['id']
        elif request.POST['title']==u'权限管理':
            form['title'] = request.POST['title']
            form['permission'] = permission_config.permissionList['userPermissionList']
            form['id']=request.POST['id']
        elif request.POST['title']==u'数据统计':
            form['title'] = request.POST['title']
            form['permission'] = permission_config.permissionList['datastatisticsPermissionList']
            form['id']=request.POST['id']
    role=RoleList.objects.get(id=int(form['id']))
    permissionList=role.permission.all()
    list = serializers.serialize('json', permissionList,ensure_ascii=False)
    true = True
    null = None
    false=False
    per_list=eval(list)#转为列表
    dataList=[]
    log.info(list)
    log.info(form['permission'])
    for r in form['permission']:
        dl={'cname':r['cname'],'name':r['name']}
        log.info(r)
        for p in per_list:
            log.info(p)
            if p['fields']['name']==r['name']:
                dl['isOwn']='true'

        dataList.append(dl)
    response_data={}
    response_data['id']=form['id']
    response_data['permission']=dataList
    response_data['title']=form['title']
    log.info(response_data['permission'])
    log.info('parentPermission end')
    return render(request, 'templates/pages/authority/authorityModel.html', {'data': response_data})

@PermissionVerify()
def role_permission_update(request):
    pass
    rolePermissionList=request.POST['rolePermissionList']
    log.info(rolePermissionList)
    for rp in eval(rolePermissionList):
        if rp['id']:
            role=RoleList.objects.get(id=rp['id'])
            permission=PermissionList.objects.get(name=rp['pname'])
            if rp['isOwn']=='true':
                if not T_RoleList_PermissionList_ID.objects.all().filter(RoleList_ID=role,PermissionList_ID=permission):

                    t_role_permission=T_RoleList_PermissionList_ID(RoleList_ID=role,PermissionList_ID=permission)
                    t_role_permission.save()

            else:
                if T_RoleList_PermissionList_ID.objects.all().filter(RoleList_ID=role,PermissionList_ID=permission):
                    t_role_permission=T_RoleList_PermissionList_ID.objects.get(RoleList_ID=role,PermissionList_ID=permission)
                    t_role_permission.delete()
                    print '333'




    return HttpResponse(JsonResponse({}), content_type="application/json;charset=UTF-8")




# 用户登录情况统计
def userLoginStatics(request):
    if request.session['username']:
        request.session['username'] = request.session['username']
        request.session['userId'] = User.objects.get(username=request.session['username']).id
    else:
        response = HttpResponse()
        response.write("<script>alert('抱歉，会话过期，请登录系统！');top.location.href='/login'</script>")
        return response
    log.info("userLoginStatics start")
    form = {}
    if request.POST:
        pass
    response_data = {}
    log.info("userLoginStatics end")
    pass
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")

# JobStatus 状态统计
@PermissionVerify()
def JobStatusStatics(request):
    jobStatusControlList=""
    if request.session['username']:
        request.session['username'] = request.session['username']
        request.session['userId'] = User.objects.get(username=request.session['username']).id
    else:
        response = HttpResponse()
        response.write("<script>alert('抱歉，会话过期，请登录系统！');top.location.href='/login'</script>")
        return response
    log.info("JobStatusStatics start")
    response_data = {}
    form={}
    OWNER_ID = None
    OWNER_NAME = None
    OWNER_PROJECT_ID = None
    OWNER_ALL = False
    if request.POST['group_owner']:
        form['owner'] = request.POST['group_owner']
    if form['owner'] == 'onlyOne':
        OWNER_ID = request.session['userId']
        OWNER_NAME = request.session['username']
    elif form['owner'] == 'all':
        OWNER_ALL = True
    else:
        OWNER_PROJECT_ID = form['owner']
    try:
        today = datetime.date.today()   # 今天的日期   截止日期
        lastMonth = today - datetime.timedelta(days=30)  # 一个月前的日期   开始日期
        timeList = []
        timeList.append(lastMonth)
        for i in range(1,32):
            timeList.append(lastMonth+datetime.timedelta(days=i))
        #  确定一个月的时间  天数
        tomorrow=today + datetime.timedelta(days=1)
        dayJobMonth=[]
        #  确定一个月的dayJob状态 统计
        for time in timeList:
            SUCCESS = 0
            FAILURE = 0
            STARTED = 0
            REVOKED = 0
            TOTAL_JOBS = 0
            dayJob = T_JOB.objects.check_project(request,OWNER_PROJECT_ID).filter(CREATE_TIME__gte=time).filter(CREATE_TIME__lt=time+datetime.timedelta(days=1)).values('STATUS').annotate(count=Count('STATUS'))
        #  确定一个月的dayJob  状态 统计
        # 统计一个月任务执行的状态 JobStatusStatics
            for job in dayJob:
                if (job["STATUS"] == u"SUCCESS"):
                    SUCCESS = job["count"]
                elif (job["STATUS"] == u"FAILURE"):
                    FAILURE = job["count"]
                elif (job["STATUS"] == u"STARTED"):
                    STARTED = job["count"]
                elif (job["STATUS"] == u"REVOKED"):
                    REVOKED = job["count"]
                else:
                    print "都不成立输出"
                TOTAL_JOBS=SUCCESS+FAILURE+STARTED+REVOKED
                # 判断当天的 JobStatusControl 统计是否存在，，如果存在，，更新统计，不存在创建
                if JobStatusControl.objects.check_project(request,OWNER_PROJECT_ID).filter(TIME=time):
                    log.info("job exist")
                    statusControl=JobStatusControl.objects.get(TIME=time)
                    statusControl.SUCCESS=SUCCESS
                    statusControl.FAILURE=FAILURE
                    statusControl.STARTED=STARTED
                    statusControl.REVOKED=REVOKED
                    statusControl.TOTAL_JOBS=TOTAL_JOBS
                    statusControl.OWNER_ID=OWNER_ID
                    statusControl.OWNER_NAME=OWNER_NAME
                    statusControl.OWNER_PROJECT_ID=OWNER_PROJECT_ID
                    statusControl.OWNER_ALL=OWNER_ALL
                    statusControl.save()

                else:
                    log.info("job not exist")
                    statusControl=JobStatusControl(TIME=time,SUCCESS=SUCCESS,FAILURE=FAILURE,STARTED=STARTED,REVOKED=REVOKED,TOTAL_JOBS=TOTAL_JOBS,
                                                   OWNER_ID=OWNER_ID, OWNER_NAME=OWNER_NAME,
                                                   OWNER_PROJECT_ID=OWNER_PROJECT_ID, OWNER_ALL=OWNER_ALL,)
                    statusControl.save()
        jobStatusControlList = JobStatusControl.objects.check_project(request, OWNER_PROJECT_ID).order_by("TIME")
        response_data['result'] = 'Success!'
        response_data['data'] = serializers.serialize('json', jobStatusControlList, ensure_ascii=False)
    except Exception,ex:
        print "Exception==========="
        print Exception, ex
        print "Exception==========="
        response_data['result'] = 'FAIELD!'
        response_data['message'] = 'Script has not ran correctly'
    log.info("JobStatusStatics end")
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")

def init_role(request):
    response_data={}
    roleList=RoleList.objects.all()
    role_list = serializers.serialize('json', roleList, ensure_ascii=False)
    return HttpResponse(json.dumps({'roles': eval(role_list)}))


