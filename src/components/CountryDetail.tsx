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
  const [wikiText, setWikiText] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCountryData();
  }, [countryCode]);

  const fetchCountryData = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1️⃣ Fetch country data
      const countryResponse = await fetch(
        `https://restcountries.com/v3.1/alpha/${countryCode}`
      );
      if (!countryResponse.ok) throw new Error("Failed to fetch country data");
      const [countryData] = await countryResponse.json();
      setCountry(countryData);

      // 2️⃣ Fetch Wikipedia summary
      try {
        const wikiResponse = await fetch(
          `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
            countryData.name.common
          )}`
        );
        if (wikiResponse.ok) {
          const wikiData = await wikiResponse.json();
          setWikiText(wikiData.extract || "No summary available.");
        } else {
          setWikiText("No summary available.");
        }
      } catch {
        setWikiText("No summary available.");
      }

      // 3️⃣ Fetch Unsplash images
      try {
        const unsplashKey = import.meta.env.VITE_UNSPLASH_API_KEY;
        const unsplashResponse = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
            countryData.name.common
          )}&per_page=12&client_id=${unsplashKey}`
        );
        if (unsplashResponse.ok) {
          const data = await unsplashResponse.json();
          setImages(data.results.map((photo: any) => photo.urls.regular));
        } else {
          setImages([]);
        }
      } catch {
        setImages([]);
      }

      // 4️⃣ Fetch weather if coordinates available
      const lat = countryData.capitalInfo?.latlng?.[0];
      const lon = countryData.capitalInfo?.latlng?.[1];
      if (lat && lon) {
        const weatherKey = import.meta.env.VITE_OPENWEATHER_API_KEY;
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${weatherKey}`
        );
        if (weatherResponse.ok) {
          const weatherData = await weatherResponse.json();
          setWeather({
            temp: Math.round(weatherData.main.temp),
            condition: weatherData.weather?.[0]?.main || "Unknown",
            humidity: weatherData.main.humidity,
            windSpeed: weatherData.wind.speed,
          });
        }
      } else {
        setWeather(null);
      }
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

      <main className="container mx-auto px-4 py-10 lg:grid lg:grid-cols-3 lg:gap-10">
        {/* Left / Main Column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Country Header + Info */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-56 h-40 flex-shrink-0 rounded-xl overflow-hidden shadow-inner transform hover:scale-105 transition-transform duration-300">
                <img
                  src={country.flags.svg || country.flags.png}
                  alt={country.flags.alt || `Flag of ${country.name.common}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{country.name.common}</h2>
                {country.name.official !== country.name.common && (
                  <p className="text-gray-600 mb-4">
                    Official: {country.name.official}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    {country.region}
                  </Badge>
                  {country.subregion && (
                    <Badge variant="outline" className="rounded-full px-3 py-1">
                      {country.subregion}
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">
                About {country.name.common}
              </h2>
              <p className="text-gray-700 leading-relaxed">{wikiText}</p>
            </CardContent>
          </Card>

          {/* Gallery */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6">Photo Gallery</h2>
              <CountryGallery images={images} countryName={country.name.common} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-28">
          {/* Weather */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Cloud className="h-5 w-5 text-blue-600" />
                <h3>Current Weather</h3>
              </div>

              {weather ? (
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
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Weather data unavailable</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Facts */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
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
        </aside>
      </main>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
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

function CountryGallery({
  images,
  countryName,
}: {
  images: string[];
  countryName: string;
}) {
  if (!images || images.length === 0) {
    return <div className="text-center text-gray-500">No images available</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[200px]">
      {images.map((src, index) => (
        <div
          key={index}
          className={`overflow-hidden rounded-xl shadow-md transform transition-transform duration-300 hover:scale-105 ${
            index === 0 ? "sm:col-span-2 sm:row-span-2" : ""
          }`}
        >
          <ImageWithFallback
            src={src}
            alt={`View of ${countryName} ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
