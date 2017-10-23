#!/usr/bin/env python
#-*- coding: utf-8 -*-
#update:2014-09-12 by liufeily@163.com

from django.core.urlresolvers import reverse
from django.http import HttpResponse,HttpResponseRedirect
from django.shortcuts import render_to_response,RequestContext
from django.contrib.auth.decorators import login_required
# from website.common.CommonPaginator import SelfPaginator
from app_tower.permission import PermissionVerify

from django.contrib import auth
from django.contrib.auth import get_user_model
#from UserManage.forms import LoginUserForm,ChangePasswordForm,AddUserForm,EditUserForm





@login_required
@PermissionVerify()
def ListUser(request):
    mList = get_user_model().objects.all()

    kwvars = {
        'lPage':lst,
        'request':request,
    }

    return render_to_response('UserManage/user.list.html',kwvars,RequestContext(request))

@login_required
@PermissionVerify()
def AddUser(request):

    if request.method=='POST':
        form = AddUserForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data['password'])

            form.save()
            return HttpResponseRedirect(reverse('listuserurl'))
    else:
        form = AddUserForm()

    kwvars = {
        'form':form,
        'request':request,
    }

    return render_to_response('UserManage/user.add.html',kwvars,RequestContext(request))

@login_required
@PermissionVerify()
def EditUser(request,ID):
    user = get_user_model().objects.get(id = ID)

    if request.method=='POST':
        form = EditUserForm(request.POST,instance=user)
        if form.is_valid():
            form.save()
            return HttpResponseRedirect(reverse('listuserurl'))
    else:
        form = EditUserForm(instance=user
        )

    kwvars = {
        'ID':ID,
        'form':form,
        'request':request,
    }

    return render_to_response('UserManage/user.edit.html',kwvars,RequestContext(request))

@login_required
@PermissionVerify()
def DeleteUser(request,ID):
    if ID == '1':
        return HttpResponse(u'超级管理员不允许删除!!!')
    else:
        get_user_model().objects.filter(id = ID).delete()

    return HttpResponseRedirect(reverse('listuserurl'))

@login_required
@PermissionVerify()
def ResetPassword(request,ID):
    user = get_user_model().objects.get(id = ID)

    newpassword = get_user_model().objects.make_random_password(length=10,allowed_chars='abcdefghjklmnpqrstuvwxyABCDEFGHJKLMNPQRSTUVWXY3456789')
    print '====>ResetPassword:%s-->%s' %(user.username,newpassword)
    user.set_password(newpassword)
    user.save()

    kwvars = {
        'object':user,
        'newpassword':newpassword,
        'request':request,
    }

    return render_to_response('UserManage/password.reset.html',kwvars,RequestContext(request))
