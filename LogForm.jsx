import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, isToday } from "date-fns";
import { Calendar as CalendarIcon, Heart, Save, Loader2 } from "lucide-react";

export default function LogForm({ 
  selectedDate, 
  setSelectedDate, 
  logData, 
  setLogData, 
  existingLog, 
  isLoading, 
  onSave 
}) {
  const handleInputChange = (field, value) => {
    setLogData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormValid = () => {
    return Object.values(logData).some(value => value !== "");
  };

  return (
    <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            Health Log Entry
          </div>
          
          {/* Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2">
                <CalendarIcon className="w-4 h-4" />
                {format(selectedDate, 'MMM d, yyyy')}
                {isToday(selectedDate) && (
                  <span className="text-green-600 font-medium">Today</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardTitle>
        
        {existingLog && (
          <p className="text-green-600 text-sm">
            Editing existing log entry for this date
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        
        {/* Mood Score */}
        <div className="space-y-2">
          <Label htmlFor="mood" className="text-base font-medium">
            Mood Score (1-10)
          </Label>
          <Input
            id="mood"
            type="number"
            min="1"
            max="10"
            placeholder="How would you rate your mood today?"
            value={logData.mood_score}
            onChange={(e) => handleInputChange('mood_score', e.target.value)}
            className="focus:ring-2 focus:ring-green-500"
          />
          <p className="text-sm text-slate-500">1 = Very low, 10 = Excellent</p>
        </div>

        {/* Sleep Hours */}
        <div className="space-y-2">
          <Label htmlFor="sleep" className="text-base font-medium">
            Sleep Hours
          </Label>
          <Input
            id="sleep"
            type="number"
            min="0"
            max="24"
            step="0.5"
            placeholder="How many hours did you sleep?"
            value={logData.sleep_hours}
            onChange={(e) => handleInputChange('sleep_hours', e.target.value)}
            className="focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Water Intake */}
        <div className="space-y-2">
          <Label htmlFor="water" className="text-base font-medium">
            Water Intake (glasses)
          </Label>
          <Input
            id="water"
            type="number"
            min="0"
            placeholder="How many glasses of water did you drink?"
            value={logData.water_glasses}
            onChange={(e) => handleInputChange('water_glasses', e.target.value)}
            className="focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Exercise Minutes */}
        <div className="space-y-2">
          <Label htmlFor="exercise" className="text-base font-medium">
            Exercise (minutes)
          </Label>
          <Input
            id="exercise"
            type="number"
            min="0"
            placeholder="How many minutes of exercise did you do?"
            value={logData.exercise_minutes}
            onChange={(e) => handleInputChange('exercise_minutes', e.target.value)}
            className="focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-base font-medium">
            Additional Notes
          </Label>
          <Textarea
            id="notes"
            placeholder="Any additional notes about your health today..."
            value={logData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            className="min-h-[100px] focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Save Button */}
        <Button
          onClick={onSave}
          disabled={!isFormValid() || isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 h-12 text-base font-medium shadow-lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" />
              {existingLog ? 'Update Log' : 'Save Log'}
            </>
          )}
        </Button>

      </CardContent>
    </Card>
  );
}