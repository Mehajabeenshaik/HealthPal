
import React, { useState } from "react";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Search, Loader2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Skeleton } from "@/components/ui/skeleton"; // Added import for Skeleton

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

export default function Healthcare() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("hospital");
  const [locations, setLocations] = useState([]);
  const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!searchQuery) {
      setError("Please enter a location to search.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setLocations([]);

    try {
      const prompt = `Find ${searchType}s near ${searchQuery}. Provide a list of up to 10 locations with their name, address, phone number, and precise latitude and longitude.`;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            locations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  address: { type: "string" },
                  phone: { type: "string" },
                  latitude: { type: "number" },
                  longitude: { type: "number" },
                },
                required: ["name", "address", "latitude", "longitude"]
              }
            }
          }
        }
      });
      
      if (response && response.locations && response.locations.length > 0) {
        setLocations(response.locations);
        const firstLoc = response.locations[0];
        setMapCenter([firstLoc.latitude, firstLoc.longitude]);
      } else {
        setError("Could not find any locations matching your search.");
      }
    } catch (err) {
      console.error("Error finding healthcare locations:", err);
      setError("An error occurred while searching. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <MapPin className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
            Find Healthcare
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Locate nearby hospitals, clinics, and pharmacies to get the care you need, when you need it.
          </p> {/* Fixed: Changed "p>" to "</p>" */}
        </div>

        {/* Search Bar */}
        <Card className="shadow-xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                placeholder="Enter city, zip code, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 text-base flex-grow"
              />
              <Select value={searchType} onValueChange={setSearchType}>
                <SelectTrigger className="h-12 text-base md:w-48">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hospital">Hospitals</SelectItem>
                  <SelectItem value="clinic">Clinics</SelectItem>
                  <SelectItem value="pharmacy">Pharmacies</SelectItem>
                  <SelectItem value="doctor">Doctors</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={handleSearch} 
                disabled={isLoading}
                className="h-12 text-base"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Search className="w-5 h-5 mr-2" />
                )}
                Search
              </Button>
            </div>
          </CardContent>
        </Card>
        
        {error && <div className="text-red-600 text-center mb-4">{error}</div>}

        {/* Results */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="h-[600px] shadow-lg overflow-hidden">
              <MapContainer center={mapCenter} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {locations.map((loc, index) => (
                  <Marker key={index} position={[loc.latitude, loc.longitude]}>
                    <Popup>
                      <strong className="block">{loc.name}</strong>
                      {loc.address} <br />
                      {loc.phone && `Phone: ${loc.phone}`}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </Card>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {isLoading && Array(3).fill(0).map((_, i) => (
              <Card key={i}><Skeleton className="h-24 w-full" /></Card>
            ))}
            
            {!isLoading && locations.map((loc, index) => (
              <Card key={index} className="hover:bg-orange-50 transition-colors">
                <CardContent className="p-4">
                  <h3 className="font-bold">{loc.name}</h3>
                  <p className="text-sm text-slate-600">{loc.address}</p>
                  {loc.phone && <p className="text-sm text-slate-600">Phone: {loc.phone}</p>}
                </CardContent>
              </Card>
            ))}

            {!isLoading && locations.length === 0 && (
               <div className="text-center py-20 text-slate-500">
                  <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Search for healthcare facilities to see results here.</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

