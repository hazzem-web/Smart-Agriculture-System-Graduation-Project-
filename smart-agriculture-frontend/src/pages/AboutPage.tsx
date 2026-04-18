import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CloudRain, Info, TreesIcon as Plant } from "lucide-react";

const AboutPage: React.FC = () => {
  return (
    <div className="flex-1 py-12 bg-background flex flex-col items-center">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto space-y-8">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl mb-4">About Nabatat</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Empowering agriculture through artificial intelligence and data-driven insights.
          </p>
        </div>

        <Card className="shadow-sm border-border overflow-hidden">
          <CardHeader className="bg-primary/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Info className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold">Our Mission</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <CardDescription className="text-foreground text-lg leading-relaxed">
              Nabatat is an AI-powered platform designed to assist farmers with smart plant disease detection and efficient irrigation scheduling. Our goal is to enhance agricultural productivity through technology-driven insights, ensuring better crop yields and sustainable water management.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border overflow-hidden">
          <CardHeader className="bg-green-500/5 pb-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Plant className="h-6 w-6 text-green-600 dark:text-green-500" />
              </div>
              <CardTitle className="text-2xl font-bold">Plant Disease Detection</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Upload plant images and let our AI model analyze them for potential diseases. Get treatment recommendations and expert resources to manage plant health effectively.
              </p>

              <div className="bg-muted/50 p-4 rounded-lg border border-border inline-block">
                <p className="text-foreground"><strong className="text-primary">Model Used:</strong> MobileNet</p>
              </div>

              <div>
                <h4 className="text-lg font-semibold mb-4 text-foreground border-b pb-2">Supported Crops and Diseases</h4>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Pepper Bell */}
                  <div className="bg-card border rounded-lg p-4 shadow-sm">
                    <h5 className="font-bold text-lg mb-2 text-primary">Pepper Bell</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>Bacterial Spot</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Healthy</li>
                    </ul>
                  </div>

                  {/* Potato */}
                  <div className="bg-card border rounded-lg p-4 shadow-sm">
                    <h5 className="font-bold text-lg mb-2 text-primary">Potato</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>Early Blight</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>Late Blight</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Healthy</li>
                    </ul>
                  </div>

                  {/* Tomato */}
                  <div className="bg-card border rounded-lg p-4 shadow-sm sm:col-span-2 md:col-span-1">
                    <h5 className="font-bold text-lg mb-2 text-primary">Tomato</h5>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>Bacterial Spot</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>Early Blight</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>Late Blight</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>Leaf Mold</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>Septoria Leaf Spot</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>Spider Mites</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>Target Spot</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>Yellow Leaf Curl Virus</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-destructive"></span>Mosaic Virus</li>
                      <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>Healthy</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-border overflow-hidden">
          <CardHeader className="bg-blue-500/5 pb-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <CloudRain className="h-6 w-6 text-blue-600 dark:text-blue-500" />
              </div>
              <CardTitle className="text-2xl font-bold">Smart Irrigation Scheduling</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-muted-foreground text-lg leading-relaxed">
                Optimize water usage based on weather conditions and soil moisture levels. This system provides general irrigation recommendations and does not suggest crops based on specific plant types.
              </p>
              <div className="bg-muted/50 p-4 rounded-lg border border-border inline-block">
                <p className="text-foreground"><strong className="text-blue-600 dark:text-blue-500">Model Used:</strong> Logistic Regression</p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                This model predicts irrigation needs based on soil moisture and weather forecast, ensuring efficient water management.
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default AboutPage;
