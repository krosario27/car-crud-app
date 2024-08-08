from flask import Flask, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config["MONGO_URI"] = "mongodb://localhost:27017/test_db"
    mongo = PyMongo(app)
    CORS(app)

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

    return app
