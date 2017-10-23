# -*- coding:utf8 -*-
from app_tower.models import User,RoleList,PermissionList,T_RoleList_PermissionList_ID
from authority.mysqldb.authoritydb import md5
import permission_config
class rolelist_permission():
    #初始化超级管理员用户
    # if not User.objects.all():
    #     user = User(username='Admin', password=md5("88888888"),nickname='超级管理员',is_superuser="1")
    #     user.save()
    #初始化权限表

    for pname ,list in permission_config.permissionList.items():
        for per in list:
            if not PermissionList.objects.filter(name=per['name'], url=per['url']):
                permission=PermissionList(name=per['name'], url=per['url'])
                permission.save()

    #初始化角色表

    for r in permission_config.roleList:
        if not RoleList.objects.filter(name=r['name']):
            role=RoleList(name=r['name'])
            role.save()
        else:
            role=RoleList.objects.get(name=r['name'])
        #初始化角色权限表

        for pername in r['permissionList']:
            print pername
            role_permission=PermissionList.objects.get(name=pername)

            if not T_RoleList_PermissionList_ID.objects.filter(RoleList_ID=role,PermissionList_ID=role_permission):
                rolelist_permissionlist=T_RoleList_PermissionList_ID(RoleList_ID=role,PermissionList_ID=role_permission)
                rolelist_permissionlist.save()
    if not User.objects.all().exists():
        user = User(username='Admin',mobile='15214376851', password=md5("88888888"),email='shaochenhui@migu.cn',nickname='超级管理员',is_superuser="1",role=RoleList.objects.get(name="超级管理员"))
        user.save()
