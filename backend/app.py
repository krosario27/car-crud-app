from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId
from bson import json_util 
import json


app = Flask(__name__)
CORS(app)




