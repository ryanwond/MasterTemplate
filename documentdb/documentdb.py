#!/usr/bin/env python
#-*- coding: UTF-8 -*-
#author:WangRui
from .config import *
import pydocumentdb.document_client as document_client
import pydocumentdb.errors as errors


class DocumentDB(object):
    def __init__(self):
        self.master_key = {
            'masterKey': DOCUMENTDB_KEY
        }
        self.client = None
        self.db = None
        self.collection = None
        self.document = None
        self.database_link = ""
        self.collection_link = ""
        self.init_host()
        self.read_database()
        self.read_collection()

    def init_host(self):
        self.client = document_client.DocumentClient(DOCUMENTDB_HOST, self.master_key)

    def read_database(self):
        # if self.client:
        #     self.db = next((data for data in self.client.ReadDatabases() if data['id'] == DOCUMENTDB_DATABASE))

        try:
            self.database_link = 'dbs/' + DOCUMENTDB_DATABASE
            self.db = self.client.ReadDatabase(self.database_link)
            print('Database with id \'{0}\' was found, it\'s _self is {1}'.format(DOCUMENTDB_DATABASE, self.db['_self']))
        except errors.DocumentDBError as e:
            if e.status_code == 404:
                print('A database with id \'{0}\' does not exist'.format(DOCUMENTDB_DATABASE))
            else:
                raise errors.HTTPFailure(e.status_code)

    def read_collection(self):
        # self.collection = next((coll for coll in self.client.ReadCollections(self.db['_self']) if coll['id'] == DOCUMENTDB_COLLECTION))
        # print(self.collection)
        try:
            self.collection_link = self.database_link + '/colls/{0}'.format(DOCUMENTDB_COLLECTION)
            self.collection = self.client.ReadCollection(self.collection_link)
            print('Collection with id \'{0}\' was found, it\'s _self is {1}'.format(DOCUMENTDB_COLLECTION, self.collection['_self']))
        except errors.DocumentDBError as e:
            if e.status_code == 404:
                print('A collection with id \'{0}\' does not exist'.format(DOCUMENTDB_COLLECTION))
            else:
                raise errors.HTTPFailure(e.status_code)

    def read_document(self):
        document = list(self.client.ReadDocuments(self.collection_link))
        return document

    def read_one_document(self, master_id):
        document_link = self.database_link + '/colls/{0}'.format(DOCUMENTDB_COLLECTION) + '/docs/' + master_id
        return dict(self.client.ReadDocument(document_link))

    def operate_document(self, kwargs):
        result = {"status": "fail"}

        if kwargs.get('id'):
            document_link = self.database_link + '/colls/{0}'.format(DOCUMENTDB_COLLECTION) + '/docs/' + kwargs.get(
                'id')
            replaced_document = self.client.ReplaceDocument(document_link, kwargs)
            if replaced_document:
                result["id"] = replaced_document["id"]
                result["status"] = "success"
        else:
            create_result = self.client.CreateDocument(self.collection_link, kwargs)
            if create_result:
                result["id"] = create_result["id"]
                result["status"] = "success"
        return result

    def delete_document(self, document_id):
        result = {"status": "fail"}
        document_link = self.database_link + '/colls/{0}'.format(DOCUMENTDB_COLLECTION) + '/docs/' + document_id
        delete_document = self.client.DeleteDocument(document_link)
        if delete_document is None:
            result["status"] = "success"
        return result
