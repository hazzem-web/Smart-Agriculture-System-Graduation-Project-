# 🌱 Nabatat: Smart Agriculture System

**Nabatat** is a next-generation, intelligent agricultural platform designed to bridge the gap between physical farming environments and modern software solutions. This system leverages IoT sensors, deep learning models, and a sleek, modern frontend interface to empower farmers with real-time crop monitoring and automated decision-making.

---

## ✨ Key Features

- **🌱 AI-Powered Disease Detection:** Instantly diagnose plant health by uploading images of leaves. Our system utilizes a highly optimized MobileNetV2 architecture to detect diseases in crops like Tomatoes, Potatoes, and Bell Peppers with high confidence.
- **💧 Smart Irrigation Advisory:** Integrates live data from physical IoT sensors (Soil Moisture, Temperature, Humidity) with localized weather API forecasts. The system predicts precise irrigation needs, conserving water resources and maintaining optimal plant health.
- **🖥️ Premium User Interface:** A completely overhauled, responsive, and modern web application built with React, TypeScript, Tailwind CSS, and Shadcn UI. It features a cohesive design system, dark-mode ready color palettes, and an intuitive dashboard experience.
- **⚙️ Robust Python Backend:** A scalable Flask API handles AI inference, HTTP requests, and real-time serial hardware data fetching seamlessly.

---

## 🏗️ System Architecture & Technology Stack

The platform features an end-to-end architecture starting from physical IoT hardware reading the environment, a backend processing the data and AI inference, and a frontend displaying it interactively.

- **Frontend App:** React, TypeScript, Vite, Tailwind CSS v4, Lucide Icons, and custom CSS variables for dynamic theming.
- **Backend & ML API:** Python, Flask, threading, pyserial.
- **Hardware Layer:** Arduino Microcontroller, Soil Moisture Sensor, Temperature/Humidity Sensors, Real-time Relay for Pump simulation.
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

---

## 🚀 Future Scope

While Nabatat currently operates as a fully integrated hardware/software solution locally, our future targets include:
- **Mobile Application:** A dedicated Flutter/React Native mobile application for on-the-go access.
- **Advanced Dashboard Analytics:** Implementing long-term charts using libraries like Recharts to visualize historical health data and predict seasonal trends.
- **Full Cloud Gateway:** Pushing the IoT data directly to an AWS/GCP cloud interface rather than local serial.

---

## 👥 Contributors

This system was proudly developed by:

- **Hazzem Mohammed** - [@hazzem-web](https://github.com/hazzem-web)
- **Hady Alsaeed** - [@Hady-Alsaeed](https://github.com/Hady-Alsaeed)
- **MohamedAli** - [@MohamedAli](https://github.com/MohamedAliDev2004)
