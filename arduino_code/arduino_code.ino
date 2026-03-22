#include <DHT.h>

#define DHTPIN 7       // الحساس الأزرق واصل في رجل 7
#define DHTTYPE DHT11
#define SOIL_PIN A0    // حساس الرطوبة واصل في A0
#define RELAY_PIN 8    // الريلاي واصل في رجل 8

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600); 
  dht.begin();
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH); // الريلاي بيفصل غالباً على HIGH
}

void loop() {
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  int soil = analogRead(SOIL_PIN);
  int soilPercent = map(soil, 1023, 0, 0, 100);
  
  // سكربت البايثون الخاص بك يعتمد على وجود قراءة لمستوى المياه،
  // وبما أن الحساس ليس في كودك، سنعطيه قيمة افتراضية 1 (يعني يوجد مياه)
  int waterLevel = 1;

  // send data with json format to make python able to read it
  Serial.print("{\"Temp\": ");
  Serial.print(t);
  Serial.print(", \"Humidity\": ");
  Serial.print(h);
  Serial.print(", \"Soil\": ");
  Serial.print(soilPercent);
  Serial.print(", \"WaterLevel\": ");
  Serial.print(waterLevel);
  Serial.println("}");

  // استقبال الأوامر من الكمبيوتر (من ملف app.py لاحقاً)
  if (Serial.available() > 0) {
    char cmd = Serial.read();
    if (cmd == '1') digitalWrite(RELAY_PIN, LOW);   // Relay ON
    if (cmd == '0') digitalWrite(RELAY_PIN, HIGH); // Relay OFF
  }
  delay(2000); 
}
