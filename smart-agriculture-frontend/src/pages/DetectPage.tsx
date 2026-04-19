"use client";

import React, { useState, useRef } from "react";
import { Upload, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { API_BASE } from "../config.ts";

const DetectPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ disease: string; confidence: number; cause: string; symptoms: string;  treatment: string, healthy: string; } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);

    try {
      const base64Data = selectedImage.split(",")[1];
      const response = await fetch(`${API_BASE}/predict/plant`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: `data:image/jpeg;base64,${base64Data}` }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        console.error("API Error:", data.error);
        setResult(null);
      }
    } catch (error) {
      console.error("Request failed:", error);
      setResult(null);
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="flex-1 py-12 bg-background flex flex-col items-center">
      <div className="container px-4 md:px-6 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-3">Disease Detection</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Upload an image of your plant's leaves, and our AI will quickly identify any diseases and provide treatment advice.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 items-start">
          {/* Upload Card */}
          <Card className="shadow-sm border-border">
            <CardHeader className="bg-muted/30 pb-6">
              <CardTitle className="text-xl">Upload Image</CardTitle>
              <CardDescription>Select a clear photo of the affected plant area</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageChange} />

              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file) {
                    handleImageChange({ target: { files: [file] } } as unknown as React.ChangeEvent<HTMLInputElement>);
                  }
                }}
                className={`cursor-pointer border-2 border-dashed rounded-xl p-10 text-center transition-all ${
                  isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                <div className="mx-auto h-16 w-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Click or drag image here</h3>
                <p className="text-sm text-muted-foreground">Supports JPG, PNG (Max 5MB)</p>
              </div>

              {selectedImage && (
                <div className="mt-6 relative rounded-xl overflow-hidden border border-border shadow-sm max-h-[300px] flex justify-center bg-black/5">
                  <img src={selectedImage} alt="Selected Plant" className="object-contain w-full h-full max-h-[300px]" />
                </div>
              )}
            </CardContent>
            <CardFooter className="bg-muted/30 pt-6">
              <Button 
                onClick={analyzeImage} 
                disabled={isAnalyzing || !selectedImage} 
                className="w-full h-12 text-md font-semibold"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                    Analyzing Image...
                  </>
                ) : (
                  "Analyze Plant"
                )}
              </Button>
            </CardFooter>
          </Card>

          {/* Results Card */}
          <Card className="shadow-sm border-border h-full flex flex-col">
            <CardHeader className="bg-muted/30 pb-6">
              <CardTitle className="text-xl flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-primary" />
                Analysis Results
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 flex-1 flex flex-col">
              {!result && !isAnalyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 opacity-60">
                  <Info className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium text-foreground">Waiting for image</p>
                  <p className="text-sm text-muted-foreground">Upload an image to see the analysis results here.</p>
                </div>
              ) : isAnalyzing ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8">
                  <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                  <p className="text-lg font-medium text-foreground animate-pulse">Our AI is examining the plant...</p>
                </div>
              ) : result ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Status Banner */}
                  <div className={`p-4 rounded-lg flex items-start gap-3 ${result.healthy ? 'bg-green-500/10 border border-green-500/20' : 'bg-destructive/10 border border-destructive/20'}`}>
                    {result.healthy ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5 shrink-0" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-destructive mt-0.5 shrink-0" />
                    )}
                    <div>
                      <h3 className={`text-xl font-bold ${result.healthy ? 'text-green-700 dark:text-green-500' : 'text-destructive'}`}>
                        {result.disease}
                      </h3>
                      {result.healthy && <p className="text-sm text-green-600 mt-1">{result.healthy}</p>}
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5 text-sm">
                      <span className="font-medium text-foreground">AI Confidence</span>
                      <span className="font-bold text-primary">{result.confidence.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-secondary h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${result.confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid gap-4 mt-6">
                    {result.cause && (
                      <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                        <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                          Possible Cause
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{result.cause}</p>
                      </div>
                    )}

                    {result.symptoms && (
                      <div className="bg-muted/50 p-4 rounded-lg border border-border/50">
                        <h4 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                          Symptoms to Look For
                        </h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">{result.symptoms}</p>
                      </div>
                    )}

                    {result.treatment && (
                      <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                        <h4 className="font-semibold text-primary mb-1 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                          Recommended Treatment
                        </h4>
                        <p className="text-sm text-foreground leading-relaxed">{result.treatment}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DetectPage;