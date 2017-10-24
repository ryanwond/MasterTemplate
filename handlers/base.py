#!/usr/bin/env python
#-*- coding: UTF-8 -*-
#author:WangRui
from tornado.web import RequestHandler


class BaseHandler(RequestHandler):
    def get_current_user(self):
        user = self.get_cookie("user_session")
        if not user:
            return None
        return user

    def get(self):
        self.write_error(404)

    def write_error(self, status_code, **kwargs):
        self.render("error.html", status_code=status_code)
