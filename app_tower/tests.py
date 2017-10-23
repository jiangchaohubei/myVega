# /usr/bin/python2
# -*- coding:utf8 -*-
from django.test import TestCase
from app_tower.tasks import add,sendmail
import time
#from celery.task.control import revoke
import logging
log = logging.getLogger("test1") # 为loggers中定义的名称
# Create your tests here.

class celery_test(TestCase):
    def test(self):

        result=add.delay(7, 8)
        print 'task_id1:',result.task_id

    def test2(self):
        print '邮件发送前'
        result=sendmail.delay(dict(to='jiangchao_hubei@163.com'))
        print 'task_id2:',result.task_id
        print '邮件发送后'
    def revoke(self):
        result=sendmail.delay(dict(to='jiangchao_hubei@163.com'))
        taskid=result.task_id
        print taskid
        time.sleep(2.0)

