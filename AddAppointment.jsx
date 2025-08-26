import React, { useState } from "react";
import { Appointment } from "@/entities/Appointment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AddAppointment({ onCancel, onSave }) {
  const [formData, setFormData] = useState({
    doctor_name: "",
    appointment_type: "",
    date: new Date(),
    time: "",
    location: "",
    notes: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.doctor_name || !formData.date || !formData.time) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        date: format(formData.date, 'yyyy-MM-dd')
      };

      await Appointment.create(submitData);
      toast.success("Appointment added successfully!");
      onSave();
    } catch (error) {
      console.error("Error adding appointment:", error);
      toast.error("Error adding appointment. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <Card className="shadow-xl bg-white/90 backdrop-blur-sm border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <CalendarIcon className="w-4 h-4 text-white" />
          </div>
          Add New Appointment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="doctor">Doctor/Provider Name *</Label>
            <Input
              id="doctor"
              placeholder="Dr. Smith, ABC Clinic"
              value={formData.doctor_name}
              onChange={(e) => handleInputChange('doctor_name', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Appointment Type</Label>
            <Select value={formData.appointment_type} onValueChange={(value) => handleInputChange('appointment_type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general_checkup">General Checkup</SelectItem>
                <SelectItem value="specialist">Specialist Visit</SelectItem>
                <SelectItem value="lab_work">Lab Work</SelectItem>
                <SelectItem value="follow_up">Follow-up</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Appointment Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  {format(formData.date, 'MMM d, yyyy')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={(date) => handleInputChange('date', date)}
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Time *</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="123 Medical Center Dr, City, State"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            placeholder="Any special notes or preparation needed..."
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !formData.doctor_name || !formData.date || !formData.time}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Add Appointment
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