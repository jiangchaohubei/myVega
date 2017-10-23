# /usr/bin/python2
# -*- coding:utf8 -*-
from __future__ import unicode_literals

from django.db import models
from django.core.exceptions import FieldDoesNotExist
DATETIME_FORMAT = "%Y/%m/%d %H:%M:%S"
DATE_FORMAT = "%Y/%m/%d"

#model基类，所有model类继承此类
class cmodel(models.Model):
    class Meta:
        abstract = True
        ordering = ['-id']

    def get_value(self, field_name, prefix=None):
        """获取指定字段的值,返回字典类型的数据；field_name 字段名称|prefix 字段前缀(默认不加前缀，外键表字段默认以外键名作为字段的前缀)"""
        _dict = {}
        try:
            field = self._meta.get_field(field_name)
            _value = getattr(self, field_name)

            if prefix is not None:
                field_name = prefix+'_'+field_name

            if isinstance(field, models.DateTimeField):  # DateTimeField字段特殊处理，做两种类型的格式化
                if _value is not None:
                    _dict[field_name] = _value.strftime(DATETIME_FORMAT)
                    _dict['%s_short' % field_name] = _value.strftime(DATE_FORMAT)
                else:
                    _dict[field_name] = ''
                    _dict['%s_short' % field_name] = ''
            elif isinstance(field, models.DateField):  # DateField字段做格式化处理
                if _value is not None:
                    _dict['%s_short' % field_name] = _value.strftime(DATE_FORMAT)
                else:
                    _dict['%s_short' % field_name] = ''
            else:
                _dict[field_name] = _value

        except FieldDoesNotExist:
            return getattr(self, field_name)

        return _dict


    def serializable_values(self, field_name_list=None):
        """数据序列化；field_name_list 需要序列化的字段名列表(默认None，表示此model中的字段全部序列化)"""
        _dict = {}

        if not field_name_list:  # 如果field_name_list字段为None，则遍历此model，获取全部字段
            field_name_list = []
            for i in self._meta.fields:
                field_name_list.append(i.attname)

        for field_name in field_name_list:  # 序列化

            if isinstance(field_name, dict):  # 获取外键表的字段值
                for key in field_name:  # key->外键名
                    field = self._meta.get_field(key)
                    obj_external_table = getattr(self, key)

                    if isinstance(field, models.ManyToManyField):  # 多对多字段，单独处理
                        _list_e = []
                        for e in obj_external_table.all():
                            _list_e.append(e.serializable_values(field_name[key]))

                        _dict[key] = _list_e
                    else:    # 一对一，一对多字段，统一处理
                        for k in field_name[key]:
                            _dict = dict(_dict, **obj_external_table.get_value(k, key))
            else:  # (2017-03-24更新)
                _values = self.get_value(field_name)
                if type(_values) == dict:
                    _dict = dict(_dict, **_values)
                else:  # 如果此字段是方法(使用了装饰器@property),做单独处理
                    _dict = dict(_dict, **{"field_name":_values})

        return _dict