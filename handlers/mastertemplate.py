#!/usr/bin/env python
# -*- coding: UTF-8 -*-
# __author__ = 'wangrui'
from .base import BaseHandler
import tornado.web
from tornado.escape import json_encode
from tornado.escape import json_decode
from documentdb.documentdb import *
import os



class IndexHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        self.render("master_template.html")


class GetMasterTemplateInfo(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        document_instance = DocumentDB()
        document_data = document_instance.read_document()
        self.write(json_encode(document_data))


class OperateMasterTemplate(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        param = self.parse_param()
        document_instance = DocumentDB()
        if self.request.files:
            png_file = self.request.files.get('png_file', None)
            file_name = png_file[0]["filename"]
            temp_dir = os.path.join("static", "upload")
            upload_dir = os.path.join(os.getcwd(), temp_dir)
            if not os.path.exists(upload_dir):
                os.makedirs(upload_dir)
            file_path = os.path.join(upload_dir, file_name)
            with open(file_path, 'wb') as f:
                f.write(png_file[0]["body"])
            param["preview_url"] = os.path.join(PNG_URL, os.path.join(temp_dir, file_name))
        else:
            if param.get('id'):
                one_document = document_instance.read_one_document(param["id"])
                param["preview_url"] = one_document["preview_url"]
        result = document_instance.operate_document(param)
        self.write(json_encode(result))


class DeleteMasterTemplate(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        master_id = self.get_argument("master_id")
        document_instance = DocumentDB()
        result = document_instance.delete_document(master_id)
        self.write(json_encode(result))


class UploadMetaDatas(BaseHandler):
    @tornado.web.authenticated
    def post(self):
        master_id = self.get_argument("master_id")
        meta_data = json_decode(self.get_argument("metadatas"))
        document_instance = DocumentDB()
        one_document = document_instance.read_one_document(master_id)
        one_document["metadatas"] = meta_data
        result = document_instance.operate_document(one_document)
        self.write(json_encode(result))