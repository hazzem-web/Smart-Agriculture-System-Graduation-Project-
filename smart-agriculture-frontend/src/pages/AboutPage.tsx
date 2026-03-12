"use client";

import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {CloudRain, Info, ArrowLeft } from "lucide-react";

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-[url('/About.avif')] bg-cover bg-center bg-fixed relative">
        <header className="px-4 py-2 mb-2 border-b flex items-center justify-between bg-white shadow-sm">
                <div className="flex items-center gap-1 font-medium">
                  <img src = "icon.jpeg" alt="icon" className="h-6 w-6 object-contain" /> 
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
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Card className="shadow-lg border rounded-lg p-6 bg-white">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Info className="h-8 w-8 text-green-600" />
              <CardTitle className="text-2xl font-bold">About Nabatat</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-600 text-lg">
              Nabatat is an AI-powered platform designed to assist farmers with smart plant disease detection and efficient irrigation scheduling. Our goal is to enhance agricultural productivity through technology-driven insights.
            </CardDescription>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border rounded-lg p-6 bg-white">
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <img src = "icon.jpeg" alt="icon" className="h-6 w-6 object-contain" /> 
                <div>
                  <h3 className="text-xl font-semibold">Plant Disease Detection</h3>
                  <p className="text-gray-600">Upload plant images and let our AI model analyze them for potential diseases. Get treatment recommendations and expert resources to manage plant health effectively.</p>
                  <p className="mt-4 text-gray-700"><strong>Model Used:</strong> MobileNet</p>
                  <p className="mt-2 text-gray-700"><strong>Supported Crops and Diseases:</strong></p>
                  <ul className="list-disc list-inside text-gray-600">
                    <li><strong>Pepper Bell:</strong>
                      <ul className="ml-4 list-circle">
                        <li>Bacterial Spot</li>
                        <li>Healthy</li>
                      </ul>
                    </li>
                    <li><strong>Potato:</strong>
                      <ul className="ml-4 list-circle">
                        <li>Early Blight</li>
                        <li>Late Blight</li>
                        <li>Healthy</li>
                      </ul>
                    </li>
                    <li><strong>Tomato:</strong>
                      <ul className="ml-4 list-circle">
                        <li>Bacterial Spot</li>
                        <li>Early Blight</li>
                        <li>Late Blight</li>
                        <li>Leaf Mold</li>
                        <li>Septoria Leaf Spot</li>
                        <li>Spider Mites (Two-Spotted Spider Mite)</li>
                        <li>Target Spot</li>
                        <li>Yellow Leaf Curl Virus</li>
                        <li>Mosaic Virus</li>
                        <li>Healthy</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border rounded-lg p-6 bg-white">
          <CardContent>
            <div className="flex items-start gap-4">
              <CloudRain className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="text-xl font-semibold">Smart Irrigation Scheduling</h3>
                <p className="text-gray-600">Optimize water usage based on weather conditions and soil moisture levels. This system provides general irrigation recommendations and does not suggest crops based on specific plant types.</p>
                <p className="mt-4 text-gray-700"><strong>Model Used:</strong> Logistic Regression</p>
                <p className="mt-2 text-gray-700">This model predicts irrigation needs based on soil moisture and weather forecast, ensuring efficient water management.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
