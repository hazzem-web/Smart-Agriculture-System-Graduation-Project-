#include <DHT.h>
#include <ArduinoJson.h>

#define soilPin A0
#define relayPin 8
#define waterLevelPin 7
#define DHTPIN 2
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

int soilValue;
int waterLevel;

void setup() {
  Serial.begin(9600);
  
  pinMode(relayPin, OUTPUT);
  pinMode(waterLevelPin, INPUT);
  
  digitalWrite(relayPin, HIGH);  // Pump OFF initially
  
  dht.begin();
}

void loop() {
  // Read sensor values
  soilValue = analogRead(soilPin);
  waterLevel = digitalRead(waterLevelPin);
  
  float temp = dht.readTemperature();
  float humidity = dht.readHumidity();
  
  // Control pump logic
  if (soilValue > 600 && waterLevel == 1) {
    digitalWrite(relayPin, LOW);   // Pump ON
  } else {
    digitalWrite(relayPin, HIGH);  // Pump OFF
  }
  
  // Create JSON document
  StaticJsonDocument<200> doc;
  doc["Soil"] = soilValue;
  doc["Temp"] = temp;
  doc["Humidity"] = humidity;
  doc["WaterLevel"] = waterLevel;
  
  // Send JSON via Serial
  serializeJson(doc, Serial);
  Serial.println();  // Add newline for easier parsing
  
  delay(2000);
}
