Alzheimer Patient Caretaker System
A full-stack web application that helps caretakers manage Alzheimer’s patients by tracking symptoms, activities, and patient profiles. Built with React (frontend) and Flask (backend).

Features
Patient Profile Management: Create and manage patient profiles with key health information.

Activity & Symptom Tracking: Track daily activities and symptoms to monitor progress.

Dashboard: Visualize patient data and gain insights on health trends.

User Authentication: Secure login and session management for caretakers.

Responsive Interface: Optimized for both desktop and mobile devices.

Tech Stack
Frontend: React.js + Vite

Backend: Flask (Python)

Database: MongoDB

Authentication: JWT







Alzheimer Patient Caretaker System – Documentation 

Project Overview 

This is a full-stack web application to aid caretakers in managing Alzheimer’s patient profiles, tracking symptoms, activities, and accessing reports. 

 

Frontend: React 

Backend: Flask (Python) 

Other: MongoDB, MQTT, Machine Learning (fall detection, pulse analysis) 

Prerequisites 

Node.js (v18+ recommended) 

npm or yarn 

Python (3.8+) 

pip (Python package manager) 

MongoDB (running locally or accessible via URI) 

 

Optional: 

MQTT Broker (e.g., HiveMQ for real-time data) 

Email account (for notifications; Gmail recommended) 

Joblib, pandas, scikit-learn (for ML models) 

Backend Setup & Usage 

1. Clone the Repository 

git clone https://github.com/IshanSangani/Alzheimer-Patient-CareTake-System.git 

cd Alzheimer-Patient-CareTake-System/backend 

 

2. Install Dependencies 

Typical dependencies: 

Flask, flask_pymongo, flask_cors, PyJWT, Werkzeug, pandas, joblib, paho-mqtt, geocoder, scikit-learn 

 

3. Configure Environment Variables 

Create a .env file or configure environment variables for: 

SECRET_KEY (Flask/JWT) 

MongoDB URI 

Email credentials (for notifications) 

 

Example .env: 

SECRET_KEY=your_secret_key 

MONGO_URI=mongodb://localhost:27017/alzheimerdb 

 

4. Prepare ML Models 

Ensure final.joblib and scaler.joblib (used for fall/pulse detection) are in the backend route(app)  directory 

 

5. Start Backend Server 

python app/main.py 

The server typically runs at http://localhost:5000/ 

API endpoints are prefixed with /api/ 

Frontend Setup & Usage 

1. Move to Frontend Directory 

cd ../frontend 

 

2. Install Dependencies 

npm install

# or 

yarn install 

 

3. Configure API URL 

Check for a .env file or a config file where the backend API URL is set. 

Example: 

REACT_APP_API_URL=http://localhost:5000/api 

 

4. Start the Frontend 

npm run dev 

# or 

yarn start 

Runs at http://localhost:3000/ by default 

Common Commands 

Task	Backend Command	Frontend Command 

Install deps	pip install -r requirements.txt	npm install or yarn 

Start dev server	python app/main.py	npm start 

Run with hot reload	Use Flask’s debug mode	npm start 

Folder Structure (with file descriptions) 

Root 

backend/ – Flask backend and ML models 

frontend/ – React frontend 

README.md – This documentation 

 

Backend 

Path	Description 

backend/app/main.py	Flask app entrypoint, initialization, config 

backend/app/routes.py	Main API endpoints: auth, patient mgmt, fall/pulse data 

backend/models/models.py	User model logic (e.g., create_user), DB models 

final.joblib, scaler.joblib	ML model files for fall detection 

 

Key API Endpoints (from routes.py): 

/api/register – Register new caretaker (with OTP) 

/api/login – Login, returns JWT 

/api/patients – Get/add patient profiles 

/api/fall-events – Get fall event logs 

/api/pulse-data – Get pulse/BPM logs 

/api/send-otp – Send email OTP for registration 

 

Frontend 

Path	Description 

frontend/src/	React codebase: components, pages, utils 

frontend/src/components/	Reusable UI components 

frontend/src/pages/	Main pages (Dashboard, Login, Register, etc.) 

frontend/src/services/	API calls, utilities 

frontend/package.json	Frontend dependencies & scripts 

How to Start Everything 

Start MongoDB 

Run MongoDB locally or connect to a cloud instance. 

 

Start Backend 

Activate virtualenv, install dependencies, set up .env, have ML model files ready. 

Run python app/main.py. 

 

Start Frontend 

Move to frontend folder, install dependencies. 

 

Access the App 

Frontend: http://localhost:3000/ 

Backend API: http://localhost:5000/api 

Troubleshooting & Notes 

Email Sending: 

Uses Gmail SMTP by default. Enable “App Passwords” if 2FA is on. 

Set real credentials in environment/config. 

 

Replace email credentials with your credentials in the route.py file 

 

ML Models: 

If missing, retrain or copy final.joblib and scaler.joblib into backend/. 

 

MQTT: 

Default broker: broker.hivemq.com:1883. 

Make sure internet and broker are reachable for real-time features. 

 

Environment Variables: 

Don’t hardcode secrets. Use .env or system variables. 

 

Production: 

For production, consider using Docker, Nginx, SSL, etc. 

Summary Table: Main Files 

File/Folder	Purpose 

backend/app/routes.py	Main API endpoints and logic 

backend/app/main.py	App initialization, blueprint registration 

backend/models/models.py	Database models and user logic 

backend/final.joblib, scaler.joblib	Pretrained ML models 

frontend/src/	React frontend source code 

frontend/package.json	Frontend dependencies/scripts 









