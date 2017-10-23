# -*- coding: utf-8 -*
from app_tower.models import playbook,T_PROJECT

from django.http import HttpRequest,HttpResponse
from django.http import JsonResponse
from app_tower.models import User
from django.core import serializers
import os
import logging
log = logging.getLogger("playbook")
from authority.permission import PermissionVerify

import sys
reload(sys)
sys.setdefaultencoding('utf8')

# 添加组
@PermissionVerify()
def playbook_add(request):
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
    playbookPath='public'
    try:
        if request.POST:
            form['name'] = request.POST['name']
            form['description'] = request.POST['discription']
            form['owner'] = request.POST['owner']
            form['content'] = request.POST['content']
            form['dir'] = request.POST['dir']
            form['myFile'] = request.FILES.get("inputFile", None)  # 获取上传的文件，如果没有文件，则默认为None
        log.info(form)

        if form['owner']=='onlyOne':
            OWNER_ID=request.session['userId']
            OWNER_NAME=request.session['username']
            playbookPath=OWNER_NAME
        elif form['owner']=='all':
            OWNER_ALL=True
            playbookPath='public'
        else:
            OWNER_PROJECT_ID=form['owner']
            playbookPath=T_PROJECT.objects.get(id=int(OWNER_PROJECT_ID)).NAME
        if playbook.objects.filter(NAME=form['name']):
            response_data['resultCode']='0001'
            response_data['resultDesc']='NAME已经存在，名称不能重复！'
            return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
        PLAYBOOK_PATH=""
        if not os.path.exists('/opt/playbooks'):
            os.makedirs('/opt/playbooks')

        if not os.path.exists('/opt/playbooks/'+playbookPath):
            os.makedirs('/opt/playbooks/'+playbookPath)
        PLAYBOOK_PATH='/opt/playbooks/'+playbookPath
        if  form['dir']:
            if not os.path.exists('/opt/playbooks/'+playbookPath+'/'+form['dir']):
                os.makedirs('/opt/playbooks/'+playbookPath+'/'+form['dir'])
            PLAYBOOK_PATH='/opt/playbooks/'+playbookPath+'/'+form['dir']

        PLAYBOOK_PATH+='/'+form['name']+'.yaml'
        log.info("playbookPath:"+PLAYBOOK_PATH)
        # if not os.path.exists('C:\Users\PC\Desktop\example\playbooks'):
        #     os.makedirs('C:\Users\PC\Desktop\example\playbooks')
        #
        # if not os.path.exists('C:\Users\PC\Desktop\example\playbooks\\'+playbookPath):
        #     os.makedirs('C:\Users\PC\Desktop\example\playbooks\\'+playbookPath)
        #
        # PLAYBOOK_PATH='C:\Users\PC\Desktop\example\playbooks\\'+playbookPath+'\\'+form['name']+'.yaml'
        fo=open(PLAYBOOK_PATH,"wb")
        if form['myFile']==None:
            fo.write(form['content'])
        else:
            form['content']=''
            for chunk in form['myFile'].chunks():  # 分块写入文件
                fo.write(chunk)
                form['content']+=chunk
        fo.close()
        pb = playbook(NAME=form['name'], DESCRIPTION=form['description'],PLAYBOOK_PATH=PLAYBOOK_PATH, PLAYBOOK_CONTENT=form['content'],OWNER_ID=OWNER_ID,OWNER_NAME=OWNER_NAME,OWNER_PROJECT_ID=OWNER_PROJECT_ID,OWNER_ALL=OWNER_ALL,
                        CREATE_USER_ID=request.session['userId'] ,CREATE_USER_NAME=request.session['username'],FILEDIR=form['dir'] if form['dir'] else None)
        pb.save()
        response_data['resultCode']='0000'
        response_data['resultDesc']='Success'
    except Exception, ex:
        print Exception, ex
        log.error(ex)
        response_data['resultCode']='0001'
        response_data['resultDesc']='Faield'
        log.info('playbook_add end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")

#查询任务
@PermissionVerify()
def playbook_select(request):
    log.info('playbook_select start')
    if request.session['username']:
        request.session['username'] = request.session['username']
        request.session['userId'] = User.objects.get(username=request.session['username']).id
    else:
        response = HttpResponse()
        response.write("<script>alert('抱歉，会话过期，请登录系统！');top.location.href='/login'</script>")
        return response
    #本页第一条数据下标
    offset= request.GET.get('offset')
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
    createUser = ''

    if request.GET.get("name"):
        name=request.GET.get("name")
    if request.GET.get("userName"):
        createUser=request.GET.get("userName")


    playbooklist=playbook.objects.check_own(request).filter(NAME__contains=name).filter(CREATE_USER_NAME__contains=createUser).order_by(orderBy)
    total = len(playbooklist)
    log.info(total)
    print total
    try:
        list = playbooklist[int(offset):int(offset)+int(limit)]
        #[5:10]这是查找从下标5到下标10之间的数据，不包括10。
    except Exception,ex:
        print Exception,ex
    response_data = {}
    try:
        response_data['result'] = 'Success'
        #序列码 serializers.serialize，且ensure_ascii=False防止乱码
        response_data['rows'] = serializers.serialize('json', list,ensure_ascii=False)
        response_data['total'] = total
    except:
        response_data['result'] = 'FAIELD!'
        response_data['rows'] = 'Script has not ran correctly'
    log.info('playbook_select end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")

#删除任务  数据库删除   根据id删除
@PermissionVerify()
def playbook_delete(request):
    log.info('jobs_delete start')
    if request.session['username']:
        request.session['username'] = request.session['username']
        request.session['userId'] = User.objects.get(username=request.session['username']).id
    else:
        response = HttpResponse()
        response.write("<script>alert('抱歉，会话过期，请登录系统！');top.location.href='/login'</script>")
        return response
    form = {}
    response_data={}
    if request.POST:
        form['id'] = request.POST['id']
    # 根据id删除的数据
    playbooks = playbook.objects.get(id=form['id'])
    try:
        playbooks.delete()
        os.remove(playbooks.PLAYBOOK_PATH)
        response_data['resultCode'] = 'SUCCESS'
        response_data['resultDesc'] = '删除成功！'
    except Exception,ex:
        log.error(ex)
        response_data['resultCode'] = 'FAILED'
        response_data['resultDesc'] = '已被使用，禁止删除！'
    log.info('playbook_delete end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")


# 更新任务 根据id  更新
@PermissionVerify()
def playbook_update(request):
    log.info('playbook_update start')
    if request.session['username']:
        request.session['username'] = request.session['username']
        request.session['userId'] = User.objects.get(username=request.session['username']).id
    else:
        response = HttpResponse()
        response.write("<script>alert('抱歉，会话过期，请登录系统！');top.location.href='/login'</script>")
        return response
    form = {}
    OWNER_ID=None
    OWNER_NAME=None
    OWNER_PROJECT_ID=None
    OWNER_ALL=False
    playbookPath='public'
    response_data = {}
    try:
        if request.POST:
            form['id'] = request.POST['id']
            form['name'] = request.POST['name']
            form['description'] = request.POST['description']
            form['content'] = request.POST['content']
            form['dir'] = request.POST['dir']
            form['owner'] = request.POST['owner']
            if form['owner']=='onlyOne':
                OWNER_ID=request.session['userId']
                OWNER_NAME=request.session['username']
                playbookPath=OWNER_NAME
            elif form['owner']=='all':
                OWNER_ALL=True
                playbookPath='public'
            else:
                OWNER_PROJECT_ID=form['owner']
                playbookPath=T_PROJECT.objects.get(id=int(OWNER_PROJECT_ID)).NAME
            if playbook.objects.filter(NAME=form['name']).exists():
                if not playbook.objects.get(NAME=form['name']).id == int(form['id']):
                    response_data['resultCode']='0001'
                    response_data['resultDesc']='NAME已经存在，名称不能重复！'
                    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
            pb = playbook.objects.get(id=form['id'])
            os.remove(pb.PLAYBOOK_PATH)#删除原文件
            PLAYBOOK_PATH=""
            if not os.path.exists('/opt/playbooks'):
                os.makedirs('/opt/playbooks')

            if not os.path.exists('/opt/playbooks/'+playbookPath):
                os.makedirs('/opt/playbooks/'+playbookPath)
            PLAYBOOK_PATH='/opt/playbooks/'+playbookPath
            if  form['dir']:
                if not os.path.exists('/opt/playbooks/'+playbookPath+'/'+form['dir']):
                    os.makedirs('/opt/playbooks/'+playbookPath+'/'+form['dir'])
                PLAYBOOK_PATH='/opt/playbooks/'+playbookPath+'/'+form['dir']

            PLAYBOOK_PATH+='/'+form['name']+'.yaml'
            # if not os.path.exists('C:\Users\PC\Desktop\example\playbooks'):
            #     os.makedirs('C:\Users\PC\Desktop\example\playbooks')
            #
            # if not os.path.exists('C:\Users\PC\Desktop\example\playbooks\\'+playbookPath):
            #     os.makedirs('C:\Users\PC\Desktop\example\playbooks\\'+playbookPath)
            #
            # PLAYBOOK_PATH='C:\Users\PC\Desktop\example\playbooks\\'+playbookPath+'\\'+form['name']+'.yaml'
            fo=open(PLAYBOOK_PATH,"wb")

            fo.write(form['content'])

            fo.close()

            pb.NAME = form['name']
            pb.DESCRIPTION = form['description']
            pb.FILEDIR = form['dir'] if form['dir'] else None
            pb.PLAYBOOK_CONTENT = form['content']
            pb.PLAYBOOK_PATH=PLAYBOOK_PATH
            pb.MODIFY_USER_ID=request.session['userId']
            pb.OWNER_ID=OWNER_ID
            pb.OWNER_NAME=OWNER_NAME
            pb.OWNER_PROJECT_ID=OWNER_PROJECT_ID
            pb.OWNER_ALL=OWNER_ALL
            pb.save()


            response_data['resultCode'] = '0000'
    except:
        response_data['resultCode'] = '0001'
        response_data['resultDesc'] = '修改失败'
    log.info('playbook_update end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")


