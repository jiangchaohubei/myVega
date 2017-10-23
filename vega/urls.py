# /usr/bin/python2
# -*- coding:utf8 -*-
from django.conf.urls import url,include,patterns
import settings
from . import view
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
                       url(r'^login$', view.index),
                       url(r'^main$', view.main),
                       url(r'^admin/', include(admin.site.urls)),
                       url(r'^app_tower/', include('app_tower.urls')),
                       url(r'^authority/', include('authority.urls')),
                       url(r'^feedback/', include('feedback.urls')),

                       url(r'^static/(?P<path>.*)$', 'django.views.static.serve',{'document_root': settings.STATIC_URL}),
)
