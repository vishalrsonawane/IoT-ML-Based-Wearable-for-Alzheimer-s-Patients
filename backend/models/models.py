# models.py - MongoDB collection access and model logic
from main import mongo
from werkzeug.security import generate_password_hash
import datetime

# User collection access
users_collection = mongo.db.users

# Patient collection access
patients_collection = mongo.db.patients

# Sensor data collection access
sensor_data_collection = mongo.db.sensor_data

def create_user(data):
    """Create a new user document and insert into the users collection."""
    new_user = {
        'name': data['name'],
        'email': data['email'],
        'password': generate_password_hash(data['password']),
        'role': 'caretaker',
        'device_id': data['device_id'],
        'created_at': datetime.datetime.utcnow()
    }
    user_id = users_collection.insert_one(new_user).inserted_id
    return user_id
