# 🌱 FarmFriend: A Smart Agriculture System

FarmFriend is a comprehensive and intelligent agricultural solution that bridges the gap between modern software and physical hardware. This graduation project integrates physical IoT sensors, deep learning, and a sleek frontend interface to provide real-time agricultural monitoring and automated decision-making.

---

## ✨ Key Features

- **🌱 Real-time Disease Detection:** Upload an image of a plant leaf to instantly identify diseases using an optimized MobileNetV2 architecture.
- **💧 Smart Irrigation with Real Sensors:** The system gathers live environmental and soil data through an interconnected **Arduino** hardware setup, predicting the need for irrigation to conserve water and ensure optimal plant health.
- **📊 Real-time Hardware Integration:** We moved beyond simulations and directly connected physical sensors (Temperature, Humidity, Soil Moisture) to the backend via Serial communication, while maintaining the OpenWeather API for supplementary atmospheric data.
- **🖥️ User-Friendly Interface:** A clean, intuitive, and responsive web application built with modern web technologies.
- **⚙️ Robust Python Backend:** Powered by a scalable Flask API managing the AI models, HTTP requests, and real-time serial hardware data fetch operations on-demand.

---

## 🏗️ System Architecture & Technology Stack

The system features an end-to-end architecture starting from physical IoT hardware reading the environment, a backend processing the data and AI inference, and a frontend displaying it interactively.

- **Hardware Layer:** Arduino Microcontroller, Soil Moisture Sensor, Temperature/Humidity Sensors, Real-time Relay for Pump simulation.
- **Backend & ML API:** Python, Flask, threading, pyserial.
- **Frontend App:** Frontend interface via React, TypeScript, and Vite.
- **AI & Deep Learning:** TensorFlow, Keras, Scikit-learn, joblib.

---

## 🧠 Core AI Models

### 1. Plant Disease Detection
A deep convolutional neural network fine-tuned to classify various plant diseases.
- **Model:** Pre-trained **MobileNetV2** base augmented with Custom Layers (GlobalAveragePooling2D, BatchNormalization, Dropout, Dense).
- **Rationale:** Chosen for its excellent balance of high accuracy and minimal computational load, making it perfect for real-time edge predictions.
- **Performance:** Achieved ~**90% accuracy** on the PlantVillage dataset.

### 2. Intelligent Irrigation Scheduling 
A binary classification model to determine whether a given area requires watering based on sensor thresholds.
- **Model:** **Logistic Regression**.
- **Data Input:** Combines live physical Arduino readings with cloud weather metrics.
- **Rationale:** Fast, highly interpretable, and mathematically sound for making immediate threshold-based decisions.

> **Other Models Evaluated:**
> We explored ResNet50 (too heavyweight), VGG16, Random Forest, and SVMs before deciding on our current optimal stack.

---

## 🖼️ Project Gallery

A glimpse into the FarmFriend application:

![Screenshot 1](https://github.com/user-attachments/assets/2922b39f-d46c-469d-8063-daf6a3c5ac9c)
![Screenshot 2](https://github.com/user-attachments/assets/763c4a56-5f9a-47ac-a0ca-a59ba8cc43e6)
![Screenshot 3](https://github.com/user-attachments/assets/08b64672-4551-4c1b-8171-909cfb9bcc9d)

---

## 🚀 Future Scope

While FarmFriend currently operates as a fully integrated hardware/software solution locally, our future targets include:
- **Mobile Application:** A dedicated Flutter/React Native mobile application for on-the-go access.
- **Advanced Dashboard Analytics:** Implementing long-term charts using libraries like Recharts to visualize historical health data and predict seasonal trends.
- **Full Cloud Gateway:** Pushing the IoT data directly to an AWS/GCP cloud interface rather than local serial.

---

## 👥 Contributors

This system was proudly developed by:

- **Hazzem Mohammed** - [@hazzem-web](https://github.com/hazzem-web)
- **Hady Alsaeed** - [@Hady-Alsaeed](https://github.com/Hady-Alsaeed)
- **MohamedAli** - [@MohamedAli](https://github.com/MohamedAliDev2004)
