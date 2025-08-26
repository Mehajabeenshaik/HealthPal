import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Pill, Clock } from "lucide-react";
import { format, isToday, isTomorrow } from "date-fns";

export default function UpcomingReminders({ medications, appointments, isLoading }) {
  const getUpcomingMeds = () => {
    // Simple logic - show all current medications
    return medications.slice(0, 3);
  };

  const getUpcomingAppointments = () => {
    // Filter for future appointments
    return appointments.filter(apt => new Date(apt.date) >= new Date()).slice(0, 3);
  };

  if (isLoading) {
    return (
      <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1">
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          Upcoming Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Medications */}
        {getUpcomingMeds().map((med, index) => (
          <div key={med.id} className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Pill className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">{med.name}</p>
              <p className="text-sm text-slate-600">{med.dosage} - {med.frequency.replace('_', ' ')}</p>
            </div>
          </div>
        ))}

        {/* Appointments */}
        {getUpcomingAppointments().map((apt, index) => (
          <div key={apt.id} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-slate-900">{apt.doctor_name}</p>
              <p className="text-sm text-slate-600">
                {format(new Date(apt.date), 'MMM d')} at {apt.time}
              </p>
            </div>
            <Badge variant="outline" className="text-xs">
              {isToday(new Date(apt.date)) ? 'Today' : 
               isTomorrow(new Date(apt.date)) ? 'Tomorrow' : 
               format(new Date(apt.date), 'MMM d')}
            </Badge>
          </div>
        ))}

        {getUpcomingMeds().length === 0 && getUpcomingAppointments().length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No upcoming reminders</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}