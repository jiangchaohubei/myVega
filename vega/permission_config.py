# -*- coding:utf8 -*-


permissionList={
    'queryPermissionList':[
        {'name':'credentials_select','url':'/app_tower/credentials/select','cname':'查询登录凭证'},
        {'name':'group_select','url':'/app_tower/group/select','cname':'查询主机组'},
        {'name':'host_select','url':'/app_tower/host/select','cname':'查询主机'},
        {'name':'jobTemplete_select','url':'/app_tower/job/select','cname':'查询任务模板'},
        {'name':'jobs_select','url':'/app_tower/jobs/select','cname':'查询任务'},
        {'name':'user_select','url':'/authority/select/user','cname':'查询用户'},
        {'name':'role_select','url':'/authority/select/role','cname':'查询角色'},
        {'name':'project_select','url':'/app_tower/project/select','cname':'查询项目组'},
        {'name':'playbook_select','url':'/app_tower/playbook/select','cname':'查询playbook'},
    ],
    'playbookPermissionList':[
        {'name':'playbook_add','url':'/app_tower/playbook/add','cname':'添加playbook'},
        {'name':'playbook_delete','url':'/app_tower/playbook/delete','cname':'删除playbook'},
        {'name':'playbook_update','url':'/app_tower/playbook/update','cname':'修改playbook'},
    ],
    'credentialsPermissionList':[
        {'name':'credentials_add','url':'/app_tower/credentials/add','cname':'添加登录凭证'},
        {'name':'credentials_delete','url':'/app_tower/credentials/delete','cname':'删除登录凭证'},
        {'name':'credentials_update','url':'/app_tower/credentials/update','cname':'修改登录凭证'},
    ],
    'projectPermissionList':[
        {'name':'project_add','url':'/app_tower/project/add','cname':'添加项目组'},
        {'name':'project_delete','url':'/app_tower/project/delete','cname':'删除项目组'},
        {'name':'project_update','url':'/app_tower/project/update','cname':'修改项目组'},
    ],
    'groupPermissionList':[
        {'name':'group_add','url':'/app_tower/group/add','cname':'添加主机组'},
        {'name':'group_delete','url':'/app_tower/group/delete','cname':'删除主机组'},
        {'name':'group_update','url':'/app_tower/group/update','cname':'修改主机组'},
        {'name':'group_export','url':'/app_tower/group/export','cname':'导出主机组'},
        {'name':'group_add_backGroup','url':'/app_tower/group/create_backGroup','cname':'添加回滚主机组'},
        {'name':'host_add','url':'/app_tower/host/add','cname':'添加主机'},
        {'name':'host_delete','url':'/app_tower/host/delete','cname':'删除主机'},
        {'name':'host_update','url':'/app_tower/host/update','cname':'修改主机'},
    ],
    'jobTemplatePermissionList':[
        {'name':'jobTemplete_add','url':'/app_tower/job/add','cname':'添加任务模板'},
        {'name':'jobTemplete_run_save','url':'/app_tower/job/save_run_job','cname':'运行并添加任务模板'},
        {'name':'jobTemplete_run','url':'/app_tower/job/run_job','cname':'运行任务模板'},
        {'name':'jobTemplete_delete','url':'/app_tower/job/delete','cname':'删除任务模板'},
        {'name':'jobTemplete_update','url':'/app_tower/job/update','cname':'更新任务模板'},
    ],
    'jobPermissionList':[
        {'name':'jobs_delete','url':'/app_tower/jobs/delete','cname':'删除任务'},
        {'name':'jobs_stop','url':'/app_tower/job/stop_job','cname':'停止任务'},
    ],
    'userPermissionList':[
        {'name':'user_add','url':'/authority/save/user','cname':'添加用户'},
        {'name':'user_update','url':'/authority/update/user','cname':'修改用户'},
        {'name':'user_delete','url':'/authority/delete/user','cname':'删除用户'},
        {'name':'role_add','url':'/authority/add/role','cname':'添加角色'},
        {'name':'role_delete','url':'/authority/delete/role','cname':'删除角色'},
        {'name':'role_update','url':'/authority/update/role_permission','cname':'更新角色权限'},
    ],
    'feedbackPermissionList':[
        {'name':'saveFeedBack','url':'/feedback/saveFeedBack','cname':'添加意见反馈'},
        {'name':'exportAllFeedback','url':'/feedback/export/allFeedback','cname':'导出意见反馈'},
    ],
    'commandsPermissionList':[
        {'name':'runSH','url':'/app_tower/job/run_commands_runSH','cname':'执行sh脚本'},
        {'name':'searchProcess','url':'/app_tower/job/run_commands_searchProcess','cname':'查询进程'},
        {'name':'changeProcess','url':'/app_tower/job/run_commands_changeProcess','cname':'启动/停止进程'},
        {'name':'updateSudo','url':'/app_tower/job/run_commands_changeSudoAuth','cname':'sudo权限操作'},
        {'name':'callbackSudo','url':'/app_tower/job/run_commands_callbackSudoAuth','cname':'回收sudo权限'},
        {'name':'searchLog','url':'/app_tower/job/run_commands_searchLog','cname':'查日志'},
        {'name':'copyFile','url':'/app_tower/job/run_commands_copyFile','cname':'分发文件'},
        {'name':'searchSN','url':'/app_tower/job/run_commands_searchSN','cname':'查询SN号'},

    ],
    'datastatisticsPermissionList':[
        {'name':'sudo_select','url':'/app_tower/job/sudo_select','cname':'sudo权限统计'},
        {'name':'operation_select','url':'/app_tower/job/operation_select','cname':'操作记录统计'},
        {'name':'JobStatus_select','url':'/authority/charts/JobStatusStatics/JobStatus','cname':'任务状态统计'},



    ]
}


roleList=[
    {
        'name':'超级管理员',
        'permissionList':[
            'credentials_select','group_select','host_select','jobTemplete_select','jobs_select','user_select','role_select','project_select','playbook_select',
            'credentials_add','credentials_delete','credentials_update',
            'playbook_add','playbook_delete','playbook_update',
            'project_add','project_delete','project_update',
            'group_add', 'group_delete','group_update','group_export','group_add_backGroup','host_add','host_delete','host_update',
            'jobTemplete_add', 'jobTemplete_run_save','jobTemplete_run','jobTemplete_delete','jobTemplete_update',
            'jobs_delete', 'jobs_stop',
            'user_add','user_update','user_delete', 'role_add','role_delete','role_update',
            'saveFeedBack','exportAllFeedback',
            'updateSudo','searchLog','copyFile','searchSN','changeProcess','searchProcess','runSH','callbackSudo',
            'sudo_select','operation_select','JobStatus_select',
        ]
    },
    {
        'name':'管理员',
        'permissionList': [
            'credentials_select','group_select','host_select','jobTemplete_select','jobs_select','user_select','role_select','project_select','playbook_select',
            'credentials_add','credentials_delete','credentials_update',
            'playbook_add','playbook_delete','playbook_update',
            'project_add','project_delete','project_update',
            'group_add', 'group_delete','group_update','group_export','group_add_backGroup','host_add','host_delete','host_update',
            'jobTemplete_add', 'jobTemplete_run_save','jobTemplete_run','jobTemplete_delete','jobTemplete_update',
            'jobs_delete', 'jobs_stop',
            'user_add','user_update','user_delete', 'role_add','role_delete','role_update',
            'saveFeedBack','exportAllFeedback',
            'updateSudo','searchLog','copyFile','searchSN','changeProcess','searchProcess','runSH','callbackSudo',
            'sudo_select','operation_select','JobStatus_select',
        ]
    },
    {
        'name':'运维人员',
        'permissionList': [
            'credentials_select','group_select','host_select','jobTemplete_select','jobs_select','project_select','playbook_select',
            'credentials_add','credentials_delete','credentials_update',
            'playbook_add','playbook_delete','playbook_update',
            'project_add','project_delete','project_update',
            'group_add', 'group_delete','group_update','group_export','group_add_backGroup','host_add','host_delete','host_update',
            'jobTemplete_add', 'jobTemplete_run_save','jobTemplete_run','jobTemplete_delete','jobTemplete_update',
            'jobs_delete', 'jobs_stop',
            'saveFeedBack','exportAllFeedback',
            'updateSudo','searchLog','copyFile','searchSN','changeProcess','searchProcess','runSH','callbackSudo',
            'sudo_select','operation_select','JobStatus_select',

        ]
    },
    {
        'name':'游客',
        'permissionList': [
            'credentials_select','group_select','host_select','jobTemplete_select','jobs_select','user_select','role_select','project_select','playbook_select',
        ]
    },

]



