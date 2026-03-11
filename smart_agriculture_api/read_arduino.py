import serial
import json
import time
import requests
from datetime import datetime
import random
import os

# Arduino Serial Configuration
SERIAL_PORT = os.getenv("ARDUINO_PORT", "COM3")  # Change this to your Arduino port
BAUD_RATE = 9600
TIMEOUT = 1

# Flask API URL
API_URL = "http://localhost:5000/sensors/data"

# Simulation mode
SIMULATION_MODE = os.getenv("SIMULATION_MODE", "true").lower() == "true"

def read_arduino():
    """Read data from Arduino via USB Serial or Simulation Mode"""
    if SIMULATION_MODE:
        print("🎮 SIMULATION MODE - Generating mock data")
        simulate_arduino()
    else:
        real_arduino()

def simulate_arduino():
    """Generate mock sensor data for testing"""
    print(f"📡 Simulating Arduino data...")
    
    while True:
        try:
            # Generate random but realistic sensor values
            data = {
                "Soil": random.randint(300, 800),      # 0-1023
                "Temp": round(random.uniform(18, 35), 1),  # 18-35°C
                "Humidity": random.randint(30, 90),    # 30-90%
                "WaterLevel": random.choice([0, 1])    # 0 or 1
            }
            
            # Add timestamp
            data['timestamp'] = datetime.now().isoformat()
            
            print(f"📡 Generated: {json.dumps(data)}")
            
            # Send to Flask API
            send_to_api(data)
            
            time.sleep(2)  # Send data every 2 seconds
            
        except Exception as e:
            print(f"❌ Error in simulation: {e}")
            time.sleep(1)

def real_arduino():
    """Read actual data from Arduino via USB Serial"""
    try:
        # Open Serial Connection
        ser = serial.Serial(SERIAL_PORT, BAUD_RATE, timeout=TIMEOUT)
        print(f"✅ Connected to Arduino on {SERIAL_PORT}")
        time.sleep(2)  # Wait for Arduino to initialize
        
        while True:
            try:
                # Read line from Serial
                if ser.in_waiting > 0:
                    line = ser.readline().decode('utf-8').strip()
                    
                    if line:
                        print(f"📡 Received: {line}")
                        
                        # Parse JSON from Arduino
                        try:
                            data = json.loads(line)
                            
                            # Add timestamp
                            data['timestamp'] = datetime.now().isoformat()
                            
                            # Send to Flask API
                            send_to_api(data)
                            
                        except json.JSONDecodeError:
                            print(f"⚠️  Invalid JSON: {line}")
                    
                time.sleep(0.1)
                
            except Exception as e:
                print(f"❌ Error reading serial: {e}")
                time.sleep(1)
    
    except serial.SerialException as e:
        print(f"❌ Serial connection error: {e}")
        print(f"📌 Available ports: COM1 to COM10 (modify SERIAL_PORT variable)")
        time.sleep(5)
    
    except KeyboardInterrupt:
        print("\n🛑 Stopped by user")
        if not SIMULATION_MODE:
            ser.close()

def send_to_api(data):
    """Send sensor data to Flask API"""
    try:
        response = requests.post(API_URL, json=data, timeout=5)
        if response.status_code == 200:
            print(f"✅ Data sent to API: {response.status_code}")
        else:
            print(f"⚠️  API Error: {response.status_code} - {response.text}")
    except requests.ConnectionError:
        print(f"⚠️  Cannot connect to API at {API_URL}")
    except Exception as e:
        print(f"❌ API Error: {e}")

if __name__ == "__main__":
    print("🌱 Smart Agriculture - Arduino Reader")
    print("=" * 50)
    
    if SIMULATION_MODE:
        print("📌 Running in SIMULATION MODE")
        print("   To use real Arduino: set SIMULATION_MODE=false")
        print("=" * 50)
    else:
        print(f"📡 Connecting to Arduino on {SERIAL_PORT}...")
    
    read_arduino()
