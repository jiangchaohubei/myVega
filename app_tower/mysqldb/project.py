#!/usr/bin/env python
# -*- coding:utf8 -*-
from app_tower.models import T_PROJECT,T_PROJECT_User_ID,User
from django.forms.models import model_to_dict
from django.http import HttpRequest, HttpResponse
from django.http import JsonResponse
from json import dumps
import json
from django.core import serializers
from authority.permission import PermissionVerify
import logging
log = logging.getLogger("project")

def init_user_select(request):
    log.info('init_user_select start')
    users=User.objects.all()
    userList = serializers.serialize('json', users, ensure_ascii=False)
    true = True
    false=False
    null = None
    #log.info('userList：'+userList)
    log.info('init_user_select end')
    return HttpResponse(json.dumps({'userList': eval(userList)}))

def init_project_select(request):
    log.info('init_project_select start')
    project=T_PROJECT.objects.check_own(request)
    projectList = serializers.serialize('json', project, ensure_ascii=False)
    true = True
    null = None
    false=False
    #log.info('projectList：'+projectList)
    log.info('init_project_select end')
    return HttpResponse(json.dumps({'projectList': eval(projectList)}))

def init_ProjectModal(request):
    log.info('init_ProjectModal start')
    id = request.POST['id']
    true = True
    false=False
    null = None
    project=T_PROJECT.objects.get(id=id)
    owner_project_id=project.OWNER_PROJECT_ID
    projectName=''
    if owner_project_id:
        projectName=T_PROJECT.objects.get(id=owner_project_id).NAME
    ownusers=project.user_set.all()
    owneruserList = serializers.serialize('json', ownusers, ensure_ascii=False)
    owner_user_List= eval(owneruserList)
    users=User.objects.all()
    userList = serializers.serialize('json', users, ensure_ascii=False)

    user_List= eval(userList)

    allproject=T_PROJECT.objects.all()
    allprojectList = serializers.serialize('json', allproject, ensure_ascii=False)
    allproject_List=eval(allprojectList)
    # log.info('projectName：'+projectName.decode('utf-8'))
    # log.info('owner_user_List：'+owneruserList.decode('utf-8'))
    # log.info('user_List：'+userList.decode('utf-8'))
    # log.info('allproject_List：'+allprojectList.decode('utf-8'))
    log.info('init_ProjectModal end')
    return HttpResponse(json.dumps({'projectName': projectName,'owner_user_List':owner_user_List,'user_List':user_List,'allproject_List':allproject_List}))
# 添加组
@PermissionVerify()
def project_add(request):
    log.info('project_add start')
    if request.session['username']:
        request.session['username'] = request.session['username']
        request.session['userId'] = User.objects.get(username=request.session['username']).id
    else:
        response = HttpResponse()
        response.write("<script>alert('抱歉，会话过期，请登录系统！');top.location.href='/login'</script>")
        return response
    form = {}
    response_data={}
    OWNER_ID=None
    OWNER_NAME=None
    OWNER_PROJECT_ID=None
    OWNER_ALL=False
    try:
        if request.POST:
            form['name'] = request.POST['NAME']
            form['description'] = request.POST['DESCRIPTION']
            form['OWNER'] = request.POST['OWNER']
            form['USERS'] = request.POST.getlist('USERS[]');
        if form['OWNER']=='onlyOne':
            OWNER_ID=request.session['userId']
            OWNER_NAME=request.session['username']
        if form['OWNER']=='all':
            OWNER_ALL=True
        if T_PROJECT.objects.filter(NAME=form['name']):
            response_data['resultCode']='0001'
            response_data['resultDesc']='NAME已经存在，名称不能重复！'
            return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
        project = T_PROJECT(NAME=form['name'], DESCRIPTION=form['description'], OWNER_ID=OWNER_ID, OWNER_NAME=OWNER_NAME, OWNER_PROJECT_ID=OWNER_PROJECT_ID, OWNER_ALL=OWNER_ALL,
                            CREATE_USER_ID=request.session['userId'],CREATE_USER_NAME=request.session['username'])
        project.save()
        if form['OWNER']=='onlyProject':
            OWNER_PROJECT_ID=project.id

            project.OWNER_PROJECT_ID=OWNER_PROJECT_ID

        project.save()
        log.info('add project:'+str(model_to_dict(project)))
        for userId in form['USERS']:
            t_user=User.objects.get(id=int(userId))
            project_user = T_PROJECT_User_ID(PROJECT_ID=project, User_ID=t_user)
            project_user.save()
        response_data['resultCode']='0000'
        response_data['resultDesc']='Success'
    except Exception, ex:
        print Exception, ex

        response_data['resultCode']='0001'
        response_data['resultDesc']='Faield'
    log.info('project_add end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")

# 查询组
@PermissionVerify()
def project_select(request):
    log.info('project_select start')
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
    name = ''
    description = ''
    if request.GET.get("name"):
        name = request.GET.get("name")
    if request.GET.get("description"):
        description = request.GET.get("description")
    # 排序字段
    # ordername= request.GET.get('ordername')
    # 通过objects这个模型管理器的all()获得所有数据行，相当于SQL中的SELECT * FROM     Test.objects.filter(name="runoob").order_by("id")
    t_project_List = T_PROJECT.objects.check_own(request).filter(NAME__contains=name).filter(DESCRIPTION__contains=description).order_by(orderBy)
    total=len(t_project_List)
    try:
        list = t_project_List[int(offset):int(offset) + int(limit)]
        # [5:10]这是查找从下标5到下标10之间的数据，不包括10。
    except Exception, ex:
        print Exception, ex
    response_data = {}
    try:
        response_data['result'] = 'Success'
        # 序列码 serializers.serialize，且ensure_ascii=False防止乱码
        response_data['rows'] = serializers.serialize('json', list, ensure_ascii=False)
        log.info('projectList:'+response_data['rows'])
        response_data['total'] = total
    except:
        response_data['result'] = 'FAIELD!'
        response_data['rows'] = 'Script has not ran correctly'
    log.info('project_select end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")

@PermissionVerify()
def project_delete(request):
    log.info('project_delete start')
    if request.session['username']:
        request.session['username'] = request.session['username']
        request.session['userId'] = User.objects.get(username=request.session['username']).id
    else:
        response = HttpResponse()
        response.write("<script>alert('抱歉，会话过期，请登录系统！');top.location.href='/login'</script>")
        return response
    form = {}
    if request.POST:
        form['id'] = request.POST['id']
    # 根据id删除的数据
    response_data = {}
    try:
        log.info('delete id:'+form['id'] )
        project = T_PROJECT.objects.get(id=form['id'])
        project.delete()
        response_data['result'] = 'Success'
    except:
        response_data['result'] = 'FAIELD!'
    log.info('project_delete end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")


# 更新任务 根据id  更新
@PermissionVerify()
def project_update(request):
    log.info('project_update start')
    if request.session['username']:
        request.session['username'] = request.session['username']
        request.session['userId'] = User.objects.get(username=request.session['username']).id
    else:
        response = HttpResponse()
        response.write("<script>alert('抱歉，会话过期，请登录系统！');top.location.href='/login'</script>")
        return response
    response_data = {}
    form={}
    OWNER_ID=None
    OWNER_NAME=None
    OWNER_PROJECT_ID=None
    OWNER_ALL=False
    if T_PROJECT.objects.filter(NAME=request.POST['NAME']).exists():
        if not T_PROJECT.objects.get(NAME=request.POST['NAME']).id == int(request.POST['id']):
            response_data['resultCode']='0001'
            response_data['resultDesc']='NAME已经存在，名称不能重复！'
            return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
    project = T_PROJECT.objects.get(id=request.POST['id'])
    if request.POST:
        form['name'] = request.POST['NAME']
        form['description'] = request.POST['DESCRIPTION']
        form['OWNER'] = request.POST['OWNER']
        form['USERS'] = request.POST.getlist('USERS[]');
    if form['OWNER']=='onlyOne':
        OWNER_ID=request.session['userId']
        OWNER_NAME=request.session['username']
    elif form['OWNER']=='all':
        OWNER_ALL=True
    else:
        OWNER_PROJECT_ID=project.id

    project.NAME = form['name']
    project.DESCRIPTION = form['description']
    project.OWNER_NAME = OWNER_NAME
    project.OWNER_ID = OWNER_ID
    project.OWNER_PROJECT_ID = OWNER_PROJECT_ID
    project.OWNER_ALL = OWNER_ALL
    project.MODIFY_USER_ID=request.session['userId']
    project.save()
    log.info('update project:'+str(model_to_dict(project)))
    T_PROJECT_User_ID.objects.filter(PROJECT_ID=project.id).delete()
    #批量删除和插入
    project_user_list = list()
    for x in form['USERS']:
        project_user_list.append(T_PROJECT_User_ID(User_ID=User.objects.get(id=x),PROJECT_ID=project))
    T_PROJECT_User_ID.objects.bulk_create(project_user_list)

    response_data['result'] = 'Success'
    log.info('project_update end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")