# -*- coding: utf-8 -*
from django.conf.urls import patterns, include, url
from feedback.mysqldb import feedbackdb
urlpatterns = patterns('feedback',
                       # 保存用户提出的意见
                       url(r'^saveFeedBack$', feedbackdb.saveFeedBack),
                       # 导出用户提出的所有意见到服务器
                       url(r'^export/allFeedback$', feedbackdb.exportAllFeedback),
                       # 下载
                       url(r'^export/allFeedback/download', feedbackdb.feedback_download),
)


