import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  AlertTriangle, 
  Lightbulb, 
  Stethoscope,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";

export default function AnalysisResult({ analysis }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mt-8 space-y-6"
    >
      
      {/* Urgent Care Alert */}
      {analysis.seek_immediate_care && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-800 font-medium">
            Based on your symptoms, you should seek immediate medical attention. 
            Please contact emergency services or visit the nearest emergency room.
          </AlertDescription>
        </Alert>
      )}

      {/* Main Analysis Card */}
      <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            AI Analysis Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Possible Conditions */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Stethoscope className="w-5 h-5 text-blue-600" />
              Possible Conditions
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysis.possible_conditions?.map((condition, index) => (
                <Badge 
                  key={index}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 px-3 py-1"
                >
                  {condition}
                </Badge>
              ))}
            </div>
          </div>

          {/* Analysis */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Detailed Analysis</h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                {analysis.analysis}
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              Recommendations
            </h3>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-yellow-800 leading-relaxed whitespace-pre-line">
                {analysis.recommendations}
              </p>
            </div>
          </div>

          {/* General Advice */}
          {analysis.general_advice && (
            <div>
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                General Advice
              </h3>
              <div className="bg-green-50 border-l-4 border-green-400 p-4">
                <p className="text-green-800 leading-relaxed whitespace-pre-line">
                  {analysis.general_advice}
                </p>
              </div>
            </div>
          )}

        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <p className="text-amber-800 text-sm leading-relaxed">
            <strong>Medical Disclaimer:</strong> This AI analysis is for informational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers with any questions you may have regarding a medical condition.
          </p>
        </CardContent>
      </Card>
      
    </motion.div>
  );
}
