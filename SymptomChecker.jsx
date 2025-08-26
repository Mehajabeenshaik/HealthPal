import React, { useState } from "react";
import { Symptom } from "@/entities/Symptom";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Activity, 
  AlertTriangle, 
  Brain, 
  Loader2, 
  Stethoscope,
  Heart,
  Clock,
  TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import SymptomForm from "../components/symptom/SymptomForm";
import AnalysisResult from "../components/symptom/AnalysisResult";
import PreviousSymptoms from "../components/symptom/PreviousSymptoms";

export default function SymptomChecker() {
  const [symptoms, setSymptomsDescription] = useState("");
  const [severity, setSeverity] = useState("");
  const [duration, setDuration] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [previousSymptoms, setPreviousSymptoms] = useState([]);

  React.useEffect(() => {
    loadPreviousSymptoms();
  }, []);

  const loadPreviousSymptoms = async () => {
    try {
      const data = await Symptom.list("-created_date", 10);
      setPreviousSymptoms(data);
    } catch (error) {
      console.error("Error loading previous symptoms:", error);
    }
  };

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const prompt = `As a medical AI assistant, analyze these symptoms and provide helpful information. 

User's symptoms: "${symptoms}"
Severity: ${severity}
Duration: ${duration}

Provide a structured analysis that includes:
1. Possible conditions (list 3-5 most likely conditions)
2. Recommendations for next steps
3. When to seek immediate medical attention
4. General advice

Format your response to be helpful but emphasize that this is not a substitute for professional medical advice.`;

      const result = await InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            possible_conditions: {
              type: "array",
              items: { type: "string" }
            },
            analysis: { type: "string" },
            recommendations: { type: "string" },
            seek_immediate_care: { type: "boolean" },
            general_advice: { type: "string" }
          }
        }
      });

      // Save to database
      const symptomRecord = await Symptom.create({
        symptoms_description: symptoms,
        severity: severity,
        duration: duration,
        ai_analysis: result.analysis,
        possible_conditions: result.possible_conditions,
        recommendation: result.recommendations
      });

      setAnalysis({
        ...result,
        id: symptomRecord.id
      });

      loadPreviousSymptoms();
    } catch (error) {
      console.error("Error analyzing symptoms:", error);
    }
    setIsAnalyzing(false);
  };

  const clearForm = () => {
    setSymptomsDescription("");
    setSeverity("");
    setDuration("");
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Stethoscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            AI Symptom Checker
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Describe your symptoms and get AI-powered insights. Remember, this tool is for informational purposes and doesn't replace professional medical advice.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Symptom Form */}
          <div className="lg:col-span-2">
            <SymptomForm
              symptoms={symptoms}
              setSymptomsDescription={setSymptomsDescription}
              severity={severity}
              setSeverity={setSeverity}
              duration={duration}
              setDuration={setDuration}
              isAnalyzing={isAnalyzing}
              onAnalyze={analyzeSymptoms}
              onClear={clearForm}
            />

            {/* Analysis Results */}
            <AnimatePresence mode="wait">
              {analysis && (
                <AnalysisResult analysis={analysis} />
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Important Notice */}
            <Card className="border-amber-200 bg-amber-50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <CardTitle className="text-amber-900 text-lg">Important Notice</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-amber-800 text-sm leading-relaxed">
                  This AI tool provides general information only. Always consult healthcare professionals for proper diagnosis and treatment.
                </p>
              </CardContent>
            </Card>

            {/* Emergency Situations */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  <CardTitle className="text-red-900 text-lg">Seek Immediate Help</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="text-red-800 text-sm space-y-2">
                  <li>• Chest pain or difficulty breathing</li>
                  <li>• Severe allergic reactions</li>
                  <li>• Loss of consciousness</li>
                  <li>• Severe bleeding or trauma</li>
                  <li>• Signs of stroke or heart attack</li>
                </ul>
                <Button className="w-full mt-4 bg-red-600 hover:bg-red-700">
                  Call Emergency Services
                </Button>
              </CardContent>
            </Card>

            {/* Previous Symptoms */}
            <PreviousSymptoms symptoms={previousSymptoms} />
            
          </div>
        </div>
      </div>
    </div>
  );
}