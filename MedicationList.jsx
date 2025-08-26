import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Pill, Clock, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function MedicationList({ medications, isLoading }) {
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

  if (medications.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <Pill className="w-12 h-12 mx-auto mb-4 text-slate-400" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Medications Added</h3>
          <p className="text-slate-600">Add your first medication to get started with reminders.</p>
        </CardContent>
      </Card>
    );
  }

  const getFrequencyText = (frequency) => {
    const frequencyMap = {
      'once_daily': 'Once daily',
      'twice_daily': 'Twice daily', 
      'three_times_daily': 'Three times daily',
      'as_needed': 'As needed'
    };
    return frequencyMap[frequency] || frequency;
  };

  return (
    <div className="space-y-4">
      {medications.map((med) => (
        <Card key={med.id} className="shadow-lg bg-white/90 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Pill className="w-6 h-6 text-blue-600" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">{med.name}</h3>
                <p className="text-slate-600 mb-2">{med.dosage}</p>
                
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {getFrequencyText(med.frequency)}
                  </div>
                  {med.time_of_day && med.time_of_day.length > 0 && (
                    <div className="flex items-center gap-1">
                      <span>at {med.time_of_day.join(', ')}</span>
                    </div>
                  )}
                </div>

                {med.start_date && (
                  <div className="flex items-center gap-1 text-sm text-slate-500 mt-1">
                    <Calendar className="w-4 h-4" />
                    Started {format(new Date(med.start_date), 'MMM d, yyyy')}
                    {med.end_date && ` - ends ${format(new Date(med.end_date), 'MMM d, yyyy')}`}
                  </div>
                )}

                {med.notes && (
                  <p className="text-sm text-slate-600 mt-2 italic">{med.notes}</p>
                )}
              </div>

              <Badge variant="outline" className="bg-green-50 text-green-700">
                Active
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}