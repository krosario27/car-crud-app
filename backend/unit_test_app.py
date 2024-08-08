import unittest
from flask_pymongo import PyMongo
from app import create_app  # Adjust the import based on your file structure

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


    def test_get_cars(self):
        response = self.client.get("/api/cars")
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn("response", data)
        self.assertIsInstance(data["response"], list)
        self.assertGreater(len(data["response"]), 0)
        self.assertEqual(data["response"][0]["make"], "Toyota")

if __name__ == "__main__":
    unittest.main()
