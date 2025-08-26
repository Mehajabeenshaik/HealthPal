import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Activity, Brain, Loader2 } from "lucide-react";

export default function SymptomForm({ 
  symptoms, 
  setSymptomsDescription, 
  severity, 
  setSeverity, 
  duration, 
  setDuration, 
  isAnalyzing, 
  onAnalyze, 
  onClear 
}) {
  return (
    <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Activity className="w-4 h-4 text-white" />
          </div>
          Describe Your Symptoms
        </CardTitle>
        <p className="text-slate-600">
          Be as detailed as possible about how you're feeling. Include location, intensity, and any triggers.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Symptoms Description */}
        <div className="space-y-2">
          <Label htmlFor="symptoms" className="text-base font-medium">
            What symptoms are you experiencing?
          </Label>
          <Textarea
            id="symptoms"
            placeholder="Describe your symptoms in detail... For example: 'I have a throbbing headache on the right side of my head, along with nausea and sensitivity to light. It started this morning after I woke up.'"
            value={symptoms}
            onChange={(e) => setSymptomsDescription(e.target.value)}
            className="min-h-[120px] resize-none focus:ring-2 focus:ring-blue-500"
            disabled={isAnalyzing}
          />
        </div>

        {/* Severity and Duration */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-base font-medium">How severe are your symptoms?</Label>
            <Select value={severity} onValueChange={setSeverity} disabled={isAnalyzing}>
              <SelectTrigger>
                <SelectValue placeholder="Select severity level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mild">Mild - Noticeable but not limiting daily activities</SelectItem>
                <SelectItem value="moderate">Moderate - Somewhat limiting daily activities</SelectItem>
                <SelectItem value="severe">Severe - Significantly limiting daily activities</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">How long have you had these symptoms?</Label>
            <Select value={duration} onValueChange={setDuration} disabled={isAnalyzing}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="less_than_day">Less than a day</SelectItem>
                <SelectItem value="1-3_days">1-3 days</SelectItem>
                <SelectItem value="4-7_days">4-7 days</SelectItem>
                <SelectItem value="1-2_weeks">1-2 weeks</SelectItem>
                <SelectItem value="2-4_weeks">2-4 weeks</SelectItem>
                <SelectItem value="more_than_month">More than a month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={onAnalyze}
            disabled={!symptoms.trim() || isAnalyzing}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 h-12 text-base font-medium shadow-lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing Symptoms...
              </>
            ) : (
              <>
                <Brain className="w-5 h-5 mr-2" />
                Analyze Symptoms
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            onClick={onClear}
            disabled={isAnalyzing}
            className="px-6 h-12"
          >
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}