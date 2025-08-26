import React, { useState, useEffect } from "react";
import { Medication, Appointment } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Pill } from "lucide-react";

import MedicationList from "../components/reminders/MedicationList";
import AppointmentList from "../components/reminders/AppointmentList";
import AddMedication from "../components/reminders/AddMedication";
import AddAppointment from "../components/reminders/AddAppointment";

export default function Reminders() {
  const [medications, setMedications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddMed, setShowAddMed] = useState(false);
  const [showAddAppt, setShowAddAppt] = useState(false);

  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    setIsLoading(true);
    try {
      const [medsData, apptsData] = await Promise.all([
        Medication.list("-created_date"),
        Appointment.list("date")
      ]);
      setMedications(medsData);
      setAppointments(apptsData);
    } catch (error) {
      console.error("Error loading reminders:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Health Reminders
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Never miss a medication dose or medical appointment. Set up smart reminders to stay on top of your health routine.
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="medications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-96 mx-auto">
            <TabsTrigger value="medications" className="flex items-center gap-2">
              <Pill className="w-4 h-4" />
              Medications
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Appointments
            </TabsTrigger>
          </TabsList>

          <TabsContent value="medications" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Medication Reminders</h2>
              <Button 
                onClick={() => setShowAddMed(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Medication
              </Button>
            </div>

            {showAddMed && (
              <AddMedication
                onCancel={() => setShowAddMed(false)}
                onSave={() => {
                  setShowAddMed(false);
                  loadReminders();
                }}
              />
            )}

            <MedicationList medications={medications} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Upcoming Appointments</h2>
              <Button 
                onClick={() => setShowAddAppt(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Appointment
              </Button>
            </div>

            {showAddAppt && (
              <AddAppointment
                onCancel={() => setShowAddAppt(false)}
                onSave={() => {
                  setShowAddAppt(false);
                  loadReminders();
                }}
              />
            )}

            <AppointmentList appointments={appointments} isLoading={isLoading} />
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}