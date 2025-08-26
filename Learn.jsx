
import React, { useState, useEffect } from "react";
import { HealthTip } from "@/entities/HealthTip";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Added this import
import { BookOpen, Lightbulb, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const categoryConfig = {
  nutrition: { icon: "🍎", color: "bg-red-100 text-red-800" },
  exercise: { icon: "🏋️", color: "bg-blue-100 text-blue-800" },
  mental_health: { icon: "🧠", color: "bg-purple-100 text-purple-800" },
  preventive_care: { icon: "🛡️", color: "bg-green-100 text-green-800" },
  chronic_conditions: { icon: "💊", color: "bg-orange-100 text-orange-800" },
  general: { icon: "💡", color: "bg-gray-100 text-gray-800" },
};

export default function Learn() {
  const [healthTips, setHealthTips] = useState([]);
  const [filteredTips, setFilteredTips] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadHealthTips();
  }, []);

  useEffect(() => {
    let tips = healthTips;

    if (selectedCategory !== "all") {
      tips = tips.filter(tip => tip.category === selectedCategory);
    }

    if (searchTerm) {
      tips = tips.filter(tip => 
        tip.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tip.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredTips(tips);
  }, [searchTerm, selectedCategory, healthTips]);
  
  const loadHealthTips = async () => {
    setIsLoading(true);
    try {
      const data = await HealthTip.list("-created_date");
      setHealthTips(data);
      setFilteredTips(data);
    } catch (error) {
      console.error("Error loading health tips:", error);
    }
    setIsLoading(false);
  };
  
  const categories = ["all", ...Object.keys(categoryConfig)];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Health Education Hub
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Explore reliable medical information and wellness tips to empower your health journey.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input 
              placeholder="Search for health tips..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button 
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full transition-all duration-300 ${selectedCategory === category ? 'bg-cyan-600' : 'bg-white'}`}
              >
                {category === 'all' ? 'All' : categoryConfig[category]?.icon} {category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Button>
            ))}
          </div>
        </div>

        {/* Health Tips Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array(6).fill(0).map((_, i) => (
              <Card key={i}><Skeleton className="h-48 w-full" /></Card>
            ))
          ) : (
            filteredTips.map((tip, index) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="h-full flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <Badge className={`self-start ${categoryConfig[tip.category]?.color}`}>
                      {tip.category.replace(/_/g, ' ')}
                    </Badge>
                    <CardTitle className="text-lg font-bold mt-2">{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-slate-600 leading-relaxed">{tip.content}</p>
                  </CardContent>
                  <CardContent className="text-xs text-slate-400 border-t pt-3">
                    Source: {tip.source || "HealthPal Experts"}
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
        {!isLoading && filteredTips.length === 0 && (
          <div className="text-center col-span-full py-20">
            <p className="text-lg text-slate-500">No health tips found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
