from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId
from bson import json_util 
import json


app = Flask(__name__)
CORS(app)

# Connecto to MongoDB Database
app.config['MONGO_URI'] = "mongodb://127.0.0.1:27017/car_db"
mongo = PyMongo(app)

#Define parse_json function
def parse_json(data):
    return json.loads((json_util.dumps(data)))


@app.route("/api", methods=["GET"])
def api():
    return jsonify({"response": "api worked..."}), 200




