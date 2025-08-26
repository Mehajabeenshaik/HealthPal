import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Clock, Droplets, Moon, Smile, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const MetricCard = ({ title, current, average, icon: Icon, color, unit = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="relative overflow-hidden border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-5 rounded-full transform translate-x-8 -translate-y-8`} />
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
          <Icon className={`h-5 w-5 ${color.replace('bg-', 'text-')}`} />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline space-x-2">
            <div className="text-3xl font-bold text-slate-900">
              {current !== null && current !== undefined ? `${current}${unit}` : "–"}
            </div>
            {average > 0 && (
              <div className="flex items-center text-sm text-slate-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                {average}{unit} avg
              </div>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-2">
            {current !== null && current !== undefined ? "Today" : "No data today"}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function HealthMetrics({ todaysLog, weeklyAverages, isLoading }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Array(4).fill(0).map((_, i) => (
          <Card key={i} className="p-6">
            <Skeleton className="h-4 w-20 mb-4" />
            <Skeleton className="h-8 w-12 mb-2" />
            <Skeleton className="h-3 w-16" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      <MetricCard
        title="Mood"
        current={todaysLog?.mood_score}
        average={weeklyAverages.mood}
        icon={Smile}
        color="bg-yellow-500"
        unit="/10"
      />
      <MetricCard
        title="Sleep"
        current={todaysLog?.sleep_hours}
        average={weeklyAverages.sleep}
        icon={Moon}
        color="bg-indigo-500"
        unit="h"
      />
      <MetricCard
        title="Water"
        current={todaysLog?.water_glasses}
        average={weeklyAverages.water}
        icon={Droplets}
        color="bg-blue-500"
        unit=" glasses"
      />
      <MetricCard
        title="Exercise"
        current={todaysLog?.exercise_minutes}
        average={weeklyAverages.exercise}
        icon={Heart}
        color="bg-green-500"
        unit="min"
      />
    </div>
  );
}