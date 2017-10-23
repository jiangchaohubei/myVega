创建项目       django-admin startproject vega
创建app应用    python manage.py startapp app_tower


自动化部署 安装模块
redis3.2.0.tar.g
python==2.7
django==1.8
django-celery==3.1.17
celery==3.1.17
redis==2.10
ansible==2.3.1.0
MySQL-python   x86_64   1.2.5-1.el7
pip install  pyexcel_xls   0.5.0




上线新版本后操作步骤：

1.  python manage.py makemigrations   # 让 Django 知道我们在我们的模型有一些变更（当上传新版本时，要把所有app的migrations文件夹下的除__init__.py文件外的文件复制到新上传项目对应文件夹）

2. python manage.py migrate   # 创建表结构

3.先启动服务器
     python manage.py runserver 0.0.0.0:80 &
4.再启动worker
    export PYTHONOPTIMIZE=1
    python manage.py celery worker -c 4 --loglevel=info --autoreload &
    #一次最多4个任务，其他将会排队

（说明：3.4步骤可以合并为项目根目录下执行 ./run.sh）




注意事项：
#初始用户   Admin        初始密码   88888888

settings.py中ALLOWED_HOSTS加服务器访问ip

cd /usr/local/redis-3.2.0/src
./redis-server /usr/local/redis-3.2.0/redis.conf

# 如果更换发送人的邮箱 需要将发送人的邮箱开启  STMP 邮件服务