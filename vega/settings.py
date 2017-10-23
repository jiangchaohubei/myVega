# /usr/bin/python2
# -*- coding:utf8 -*-

#celery配置
import djcelery
djcelery.setup_loader()
BROKER_URL= 'redis://127.0.0.1:6379/0'
CELERY_RESULT_BACKEND = 'redis://127.0.0.1:6379/1'
CELERY_ACCEPT_CONTENT = ['application/json']
CELERY_TASK_SERIALIZER = 'json'
CELERY_RESULT_SERIALIZER = 'json'
CELERY_DEFAULT_QUEUE='default'

CELERY_TRACK_STARTED='True'
CELERY_TASK_RESULT_EXPIRES = 60 * 60 * 24   # 任务过期时间
CELERY_TIMEZONE = 'Asia/Shanghai'
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.8/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '*nnjr_d+0zs+3f5)^#8xt#u8o3o+c^iv%nl$$a_-vr&(of3rcp'



ALLOWED_HOSTS = ['117.131.17.218','117.131.17.207','106.14.157.183','127.0.0.1','10.200.58.6']


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    'app_tower',
    'djcelery',
    'loginmiddleware',
    'authority'

)

MIDDLEWARE_CLASSES = (

    'app_tower.middleware.mySessionMiddleware.SessionMiddleware',
    #'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    # 'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'app_tower.middleware.recordMiddleware.recordMiddleware',
    'loginmiddleware.loginmiddleware.LoginMiddleware',

)

ROOT_URLCONF = 'vega.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR+"/static",],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'vega.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'vega',
        'USER': 'root',  #root    #vegauser
        'PASSWORD': 'root',   #root     #DBVega568SQL
        'HOST': 'localhost',
        'PORT': '3306',
    },
    'innodb': {
            'ENGINE': 'django.db.backends.mysql',
            'OPTIONS': { 'init_command': 'SET storage_engine=INNODB;' }
        }
}


# Internationalization
# https://docs.djangoproject.com/en/1.8/topics/i18n/

LANGUAGE_CODE = 'zh-hans'

TIME_ZONE = 'Asia/Shanghai'

USE_I18N = True

USE_L10N = True

USE_TZ = False


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/

STATIC_URL = BASE_DIR+'/static/'



#session的超时时间设置

SESSION_COOKIE_AGE=60*30    #1分钟。
SESSION_EXPIRE_AT_BROWSER_CLOSE=True  #：会话cookie可以在用户浏览器中保持有效期。True：关闭浏览器，则Cookie失效。
#SESSION_COOKIE_DOMAIN 生效站点
#SESSION_COOKIE_NAME cookie中保存session的名称
#下面这个方法不是在settings中用的
#request.session.set_expiry(value)
# SECURITY WARNING: don't run with debug turned on in production!


EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# 邮件配置
EMAIL_USE_TLS = False
EMAIL_HOST = 'smtp.163.com'   #SMTP地址
EMAIL_PORT = 25  #SMTP端口
EMAIL_HOST_USER = '15221459431@163.com' #我自己的邮箱是发件人     需要去自己的邮箱开启SMTP 邮件服务
EMAIL_HOST_PASSWORD = 'smy289343354'   #SMTP密码   不是你的邮箱登录密码
DEFAULT_FROM_EMAIL = '15221459431@163.com'  #这样别人收到的邮件中就会有你设定的名称 发件人:<15221459431@163.com>


#日志配置
DEBUG = True
import loggerconfig
import datetime
LOGGING=loggerconfig.LOGGING