import unittest
from flask_pymongo import PyMongo
from test_app import create_app  # Adjust the import based on your file structure
from bson.objectid import ObjectId

class TestCarsAPI(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.app = create_app()
        cls.client = cls.app.test_client()
        cls.mongo = PyMongo(cls.app)
        
        # Create a test car in the database
        with cls.app.app_context():
            cls.mongo.db.cars.insert_one({
                "make": "Toyota",
                "model": "Corolla",
                "year": 2020,
                "description": "A reliable car."
            })

    @classmethod
    def tearDownClass(cls):
        with cls.app.app_context():
            cls.mongo.db.cars.drop()  # Clean up the database after tests

    def test_get_cars(self):
        response = self.client.get("/api/cars")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("response", data)
        self.assertIsInstance(data["response"], list)
        self.assertGreater(len(data["response"]), 0)
        self.assertEqual(data["response"][0]["make"], "Toyota")

 
    def test_add_car(self):
        # Define test data
        new_car = {
            "make": "Honda",
            "model": "Civic",
            "year": 2022,
            "description": "A sporty sedan."
        }
        
        # Perform the POST request
        response = self.client.post("/api/cars", json=new_car)
        
        # Check the status code
        self.assertEqual(response.status_code, 200)
        
        # Parse the response
        data = response.get_json()
        
        # Check that the response contains the correct fields
        self.assertIn("response", data)
        response_car = data["response"]
        self.assertIn("_id", response_car)
        self.assertEqual(response_car["make"], new_car["make"])
        self.assertEqual(response_car["model"], new_car["model"])
        self.assertEqual(response_car["year"], new_car["year"])
        self.assertEqual(response_car["description"], new_car["description"])
        
        # Check that the response contains the correct fields
        self.assertIn("response", data)
        response_car = data["response"]

        # Extract the ObjectId string from the embedded document
        _id_str = response_car["_id"].get("$oid")
        self.assertIsInstance(_id_str, str)


        # Convert the string ID from the response to an ObjectId
        try:
            db_car_id = ObjectId(_id_str)
        except Exception as e:
            self.fail(f"Failed to convert _id to ObjectId: {e}")

        db_car = self.mongo.db.cars.find_one({"_id": db_car_id})
        self.assertIsNotNone(db_car)
        self.assertEqual(db_car["make"], new_car["make"])
        self.assertEqual(db_car["model"], new_car["model"])
        self.assertEqual(db_car["year"], new_car["year"])
        self.assertEqual(db_car["description"], new_car["description"])

    

if __name__ == "__main__":
    unittest.main()
