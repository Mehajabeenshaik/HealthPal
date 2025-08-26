import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Heart, Droplets, Moon, Smile } from "lucide-react";
import { format } from "date-fns";

export default function RecentActivity({ healthLogs, isLoading }) {
  if (isLoading) {
    return (
      <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentLogs = healthLogs.slice(0, 7);

  return (
    <Card className="shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-green-600" />
          Recent Health Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentLogs.length > 0 ? (
          <div className="space-y-4">
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-lg transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                    <Heart className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      Health Log - {format(new Date(log.date), 'MMM d, yyyy')}
                    </p>
                    <div className="flex items-center gap-4 mt-1">
                      {log.mood_score && (
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Smile className="w-3 h-3" />
                          {log.mood_score}/10
                        </div>
                      )}
                      {log.sleep_hours && (
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Moon className="w-3 h-3" />
                          {log.sleep_hours}h
                        </div>
                      )}
                      {log.water_glasses && (
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                          <Droplets className="w-3 h-3" />
                          {log.water_glasses} glasses
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  Completed
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Activity className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No health logs yet</p>
            <p className="text-sm mt-1">Start tracking your daily health!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}