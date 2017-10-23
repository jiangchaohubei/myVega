# -*- coding: utf-8 -*
from django.http import JsonResponse
from django.http import HttpRequest, HttpResponse, HttpResponseRedirect
from django.core.mail import send_mail
import os
from pyexcel_xls import save_data
from collections import OrderedDict
from app_tower.models import FEEDBACK,User
from authority.permission import PermissionVerify
import logging
log = logging.getLogger("feedback")
# 保存用户意见
@PermissionVerify()
def saveFeedBack(request):
    log.info('saveFeedBack start')
    if request.session['username']:
        request.session['username'] = request.session['username']
        request.session['userId'] = User.objects.get(username=request.session['username']).id
    else:
        response = HttpResponse()
        response.write("<script>alert('抱歉，会话过期，请登录系统！');top.location.href='/login'</script>")
        return response
    response_data = {}
    form = {}
    try:
        if request.POST:
            form['TOPIC'] = request.POST['TOPIC']
            form['CONTENT'] = request.POST['CONTENT']
            fd=FEEDBACK(TOPIC=form['TOPIC'],CONTENT=form['CONTENT'],CREATE_USER_NAME=request.session['username'])
            fd.save()
            # 将用户提取的反馈意见通过邮箱发送给管理员
            # 管理员邮箱
            superAdminEmail=User.objects.get(username="Admin").email
            title =str(request.session['username'])+ "用户为自动化部署项目提取了宝贵意见!"
            content = "意见主题是:"+form['TOPIC'].encode("utf-8")+"意见内容是:"+form['CONTENT'].encode("utf-8")
            send_mail(title, content, '15221459431@163.com',
                      [str(superAdminEmail)], fail_silently=False)

            response_data['resultCode'] = '0000'
            response_data['resultDesc'] = 'Success'
    except Exception, ex:
        print Exception, ex
        response_data['resultCode'] = '0001'
        response_data['resultDesc'] = 'Faield'
    log.info('saveFeedBack end')
    return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")
# 导出 所有的反馈意见 再写入到服务器上在 导出
@PermissionVerify()
def exportAllFeedback(request):
        response_data = {}
        log.info('exportAllFeedback start')
        try:
            # 查询
            feedbacList = FEEDBACK.objects.all()
            # 写Excel数据, xls格式
            data = OrderedDict()
            # sheet表的数据
            sheet_1 = []
            row_1_data = [u"ID", u"反馈意见人",u"主题",u"反馈内容",u"反馈意见的时间" ]  # 每一行的数据
            # 添加表头
            sheet_1.append(row_1_data)
            # 遍历  逐条添加数据
            for feedback in feedbacList:
                row_data = []
                row_data.append(feedback.id)
                row_data.append(feedback.CREATE_USER_NAME)
                row_data.append(feedback.TOPIC)
                row_data.append(feedback.CONTENT)
                row_data.append(feedback.CREATE_TIME)
                sheet_1.append(row_data)
            # 添加sheet表
            data.update({u"这是反馈意见表": sheet_1})
            exportRoot = str(os.getcwd()) + "/feedbackExport/feedback.xls"
            # 保存成xls文件
            save_data(exportRoot, data)
            response_data['resultCode'] = '0000'
            response_data['filepath'] = exportRoot
            response_data['resultDesc'] = 'Success'
        except Exception, ex:
            print "==exception=="
            print Exception, ex
            print "==exception=="
            response_data['resultCode'] = '0001'
            response_data['resultDesc'] = 'Faield'
        log.info('exportAllFeedback end')
        return HttpResponse(JsonResponse(response_data), content_type="application/json;charset=UTF-8")



def feedback_download(request):
    response_data={}
    form={}
    log.info('feedback_download start')
    form["filepath"]=request.GET['filepath']
    form["filename_"]="意见反馈表"
    form["filetype_"]=".xls"
    # 下载文件
    def readFile(fn, buf_size=262144):  # 大文件下载，设定缓存大小
        f = open(fn, "rb")
        while True:  # 循环读取
            c = f.read(buf_size)
            if c:
                yield c
            else:
                break
        f.close()

    response = HttpResponse(readFile(form["filepath"]),
                            content_type='APPLICATION/OCTET-STREAM')  # 设定文件头，这种设定可以让任意文件都能正确下载，而且已知文本文件不是本地打开
    response['Content-Disposition'] = 'attachment; filename=' + form["filename_"] + form["filetype_"] # 设定传输给客户端的文件名称
    response['Content-Length'] = os.path.getsize(form["filepath"])  # 传输给客户端的文件大小
    log.info('feedback_download end')
    # 导出成功之后   删除服务器上的文件
    os.remove(form["filepath"])
    return response