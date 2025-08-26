import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar, Clock, MapPin, User } from "lucide-react";
import { format, isToday, isTomorrow, isPast } from "date-fns";

export default function AppointmentList({ appointments, isLoading }) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(0).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Appointments Scheduled</h3>
          <p className="text-slate-600">Add your first appointment to keep track of your healthcare schedule.</p>
        </CardContent>
      </Card>
    );
  }

  const getAppointmentTypeColor = (type) => {
    const colorMap = {
      'general_checkup': 'bg-blue-100 text-blue-800',
      'specialist': 'bg-purple-100 text-purple-800',
      'lab_work': 'bg-green-100 text-green-800',
      'follow_up': 'bg-orange-100 text-orange-800',
      'emergency': 'bg-red-100 text-red-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colorMap[type] || colorMap['other'];
  };

  const getDateBadge = (date) => {
    const appointmentDate = new Date(date);
    if (isPast(appointmentDate) && !isToday(appointmentDate)) {
      return { text: 'Past', className: 'bg-gray-100 text-gray-600' };
    }
    if (isToday(appointmentDate)) {
      return { text: 'Today', className: 'bg-red-100 text-red-700' };
    }
    if (isTomorrow(appointmentDate)) {
      return { text: 'Tomorrow', className: 'bg-orange-100 text-orange-700' };
    }
    return { text: 'Upcoming', className: 'bg-green-100 text-green-700' };
  };

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => {
        const dateBadge = getDateBadge(appointment.date);
        
        return (
          <Card key={appointment.id} className="shadow-lg bg-white/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">{appointment.doctor_name}</h3>
                    <Badge className={dateBadge.className}>
                      {dateBadge.text}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Badge className={`${getAppointmentTypeColor(appointment.appointment_type)} text-sm`}>
                      {appointment.appointment_type.replace('_', ' ')}
                    </Badge>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(appointment.date), 'EEEE, MMM d, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {appointment.time}
                      </div>
                    </div>

                    {appointment.location && (
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        {appointment.location}
                      </div>
                    )}

                    {appointment.notes && (
                      <p className="text-sm text-slate-600 mt-2 italic bg-slate-50 p-2 rounded">
                        {appointment.notes}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}