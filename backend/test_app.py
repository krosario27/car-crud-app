from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS
from bson.objectid import ObjectId
from bson import json_util 
import json

def create_app():
    app = Flask(__name__)
    app.config["MONGO_URI"] = "mongodb://localhost:27017/test_db"
    mongo = PyMongo(app)
    CORS(app)

    #Define parse_json function
    def parse_json(data):
        return json.loads((json_util.dumps(data)))

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

    @app.route("/api/cars", methods=["POST"])
    def add_cars():
        try: 
            data = request.json
            new_car = { 
                "make": data["make"], 
                "model": data["model"], 
                "year": data["year"],
                "description": data["description"]
            }
            result = mongo.db.cars.insert_one(new_car)
            new_car_with_id = {"_id": str(result.inserted_id), **new_car}
            return jsonify({"response": parse_json(new_car_with_id)}), 200
        except Exception as e:
            return jsonify({"response": str(e)}), 500

    return app
