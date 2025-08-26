import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Activity, Heart, Calendar } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link to={createPageUrl("HealthLogger")}>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg">
          <Heart className="w-4 h-4 mr-2" />
          Log Health
        </Button>
      </Link>
      <Link to={createPageUrl("SymptomChecker")}>
        <Button variant="outline" className="border-blue-200 hover:bg-blue-50">
          <Activity className="w-4 h-4 mr-2" />
          Check Symptoms
        </Button>
      </Link>
      <Link to={createPageUrl("Reminders")}>
        <Button variant="outline" className="border-green-200 hover:bg-green-50">
          <Calendar className="w-4 h-4 mr-2" />
          Add Reminder
        </Button>
      </Link>
    </div>
  );
}