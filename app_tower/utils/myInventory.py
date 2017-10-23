#!/usr/bin/env python
# -*- coding:utf8 -*-
from ansible.inventory import Inventory
from ansible.inventory.group import Group
from ansible.inventory.host import Host

class myInventory(Inventory):
    """
    this is my ansible inventory object.
    """
    def __init__(self, resource, loader, variable_manager,host_list=[]):
        """
        resource的数据格式是一个列表字典，比如
            {
                "group1": {
                    "hosts": [{"hostname": "10.0.0.0", "port": "22", "username": "test", "password": "pass"}, ...],
                    "vars": {"var1": value1, "var2": value2, ...}
                }
            }

        如果你只传入1个列表，这默认该列表内的所有主机属于default_group组,比如
            [{"hostname": "10.0.0.0", "port": "22", "username": "test", "password": "pass"}, ...]
        """
        self.resource = resource
        #     {
        #     u'test': {
        #         'hosts': [
        #             {'username': '', 'password': '','ip':u'113.209.107.36', 'hostname': u'113.209.107.36', 'port': '22'},
        #             {'username': '', 'password': '','ip':u'10.200.56.28', 'hostname': u'10.200.56.28', 'port': '22'}
        #         ],
        #         'vars': {'anisble_ssh_pass': 'z8xFC9l~', 'ansible_ssh_user': 'root'}
        #     }
        # }
        self.inventory = Inventory(loader=loader, variable_manager=variable_manager, host_list=host_list)


    def my_add_group(self, hosts, groupname, groupvars=None):
        print 'my_add_group'
        print str(hosts)
        """
        add hosts to a group
        """
        my_group = Group(name=groupname)

        # if group variables exists, add them to group
        if groupvars:
            for key, value in groupvars.iteritems():
                my_group.set_variable(key, value)

                # add hosts to group
        for host in hosts:
            print host
            # set connection variables
            hostname = host.get("hostname")
            hostip = host.get('ip', hostname)
            hostport = host.get("port")
            username = host.get("username")
            password = host.get("password")
            #ssh_key = host.get("ssh_key")
            my_host = Host(name=hostname, port=hostport)
            my_host.set_variable('ansible_ssh_host', hostip)
            my_host.set_variable('ansible_ssh_port', hostport)
            my_host.set_variable('ansible_ssh_user', username)
            my_host.set_variable('ansible_ssh_pass', password)
            #my_host.set_variable('ansible_ssh_private_key_file', ssh_key)

            # set other variables
            for key, value in host.iteritems():
                if key not in ["hostname", "port",'ip', "username", "password"]:
                    my_host.set_variable(key, value)
                    # add to group
            my_group.add_host(my_host)
            #加到all里面
            self.inventory.get_group('all').add_host(my_host)

        print my_group.get_hosts()
        print my_group._get_hosts()
        print my_group.get_vars()
        self.inventory.add_group(my_group)

        print self.inventory.get_hosts()
        print self.inventory.get_group_dict()


    def gen_inventory(self):
        print 'gen_inventory'
        """
        add hosts to inventory.
        """
        if isinstance(self.resource, list):
            print 'if'
            print self.resource
            self.my_add_group(self.resource, 'default_group')
        elif isinstance(self.resource, dict):
            print 'elif'
            print self.resource
            for groupname, hosts_and_vars in self.resource.iteritems():
                print groupname,hosts_and_vars.get("hosts")
                self.my_add_group(hosts_and_vars.get("hosts"), groupname, hosts_and_vars.get("vars"))

    def get_inventory(self):
        print 'get_inventory'
        self.gen_inventory()
        print self.inventory
        return self.inventory
