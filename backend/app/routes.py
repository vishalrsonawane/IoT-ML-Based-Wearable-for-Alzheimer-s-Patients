from flask import jsonify, request, Blueprint, make_response
from werkzeug.security import generate_password_hash, check_password_hash
from bson.objectid import ObjectId
import jwt
import datetime
import random
import string
from main import mongo, app, token_required
from models.models import create_user
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import re
import threading
import paho.mqtt.client as mqtt
import joblib
import json
import pandas as pd
import time

# Create Blueprint
api = Blueprint('api', __name__)

# For alert email rate limiting
last_alert_email_time = {'fall': 0, 'high_bpm': 0}
EMAIL_COOLDOWN_SECONDS = 25  # 25 seconds
VERY_HIGH_BPM_THRESHOLD = 140 # BPM threshold for alerts

# Store OTPs in-memory (for demo; use Redis or DB for production)
otp_store = {}

# Helper to send email
def send_notification_email(recipient, subject, body):
    # Configure your SMTP server here
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587
    sender_email = 'ishansangani25@gmail.com'  # Replace with your email
    sender_password = 'your_app_password'   # Use app password or env var

    msg = MIMEMultipart()
    msg['From'] = sender_email
    msg['To'] = recipient
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, recipient, msg.as_string())
        server.quit()
        return True
    except Exception as e:
        print('Email send error:', e)
        return False

# OTP endpoint
@api.route('/send-otp', methods=['POST'])
def send_otp():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({'message': 'Email is required!'}), 400
    otp = ''.join(random.choices(string.digits, k=6))
    otp_store[email] = {'otp': otp, 'expires': datetime.datetime.utcnow() + datetime.timedelta(minutes=10)}
    
    email_subject = 'Your AlzCare Registration OTP'
    email_body = f'Your OTP for registration is: {otp}'
    if send_notification_email(email, email_subject, email_body):
        return jsonify({'message': 'OTP sent successfully'})
    else:
        return jsonify({'message': 'Failed to send OTP'}), 500

# Regex patterns for validation
EMAIL_REGEX = r"^[\w\.-]+@[\w\.-]+\.\w{2,}$"
PASSWORD_REGEX = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':\"\\|,.<>\/?]).{8,}$"

# Authentication routes
@api.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    # Email and password validation
    email = data.get('email', '')
    password = data.get('password', '')
    if not re.match(EMAIL_REGEX, email):
        return jsonify({'message': 'Invalid email format!'}), 400
    if not re.match(PASSWORD_REGEX, password):
        return jsonify({'message': 'Password must be at least 8 characters, include uppercase, lowercase, number, and special character!'}), 400

    # Check if device_id is provided
    if 'device_id' not in data or not data['device_id']:
        return jsonify({'message': 'Device ID is required!'}), 400

    # Check if device_id is already used in users or patients
    device_id = data['device_id']
    if mongo.db.users.find_one({'device_id': device_id}) or mongo.db.patients.find_one({'device_id': device_id}):
        return jsonify({'message': 'Device ID already in use!'}), 409

    # Check if user already exists
    if mongo.db.users.find_one({'email': email}):
        return jsonify({'message': 'User already exists!'}), 409

    # OTP verification
    otp = data.get('otp')
    if not otp or not email:
        return jsonify({'message': 'OTP and email required!'}), 400
    otp_entry = otp_store.get(email)
    if not otp_entry or otp_entry['otp'] != otp or otp_entry['expires'] < datetime.datetime.utcnow():
        return jsonify({'message': 'Invalid or expired OTP!'}), 400
    # Remove OTP after use
    otp_store.pop(email, None)

    # Remove username from data if present
    data.pop('username', None)

    # Create user document using model function
    user_id = create_user(data)

    # Optionally, create a patient record as well
    patient_name = data.get('patient_name')
    if patient_name:
        new_patient = {
            'name': patient_name,
            'caretaker_id': str(user_id),
            'device_id': data['device_id'],
            'created_at': datetime.datetime.utcnow()
        }
        mongo.db.patients.insert_one(new_patient)

    return jsonify({'message': 'User registered successfully!'}), 201

@api.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = mongo.db.users.find_one({'email': email})
    if not user:
        return jsonify({'message': 'Invalid credentials!'}), 401
    if check_password_hash(user['password'], password):
        token = jwt.encode({
            'user_id': str(user['_id']),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")
        resp = make_response(jsonify({
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        }))
        resp.set_cookie('alz_token', token, httponly=True, samesite='Lax', max_age=24*3600)
        return resp
    return jsonify({'message': 'Invalid credentials!'}), 401

# Patient routes
@api.route('/patients', methods=['GET'])
@token_required
def get_patients(current_user):
    if current_user['role'] != 'caretaker':
        return jsonify({'message': 'Unauthorized!'}), 403
    
    patients = list(mongo.db.patients.find({'caretaker_id': str(current_user['_id'])}))
    
    # Convert ObjectId to string for JSON serialization
    for patient in patients:
        patient['_id'] = str(patient['_id'])
    
    return jsonify({'patients': patients})

@api.route('/patients', methods=['POST'])
@token_required
def add_patient(current_user):
    data = request.get_json()
    
    new_patient = {
        'name': data['name'],
        'age': data['age'],
        'device_id': data['device_id'],
        'caretaker_id': str(current_user['_id']),
        'created_at': datetime.datetime.utcnow()
    }
    
    patient_id = mongo.db.patients.insert_one(new_patient).inserted_id
    
    return jsonify({
        'message': 'Patient added successfully!',
        'patient_id': str(patient_id)
    }), 201

# Load model and scaler
model = joblib.load('final.joblib')
scaler = joblib.load('scaler.joblib')

# MongoDB collection for fall events
FALL_EVENTS_COLLECTION = 'fall_events'

# MongoDB collection for pulse data
PULSE_DATA_COLLECTION = 'pulse_data'

# Helper to get location (try to get real location, fallback to static)
def get_laptop_location():
    try:
        import geocoder
        g = geocoder.ip('me')
        if g.ok and g.latlng:
            return {'lat': g.latlng[0], 'lon': g.latlng[1]}
    except Exception as e:
        print("Geolocation error:", e)
    # Fallback to static location if geolocation fails
    return {'lat': 23.0225, 'lon': 72.5714}

# MQTT callback
def on_connect(client, userdata, flags, rc):
    print("Connected to MQTT broker with result code "+str(rc))
    client.subscribe("fall_detection/data")  # <-- This is the topic

# For pulse data throttling and BPM calculation
last_pulse_store_time = {'ts': 0}
pulse_window = []
window_seconds = 10  # Calculate BPM over a 10 second window
# Assuming ESP8266 sends data roughly every 200ms (5Hz)
# So, for a 10-second window, we need 10 * 5 = 50 samples.
# Adjust max_samples if your ESP8266 sending interval is different.
# The interval in your ESP code is 200ms.
MAX_PULSE_SAMPLES_IN_WINDOW = window_seconds * 5

def detect_beats_and_bpm(current_pulse_window, current_window_seconds):
    # This is a very basic peak detection.
    # For reliable BPM, a more sophisticated algorithm is usually needed,
    # often involving filtering and adaptive thresholds.
    # Adjust threshold and min_gap based on your sensor's typical raw output.
    threshold = 100  # Adjusted from 550 based on observed raw data ~168
    min_gap_ms = 250   # Minimum ms between beats (e.g., max 240 BPM)
    # Convert min_gap_ms to samples based on ~200ms interval from ESP
    min_gap_samples = int(min_gap_ms / 200) if 200 > 0 else 1


    beats = 0
    last_peak_index = -min_gap_samples # Initialize to allow first peak

    if len(current_pulse_window) < 3: # Need at least 3 points to detect a peak
        return 0

    for i in range(1, len(current_pulse_window) - 1):
        # Simple peak: higher than neighbors and above threshold
        is_peak = (current_pulse_window[i] > threshold and
                   current_pulse_window[i] > current_pulse_window[i-1] and
                   current_pulse_window[i] >= current_pulse_window[i+1]) # Use >= for plateaus

        if is_peak and (i - last_peak_index) >= min_gap_samples:
            beats += 1
            last_peak_index = i
    
    if current_window_seconds > 0 and beats > 0:
        # Calculate effective duration of the window for BPM calculation
        # This is more accurate if the number of samples isn't exactly matching the desired window_seconds
        effective_duration_seconds = len(current_pulse_window) * 0.2 # 0.2s per sample (5Hz)
        bpm = int((beats / effective_duration_seconds) * 60)
        # Clamp BPM to a reasonable range
        bpm = max(40, min(bpm, 200))
        return bpm
    return 0

def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        # Extract features for fall detection
        feature_names = ['ax', 'ay', 'az', 'gx', 'gy', 'gz']
        features = [payload.get(k, 0) for k in feature_names]
        X_df = pd.DataFrame([features], columns=feature_names)
        X_scaled = scaler.transform(X_df)
        pred = model.predict(X_scaled)[0]
        if pred == 1:
            # Fall detected, store in DB
            event = {
                'timestamp': datetime.datetime.utcnow(),
                'location': get_laptop_location(),
                'features': features
            }
            mongo.db[FALL_EVENTS_COLLECTION].insert_one(event)
            print("Fall detected and stored:", event)

            # Send email alert for fall
            now_ts_fall = time.time()
            if now_ts_fall - last_alert_email_time.get('fall', 0) > EMAIL_COOLDOWN_SECONDS:
                # Simplification: fetch first user. In a real system, link device_id to user.
                user_to_notify = mongo.db.users.find_one() 
                if user_to_notify and 'email' in user_to_notify:
                    recipient_email = user_to_notify['email']
                    alert_subject = "ALERT: Fall Detected!"
                    alert_body = f"A fall has been detected for a patient at {event['timestamp'].strftime('%Y-%m-%d %H:%M:%S')} UTC. Location (approx.): {event['location']}. Please check on the patient immediately."
                    if send_notification_email(recipient_email, alert_subject, alert_body):
                        last_alert_email_time['fall'] = now_ts_fall
                        print(f"Fall alert email sent to {recipient_email}")
                    else:
                        print(f"Failed to send fall alert email to {recipient_email}")
                else:
                    print("No user found or user has no email, cannot send fall alert.")
            else:
                print("Fall detected, but email cooldown for fall alerts is active.")

        # Process raw pulse data to calculate and store BPM
        if 'pulse' in payload: # Expecting raw pulse value here
           ## print(f"Received pulse data: {payload['pulse']}") # New print statement
            now = time.time()
            pulse_window.append(payload['pulse'])

            # Keep pulse_window to the size of MAX_PULSE_SAMPLES_IN_WINDOW
            if len(pulse_window) > MAX_PULSE_SAMPLES_IN_WINDOW:
                pulse_window.pop(0)

            # Calculate and store BPM if enough samples and 5s passed since last store
            if now - last_pulse_store_time['ts'] >= 5 and len(pulse_window) >= MAX_PULSE_SAMPLES_IN_WINDOW:
                # Use a copy of the window for calculation in case it's modified by another thread (though less likely here)
                current_window_copy = list(pulse_window)
                bpm = detect_beats_and_bpm(current_window_copy, window_seconds)
                print(f"Detected BPM: {bpm}") # New print statement
                
                if bpm > 0: # Store only if a valid BPM was calculated
                    bpm_entry = {
                        'timestamp': datetime.datetime.utcnow(),
                        'pulse': bpm  # Storing calculated BPM in the 'pulse' field as per DB schema
                    }
                    mongo.db[PULSE_DATA_COLLECTION].insert_one(bpm_entry)
                    last_pulse_store_time['ts'] = now
                    print(f"Calculated and Stored Pulse BPM: {bpm_entry}")

                    # Send email alert for very high BPM
                    if bpm > VERY_HIGH_BPM_THRESHOLD:
                        now_ts_bpm = time.time() 
                        if now_ts_bpm - last_alert_email_time.get('high_bpm', 0) > EMAIL_COOLDOWN_SECONDS:
                            user_to_notify = mongo.db.users.find_one() # Simplification
                            if user_to_notify and 'email' in user_to_notify:
                                recipient_email = user_to_notify['email']
                                alert_subject = f"ALERT: Very High Heart Rate Detected ({bpm} BPM)!"
                                alert_body = f"A very high heart rate of {bpm} BPM was detected for a patient at {bpm_entry['timestamp'].strftime('%Y-%m-%d %H:%M:%S')} UTC. Please check on the patient immediately."
                                if send_notification_email(recipient_email, alert_subject, alert_body):
                                    last_alert_email_time['high_bpm'] = now_ts_bpm
                                    print(f"High BPM alert email sent to {recipient_email}")
                                else:
                                    print(f"Failed to send high BPM alert email to {recipient_email}")
                            else:
                                print("No user found or user has no email, cannot send high BPM alert.")
                        else:
                            print(f"High BPM ({bpm}) detected, but email cooldown for high BPM alerts is active.")
                

    except Exception as e:
        print(f"Error processing MQTT message: {e}")

def mqtt_thread():
    mqtt_client = mqtt.Client()
    mqtt_client.on_connect = on_connect
    mqtt_client.on_message = on_message
    mqtt_client.connect("broker.hivemq.com", 1883, 60)
    mqtt_client.loop_forever()

# Start MQTT listener in background thread (only once)
threading.Thread(target=mqtt_thread, daemon=True).start()

# API endpoint to get fall events
@api.route('/fall-events', methods=['GET'])
def get_fall_events():
    events = list(mongo.db[FALL_EVENTS_COLLECTION].find().sort('timestamp', -1))
    for e in events:
        e['_id'] = str(e['_id'])
        # Format timestamp for frontend
        e['timestamp'] = e['timestamp'].strftime('%Y-%m-%d %H:%M:%S')
    return jsonify({'fall_events': events})

# API endpoint to get pulse data
@api.route('/pulse-data', methods=['GET'])
def get_pulse_data():
    data = list(mongo.db[PULSE_DATA_COLLECTION].find().sort('timestamp', -1))
    for d in data:
        d['_id'] = str(d['_id'])
        d['timestamp'] = d['timestamp'].strftime('%Y-%m-%d %H:%M:%S')
    return jsonify({'pulse_data': data})

# Register blueprint with app
app.register_blueprint(api, url_prefix='/api')
