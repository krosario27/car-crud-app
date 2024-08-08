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

# Connect to API
@app.route("/api", methods=["GET"])
def api():
    return jsonify({"response": "api worked..."}), 200

# Gets all cars from db when route is accessed
@app.route("/api/cars", methods=["GET"])
def get_cars():
    try:
        cars = mongo.db.cars.find()
        cars_list = [{
            "_id": str(car["_id"]), 
            "make": car["make"], 
            "model": car["model"], 
            "year": car["year"],
            "description": car["description"]} 
            for car in cars]
        return jsonify({"response": cars_list}), 200
    except Exception as e:
        return jsonify({"response": str(e)}), 500
    






