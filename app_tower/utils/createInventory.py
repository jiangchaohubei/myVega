#!/usr/bin/env python
# -*- coding:utf8 -*-

import os
import sys
import argparse

try:
    import json
except ImportError:
    import simplejson as json

class createInventory():

    def __init__(self):
        self.inventory = {}
        self .read_cli_args()
        #定义 --list选项
        if self.args.list:
            self.inventory = self.example_inventory()
        #定义--host [hostname]选项
        elif self.args.host:

            self.inventory = self.empty_inventory()
        #如果没有主机组或变量要设置，就返回一个空inventory
        else:
            self.inventory = self.empty_inventory()

        print json.dumps(self.inventory)

    #用于展示效果的JSON格式的inventory文件内容
    def example_inventory(self):

        #示例
        return {
            "webservers":{
                "hosts": ["113.209.107.36"],
                "vars":{
                    "ansible_ssh_user":"root",
                    "anisble_ssh_pass":"z8xFC9l~"
                }
            },
            "_meta":{
                "hostvars":{
                    "113.209.107.36":{
                        "ansible_ssh_user":"root",
                        "anisble_ssh_pass":"z8xFC9l~"
                    },
                    "192.168.1.65":{
                        "host_specific_var":"bar"
                    }
                }
            }
        }

    #返回仅用于测试的空Inventory
    def empty_inventory(self):
        return {"_meta": {"hostvars": {}}}

    #读取并分析读入的选项和参数
    def read_cli_args(self):
        parser = argparse.ArgumentParser()
        parser.add_argument('--list',action='store_true',dest='list',help='get all hosts')
        parser.add_argument('--host',action='store',dest='host',help='get all hosts')
        self.args = parser.parse_args()

#获取Inventory
createInventory()