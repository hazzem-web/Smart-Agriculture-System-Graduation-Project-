<div align="center">

<img src="https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
<img src="https://img.shields.io/badge/Flask-2.x-000000?style=for-the-badge&logo=flask&logoColor=white"/>
<img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
<img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white"/>
<img src="https://img.shields.io/badge/Arduino-C++-00979D?style=for-the-badge&logo=arduino&logoColor=white"/>

# 🌱 Nabatat — Smart Agriculture System

> **An end-to-end IoT + AI platform for automated irrigation and plant disease detection.**  
> Built with Arduino, Flask, React, and deep learning — by the Computer Science Department, Kafr El-Sheikh University.

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Repository Structure](#-repository-structure)
- [AI Models](#-ai-models)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
  - [1. Hardware Setup](#1-hardware-setup)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Demo](#-demo)
- [Contributors](#-contributors)
- [License](#-license)

---

## 🌍 Overview

**Nabatat** is a graduation project that addresses one of the most pressing challenges in modern agriculture: **the inefficient use of water and the late detection of crop diseases**.

The system reads real-world sensor data (soil moisture, temperature, humidity) from an Arduino microcontroller, combines it with live weather forecasts from the OpenWeather API, and feeds it into an AI model to autonomously decide whether to trigger irrigation. A separate CNN-based module allows farmers to upload a leaf photo and instantly receive a diagnosis for 15 plant disease classes.

Everything is visualized in a responsive, real-time React dashboard.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🌡️ **Live Sensor Monitoring** | Real-time soil moisture, temperature & humidity readings from Arduino via serial |
| 💧 **Automated Irrigation** | AI decides when to activate the water pump — no manual intervention needed |
| 🌦️ **Weather Integration** | OpenWeather API feeds atmospheric data into the irrigation decision model |
| 🍃 **Plant Disease Detection** | Upload a leaf image → CNN classifies disease across 15 classes in under 3 seconds |
| 📊 **Interactive Dashboard** | React + TypeScript SPA with live charts, event logs, and pump override controls |
| 🔐 **Secure API** | JWT authentication protects all state-modifying endpoints |

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         HARDWARE LAYER                                   │
│   [Soil Sensor] ──┐                                                      │
│   [DHT Sensor]  ──┼──► [Arduino Uno/Mega] ──USB Serial──► Flask Backend │
│   [Relay+Pump]  ◄─┘                                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                    ┌───────────────▼───────────────┐
                    │         Flask Backend          │
                    │  ┌─────────────────────────┐  │
                    │  │  Serial Reader (PySerial)│  │
                    │  │  Irrigation Scheduler   │  │  ◄── OpenWeather API
                    │  │  Disease Detection API  │  │
                    │  │  SQLite Database        │  │
                    │  └─────────────────────────┘  │
                    └───────────────┬───────────────┘
                                    │  REST API (JSON)
                    ┌───────────────▼───────────────┐
                    │       React Dashboard          │
                    │  Live Sensors | Charts         │
                    │  Disease Upload | Pump Control │
                    └───────────────────────────────┘
```

---

## 📁 Repository Structure

```
Smart-Agriculture-System-Graduation-Project-/
│
├── 📁 arduino_code/                  # C++ firmware for Arduino microcontroller
│   └── arduino_sensor_node.ino       # Reads sensors & receives relay commands via Serial
│
├── 📁 smart_agriculture_api/         # Python Flask backend
│   ├── app.py                        # Application entry point
│   ├── serial_reader.py              # PySerial bridge — reads Arduino data stream
│   ├── irrigation_scheduler.py       # Calls ML model & triggers pump via serial
│   ├── weather_service.py            # OpenWeather API integration
│   ├── disease_api.py                # Disease detection endpoint logic
│   ├── models/                       # SQLite database models
│   ├── routes/                       # Flask route blueprints
│   ├── requirements.txt
│   └── .env.example
│
├── 📁 IrrigationScheduling/          # ML model training notebooks & artifacts
│   ├── train_model.ipynb             # Model training (Logistic Regression)
│   ├── irrigation_model.pkl          # Serialized trained model (joblib)
│   └── dataset/                      # Training data (sensor + weather features)
│
├── 📁 PlantDiseaseDetection/         # CNN model training & artifacts
│   ├── train_cnn.ipynb               # MobileNetV2 fine-tuning notebook
│   ├── plant_disease_model.h5        # Saved Keras model weights
│   ├── class_names.json              # 15 disease class labels
│   └── dataset/                      # PlantVillage image dataset (subset)
│
├── 📁 smart-agriculture-frontend/    # React + TypeScript frontend
│   ├── src/
│   │   ├── components/               # Reusable UI components
│   │   ├── pages/                    # Dashboard, Disease Detection, History
│   │   ├── hooks/                    # Custom React hooks (useSensorData, etc.)
│   │   └── api/                      # Axios API client
│   ├── package.json
│   └── vite.config.ts
│
├── 📁 Demo/                          # Screenshots and demo media
├── LICENSE
└── README.md
```

---

## 🧠 AI Models

### 🌿 Plant Disease Detection (CNN)

| Property | Detail |
|---|---|
| **Architecture** | MobileNetV2 (ImageNet weights) + Custom classification head |
| **Input** | 224 × 224 × 3 RGB leaf image |
| **Output** | 15-class softmax prediction + confidence score |
| **Accuracy** | ~90% on PlantVillage test set |
| **Framework** | TensorFlow / Keras |

**Supported Classes:**
`Tomato Bacterial Spot` · `Tomato Early Blight` · `Tomato Late Blight` · `Tomato Leaf Mold` · `Tomato Target Spot` · `Tomato Yellow Leaf Curl Virus` · `Tomato Healthy` · `Potato Early Blight` · `Potato Late Blight` · `Potato Healthy` · `Corn Common Rust` · `Corn Northern Leaf Blight` · `Corn Gray Leaf Spot` · `Corn Healthy` · `Pepper Bacterial Spot`

---

### 💧 Irrigation Scheduling (ML)

| Property | Detail |
|---|---|
| **Algorithm** | Logistic Regression (scikit-learn) |
| **Output** | Binary: `IRRIGATE` / `DO NOT IRRIGATE` |
| **Features** | Soil moisture, temp, humidity (Arduino) + weather temp, humidity, pressure, rain forecast (OpenWeather) |
| **Serialization** | `joblib` → `irrigation_model.pkl` |

---

## 🛠️ Tech Stack

**Backend**
- Python 3.8+, Flask 2.x
- PySerial — Arduino serial communication
- TensorFlow / Keras — CNN inference
- Scikit-learn / joblib — ML model inference
- SQLite3 — persistent data storage
- Requests — OpenWeather API HTTP client

**Frontend**
- React 18 + TypeScript
- Vite — build tool
- Tailwind CSS v4
- Shadcn UI — component library
- Lucide Icons
- Axios — API client

**Hardware**
- Arduino Uno / Mega R3
- Capacitive Soil Moisture Sensor
- DHT11 / DHT22 (Temperature & Humidity)
- 5V Relay Module
- DC Submersible Water Pump

---

## 🚀 Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+ LTS
- Arduino IDE
- Git

---

### 1. Hardware Setup

1. Wire the **Soil Moisture Sensor**: `VCC → 5V`, `GND → GND`, `AOUT → A0`
2. Wire the **DHT Sensor**: `VCC → 5V`, `GND → GND`, `DATA → Digital Pin 2` *(add 10kΩ pull-up resistor between DATA and VCC)*
3. Wire the **Relay Module**: `VCC → 5V`, `GND → GND`, `IN → Digital Pin 7`
4. Connect the **Water Pump** to the relay's `NO` terminal
5. Connect Arduino to your PC via USB and note the COM port (e.g. `COM3` / `/dev/ttyACM0`)
6. Open `arduino_code/arduino_sensor_node.ino` in **Arduino IDE** and upload it
7. Open the Serial Monitor at **9600 baud** to verify sensor output

---

### 2. Backend Setup

```bash
# Clone the repository
git clone https://github.com/hazzem-web/Smart-Agriculture-System-Graduation-Project-.git
cd Smart-Agriculture-System-Graduation-Project-/smart_agriculture_api

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Linux / macOS
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# → Edit .env with your values (see Environment Variables section below)

# Initialize the database
python init_db.py

# Start the Flask server
python app.py
# API running at http://localhost:5000
```

---

### 3. Frontend Setup

```bash
cd ../smart-agriculture-frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Set VITE_API_BASE_URL=http://localhost:5000

# Start development server
npm run dev
# Dashboard at http://localhost:5173
```

---

## 🔑 Environment Variables

Create a `.env` file inside `smart_agriculture_api/` with the following:

```env
# OpenWeather API
OPENWEATHER_API_KEY=your_openweather_api_key_here
FARM_LAT=30.9756
FARM_LON=31.1687

# Arduino Serial Port
SERIAL_PORT=COM3           # Windows
# SERIAL_PORT=/dev/ttyACM0  # Linux/macOS
SERIAL_BAUD=9600

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# Model Paths
IRRIGATION_MODEL_PATH=../IrrigationScheduling/irrigation_model.pkl
DISEASE_MODEL_PATH=../PlantDiseaseDetection/plant_disease_model.h5
CLASS_NAMES_PATH=../PlantDiseaseDetection/class_names.json

# Irrigation Decision Threshold
CONFIDENCE_THRESHOLD=0.75
```

> ⚠️ **Never commit your `.env` file.** It is already included in `.gitignore`.

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/login` | ❌ | Login and receive JWT token |
| `GET` | `/api/sensors/latest` | ✅ | Get latest Arduino sensor reading |
| `GET` | `/api/sensors/history` | ✅ | Get paginated sensor reading history |
| `GET` | `/api/irrigation/events` | ✅ | Get irrigation event log |
| `POST` | `/api/irrigation/override` | ✅ | Manually activate/deactivate pump |
| `POST` | `/api/disease/predict` | ✅ | Upload leaf image → disease classification |
| `GET` | `/api/weather/current` | ✅ | Get cached weather data for farm location |

---

## 🎬 Demo

> Screenshots and demo videos are available in the [`/Demo`](./Demo) folder.

---

## 👥 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/hazzem-web">
        <b>Hazzem Mohammed</b>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/Hady-Alsaeed">
        <b>Hady Alsaeed</b>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/MohamedAliDev2004">
        <b>Mohamed Ali</b>
      </a>
    </td>
  </tr>
</table>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](./LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by the Smart Agriculture Team — Kafr El-Sheikh University, Computer Science Department, 2025–2026</sub>
</div>