"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config.ts";


const IrrigationPage: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [moisture, setMoisture] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [pressure, setPressure] = useState<number | null>(null);
  const [altitude, setAltitude] = useState<number | null>(null);
  const [rainExpected, setRainExpected] = useState<boolean | null>(null);
  const [advice, setAdvice] = useState<string>("");

  const handleSearch = async (query: string) => {
    setLocation(query);
    if (query.length > 2) {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await response.json();
      setSearchResults(data);
    } else {
      setSearchResults([]);
    }
  };

  const selectLocation = (place: any) => {
    setLocation(place.display_name);
    setSearchResults([]);
  };

  const fetchWeatherDataAndSensors = async (): Promise<void> => {
    try {
      setAdvice("Fetching data...");
      // Fetch weather data
      const weatherResponse = await fetch(`${API_BASE}/check_weather?location=${location}`);
      const weatherData = await weatherResponse.json();

      setRainExpected(weatherData.rain_expected);
      setPressure(weatherData.pressure);
      setAltitude(weatherData.altitude);

      // Fetch sensor data
      const sensorResponse = await fetch(`${API_BASE}/sensors/data`);
      const sensorData = await sensorResponse.json();

      setTemperature(sensorData.temperature);
      setHumidity(sensorData.humidity);
      setMoisture(sensorData.soil_moisture);

      if (weatherData.rain_expected) {
        setAdvice("No irrigation needed due to expected rain.");
      } else {
        setAdvice("Data fetched successfully. Ready to get advice.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setAdvice("Failed to fetch all data.");
    }
  };

  const getIrrigationAdvice = async (): Promise<void> => {
    if (rainExpected) return;
    setAdvice("Fetching irrigation advice...");

    try {
      const response = await fetch(`${API_BASE}/predict/irrigation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperature,
          soil_moisture: moisture,
          pressure,
          altitude,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }

      const data: { prediction: string } = await response.json();
      setAdvice(data.prediction);
    } catch (error) {
      console.error("Error fetching irrigation advice:", error);
      setAdvice("Failed to get advice. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="px-4 py-2 border-b flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-1 font-medium">
          <img src="icon.jpeg" alt="icon" className="h-6 w-6 object-contain" /> 
          <span className="text-md">Nabatat</span>
        </div> 
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-green-600 text-sm hover:text-green-700 transition"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Home
        </button>
      </header>

      <main className="flex-1 bg-[url('/IrrigationAdvisorBage.jpg')] bg-cover bg-center bg-fixed relative">
        <Card className="w-full max-w-md shadow-xl p-6 bg-blue-100 rounded-lg absolute z-10 bottom-60 left-30">
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold">Irrigation Advisor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pressure === null && (
                <div>
                  <Label>Enter Your Location (For Weather Info)</Label>
                  <Input
                    type="text"
                    value={location}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Search location..."
                  />
                  {searchResults.length > 0 && (
                    <ul className="border rounded-md bg-white mt-1 shadow-md max-h-40 overflow-y-auto">
                      {searchResults.map((place, index) => (
                        <li
                          key={index}
                          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => selectLocation(place)}
                        >
                          {place.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                  <Button onClick={fetchWeatherDataAndSensors} className="w-full mt-2 bg-blue-600 hover:bg-blue-700">
                    Fetch Sensor & Weather Data
                  </Button>
                </div>
              )}
              {pressure !== null && (
                <>
                  <div className="grid grid-cols-2 gap-2 text-sm bg-white p-3 rounded-md shadow-sm border border-blue-200">
                    <p className="font-semibold text-gray-700">Sensor Data:</p>
                    <p></p>
                    <p>Temperature: {temperature}°C</p>
                    <p>Humidity: {humidity}%</p>
                    <p>Soil Moisture: {moisture}</p>
                    <p className="col-span-2 border-b my-1"></p>
                    <p className="font-semibold text-gray-700">Weather API Data:</p>
                    <p></p>
                    <p>Pressure: {pressure} hPa</p>
                    <p>Altitude: {altitude?.toFixed(2)} m</p>
                    <p>Rain Expected: {rainExpected ? "Yes" : "No"}</p>
                  </div>
                  
                  <Separator />
                  {!rainExpected && (
                    <div>
                      <Button onClick={getIrrigationAdvice} className="w-full mt-2 bg-green-600 hover:bg-green-700">
                        Get Irrigation Advice
                      </Button>
                    </div>
                  )}
                  {advice && <p className="text-center mt-4 font-semibold text-gray-800">{advice}</p>}
                  
                  <Button 
                    variant="outline" 
                    onClick={fetchWeatherDataAndSensors} 
                    className="w-full mt-4 bg-white hover:bg-gray-100 text-blue-600 border-blue-600"
                  >
                    Refresh Sensor & Weather Data
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default IrrigationPage;
