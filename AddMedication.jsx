import React, { useState } from "react";
import { Medication } from "@/entities/Medication";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Pill, Save, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AddMedication({ onCancel, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "",
    time_of_day: [],
    start_date: new Date(),
    end_date: null,
    notes: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTimeAdd = (time) => {
    if (time && !formData.time_of_day.includes(time)) {
      setFormData(prev => ({
        ...prev,
        time_of_day: [...prev.time_of_day, time].sort()
      }));
    }
  };

  const removeTime = (timeToRemove) => {
    setFormData(prev => ({
      ...prev,
      time_of_day: prev.time_of_day.filter(time => time !== timeToRemove)
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.dosage || !formData.frequency) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        start_date: format(formData.start_date, 'yyyy-MM-dd'),
        end_date: formData.end_date ? format(formData.end_date, 'yyyy-MM-dd') : null
      };

      await Medication.create(submitData);
      toast.success("Medication added successfully!");
      onSave();
    } catch (error) {
      console.error("Error adding medication:", error);
      toast.error("Error adding medication. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Pill className="w-4 h-4 text-white" />
          </div>
          Add New Medication
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Medication Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Aspirin, Lisinopril"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="dosage">Dosage *</Label>
            <Input
              id="dosage"
              placeholder="e.g., 10mg, 1 tablet"
              value={formData.dosage}
              onChange={(e) => handleInputChange('dosage', e.target.value)}
            />
          </div>
        </div>

        {/* Frequency */}
        <div className="space-y-2">
          <Label>Frequency *</Label>
          <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
            <SelectTrigger>
              <SelectValue placeholder="How often?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="once_daily">Once daily</SelectItem>
              <SelectItem value="twice_daily">Twice daily</SelectItem>
              <SelectItem value="three_times_daily">Three times daily</SelectItem>
              <SelectItem value="as_needed">As needed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Times */}
        <div className="space-y-2">
          <Label>Times of Day</Label>
          <div className="flex gap-2">
            <Input
              type="time"
              onChange={(e) => e.target.value && handleTimeAdd(e.target.value)}
              className="w-32"
            />
          </div>
          {formData.time_of_day.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.time_of_day.map((time, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1">
                  {time}
                  <button onClick={() => removeTime(time)} className="text-blue-600 hover:text-blue-800">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {format(formData.start_date, 'MMM d, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.start_date}
                  onSelect={(date) => handleInputChange('start_date', date)}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>End Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {formData.end_date ? format(formData.end_date, 'MMM d, yyyy') : 'No end date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.end_date}
                  onSelect={(date) => handleInputChange('end_date', date)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Any special instructions or notes..."
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !formData.name || !formData.dosage || !formData.frequency}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Add Medication
              </>
            )}
          </Button>
          
          <Button variant="outline" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}