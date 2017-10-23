# /usr/bin/python2
# -*- coding:utf8 -*-
from celery import task
from billiard.exceptions import Terminated#方便更好的取消任务
import time
from app_tower.utils.playbook_run import runplaybook
from app_tower.utils.commands_run import commandsrun
from app_tower.models import T_JOB,T_Group,T_LOGIN_CREDENTIALS,T_JOB_EVENT,T_COMMAND_EVENT,sudo_record
from app_tower.utils.mygroup import mygroup
import commands
import logging
from django.core import serializers
from vega.settings import SECRET_KEY
from app_tower.utils import desJiami


from collections import defaultdict, MutableMapping
log = logging.getLogger("tasks") # 为loggers中定义的名称

#python的commands模块执行命令
@task(throws=(Terminated,))
def runCommands(file,comman):

        (status, output) = commands.getstatusoutput("bash -c set -o pipefail;"+comman+"|tee -a "+file)

#ansible的api模块执行命令
@task(throws=(Terminated,))
def runCommands2(file,groupid,credentialsid,commandName,vars,userid,username,hostList,port=22,isSudo='false',action="",ACCOUNT="",requestDesc=""):
        log.info('celery runCommands2 start')
        credentials=T_LOGIN_CREDENTIALS.objects.get(id=credentialsid)
        login_user=credentials.LOGIN_USER
        d = desJiami.DES()
        d.input_key(SECRET_KEY)
        login_pwd=d.decode(str(credentials.LOGIN_PWD))
        #查出host列表

        com=commandsrun(file,hostList,login_user,login_pwd,commandName,vars,port,isSudo)
        result=com.run()
        if action=='add':
             if not result['success']=={}:
                 surecord=sudo_record(IP=hostList[0],CREDENTIALS_ID=credentials,DESCRIPTION=requestDesc,PORT=port,ACCOUNT=ACCOUNT,CREATE_USER_ID=userid,CREATE_USER_NAME=username)
                 surecord.save()
        if  action=='cancel':
            if not result['success']=={}:
                if sudo_record.objects.filter(IP=hostList[0],ACCOUNT=ACCOUNT):
                    sudo_record.objects.filter(IP=hostList[0],ACCOUNT=ACCOUNT).delete()
        t_command_event=T_COMMAND_EVENT(GROUP_ID=groupid,CREDENTIALS_ID=credentialsid,LOGFILE=file,COMMAND_NAME=commandName,COMMAND_VARS=vars,CREATE_USER_ID=userid,CREATE_USER_NAME=username,RESULT=str(result))
        t_command_event.save()
        log.info('celery runCommands2 end')


#ansible的api执行playbook
@task(throws=(Terminated,))
def run_playbook(file,jobsid,hostList=None):
    log.info('celery run_playbook start')
    jobs=T_JOB.objects.get(id=jobsid)
    starttime=time.time()
    print starttime
    print time.localtime(starttime)
    log.info('startTime: '+str(time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(starttime))))
    jobs.START_TIME=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(starttime))
    #实例化
    mygroups=mygroup(jobsid,hostList)
    group=mygroups.get_mygroup()
    extra_var={}
    job_tags=[]
    skip_tags=[]
    true = True
    null = None
    false=False
    if  jobs.JOB_TAGS:
        jobtags=jobs.JOB_TAGS+','
        job_tags=jobtags.split(',')
        job_tags.pop()
    if  jobs.SKIP_TAGS:
        skiptags=jobs.SKIP_TAGS+','
        skip_tags=skiptags.split(',')
        skip_tags.pop()

    if  jobs.EXTRA_VARIABLES:
        extra_var=eval(jobs.EXTRA_VARIABLES)
    log.info(job_tags)
    log.info(skip_tags)
    log.info(extra_var)
    playbookPath=''
    if jobs.PLAYBOOK_ID:
        playbookPath=jobs.PLAYBOOK_ID.PLAYBOOK_PATH
    else:
        playbookPath=jobs.PLAYBOOK_FILE
    runbook=runplaybook(file,playbookPath,group,extra_var,job_tags,skip_tags,jobs.FORKS)
    #执行
    result=runbook.run()

    endtime=time.time()
    jobs.FINISH_TIME=time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(endtime))
    jobs.ELAPSED=endtime-starttime
    log.info('finishTime: '+str(time.strftime("%Y-%m-%d %H:%M:%S",time.localtime(endtime))))
    log.info('result>>>>'+str(result))
    if result['code'] in [1001,1002,1003]:
        jobs.STATUS='FAILURE'
    elif result['skipped'] or result['fail'] or result['unreachable'] or result['success']=={}:
        jobs.STATUS='FAILURE'
    else:
        jobs.STATUS='SUCCESS'
    log.info('status'+jobs.STATUS)
    #日志内容入库
    with open(file,'r') as f:
        f.seek(0)
        jobs.LOGCONTENT =f.read()
    jobs.save()

    #记录T_JOB_EVENT表
    tgroups=T_Group.objects.get(id=jobs.GROUP_ID.id)
    thosts=tgroups.HOSTS.all()
    thostsList = serializers.serialize('json', thosts,ensure_ascii=False)
    true = True
    null = None
    t_host_list=eval(thostsList)#转为列表
    for host in t_host_list:
        hostID=host['pk']
        hostName=host['fields']['NAME']
        if hostName in result['recap']:
            job_event=T_JOB_EVENT(JOB_ID=jobsid,HOST_ID=hostID,HOST_NAME=hostName,SUCCESS=result['recap'][hostName]['ok'],FAILED=result['recap'][hostName]['failed'],
                                  CHANGED=result['recap'][hostName]['changed'],UNREACHABLE=result['recap'][hostName]['unreachable'],SKIPPED=result['recap'][hostName]['skipped'])
            job_event.save()
        else:  #这里是skip_tags跳过的部分
            job_event=T_JOB_EVENT(JOB_ID=jobsid,HOST_ID=hostID,HOST_NAME=hostName,SUCCESS=0,FAILED=0,
                                  CHANGED=0,UNREACHABLE=0,SKIPPED=0)
            job_event.save()

    log.info('celery run_playbook end')


    return result

