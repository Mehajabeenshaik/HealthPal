import React, { useState, useEffect } from "react";
import { HealthLog } from "@/entities/HealthLog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isToday } from "date-fns";
import { Calendar as CalendarIcon, Heart, Save, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import LogForm from "../components/health/LogForm";
import HealthTrends from "../components/health/HealthTrends";

export default function HealthLogger() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [logData, setLogData] = useState({
    mood_score: "",
    sleep_hours: "",
    water_glasses: "",
    exercise_minutes: "",
    notes: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [existingLog, setExistingLog] = useState(null);
  const [healthLogs, setHealthLogs] = useState([]);

  useEffect(() => {
    loadHealthLogs();
  }, []);

  useEffect(() => {
    checkExistingLog();
  }, [selectedDate, healthLogs]);

  const loadHealthLogs = async () => {
    try {
      const logs = await HealthLog.list("-date", 30);
      setHealthLogs(logs);
    } catch (error) {
      console.error("Error loading health logs:", error);
    }
  };

  const checkExistingLog = () => {
    const dateString = format(selectedDate, 'yyyy-MM-dd');
    const existing = healthLogs.find(log => log.date === dateString);
    
    if (existing) {
      setExistingLog(existing);
      setLogData({
        mood_score: existing.mood_score?.toString() || "",
        sleep_hours: existing.sleep_hours?.toString() || "",
        water_glasses: existing.water_glasses?.toString() || "",
        exercise_minutes: existing.exercise_minutes?.toString() || "",
        notes: existing.notes || ""
      });
    } else {
      setExistingLog(null);
      setLogData({
        mood_score: "",
        sleep_hours: "",
        water_glasses: "",
        exercise_minutes: "",
        notes: ""
      });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const formData = {
        date: format(selectedDate, 'yyyy-MM-dd'),
        mood_score: logData.mood_score ? parseFloat(logData.mood_score) : null,
        sleep_hours: logData.sleep_hours ? parseFloat(logData.sleep_hours) : null,
        water_glasses: logData.water_glasses ? parseInt(logData.water_glasses) : null,
        exercise_minutes: logData.exercise_minutes ? parseInt(logData.exercise_minutes) : null,
        notes: logData.notes || null
      };

      // Remove null values
      Object.keys(formData).forEach(key => {
        if (formData[key] === null || formData[key] === "") {
          delete formData[key];
        }
      });

      if (existingLog) {
        await HealthLog.update(existingLog.id, formData);
        toast.success("Health log updated successfully!");
      } else {
        await HealthLog.create(formData);
        toast.success("Health log saved successfully!");
      }

      await loadHealthLogs();
    } catch (error) {
      console.error("Error saving health log:", error);
      toast.error("Error saving health log. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Health Logger
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Track your daily health metrics to understand patterns and improve your wellbeing over time.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Logging Form */}
          <div className="lg:col-span-2">
            <LogForm
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              logData={logData}
              setLogData={setLogData}
              existingLog={existingLog}
              isLoading={isLoading}
              onSave={handleSave}
            />
          </div>

          {/* Health Trends Sidebar */}
          <div className="space-y-6">
            <HealthTrends healthLogs={healthLogs} />
          </div>
        </div>
      </div>
    </div>
  );
}
