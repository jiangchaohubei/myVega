# -*- coding: utf-8 -*
from django.conf.urls import patterns, include, url
from app_tower.mysqldb import inventoriesdb
from app_tower.mysqldb import jobTemplatedb
from app_tower.mysqldb import jobsdb
from app_tower.mysqldb import credentials,project,playbook

urlpatterns = patterns('inventories',
                        url(r'^group/select$', inventoriesdb.group_select),
                        url(r'^group/add$', inventoriesdb.group_add),
                        url(r'^group/create_backGroup$', inventoriesdb.create_backGroup),
                        url(r'^group/delete$', inventoriesdb.group_delete),
                        url(r'^group/update$', inventoriesdb.group_update),
                         # 导出主机组全部信息 到服务器
                        url(r'^group/export$', inventoriesdb.group_export),
                        # 下载信息到本地
                        url(r'^group/export/download$', inventoriesdb.group_download),



                        url(r'^host/add$', inventoriesdb.host_add),
                        # 将 主机组文件上传到服务器上
                        url(r'^hosts/import$', inventoriesdb.hosts_import),

                        url(r'^host/select$', inventoriesdb.host_select),
                        url(r'^host/delete$', inventoriesdb.host_delete),
                        url(r'^host/update$', inventoriesdb.host_update),
                        url(r'^hosts/downloadXLSX$', inventoriesdb.downloadXLSX),
                        url(r'^host/searchHostByGrooupId$', inventoriesdb.searchHostByGrooupId),

                        url(r'^job/select$', jobTemplatedb.job_select),
                        url(r'^job/delete$', jobTemplatedb.job_delete),
                        url(r'^job/update$', jobTemplatedb.job_update),



                        url(r'^job/add$', jobTemplatedb.job_add),


                        url(r'^job/to_job_add$', jobTemplatedb.to_job_add),
                        url(r'^job/save_run_job$', jobTemplatedb.save_run_job),
                        url(r'^job/run_job$', jobTemplatedb.run_job),
                        url(r'^job/to_job_run$', jobTemplatedb.to_job_run),


                        url(r'^job/run_commands$', jobTemplatedb.run_commands),
                        url(r'^job/run_commands2$', jobTemplatedb.run_commands2),
                        url(r'^job/run_commands_changeSudoAuth$', jobTemplatedb.run_commands_changeSudoAuth),
                        url(r'^job/run_commands_callbackSudoAuth$', jobTemplatedb.run_commands_callbackSudoAuth),
                        url(r'^job/run_commands_searchSN$', jobTemplatedb.run_commands_searchSN),
                        url(r'^job/run_commands_searchLog$', jobTemplatedb.run_commands_searchLog),
                        url(r'^job/run_commands_copyFile$', jobTemplatedb.run_commands_copyFile),
                        url(r'^job/run_commands_changeProcess$', jobTemplatedb.run_commands_changeProcess),
                        url(r'^job/run_commands_searchProcess$', jobTemplatedb.run_commands_searchProcess),
                        url(r'^job/run_commands_runSH$', jobTemplatedb.run_commands_runSH),
                        url(r'^job/sudo_select$', jobTemplatedb.sudo_select),

                        url(r'^job/checkFile$', jobTemplatedb.checkFile),
                        url(r'^job/read_commands_log', jobTemplatedb.read_commands_log),
                        url(r'^job/init_commands_select', jobTemplatedb.init_commands_select),
                        url(r'^job/read_job_log', jobTemplatedb.read_job_log),
                        url(r'^job/stop_job', jobTemplatedb.stop_job),

                        url(r'^job/get_event', jobTemplatedb.get_event),


                        url(r'^jobs/select$', jobsdb.jobs_select),
                        url(r'^jobs/delete$', jobsdb.jobs_delete),
                        url(r'^jobs/update$', jobsdb.jobs_update),

                       url(r'^credentials/select', credentials.credentials_select),
                       url(r'^credentials/add', credentials.credentials_add),
                       url(r'^credentials/delete', credentials.credentials_delete),
                       url(r'^credentials/update', credentials.credentials_update),

                       url(r'^review_file$', jobTemplatedb.review_file),

                       url(r'^project/init_user_select$', project.init_user_select),
                       url(r'^project/init_project_select$', project.init_project_select),
                       url(r'^project/init_ProjectModal$', project.init_ProjectModal),
                       url(r'^project/add$', project.project_add),
                       url(r'^project/select$', project.project_select),
                       url(r'^project/delete', project.project_delete),
                       url(r'^project/update', project.project_update),

					   url(r'^job/operation_select$', jobTemplatedb.operation_select),
                       url(r'^playbook/add', playbook.playbook_add),
                       url(r'^playbook/select', playbook.playbook_select),
                       url(r'^playbook/delete', playbook.playbook_delete),
                       url(r'^playbook/update', playbook.playbook_update),

)



#
# urlpatterns = patterns('select',
#                        url(r'^inventories/select$', inventoriesdb.inventories_select),
# )
