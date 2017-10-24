#!/usr/bin/env python
# -*- coding: UTF-8 -*-
# __author__ = 'wangrui'
from tornado.web import RequestHandler
from tornado.escape import json_encode
from base import BaseHandler
import tornado.web
import hashlib

USER_LOGIN_DATA = {
    "admin": "e10adc3949ba59abbe56e057f20f883e"
}


class LoginHandler(RequestHandler):
    def get(self):
        self.render("login.html")

    def post(self):
        username = self.get_argument("username")
        password = self.get_argument("password")
        password_md5 = hashlib.md5(password).hexdigest()
        data = {
            "status": "success",
            'errno': 0,
            'errmsg': ""
        }
        if username not in USER_LOGIN_DATA:
            data["status"] = "fail"
            data["errno"] = 1
            data["errmsg"] = "username was wrong"
        else:
            if password_md5 != USER_LOGIN_DATA.get(username):
                data["status"] = "fail"
                data["errno"] = 1
                data["errmsg"] = "password was wrong"
            else:
                self.set_cookie("user_session", username, expires_days=1)
        self.write(json_encode(data))


class ExitHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self):
        self.clear_cookie("user_session")
        self.redirect("/login")