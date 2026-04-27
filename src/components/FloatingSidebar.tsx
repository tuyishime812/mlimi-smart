import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  X, Settings, Loader2, Thermometer, Droplets, 
  MapPin, RefreshCw, AlertCircle 
} from "lucide-react";
import { WeatherSkeleton } from "./loading-skeletons";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { QueryType } from "@/types/chat";

interface FloatingSidebarProps {
  queryType: QueryType;
  onQueryTypeChange: (value: QueryType) => void;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}




export const FloatingSidebar = ({ queryType, onQueryTypeChange, isOpen, onClose, children }: FloatingSidebarProps) => {
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<Record<string, unknown> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  
  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in duration-300"
        onClick={onClose}
      />
      <aside className="fixed right-6 top-24 w-80 z-50 animate-in slide-in-from-right duration-300 max-h-[80vh] overflow-y-auto rounded-3xl">
        <Card className="glass-card p-6 space-y-6 shadow-2xl rounded-3xl border-none">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              <Settings className="h-5 w-5 text-primary" />
              Chat Settings
            </h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="hover:bg-primary/10 rounded-xl transition-all"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-4">
            <span 
              className="text-3xl font-emoji select-none" 
              role="img" 
              aria-label="Farming"
              style={{ 
                fontFamily: '"Segoe UI Emoji", "Noto Color Emoji", "Apple Color Emoji", "Segoe UI Symbol", "Android Emoji", sans-serif'
              }}
            >
              🌾
            </span>
          </div>

          {children || (
            <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground block">
                Select Chat Mode:
              </label>
              <Select value={queryType} onValueChange={onQueryTypeChange}>
                <SelectTrigger className="w-full bg-card border-2 border-border hover:border-primary/40 rounded-xl transition-all duration-300">
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent className="bg-card border border-border rounded-xl">
                  <SelectItem value="General">🌾 General</SelectItem>
                  <SelectItem value="Farming Advice">🌱 Farming Advice</SelectItem>
                  <SelectItem value="Pest & Disease Control">🐛 Pest & Disease</SelectItem>
                  <SelectItem value="Business & Marketing">💰 Marketing</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Choose your focus area for personalized expert advice
              </p>
            </div>

            <div className="flex items-center gap-2 mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
              <AlertCircle className="h-4 w-4 text-primary flex-shrink-0" />
              <p className="text-xs text-foreground">Select your preferred mode above to get specialized assistance</p>
            </div>
          </div>
          )}

          {/* Tools Section */}
          <div className="space-y-4 pt-2 border-t border-border">
            <div className="flex items-center justify-between pt-2">
              <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                <span className="text-primary">⚙️</span>
                Quick Tools
              </h3>
              <Badge className="text-xs bg-primary/20 text-primary border-0">Beta</Badge>
            </div>

            {/* Weather Information */}
            <div className="space-y-3 p-3 rounded-xl bg-secondary/5 border border-secondary/20">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                  <Thermometer className="h-4 w-4 text-secondary" />
                  Weather Info
                </h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="hover:bg-secondary/10 rounded-lg"
                      >
                        <AlertCircle className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Get real-time weather data for your location</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Input 
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  placeholder="Latitude"
                  className="text-sm"
                />
                <Input 
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                  placeholder="Longitude"
                  className="text-sm"
                />
              </div>
              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}
              {loading ? (
                <WeatherSkeleton />
              ) : weatherData?.forecast?.current && (
                <div className="text-sm p-3 bg-background/60 rounded-lg border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-muted-foreground">Current Conditions</span>
                    <RefreshCw className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">Temperature</span>
                      </div>
                      <span className="text-sm font-medium">{weatherData.forecast.current.temp}°C</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Humidity</span>
                      </div>
                      <span className="text-sm font-medium">{weatherData.forecast.current.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span className="text-sm">Conditions</span>
                      </div>
                      <span className="text-sm font-medium">{weatherData.forecast.current.conditions}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Button 
                  onClick={async () => {
                    if (!lat || !lon) {
                      setError("Please enter both latitude and longitude.");
                      return;
                    }
                    setLoading(true);
                    setError(null);
                    try {
                      const res = await fetch("http://localhost:8000/weather", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                          latitude: parseFloat(lat), 
                          longitude: parseFloat(lon), 
                          days: 5 
                        })
                      });
                      if (!res.ok) {
                        const txt = await res.text();
                        setError(`Weather error: ${txt}`);
                        return;
                      }
                      const data = await res.json();
                      setWeatherData(data);
                    } catch (err) {
                      console.error(err);
                      setError("Failed to call weather API. Is the backend running and OPENWEATHER_API_KEY set?");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Fetch Weather'
                  )}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setLat("");
                    setLon("");
                    setWeatherData(null);
                    setError(null);
                  }}
                  disabled={loading}
                >
                  Clear
                </Button>
                <Button 
                  variant="secondary" 
                  onClick={async () => {
                    const city = prompt("Enter your city or region name:");
                    if (!city) return;
                    setLoading(true);
                    setError(null);
                    try {
                      const res = await fetch("http://localhost:8000/weather", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                          city: city.trim(),
                          days: 5,
                          latitude: null,
                          longitude: null
                        })
                      });
                      
                      if (!res.ok) {
                        const responseText = await res.text();
                        setError(`Weather error (${res.status}): ${responseText}`);
                        return;
                      }
                      
                      const data = await res.json();
                      setWeatherData(data);
                      
                      if (!data.forecast?.current) {
                        setError("No current weather data available");
                        return;
                      }
                    } catch (err) {
                      console.error("Weather API error:", err);
                      setError("Failed to fetch weather data. Please check if the backend is running and properly configured.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Location'
                  )}
                </Button>
              </div>
            </div>

            {/* Market Analysis section removed */}
          </div>

          <div className="space-y-3 pt-4 border-t border-border text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <span className="text-lg">🌍</span>
              <span>Multilingual Support</span>
            </p>
            <p className="text-xs pl-7">English • Chichewa • Swahili • Kinyarwanda</p>
            <p className="flex items-center gap-2 pt-2">
              <span className="text-lg">🤖</span>
              <span>Powered by Tuyishime Martin</span>
            </p>
          </div>
        </Card>
      </aside>
    </>
  );
};
