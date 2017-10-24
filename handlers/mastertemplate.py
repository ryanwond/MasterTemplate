#!/usr/bin/env python
# -*- coding: UTF-8 -*-
# __author__ = 'wangrui'
from base import BaseHandler
import tornado.web
from tornado.escape import json_decode
from tornado.escape import json_encode

class IndexHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        self.render("master_template.html")


class GetMasterTemplateInfo(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        data = [
            {
                "id": "1",
                "channel": "1",
                "canvas": "1",
                "preview_url": "1",
                "description": "1",
                "display_name": "11",
                "is_single": "1",
                "image_dimensions": "1",
                "html_contents": "1",
                "css_contents": "1",
            },
            {
                "id": "2",
                "channel": "2",
                "canvas": "2",
                "preview_url": "2",
                "description": "2",
                "display_name": "2",
                "is_single": "2",
                "image_dimensions": "2",
                "html_contents": "2",
                "css_contents": "2",
            }
        ]
        aoData = json_decode(self.get_argument("aoData"))
        sEcho = 0
        iDisplayStart = 0
        iDisplayLength = 0
        for da in aoData:
            if da["name"] == "sEcho":
                sEcho = da["value"]
            if da["name"] == "iDisplayStart":
                iDisplayStart = da["value"]
            if da["name"] == "iDisplayLength":
                iDisplayLength = da["value"]
        total = 10

        initEcho = sEcho + 1
        return_data = dict()
        return_data["sEcho"] = initEcho
        return_data["iTotalRecords"] = total
        return_data["iTotalDisplayRecords"] = total
        return_data["aaData"] = data
        self.write(json_encode(return_data))
