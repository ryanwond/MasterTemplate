#!/usr/bin/env python
#-*- coding: UTF-8 -*-
#author:WangRui
import os
import tornado.web
import tornado.httpserver
import tornado.ioloop
import tornado.options
from tornado.options import options, define
import uuid

from handlers import base
from handlers import login
from handlers import mastertemplate


define(name="port", default=8000, type=int)


class Application(tornado.web.Application):

    def __init__(self):
        handlers = [
            (r"/", mastertemplate.IndexHandler),
            (r"/login", login.LoginHandler),
            (r"/exit", login.ExitHandler),
            (r"/getmastertemplateinfo", mastertemplate.GetMasterTemplateInfo),
            (r"/operate", mastertemplate.OperateMasterTemplate),
            (r"/delete", mastertemplate.DeleteMasterTemplate),
            (r".*", base.BaseHandler),
        ]

        settings = dict(
            login_url="/login",
            template_path=os.path.join(os.path.dirname(__file__), "templates"),
            static_path=os.path.join(os.path.dirname(__file__), "static"),
            cookie_secret=uuid.uuid4(),
            xsrf_cookies=False,
            debug=True,
        )
        tornado.web.Application.__init__(self, handlers, **settings)


def main():
    tornado.options.parse_command_line()
    print("Starting server on port %d" % options.port)
    http_server = Application()
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()


if __name__ == "__main__":
    main()
