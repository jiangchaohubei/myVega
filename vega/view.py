# /usr/bin/python2
# -*- coding:utf8 -*-
from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect
from vega.rolelist_permissionlist_init import rolelist_permission
#from vega.deleteLogsRegular import runTask
@csrf_protect
def index(request):
    context = {}
    context['index'] = 'this is index!'
    rolelist_permission

    return render(request, 'templates/pages/index.html', context)

def main(request):
    context = {}
    context['USERNAME'] =request.session['username']
    context['PERMISSIONNAMELIST']=request.session['permissionsNamelist']
    print context['PERMISSIONNAMELIST']
    return render(request, 'templates/pages/main.html', context)

