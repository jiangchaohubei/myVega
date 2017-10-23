# /usr/bin/python2
# -*- coding:utf8 -*-
import datetime
from logging.handlers import TimedRotatingFileHandler
LOGGING = {
    'version': 1,
    'disable_existing_loggers': True,
    'formatters': {
        'standard': {
            'format': '%(asctime)s %(filename)s[line:%(lineno)d] %(levelname)s %(message)s'
        },
    },
    'filters': {
        'require_debug_false':{
            '()':'django.utils.log.RequireDebugFalse',
        },
        'require_debug_true':{
            '()':'django.utils.log.RequireDebugTrue',
        }
    },
    'handlers': {
        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'formatter':'standard',
        },
        'console':{
            'level': 'INFO',
            'filters': ['require_debug_true'],
            'class': 'logging.StreamHandler',
            'formatter': 'standard'
        },
        'test1_handler': {
            'level':'DEBUG',
            'class':'logging.handlers.TimedRotatingFileHandler',
            'filename':'./logs/test1/test1-'+datetime.datetime.now().strftime("%Y%m%d")+'.log',
            'formatter':'standard',
            'when':'midnight', #天“S”: Seconds“M”: Minutes“H”: Hours“D”: Days“W”: Week day (0=Monday)“midnight”: Roll over at midnight
            'interval':1,   #间隔when时间
            'backupCount':40,

        },# 用于文件输出
        'test2_handler': {
            'level':'DEBUG',
            'class':'logging.handlers.TimedRotatingFileHandler',
            'filename':'./logs/test2/test2-'+datetime.datetime.now().strftime("%Y%m%d")+'.log',
            'formatter':'standard',
            'when':'midnight', #天“S”: Seconds“M”: Minutes“H”: Hours“D”: Days“W”: Week day (0=Monday)“midnight”: Roll over at midnight
            'interval':1,   #间隔when时间
            'backupCount':40,
        },# 用于文件输出
        'jobTempletedb_handler': {
            'level':'DEBUG',
            'class':'logging.handlers.TimedRotatingFileHandler',
            'filename':'./logs/jobTempletedb/jobTempletedb-'+datetime.datetime.now().strftime("%Y%m%d")+'.log',
            'formatter':'standard',
            'when':'midnight', #天“S”: Seconds“M”: Minutes“H”: Hours“D”: Days“W”: Week day (0=Monday)“midnight”: Roll over at midnight
            'interval':1,   #间隔when时间
            'backupCount':40,
        },# 用于文件输出
        'inventoriesdb_handler': {
            'level':'DEBUG',
            'class':'logging.handlers.TimedRotatingFileHandler',
            'filename':'./logs/inventoriesdb/inventoriesdb-'+datetime.datetime.now().strftime("%Y%m%d")+'.log',
            'formatter':'standard',
            'when':'midnight', #天“S”: Seconds“M”: Minutes“H”: Hours“D”: Days“W”: Week day (0=Monday)“midnight”: Roll over at midnight
            'interval':1,   #间隔when时间
            'backupCount':40,
        },# 用于文件输出
        'jobsdb_handler': {
            'level':'DEBUG',
            'class':'logging.handlers.TimedRotatingFileHandler',
            'filename':'./logs/jobsdb/jobsdb-'+datetime.datetime.now().strftime("%Y%m%d")+'.log',
            'formatter':'standard',
            'when':'midnight', #天“S”: Seconds“M”: Minutes“H”: Hours“D”: Days“W”: Week day (0=Monday)“midnight”: Roll over at midnight
            'interval':1,   #间隔when时间
            'backupCount':40,   #最大日志数，自动删除久远的日志

        },# 用于文件输出
        'playbook_run_handler': {
            'level':'DEBUG',
            'class':'logging.handlers.TimedRotatingFileHandler',
            'filename':'./logs/playbook_run/playbook_run-'+datetime.datetime.now().strftime("%Y%m%d")+'.log',
            'formatter':'standard',
            'when':'midnight', #天“S”: Seconds“M”: Minutes“H”: Hours“D”: Days“W”: Week day (0=Monday)“midnight”: Roll over at midnight
            'interval':1,   #间隔when时间
            'backupCount':40,
        },# 用于文件输出
        'commands_run_handler': {
            'level':'DEBUG',
            'class':'logging.handlers.TimedRotatingFileHandler',
            'filename':'./logs/commands_run/commands_run-'+datetime.datetime.now().strftime("%Y%m%d")+'.log',
            'formatter':'standard',
            'when':'midnight', #天“S”: Seconds“M”: Minutes“H”: Hours“D”: Days“W”: Week day (0=Monday)“midnight”: Roll over at midnight
            'interval':1,   #间隔when时间
            'backupCount':40,
        },# 用于文件输出
        'usersdb_handler': {
            'level':'DEBUG',
            'class':'logging.handlers.TimedRotatingFileHandler',
            'filename':'./logs/usersdb/usersdb-'+datetime.datetime.now().strftime("%Y%m%d")+'.log',
            'formatter':'standard',
            'when':'midnight', #天“S”: Seconds“M”: Minutes“H”: Hours“D”: Days“W”: Week day (0=Monday)“midnight”: Roll over at midnight
            'interval':1,   #间隔when时间
            'backupCount':40,
        },# 用于文件输出

        'authoritydb_handler': {
            'level':'DEBUG',
            'class':'logging.handlers.TimedRotatingFileHandler',
            'filename':'./logs/authoritydb/authoritydb-'+datetime.datetime.now().strftime("%Y%m%d")+'.log',
            'formatter':'standard',
            'when':'midnight', #天“S”: Seconds“M”: Minutes“H”: Hours“D”: Days“W”: Week day (0=Monday)“midnight”: Roll over at midnight
            'interval':1,   #间隔when时间
            'backupCount':40,
        },# 用于文件输出

        'tasks_handler': {
            'level':'DEBUG',
            'class':'logging.handlers.TimedRotatingFileHandler',
            'filename':'./logs/tasks/tasks-'+datetime.datetime.now().strftime("%Y%m%d")+'.log',
            'formatter':'standard',
            'when':'midnight', #天“S”: Seconds“M”: Minutes“H”: Hours“D”: Days“W”: Week day (0=Monday)“midnight”: Roll over at midnight
            'interval':1,   #间隔when时间
            'backupCount':40,
        },# 用于文件输出
        'credentials_handler': {
            'level':'DEBUG',
            'class':'logging.handlers.TimedRotatingFileHandler',
            'filename':'./logs/credentials/credentials-'+datetime.datetime.now().strftime("%Y%m%d")+'.log',
            'formatter':'standard',
            'when':'midnight', #天“S”: Seconds“M”: Minutes“H”: Hours“D”: Days“W”: Week day (0=Monday)“midnight”: Roll over at midnight
            'interval':1,   #间隔when时间
            'backupCount':40,
        },# 用于文件输出
        'project_handler': {
            'level':'DEBUG',
            'class':'logging.handlers.TimedRotatingFileHandler',
            'filename':'./logs/project/project-'+datetime.datetime.now().strftime("%Y%m%d")+'.log',
            'formatter':'standard',
            'when':'midnight', #天“S”: Seconds“M”: Minutes“H”: Hours“D”: Days“W”: Week day (0=Monday)“midnight”: Roll over at midnight
            'interval':1,   #间隔when时间
            'backupCount':40,
        },# 用于文件输出
        'feedback_handler': {
            'level':'DEBUG',
            'class':'logging.handlers.TimedRotatingFileHandler',
            'filename':'./logs/feedback/feedback-'+datetime.datetime.now().strftime("%Y%m%d")+'.log',
            'formatter':'standard',
            'when':'midnight', #天“S”: Seconds“M”: Minutes“H”: Hours“D”: Days“W”: Week day (0=Monday)“midnight”: Roll over at midnight
            'interval':1,   #间隔when时间
            'backupCount':40,
        },# 用于文件输出
        'playbook_handler': {
            'level':'DEBUG',
            'class':'logging.handlers.TimedRotatingFileHandler',
            'filename':'./logs/playbook/playbook-'+datetime.datetime.now().strftime("%Y%m%d")+'.log',
            'formatter':'standard',
            'when':'midnight', #天“S”: Seconds“M”: Minutes“H”: Hours“D”: Days“W”: Week day (0=Monday)“midnight”: Roll over at midnight
            'interval':1,   #间隔when时间
            'backupCount':40,
        },# 用于文件输出
    },
    'loggers': {
        'django.request': {
            'handlers': ['mail_admins'],
            'level': 'ERROR',
            'propagate': True,
        },
        'django': {
            'handlers' :['test1_handler', 'console'],
            'level':'DEBUG',
            'propagate': True # 是否继承父类的log信息
        }, # handlers 来自于上面的 handlers 定义的内容
        'test1':{
            'handlers': ['test1_handler','console'],
            'level': 'INFO',
            'propagate': False
        },
        'test2':{
            'handlers': ['test2_handler','console'],
            'level': 'INFO',
            'propagate': False
        },
        'jobTempletedb':{
            'handlers': ['jobTempletedb_handler','console'],
            'level': 'INFO',
            'propagate': False
        },
        'inventoriesdb':{
            'handlers': ['inventoriesdb_handler','console'],
            'level': 'INFO',
            'propagate': False
        },
        'jobsdb':{
            'handlers': ['jobsdb_handler','console'],
            'level': 'INFO',
            'propagate': False
        },
        'playbook_run':{
            'handlers': ['playbook_run_handler','console'],
            'level': 'INFO',
            'propagate': False
        },
        'commands_run':{
            'handlers': ['commands_run_handler','console'],
            'level': 'INFO',
            'propagate': False
        },

        'usersdb':{
            'handlers': ['usersdb_handler','console'],
            'level': 'INFO',
            'propagate': False
        },

        'authoritydb':{
            'handlers': ['authoritydb_handler','console'],
            'level': 'INFO',
            'propagate': False
        },




        'tasks':{
            'handlers': ['tasks_handler','console'],
            'level': 'INFO',
            'propagate': False
        },
        'credentials':{
            'handlers': ['credentials_handler','console'],
            'level': 'INFO',
            'propagate': False
        },
        'project':{
            'handlers': ['project_handler','console'],
            'level': 'INFO',
            'propagate': False
        },
        'feedback':{
            'handlers': ['feedback_handler','console'],
            'level': 'INFO',
            'propagate': False
        },
        'playbook':{
            'handlers': ['playbook_handler','console'],
            'level': 'INFO',
            'propagate': False
        },


    }
}