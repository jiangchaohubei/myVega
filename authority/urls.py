# -*- coding: utf-8 -*
from django.conf.urls import patterns, include, url
from authority.mysqldb import authoritydb
urlpatterns = patterns('authorities',

                       url(r'^user/login$', authoritydb.login),
                       url(r'^user/logout', authoritydb.logout),
                       url(r'^user/checkUserName', authoritydb.checkUserName),
                       url(r'^user/checkUserQuestion', authoritydb.checkUserQuestion),
                       url(r'^user/reset/password/email', authoritydb.resetPasswordByEmail),
                       url(r'^user/reset/password/mobile', authoritydb.resetPasswordByMobile),



                       url(r'^user/check/capcha', authoritydb.checkCapcha),
                       url(r'^user/updatepassword', authoritydb.updatepassword),
                       url(r'^user/loginCapcha', authoritydb.loginCapcha),


                       url(r'^select/user$', authoritydb.selectUser),
                       url(r'^select/role$', authoritydb.selectRole),
                       url(r'^select/init_role$', authoritydb.init_role),
                       url(r'^save/user$', authoritydb.saveUser),
                       url(r'^update/user$', authoritydb.updateUser),
                       url(r'^delete/user$', authoritydb.delete),
                       url(r'^add/role$', authoritydb.addRole),
                       url(r'^delete/role$', authoritydb.deleteRole),

                       url(r'^select/parentPermission$', authoritydb.parentPermission),

                       url(r'^update/role_permission$', authoritydb.role_permission_update),

                       # 图表 工具方法
                       url(r'^charts/userLoginStatics$', authoritydb.userLoginStatics),
                       url(r'^charts/JobStatusStatics/JobStatus$', authoritydb.JobStatusStatics),



)


