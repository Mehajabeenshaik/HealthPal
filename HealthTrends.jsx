import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Smile, Moon, Droplets, Heart } from "lucide-react";
import { subDays, format } from "date-fns";

export default function HealthTrends({ healthLogs }) {
  const getLastWeekAverage = (metric) => {
    const lastWeekLogs = healthLogs
      .filter(log => new Date(log.date) >= subDays(new Date(), 7))
      .filter(log => log[metric] !== undefined && log[metric] !== null);
    
    if (lastWeekLogs.length === 0) return 0;
    
    const sum = lastWeekLogs.reduce((total, log) => total + log[metric], 0);
    return Math.round((sum / lastWeekLogs.length) * 10) / 10;
  };

  const getLastMonthAverage = (metric) => {
    const lastMonthLogs = healthLogs
      .filter(log => new Date(log.date) >= subDays(new Date(), 30))
      .filter(log => log[metric] !== undefined && log[metric] !== null);
    
    if (lastMonthLogs.length === 0) return 0;
    
    const sum = lastMonthLogs.reduce((total, log) => total + log[metric], 0);
    return Math.round((sum / lastMonthLogs.length) * 10) / 10;
  };

  const getTrend = (weekAvg, monthAvg) => {
    if (weekAvg === 0 || monthAvg === 0) return "neutral";
    if (weekAvg > monthAvg) return "up";
    if (weekAvg < monthAvg) return "down";
    return "neutral";
  };

  const trends = [
    {
      name: "Mood",
      icon: Smile,
      weekAvg: getLastWeekAverage('mood_score'),
      monthAvg: getLastMonthAverage('mood_score'),
      unit: "/10",
      color: "text-yellow-600"
    },
    {
      name: "Sleep",
      icon: Moon,
      weekAvg: getLastWeekAverage('sleep_hours'),
      monthAvg: getLastMonthAverage('sleep_hours'),
      unit: "h",
      color: "text-indigo-600"
    },
    {
      name: "Water",
      icon: Droplets,
      weekAvg: getLastWeekAverage('water_glasses'),
      monthAvg: getLastMonthAverage('water_glasses'),
      unit: " glasses",
      color: "text-blue-600"
    },
    {
      name: "Exercise",
      icon: Heart,
      weekAvg: getLastWeekAverage('exercise_minutes'),
      monthAvg: getLastMonthAverage('exercise_minutes'),
      unit: " min",
      color: "text-green-600"
    }
  ];

  return (
    <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-600" />
          Health Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {trends.map((trend, index) => {
          const trendDirection = getTrend(trend.weekAvg, trend.monthAvg);
          
          return (
            <div key={trend.name} className="p-4 bg-slate-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <trend.icon className={`w-4 h-4 ${trend.color}`} />
                  <span className="font-medium text-slate-900">{trend.name}</span>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full ${
                  trendDirection === 'up' ? 'bg-green-100 text-green-700' :
                  trendDirection === 'down' ? 'bg-red-100 text-red-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {trendDirection === 'up' ? '↗' : trendDirection === 'down' ? '↘' : '→'}
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">This week:</span>
                  <span className="font-medium">{trend.weekAvg}{trend.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">This month:</span>
                  <span className="font-medium">{trend.monthAvg}{trend.unit}</span>
                </div>
              </div>
            </div>
          );
        })}

        {healthLogs.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Start logging health data to see trends</p>
          </div>
        )}
        
      </CardContent>
    </Card>
  );
}