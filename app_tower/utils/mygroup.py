#!/usr/bin/env python
# -*- coding:utf8 -*-
from app_tower.models import  T_JOB
from app_tower.models import  T_Group
from app_tower.models import  T_LOGIN_CREDENTIALS
from django.core import serializers
from app_tower.utils import desJiami
from vega.settings import SECRET_KEY
import logging
log = logging.getLogger("tasks") # 为loggers中定义的名称

class mygroup():
    def __init__(self,jobsId,hosts=None):
        jobTem=T_JOB.objects.get(id=jobsId)
        self.job=jobTem
        self.groupid=jobTem.GROUP_ID.id
        self.credentrialsid=jobTem.CREDENTIAL_MACHINE_ID.id
        self.hosts=hosts
        log.info(hosts)

    def get_mygroup(self):
        print 'get_mygroup'
        """
        resource的数据格式是一个列表字典，比如
            {
                "group1": {
                    "hosts": [{"hostname": "10.0.0.0", "port": "22", "username": "test", "password": "pass"}, ...],
                    "vars": {"var1": value1, "var2": value2, ...}
                }
            }

        如果你只传入1个列表，这默认该列表内的所有主机属于my_group组,比如
            [{"hostname": "10.0.0.0", "port": "22", "username": "test", "password": "pass"}, ...]
        """
        credentrials=T_LOGIN_CREDENTIALS.objects.get(id=self.credentrialsid)
        login_user=credentrials.LOGIN_USER
        d = desJiami.DES()
        d.input_key(SECRET_KEY)
        login_pwd=d.decode(str(credentrials.LOGIN_PWD))
        group=T_Group.objects.get(id=self.groupid)
        hostList=[]
        #主机组中主机进行了筛选
        if  self.hosts:
            print '111111'
            print self.hosts
            for host in self.hosts:
                print host
                item={"hostname": "",'ip':'', "port": "22", "username": login_user, "password": login_pwd}
                item["hostname"]=host
                item["ip"]=host
                hostList.append(item)

        else:
            ##多对多的查询##
            host=group.HOSTS.all()
            thosts = serializers.serialize('json', host, ensure_ascii=False)
            true = True
            null = None
            false=False
            hosts=eval(thosts)
            for host in hosts:
                print host
                item={"hostname": "",'ip':'', "port": "22", "username": login_user, "password": login_pwd}
                item["hostname"]=host["fields"]["NAME"]
                item["ip"]=host["fields"]["NAME"]
                hostList.append(item)

        log.info(hostList)
        mygroup={
            group.NAME:{
                "hosts":hostList,
                "vars":{
                    "ansible_ssh_user":login_user,
                    "anisble_ssh_pass":login_pwd
                }
            }
        }
        #return str(mygroup).replace('u\'','\'')
        return mygroup

