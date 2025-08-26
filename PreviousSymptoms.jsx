import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Activity } from "lucide-react";
import { format } from "date-fns";

export default function PreviousSymptoms({ symptoms }) {
  if (symptoms.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="w-5 h-5 text-slate-600" />
            Previous Symptoms
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-slate-500">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No previous symptoms recorded</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-slate-600" />
          Previous Symptoms
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {symptoms.slice(0, 5).map((symptom, index) => (
            <div key={symptom.id} className="p-3 bg-slate-50 rounded-lg">
              <p className="text-sm font-medium text-slate-900 mb-1 truncate">
                {symptom.symptoms_description.slice(0, 60)}...
              </p>
              <div className="flex items-center justify-between">
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    symptom.severity === 'severe' ? 'border-red-300 text-red-700' :
                    symptom.severity === 'moderate' ? 'border-orange-300 text-orange-700' :
                    'border-green-300 text-green-700'
                  }`}
                >
                  {symptom.severity}
                </Badge>
                <span className="text-xs text-slate-500">
                  {format(new Date(symptom.created_date), 'MMM d')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}