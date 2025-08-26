import React, { useState, useEffect, useMemo } from "react";
import { HealthLog } from "../entities/HealthLog";
import { Medication } from "../entities/Medication";
import { Appointment } from "../entities/Appointment";

import QuickActions from "../components/dashboard/QuickActions";
import HealthMetrics from "../components/dashboard/HealthMetrics";
import UpcomingReminders from "../components/dashboard/UpcomingReminders";
import RecentActivity from "../components/dashboard/RecentActivity";

import { subDays, isToday } from "date-fns";

export default function Dashboard() {
  const [healthLogs, setHealthLogs] = useState([]);
  const [medications, setMedications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load all dashboard data
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [logsData, medsData, appsData] = await Promise.all([
          HealthLog.list("-date", 30),
          Medication.list("-created_date", 10),
          Appointment.list("date", 5),
        ]);

        setHealthLogs(logsData);
        setMedications(medsData);
        setAppointments(appsData);
      } catch (err) {
        console.error("Error loading dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
      }
      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  // Memoized today's log
  const todaysLog = useMemo(() => {
    return healthLogs.find(log => isToday(new Date(log.date)));
  }, [healthLogs]);

  // Memoized weekly average
  const getWeeklyAverage = metric => {
    const lastWeekLogs = healthLogs.filter(
      log => new Date(log.date) >= subDays(new Date(), 7) && log[metric] !== undefined
    );

    if (lastWeekLogs.length === 0) return 0;

    const sum = lastWeekLogs.reduce((total, log) => total + (log[metric] || 0), 0);
    return Math.round((sum / lastWeekLogs.length) * 10) / 10;
  };

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Morning";
    if (hour < 18) return "Afternoon";
    return "Evening";
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              Good {greeting}!
            </h1>
            <p className="text-slate-600 text-lg">
              {isLoading
                ? "Loading your dashboard..."
                : todaysLog
                ? "You've logged your health today. Keep it up!"
                : "Ready to track your health today?"}
            </p>
          </div>
          <QuickActions isLoading={isLoading} />
        </div>

        {/* Health Metrics */}
        {isLoading ? (
          <div className="h-40 bg-gray-200 animate-pulse rounded-lg"></div>
        ) : (
          <HealthMetrics
            healthLogs={healthLogs}
            todaysLog={todaysLog}
            weeklyAverages={{
              mood: getWeeklyAverage("mood_score"),
              sleep: getWeeklyAverage("sleep_hours"),
              water: getWeeklyAverage("water_glasses"),
              exercise: getWeeklyAverage("exercise_minutes"),
            }}
          />
        )}

        {/* Main Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="h-20 bg-gray-200 animate-pulse rounded-lg"></div>
              </div>
            ) : (
              <RecentActivity healthLogs={healthLogs} />
            )}
          </div>

          <div className="space-y-8">
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="h-24 bg-gray-200 animate-pulse rounded-lg"></div>
              </div>
            ) : (
              <UpcomingReminders
                medications={medications}
                appointments={appointments}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
