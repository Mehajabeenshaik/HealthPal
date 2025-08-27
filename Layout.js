import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  LayoutDashboard, 
  Activity, 
  Heart, 
  Calendar, 
  MapPin, 
  BookOpen,
  Menu,
  X
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: LayoutDashboard,
  },
  {
    title: "Symptom Checker",
    url: createPageUrl("SymptomChecker"),
    icon: Activity,
  },
  {
    title: "Health Logger",
    url: createPageUrl("HealthLogger"),
    icon: Heart,
  },
  {
    title: "Reminders",
    url: createPageUrl("Reminders"),
    icon: Calendar,
  },
  {
    title: "Find Healthcare",
    url: createPageUrl("Healthcare"),
    icon: MapPin,
  },
  {
    title: "Learn",
    url: createPageUrl("Learn"),
    icon: BookOpen,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <SidebarProvider>
      <style>
        {`
          :root {
            --primary-blue: #4A90E2;
            --primary-green: #7ED321;
            --light-blue: #E8F4FD;
            --light-green: #F0FCE8;
            --text-primary: #1A2332;
            --text-secondary: #6B7280;
            --background: #FAFBFC;
          }
          
          body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background-color: var(--background);
          }
          
          .health-gradient {
            background: linear-gradient(135deg, var(--primary-blue) 0%, var(--primary-green) 100%);
          }
          
          .glass-effect {
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.95);
          }
        `}
      </style>
      
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <Sidebar className="border-r border-blue-100 glass-effect">
          <SidebarHeader className="border-b border-blue-100 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 health-gradient rounded-xl flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">HealthPal</h2>
                <p className="text-sm text-slate-500">Your Health Companion</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 rounded-xl p-3 ${
                          location.pathname === item.url 
                            ? 'bg-blue-100 text-blue-700 shadow-sm border border-blue-200' 
                            : 'text-slate-600'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-800">Health Tip</span>
              </div>
              <p className="text-xs text-green-700 leading-relaxed">
                Stay hydrated! Drinking 8 glasses of water daily helps maintain optimal body function.
              </p>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0">
          {/* Mobile header */}
          <header className="bg-white/80 backdrop-blur-md border-b border-blue-100 px-6 py-4 md:hidden sticky top-0 z-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger className="hover:bg-blue-50 p-2 rounded-lg transition-colors duration-200" />
                <div className="w-8 h-8 health-gradient rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-lg font-bold text-slate-900">HealthPal</h1>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
