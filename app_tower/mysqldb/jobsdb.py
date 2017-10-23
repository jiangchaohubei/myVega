# -*- coding: utf-8 -*
from app_tower.models import T_JOB

from django.http import HttpRequest,HttpResponse
from django.http import JsonResponse
from app_tower.models import User
from django.core import serializers

import logging
log = logging.getLogger("jobsdb")
from authority.permission import PermissionVerify
#查询任务
@PermissionVerify()
def jobs_select(request):
    log.info('jobs_select start')
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
    description = ''
    jobType=''
    jobTaskid=''
    jobStatus=''
    if request.GET.get("name"):
        name=request.GET.get("name")
    if request.GET.get("description"):
        description=request.GET.get("description")
    if request.GET.get('jobTaskid'):
        jobTaskid=request.GET.get("jobTaskid")

    if request.GET.get('jobType')!="-1":
        jobType=request.GET.get("jobType")
    if request.GET.get('jobStatus')!="-1":
        jobStatus=request.GET.get("jobStatus")

    jobslist=T_JOB.objects.check_own(request).filter(NAME__contains=name).filter(DESCRIPTION__contains=description). \
        filter(CELERY_TASK_ID__contains=jobTaskid).filter(JOB_TYPE__contains=jobType).filter(STATUS__contains=jobStatus).order_by(orderBy)
    total = len(jobslist)

    print total
    try:
        list = jobslist[int(offset):int(offset)+int(limit)]
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
    log.info('jobs_select end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")

#删除任务  数据库删除   根据id删除
@PermissionVerify()
def jobs_delete(request):
    log.info('jobs_delete start')
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
    job = T_JOB.objects.get(id=form['id'])
    job.delete()
    response_data = {}
    try:
        response_data['result'] = 'Success'
    except:
        response_data['result'] = 'FAIELD!'
    log.info('jobs_delete end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")


# 更新任务 根据id  更新
@PermissionVerify()
def jobs_update(request):
    log.info('jobs_update start')
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
        form['NAME'] = request.POST['NAME']
        form['DESCRIPTION'] = request.POST['DESCRIPTION']
        form['JOB_TYPE'] = request.POST['JOB_TYPE']
        form['GROUP_ID'] = request.POST['GROUP_ID']
        form['PLAYBOOK_FILE'] = request.POST['PLAYBOOK_FILE']
        form['FORKS'] = request.POST['FORKS']
        form['JOB_TAGS'] = request.POST['JOB_TAGS']
        form['SKIP_TAGS'] = request.POST['SKIP_TAGS']
        form['STATUS'] = request.POST['STATUS']
        form['CANCELFLAG'] = request.POST['CANCELFLAG']
        job = T_JOB.objects.get(id=form['id'])
        job.NAME = form['NAME']
        job.DESCRIPTION = form['DESCRIPTION']
        job.JOB_TYPE = form['JOB_TYPE']
        job.GROUP_ID = form['GROUP_ID']
        job.PLAYBOOK_FILE = form['PLAYBOOK_FILE']
        job.FORKS = form['FORKS']
        job.JOB_TAGS = form['JOB_TAGS']
        job.SKIP_TAGS = form['SKIP_TAGS']
        job.STATUS = form['STATUS']
        job.CANCEL_FLAG = form['CANCELFLAG']
        job.CREDENTIAL_MACHINE_ID=form['Login_credentials']
        job.LABELS=form['Labels']
        job.save()
        response_data = {}
    try:
        response_data['result'] = 'Success'
    except:
        response_data['result'] = 'FAIELD!'
    log.info('jobs_update end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")


