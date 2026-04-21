# 🧠 Alzheimer Patient Caretaker System

A full-stack web application designed to help caretakers manage Alzheimer’s patients by tracking activities, symptoms, and health data in real time.

---

## 🚀 Features

- Patient Profile Management — Create and manage patient records  
- Activity & Symptom Tracking — Monitor daily activities and health conditions  
- Fall Detection & Pulse Monitoring — ML-based detection using sensor data  
- Dashboard — Visual insights for better decision-making  
- User Authentication — Secure login using JWT  
- Responsive UI — Works across desktop and mobile  

---

## 🛠️ Tech Stack

**Frontend:** React.js (Vite)  
**Backend:** Flask (Python)  
**Database:** MongoDB  
**Authentication:** JWT  
**Machine Learning:** Random Forest (Fall Detection, Pulse Analysis)  
**Real-time Communication:** MQTT  

---

## ⚙️ How to Run

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/alzheimer-care-system.git
cd Alzheimer-Patient-CareTake-System
```

### 2. Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app/main.py
```

Runs on: http://localhost:5000/

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

Runs on: http://localhost:3000/

---

## 🔑 Environment Variables

Create a `.env` file in backend:

```env
SECRET_KEY=your_secret_key
MONGO_URI=mongodb://localhost:27017/alzheimerdb
```

---

## 📡 Key API Endpoints

- `/api/register` — Register caretaker  
- `/api/login` — Login (JWT)  
- `/api/patients` — Manage patient data  
- `/api/fall-events` — Fall detection logs  
- `/api/pulse-data` — Pulse monitoring  

---

## 📂 Project Structure

```
backend/
  ├── app/
  ├── models/
  ├── routes.py
  ├── main.py
  ├── ML models

frontend/
  ├── src/
  ├── components/
  ├── pages/
```

---

## ⚠️ Notes

- Requires MongoDB running locally or via cloud  
- ML model files (.joblib) must be present in backend  
- MQTT broker used for real-time data  
- Email OTP requires valid SMTP configuration  

---

## 💡 Overview

This project combines IoT, Machine Learning, and Web Development to provide a practical solution for monitoring Alzheimer’s patients and assisting caretakers in real-time decision making.
