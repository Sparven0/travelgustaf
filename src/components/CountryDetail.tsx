import { useState, useEffect } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorDisplay } from "./ErrorDisplay";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  ArrowLeft,
  MapPin,
  Users,
  Globe,
  DollarSign,
  MessageSquare,
  Cloud,
  Droplets,
  Wind,
} from "lucide-react";

interface CountryDetailProps {
  countryCode: string;
  onBack: () => void;
}

export function CountryDetail({ countryCode, onBack }: CountryDetailProps) {
  const [country, setCountry] = useState<any>(null);
  const [weather, setWeather] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [wikiText, setWikiText] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCountryData();
  }, [countryCode]);

  const fetchCountryData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch country data
      const countryResponse = await fetch(
        `https://restcountries.com/v3.1/alpha/${countryCode}`
      );
      if (!countryResponse.ok) throw new Error("Failed to fetch country data");
      const [countryData] = await countryResponse.json();
      setCountry(countryData);

      // Mock weather data (since we don't have a real API key)
      const mockWeather = {
        temp: Math.floor(Math.random() * 30) + 5,
        condition: ["Sunny", "Cloudy", "Rainy", "Partly Cloudy"][Math.floor(Math.random() * 4)],
        humidity: Math.floor(Math.random() * 40) + 40,
        windSpeed: Math.floor(Math.random() * 20) + 5,
      };
      setWeather(mockWeather);

      // Mock Wikipedia text
      setWikiText(
        `${countryData.name.common} is a country located in ${countryData.region}${
          countryData.subregion ? `, specifically in ${countryData.subregion}` : ""
        }. The capital city is ${
          countryData.capital?.[0] || "not specified"
        }. This information provides a brief overview of the country's geographical and political context.`
      );

      // Images will be fetched separately
      setImages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchCountryData} />;
  if (!country) return null;

  const languages = country.languages
    ? Object.values(country.languages).join(", ")
    : "N/A";
  const currencies = country.currencies
    ? Object.values(country.currencies)
        .map((c: any) => `${c.name} (${c.symbol || ""})`)
        .join(", ")
    : "N/A";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button onClick={onBack} variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Countries
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Country Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="w-full md:w-48 h-32 flex-shrink-0 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg overflow-hidden">
                    <img
                      src={country.flags.svg || country.flags.png}
                      alt={country.flags.alt || `Flag of ${country.name.common}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h1 className="mb-2">{country.name.common}</h1>
                    {country.name.official !== country.name.common && (
                      <p className="text-gray-600 mb-4">
                        Official: {country.name.official}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{country.region}</Badge>
                      {country.subregion && (
                        <Badge variant="outline">{country.subregion}</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6">Country Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoItem
                    icon={<MapPin className="h-5 w-5 text-blue-600" />}
                    label="Capital"
                    value={country.capital?.[0] || "N/A"}
                  />
                  <InfoItem
                    icon={<Users className="h-5 w-5 text-purple-600" />}
                    label="Population"
                    value={country.population.toLocaleString()}
                  />
                  <InfoItem
                    icon={<Globe className="h-5 w-5 text-green-600" />}
                    label="Area"
                    value={`${country.area.toLocaleString()} km²`}
                  />
                  <InfoItem
                    icon={<MessageSquare className="h-5 w-5 text-orange-600" />}
                    label="Languages"
                    value={languages}
                  />
                  <InfoItem
                    icon={<DollarSign className="h-5 w-5 text-yellow-600" />}
                    label="Currency"
                    value={currencies}
                  />
                  <InfoItem
                    icon={<Globe className="h-5 w-5 text-pink-600" />}
                    label="Timezones"
                    value={country.timezones?.[0] || "N/A"}
                  />
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-4">About {country.name.common}</h2>
                <p className="text-gray-700 leading-relaxed mb-4">{wikiText}</p>
                <p className="text-xs text-gray-500">
                  Source: Mock Wikipedia data for demonstration purposes
                </p>
              </CardContent>
            </Card>

            {/* Gallery */}
            <Card>
              <CardContent className="p-6">
                <h2 className="mb-6">Photo Gallery</h2>
                <CountryGallery countryName={country.name.common} />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Weather */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Cloud className="h-5 w-5 text-blue-600" />
                  <h3>Current Weather</h3>
                </div>
                {weather && (
                  <div className="space-y-4">
                    <div className="text-center py-4">
                      <div className="text-4xl mb-2">{weather.temp}°C</div>
                      <p className="text-gray-600">{weather.condition}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span>Humidity</span>
                        </div>
                        <span>{weather.humidity}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Wind className="h-4 w-4 text-gray-500" />
                          <span>Wind Speed</span>
                        </div>
                        <span>{weather.windSpeed} km/h</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">
                      Weather data is simulated for demonstration purposes
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Facts */}
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4">Quick Facts</h3>
                <div className="space-y-3 text-sm">
                  {country.independent !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Independent</span>
                      <span>{country.independent ? "Yes" : "No"}</span>
                    </div>
                  )}
                  {country.unMember !== undefined && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">UN Member</span>
                      <span>{country.unMember ? "Yes" : "No"}</span>
                    </div>
                  )}
                  {country.startOfWeek && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Week Starts</span>
                      <span className="capitalize">{country.startOfWeek}</span>
                    </div>
                  )}
                  {country.car?.side && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Drives On</span>
                      <span className="capitalize">{country.car.side}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <p className="text-gray-900">{value}</p>
      </div>
    </div>
  );
}

function CountryGallery({ countryName }: { countryName: string }) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using Unsplash source URLs for demonstration
    const mockImages = [
      `https://source.unsplash.com/800x600/?${encodeURIComponent(countryName)},landscape`,
      `https://source.unsplash.com/800x600/?${encodeURIComponent(countryName)},city`,
      `https://source.unsplash.com/800x600/?${encodeURIComponent(countryName)},culture`,
    ];
    setImages(mockImages);
    setLoading(false);
  }, [countryName]);

  if (loading) {
    return <div className="text-center text-gray-500">Loading images...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {images.map((src, index) => (
        <div
          key={index}
          className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-100"
        >
          <ImageWithFallback
            src={src}
            alt={`View of ${countryName} ${index + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </div>
  );
}
