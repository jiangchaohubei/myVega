#!/bin/sh
ps -ef|grep python |grep -v grep|cut -c 9-15|xargs kill -9
export PYTHONOPTIMIZE=1
nohup python /opt/vega/manage.py runserver 0.0.0.0:80 &

nohup python /opt/vega/manage.py celery worker -c 4 --loglevel=info --autoreload &