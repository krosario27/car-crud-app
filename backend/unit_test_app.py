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
        
    def setUp(self):
        with self.app.app_context():
            # Create a test car before each test
            self.test_car = self.mongo.db.cars.insert_one({
                "make": "Toyota",
                "model": "Corolla",
                "year": 2020,
                "description": "A reliable car."
            })
            self.test_car_id = self.test_car.inserted_id

    # def tearDown(self):
    #     with self.app.app_context():
    #         # Drop the cars collection after each test to ensure isolation
    #         self.mongo.db.cars.drop()

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

    def test_update_car(self):
        updated_data = {
            "make": "Toyota",
            "model": "Camry",
            "year": 2021,
            "description": "A reliable and updated car."
        }

        # Perform the PUT request
        response = self.client.put(f"/api/cars/{self.test_car_id}", json=updated_data)
        self.assertEqual(response.status_code, 200)

                # Print debug information
        print(f"PUT request URL: /api/cars/{self.test_car_id}")
        print(f"Response status code: {response.status_code}")
        print(f"Response data: {response.get_json()}")
    

        # Parse the response
        data = response.get_json()
        self.assertIn("response", data)
        response_car = data["response"]
        self.assertEqual(response_car["make"], updated_data["make"])
        self.assertEqual(response_car["model"], updated_data["model"])
        self.assertEqual(response_car["year"], updated_data["year"])
        self.assertEqual(response_car["description"], updated_data["description"])

        # Verify the update in the database
        db_car = self.mongo.db.cars.find_one({"_id": self.test_car_id})
        self.assertIsNotNone(db_car)
        self.assertEqual(db_car["make"], updated_data["make"])
        self.assertEqual(db_car["model"], updated_data["model"])
        self.assertEqual(db_car["year"], updated_data["year"])
        self.assertEqual(db_car["description"], updated_data["description"])

    def test_delete_car(self):
        # Perform the DELETE request using the ID of the test car
        response = self.client.delete(f"/api/cars/{self.test_car_id}")
        self.assertEqual(response.status_code, 200)
        
        # Parse the response
        data = response.get_json()
        self.assertIn("response", data)
        self.assertEqual(data["response"], str(self.test_car_id))
        
        # Verify that the car was deleted from the database
        db_car = self.mongo.db.cars.find_one({"_id": self.test_car_id})
        self.assertIsNone(db_car)

        


if __name__ == "__main__":
    unittest.main()
