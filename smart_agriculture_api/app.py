import base64
import os
import io 
import joblib
import numpy as np
import serial
import serial.tools.list_ports
import time
import requests
import tensorflow as tf
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, BatchNormalization, Dropout
from tensorflow.keras.models import Model
from dotenv import load_dotenv
import threading
import json
import math
from datetime import datetime
arduino = None
try:
    # Try to auto-detect the Arduino port
    arduino_port = 'COM3' # Default fallback
    ports = serial.tools.list_ports.comports()
    for port in ports:
        # Check common Arduino chips (CH340, CP210x, FTDI) or name "Arduino"
        if "Arduino" in port.description or "CH340" in port.description or "USB Serial Device" in port.description:
            arduino_port = port.device
            break
            
    arduino = serial.Serial(arduino_port, 9600, timeout=1)
    time.sleep(2) 
    print(f"Arduino Connected on {arduino_port}")
except Exception as e:
    print(f"Error connecting to Arduino on {arduino_port if 'arduino_port' in locals() else 'COM3'}: {e}")

def read_from_arduino():
    global current_sensor_data
    try:
        if arduino:
            arduino.reset_input_buffer()
            arduino.readline() # Discard partial
            line = arduino.readline().decode('utf-8', errors='ignore').strip()
            if line:
                line = line.replace('nan', 'NaN') # Fix unquoted nan from Arduino C++ so Python json can parse it
                print(f"🔥 Arduino raw message: {line}")
                
                data = {}
                try:
                    data = json.loads(line)
                except Exception:
                    # Fallback to regex if not JSON format (using [:= ] instead of [^\d]* to prevent skipping over other keys)
                    temp_m = re.search(r'(?i)(?:temp|temperature)[\s:=]+([\d\.]+)', line)
                    if temp_m: data["Temp"] = float(temp_m.group(1))
                    
                    hum_m = re.search(r'(?i)(?:hum|humidity)[\s:=]+([\d\.]+)', line)
                    if hum_m: data["Humidity"] = float(hum_m.group(1))
                    
                    soil_m = re.search(r'(?i)(?:soil|moisture)[\s:=]+([\d\.]+)', line)
                    if soil_m: data["Soil"] = float(soil_m.group(1))
                    
                    water_m = re.search(r'(?i)(?:water|level)[\s:=]+([\d\.]+)', line)
                    if water_m: data["WaterLevel"] = int(float(water_m.group(1)))
                
                if data:
                    # Handle NaN safely
                    temp = data.get("Temp", current_sensor_data["temperature"])
                    if isinstance(temp, float) and math.isnan(temp) or temp == "NaN": temp = 0.0
                    hum = data.get("Humidity", current_sensor_data["humidity"])
                    if isinstance(hum, float) and math.isnan(hum) or hum == "NaN": hum = 0.0
                    
                    current_sensor_data["soil_moisture"] = data.get("Soil", current_sensor_data["soil_moisture"])
                    current_sensor_data["temperature"] = temp
                    current_sensor_data["humidity"] = hum
                    current_sensor_data["water_level"] = data.get("WaterLevel", current_sensor_data["water_level"])
                    current_sensor_data["timestamp"] = datetime.now().isoformat()
                    
                    print(f"✅ Extracted Values: Temp={temp}, Hum={hum}, Soil={current_sensor_data['soil_moisture']}")
                    
                    if data.get("Soil", 0) > 600 and data.get("WaterLevel", 0) == 1:
                        pass # We won't overwrite pump status since predicting/frontend handles it logic
    except Exception as e:
        print(f"Error in Arduino communication: {e}")


app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

# Force CPU to avoid GPU errors
os.environ["CUDA_VISIBLE_DEVICES"] = "-1"

# Store current sensor data
current_sensor_data = {
    "soil_moisture": 0,
    "temperature": 0,
    "humidity": 0,
    "water_level": 0,
    "pump_status": "OFF",
    "timestamp": None
}
# Load Models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
irrigation_model_path = os.path.join(BASE_DIR, "models", "irrigation_model.pkl")
plant_model_path = os.path.join(BASE_DIR, "models", "plant_disease_model.h5")

irrigation_model, scaler = joblib.load(irrigation_model_path)

base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(1024, activation='relu')(x)
x = Dense(512, activation='relu')(x)
x = BatchNormalization()(x)
x = Dropout(0.2)(x)
prediction = Dense(15, activation='softmax')(x)
plant_model = Model(inputs=base_model.input, outputs=prediction)
plant_model.load_weights(plant_model_path)

# Weather API Key 
load_dotenv()
WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")

# Image Preprocessing
def preprocess_image(img):
    img = img.resize((224, 224))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0  # Normalize
    return img_array


class_names = [
    "Pepper Bell - Bacterial Spot",
    "Pepper Bell - Healthy",
    "Potato - Early Blight",
    "Potato - Late Blight",
    "Potato - Healthy",
    "Tomato - Bacterial Spot",
    "Tomato - Early Blight",
    "Tomato - Late Blight",
    "Tomato - Leaf Mold",
    "Tomato - Septoria Leaf Spot",
    "Tomato - Spider Mites (Two-Spotted Spider Mite)",
    "Tomato - Target Spot",
    "Tomato - Yellow Leaf Curl Virus",
    "Tomato - Mosaic Virus",
    "Tomato - Healthy"
]

causes = {
    "Pepper Bell - Bacterial Spot": "Xanthomonas campestris bacteria",
    "Potato - Early Blight": "Alternaria solani fungus",
    "Potato - Late Blight": "Phytophthora infestans pathogen",
    "Tomato - Bacterial Spot": "Xanthomonas campestris bacteria",
    "Tomato - Early Blight": "Alternaria solani fungus",
    "Tomato - Late Blight": "Phytophthora infestans pathogen",
    "Tomato - Leaf Mold": "Passalora fulva fungus",
    "Tomato - Septoria Leaf Spot": "Septoria lycopersici fungus",
    "Tomato - Spider Mites (Two-Spotted Spider Mite)": "Tetranychus urticae mites",
    "Tomato - Target Spot": "Corynespora cassiicola fungus",
    "Tomato - Yellow Leaf Curl Virus": "Tomato yellow leaf curl virus (spread by whiteflies)",
    "Tomato - Mosaic Virus": "Tobacco mosaic virus (TMV)",
}

symptoms = {
    "Pepper Bell - Bacterial Spot": "Small, dark, water-soaked spots on leaves and fruit; can lead to defoliation and reduced yield.",
    "Potato - Early Blight": "Brown lesions with concentric rings on lower leaves, leading to defoliation.",
    "Potato - Late Blight": "Dark, water-soaked lesions on leaves and stems; rapid plant death in humid conditions.",
    "Tomato - Bacterial Spot": "Dark, water-soaked leaf spots that merge and cause yellowing; fruit may have scabby spots.",
    "Tomato - Early Blight": "Dark spots with concentric rings on lower leaves; can cause plant defoliation.",
    "Tomato - Late Blight": "Large, water-soaked lesions on leaves and stems, leading to rapid plant collapse.",
    "Tomato - Leaf Mold": "Yellow patches on upper leaves, fuzzy olive-green mold underneath.",
    "Tomato - Septoria Leaf Spot": "Numerous small, circular spots with dark margins on leaves; causes defoliation.",
    "Tomato - Spider Mites (Two-Spotted Spider Mite)": "Yellow speckling on leaves, fine webbing, leaf curling, and drying.",
    "Tomato - Target Spot": "Circular brown spots with concentric rings, leading to premature leaf drop.",
    "Tomato - Yellow Leaf Curl Virus": "Upward curling, yellowing of leaves, and stunted growth.",
    "Tomato - Mosaic Virus": "Mottled yellow and green leaf pattern, distorted leaf growth, and reduced fruit production.",
}


treatments = {
    "Pepper Bell - Bacterial Spot": "Apply copper-based fungicides. Avoid overhead watering. Use disease-resistant varieties.",
    "Pepper Bell - Healthy": "No treatment needed. Maintain proper watering and nutrient balance.",
    "Potato - Early Blight": "Use fungicides containing chlorothalonil or mancozeb. Rotate crops and remove infected plants.",
    "Potato - Late Blight": "Apply fungicides like metalaxyl or chlorothalonil. Improve air circulation and avoid wet conditions.",
    "Potato - Healthy": "No treatment needed. Maintain soil health and proper irrigation.",
    "Tomato - Bacterial Spot": "Use copper sprays and bactericides. Avoid handling plants when wet.",
    "Tomato - Early Blight": "Apply fungicides such as chlorothalonil or mancozeb. Prune lower leaves and use mulch to prevent soil splash.",
    "Tomato - Late Blight": "Use fungicides like copper-based sprays or chlorothalonil. Remove and destroy infected plants.",
    "Tomato - Leaf Mold": "Increase air circulation, reduce humidity, and apply fungicides containing chlorothalonil or mancozeb.",
    "Tomato - Septoria Leaf Spot": "Use fungicides like copper-based sprays. Remove infected leaves and ensure good airflow.",
    "Tomato - Spider Mites (Two-Spotted Spider Mite)": "Use insecticidal soap, neem oil, or predatory mites to control infestations.",
    "Tomato - Target Spot": "Apply fungicides such as azoxystrobin or chlorothalonil. Remove infected leaves and avoid overhead watering.",
    "Tomato - Yellow Leaf Curl Virus": "Control whiteflies with neem oil or insecticidal soap. Use virus-resistant tomato varieties.",
    "Tomato - Mosaic Virus": "Remove infected plants immediately. Control aphids that spread the virus using neem oil or insecticidal soap.",
    "Tomato - Healthy": "No treatment needed. Maintain good growing conditions."
}


# API Routes 
@app.route("/check_weather", methods=["GET"])
def check_weather():
    location = request.args.get("location", "default_location")
    url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={WEATHER_API_KEY}&units=metric"
    response = requests.get(url)
    if response.status_code == 200:
        weather_data = response.json()
        rain_forecast = "rain" in weather_data["weather"][0]["description"].lower()
        altitude = weather_data["coord"]["lat"] * 0.1
        return jsonify({
            "rain_expected": rain_forecast,
            "temperature": weather_data["main"]["temp"],
            "pressure": weather_data["main"]["pressure"],
            "altitude": altitude
        })
    return jsonify({"error": "Could not fetch weather data"}), 400





@app.route("/predict/irrigation", methods=["POST"])
def predict_irrigation():
    try:
        data = request.json
        temp = float(data["temperature"])
        pressure = float(data["pressure"])
        altitude = float(data["altitude"])
        soil = float(data["soil_moisture"])

        X = np.array([[temp, pressure, altitude, soil]])
        X_scaled = scaler.transform(X)
        prediction = irrigation_model.predict(X_scaled)[0]

        # القرار وإرسال الأمر للهاردوير
        if prediction in [0, 1]: 
            if arduino:
                arduino.write(b'1') # أمر تشغيل الطلمبة
            current_sensor_data["pump_status"] = "ON"
            advice = "Soil is dry. Irrigation STARTED via Arduino."
        else: 
            if arduino:
                arduino.write(b'0') # أمر إيقاف الطلمبة
            current_sensor_data["pump_status"] = "OFF"
            advice = "Soil is wet. Pump is OFF."

        return jsonify({"prediction": advice})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/predict/plant", methods=["POST"])
def predict_plant_disease():
    try:
        if "image" in request.files:
            file = request.files["image"]
            img = Image.open(file).convert("RGB")
        elif "image" in request.json:
            image_data = request.json["image"].split(",")[1]  
            img = Image.open(io.BytesIO(base64.b64decode(image_data))).convert("RGB")
        else:
            return jsonify({"error": "No image provided"}), 400

        img_array = preprocess_image(img)
        prediction = plant_model.predict(img_array)
        predicted_class_idx = np.argmax(prediction, axis=1)[0]
        confidence = float(np.max(prediction)) * 100
        predicted_class = class_names[predicted_class_idx]
        if predicted_class == "Pepper Bell - Healthy" or predicted_class == "Tomato - Healthy" or predicted_class == "Potato - Healthy": 
            return jsonify({"healthy": "Plant is healthy", "confidence": confidence})
        cause = causes.get(predicted_class, "Cause details not available")
        symptom = symptoms.get(predicted_class, "Symptom details not available")
        treatment = treatments.get(predicted_class, "No treatment details available")


        return jsonify({
            "disease": predicted_class,
            "confidence": confidence,
            "cause": cause,
            "symptoms": symptom,
            "treatment": treatment
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Sensor Data Routes
@app.route("/sensors/data", methods=["GET", "POST"])
def handle_sensor_data():
    global current_sensor_data
    
    if request.method == "POST":
        # Receive data from Arduino reader
        try:
            data = request.json
            
            # Update global sensor data
            current_sensor_data["soil_moisture"] = data.get("Soil", 0)
            current_sensor_data["temperature"] = data.get("Temp", 0)
            current_sensor_data["humidity"] = data.get("Humidity", 0)
            current_sensor_data["water_level"] = data.get("WaterLevel", 0)
            current_sensor_data["timestamp"] = data.get("timestamp")
            
            # Auto-determine pump status based on sensor values
            if data.get("Soil", 0) > 600 and data.get("WaterLevel", 0) == 1:
                current_sensor_data["pump_status"] = "ON"
            else:
                current_sensor_data["pump_status"] = "OFF"
            
            print(f"✅ Sensor data updated: {current_sensor_data}")
            return jsonify({"status": "success", "message": "Data received"}), 200
        
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 400
    
    else:
        # GET: Return current sensor data
        read_from_arduino()
        return jsonify(current_sensor_data), 200

# Run the Flask app
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(debug=False, host="0.0.0.0", port=port)
