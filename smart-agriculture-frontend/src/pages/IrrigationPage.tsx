"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { MapPin, ThermometerSun, Droplets, CloudRain, Navigation, Search, Activity, TreesIcon as Plant } from "lucide-react";
import { API_BASE } from "../config.ts";

const IrrigationPage: React.FC = () => {
  const [location, setLocation] = useState<string>("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [moisture, setMoisture] = useState<number | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [pressure, setPressure] = useState<number | null>(null);
  const [altitude, setAltitude] = useState<number | null>(null);
  const [rainExpected, setRainExpected] = useState<boolean | null>(null);
  const [advice, setAdvice] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

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
    if (!location) return;
    setIsLoading(true);
    try {
      setAdvice("Analyzing sensor & weather data...");
      
      const weatherResponse = await fetch(`${API_BASE}/check_weather?location=${location}`);
      const weatherData = await weatherResponse.json();

      setRainExpected(weatherData.rain_expected);
      setPressure(weatherData.pressure);
      setAltitude(weatherData.altitude);

      const sensorResponse = await fetch(`${API_BASE}/sensors/data`);
      const sensorData = await sensorResponse.json();

      setTemperature(sensorData.temperature);
      setHumidity(sensorData.humidity);
      setMoisture(sensorData.soil_moisture);

      if (weatherData.rain_expected) {
        setAdvice("No irrigation needed due to expected rain. Save water!");
      } else {
        setAdvice("Data fetched successfully. Ready to get AI advice.");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setAdvice("Failed to fetch data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getIrrigationAdvice = async (): Promise<void> => {
    if (rainExpected) return;
    setIsLoading(true);
    setAdvice("Generating AI irrigation advice...");

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
      setAdvice("Failed to generate advice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetData = () => {
    setPressure(null);
    setAdvice("");
  };

  return (
    <div className="flex-1 py-12 bg-background flex flex-col items-center">
      <div className="container px-4 md:px-6 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-3">Irrigation Advisor</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Optimize your water usage based on real-time soil sensor data and localized weather forecasts.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-md border-border overflow-visible">
            {pressure === null ? (
              <>
                <CardHeader className="bg-primary/5 pb-8">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-primary" />
                    Farm Location
                  </CardTitle>
                  <CardDescription className="text-base">Enter your location to fetch localized weather data</CardDescription>
                </CardHeader>
                <CardContent className="pt-8 relative z-50">
                  <div className="space-y-4">
                    <div className="space-y-2 relative">
                      <Label htmlFor="location" className="text-sm font-medium">Search Location</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="location"
                          type="text"
                          value={location}
                          onChange={(e) => handleSearch(e.target.value)}
                          placeholder="e.g. Cairo, Egypt"
                          className="pl-10 h-12 text-base"
                        />
                      </div>
                      
                      {searchResults.length > 0 && (
                        <div className="absolute top-[100%] mt-2 w-full bg-card border rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                          {searchResults.map((place, index) => (
                            <div
                              key={index}
                              className="px-4 py-3 hover:bg-muted cursor-pointer text-sm transition-colors border-b last:border-0"
                              onClick={() => selectLocation(place)}
                            >
                              {place.display_name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 pb-8">
                  <Button 
                    onClick={fetchWeatherDataAndSensors} 
                    disabled={isLoading || !location}
                    className="w-full h-12 text-md"
                  >
                    {isLoading ? "Fetching Data..." : "Fetch Sensor & Weather Data"}
                  </Button>
                </CardFooter>
              </>
            ) : (
              <>
                <CardHeader className="bg-primary/5 pb-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl flex items-center gap-2">
                        <Activity className="h-5 w-5 text-primary" />
                        Farm Dashboard
                      </CardTitle>
                      <CardDescription className="mt-2 flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-[250px] inline-block" title={location}>{location}</span>
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={resetData}>Change Location</Button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {/* Sensor Data Grid */}
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Live Sensor Data</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="bg-muted/50 rounded-xl p-4 border border-border flex flex-col items-center justify-center text-center">
                          <ThermometerSun className="h-6 w-6 text-orange-500 mb-2" />
                          <span className="text-xs text-muted-foreground mb-1">Temperature</span>
                          <span className="text-lg font-bold">{temperature}°C</span>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-4 border border-border flex flex-col items-center justify-center text-center">
                          <Droplets className="h-6 w-6 text-blue-500 mb-2" />
                          <span className="text-xs text-muted-foreground mb-1">Humidity</span>
                          <span className="text-lg font-bold">{humidity}%</span>
                        </div>
                        <div className="bg-primary/10 rounded-xl p-4 border border-primary/20 flex flex-col items-center justify-center text-center col-span-2 md:col-span-1">
                          <Plant className="h-6 w-6 text-primary mb-2" />
                          <span className="text-xs text-muted-foreground mb-1">Soil Moisture</span>
                          <span className="text-lg font-bold text-primary">{moisture}</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Weather Data Grid */}
                    <div>
                      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Weather Forecast</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="bg-muted/50 rounded-xl p-4 border border-border flex flex-col items-center justify-center text-center">
                          <CloudRain className={`h-6 w-6 mb-2 ${rainExpected ? "text-blue-500" : "text-gray-400"}`} />
                          <span className="text-xs text-muted-foreground mb-1">Rain Expected</span>
                          <span className={`text-md font-bold ${rainExpected ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground"}`}>
                            {rainExpected ? "Yes" : "No"}
                          </span>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-4 border border-border flex flex-col items-center justify-center text-center">
                          <Navigation className="h-6 w-6 text-indigo-500 mb-2" />
                          <span className="text-xs text-muted-foreground mb-1">Pressure</span>
                          <span className="text-md font-bold">{pressure} hPa</span>
                        </div>
                        <div className="bg-muted/50 rounded-xl p-4 border border-border flex flex-col items-center justify-center text-center col-span-2 md:col-span-1">
                          <Activity className="h-6 w-6 text-emerald-500 mb-2" />
                          <span className="text-xs text-muted-foreground mb-1">Altitude</span>
                          <span className="text-md font-bold">{altitude?.toFixed(0)} m</span>
                        </div>
                      </div>
                    </div>

                    {/* AI Advice Area */}
                    <div className="pt-4">
                      {advice && (
                        <div className={`p-5 rounded-xl border ${rainExpected ? 'bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900' : 'bg-primary/5 border-primary/20'}`}>
                          <h4 className="font-semibold mb-2 flex items-center gap-2">
                            {rainExpected ? <CloudRain className="h-5 w-5 text-blue-500" /> : <Plant className="h-5 w-5 text-primary" />}
                            AI Recommendation
                          </h4>
                          <p className="text-sm leading-relaxed font-medium text-foreground">{advice}</p>
                        </div>
                      )}

                      {!rainExpected && (
                        <Button 
                          onClick={getIrrigationAdvice} 
                          disabled={isLoading}
                          className="w-full h-12 mt-4 text-md bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          {isLoading ? "Generating Advice..." : "Get Irrigation Advice"}
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline" 
                        onClick={fetchWeatherDataAndSensors} 
                        disabled={isLoading}
                        className="w-full h-10 mt-3"
                      >
                        Refresh Data
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default IrrigationPage;
