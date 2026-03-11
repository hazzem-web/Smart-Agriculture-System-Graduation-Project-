"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Leaf, Droplet, Thermometer, Wind, Gauge } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config.ts";


const IrrigationPage: React.FC = () => {
  const navigate = useNavigate();
  const [sensorData, setSensorData] = useState<{
    soil_moisture: number;
    temperature: number;
    humidity: number;
    water_level: number;
    pump_status: string;
    timestamp: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch sensor data on component mount and set up auto-refresh
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch(`${API_BASE}/sensors/data`);
        if (!response.ok) throw new Error("Failed to fetch sensor data");
        const data = await response.json();
        setSensorData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchSensorData();

    // Auto-refresh every 2 seconds
    const interval = setInterval(fetchSensorData, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-50">
      <header className="px-4 py-2 border-b flex items-center justify-between bg-white shadow-sm">
        <div className="flex items-center gap-1 font-medium">
          <Leaf className="h-5 w-5 text-green-600" />
          <span className="text-md">FarmFriend - Live Sensors</span>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-green-600 text-sm hover:text-green-700 transition"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Home
        </button>
      </header>

      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">🌱 Real-Time Sensor Dashboard</h1>

          {loading ? (
            <Card className="bg-white shadow-lg">
              <CardContent className="p-8 text-center">
                <p className="text-lg text-gray-600">⏳ Connecting to sensors...</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="bg-red-50 shadow-lg border-red-200">
              <CardContent className="p-8 text-center">
                <p className="text-lg text-red-600">❌ Error: {error}</p>
                <p className="text-sm text-gray-600 mt-2">Make sure Python reader is running: <code className="bg-gray-200 px-2 py-1 rounded">python read_arduino.py</code></p>
              </CardContent>
            </Card>
          ) : sensorData ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Soil Moisture Card */}
              <Card className="bg-gradient-to-br from-amber-50 to-orange-100 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Droplet className="h-5 w-5 text-orange-600" />
                    Soil Moisture
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-orange-700">{sensorData.soil_moisture}</p>
                  <p className="text-xs text-gray-600 mt-1">Analog Value (0-1023)</p>
                </CardContent>
              </Card>

              {/* Temperature Card */}
              <Card className="bg-gradient-to-br from-red-50 to-rose-100 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Thermometer className="h-5 w-5 text-red-600" />
                    Temperature
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-red-700">{sensorData.temperature}°C</p>
                  <p className="text-xs text-gray-600 mt-1">DHT11 Sensor</p>
                </CardContent>
              </Card>

              {/* Humidity Card */}
              <Card className="bg-gradient-to-br from-blue-50 to-cyan-100 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Wind className="h-5 w-5 text-blue-600" />
                    Humidity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-700">{sensorData.humidity}%</p>
                  <p className="text-xs text-gray-600 mt-1">Relative Humidity</p>
                </CardContent>
              </Card>

              {/* Water Level Card */}
              <Card className="bg-gradient-to-br from-teal-50 to-emerald-100 shadow-lg">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Gauge className="h-5 w-5 text-teal-600" />
                    Water Level
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-teal-700">
                    {sensorData.water_level === 1 ? "Available" : "Low"}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Digital Signal</p>
                </CardContent>
              </Card>
            </div>
          ) : null}

          {/* Pump Status & Timestamp */}
          {sensorData && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pump Status */}
              <Card className={`shadow-lg ${sensorData.pump_status === "ON" ? "bg-gradient-to-br from-green-100 to-emerald-200 border-green-400" : "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-400"}`}>
                <CardHeader>
                  <CardTitle className="text-lg">🚰 Pump Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-4xl font-bold mb-2 ${sensorData.pump_status === "ON" ? "text-green-600" : "text-gray-600"}`}>
                    {sensorData.pump_status}
                  </p>
                  <Separator className="my-2" />
                  <p className="text-sm text-gray-600">
                    {sensorData.pump_status === "ON"
                      ? "✅ Irrigation is currently active"
                      : "⏸ Irrigation is paused"}
                  </p>
                </CardContent>
              </Card>

              {/* Last Update */}
              <Card className="bg-white shadow-lg">
                <CardHeader>
                  <CardTitle className="text-lg">📡 Connection Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-green-600 mb-2">✅ Connected</p>
                  <Separator className="my-2" />
                  <p className="text-sm text-gray-600">
                    Last Update: {sensorData.timestamp ? new Date(sensorData.timestamp).toLocaleTimeString() : "Waiting..."}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default IrrigationPage;
