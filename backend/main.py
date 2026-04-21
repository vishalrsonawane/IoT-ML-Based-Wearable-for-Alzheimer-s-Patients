from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import datetime
from functools import wraps

app = Flask(__name__)
CORS(app)

# Configure MongoDB
app.config["MONGO_URI"] = "mongodb://localhost:27017/Alzheimer"
mongo = PyMongo(app)

# Configure JWT
app.config['SECRET_KEY'] = 'alzheimer_secret_key'

# Token verification decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Check Authorization header first
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[-1]
        # If not found, check cookie
        if not token and 'alz_token' in request.cookies:
            token = request.cookies.get('alz_token')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = mongo.db.users.find_one({'_id': data['user_id']})
        except Exception:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# Import routes from app folder
from app import routes
from main import mongo, app, token_required

if __name__ == "__main__":
    app.run(debug=True)