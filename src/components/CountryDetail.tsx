import { useState, useEffect } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorDisplay } from "./ErrorDisplay";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  ArrowLeft,
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
      const countryResponse = await fetch(
        `https://restcountries.com/v3.1/alpha/${countryCode}`
      );
      if (!countryResponse.ok) throw new Error("Failed to fetch country data");
      const [countryData] = await countryResponse.json();
      setCountry(countryData);

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

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-black via-purple-900 to-orange-800 text-gray-100 overflow-x-hidden">
      {/* Spooky fog overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[url('/fog.png')] bg-cover opacity-10 animate-fade-in"></div>

      <header className="bg-black/80 backdrop-blur-sm border-b border-orange-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button
            onClick={onBack}
            variant="ghost"
            className="gap-2 text-orange-400 hover:text-orange-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Countries
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 lg:grid lg:grid-cols-3 lg:gap-10">
        {/* Left / Main Column */}
        <div className="lg:col-span-2 space-y-10">
          {/* Country Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border border-orange-600 bg-gray-900/90">
            <CardContent className="p-6 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-56 h-40 flex-shrink-0 rounded-xl overflow-hidden shadow-inner transform hover:scale-105 hover:shadow-orange-500/50 transition duration-300">
                <img
                  src={country.flags.svg || country.flags.png}
                  alt={country.flags.alt || `Flag of ${country.name.common}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2 text-orange-400 hover:drop-shadow-[0_0_15px_rgba(255,165,0,0.7)] transition duration-300">
                  {country.name.common} 🎃
                </h2>
                {country.name.official !== country.name.common && (
                  <p className="text-gray-300 mb-4">
                    Official: {country.name.official}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mb-4">
                  <Badge className="rounded-full px-3 py-1 bg-purple-800 text-orange-300 hover:shadow-[0_0_10px_rgba(255,140,0,0.7)] transition duration-300">
                    {country.region}
                  </Badge>
                  {country.subregion && (
                    <Badge className="rounded-full px-3 py-1 bg-gray-700 text-purple-200 hover:shadow-[0_0_10px_rgba(255,140,0,0.7)] transition duration-300">
                      {country.subregion}
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border border-orange-600 bg-gray-900/90">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4 text-orange-400 hover:drop-shadow-[0_0_10px_rgba(255,165,0,0.7)] transition duration-300">
                About {country.name.common} 👻
              </h2>
              <p className="text-gray-300 leading-relaxed">{wikiText}</p>
            </CardContent>
          </Card>

          {/* Gallery Card */}
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border border-orange-600 bg-gray-900/90">
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-orange-400 hover:drop-shadow-[0_0_10px_rgba(255,165,0,0.7)] transition duration-300">
                Photo Gallery 🦇🕸️
              </h2>
              <CountryGallery images={images} countryName={country.name.common} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-28">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border border-purple-600 bg-gray-900/90">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4 text-orange-400">
                <Cloud className="h-5 w-5" />
                <h3>Current Weather</h3>
              </div>
              {weather ? (
                <div className="space-y-1 text-white">
                  <p>Temp: {weather.temp}°C</p>
                  <p>Condition: {weather.condition}</p>
                  <p>Humidity: {weather.humidity}%</p>
                  <p>Wind: {weather.windSpeed} m/s</p>
                </div>
              ) : (
                <p className="text-gray-400">No weather data available</p>
              )}
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
}

// Gallery with floating animation
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
          className={`overflow-hidden rounded-xl shadow-md transform transition-transform duration-300 hover:scale-105 animate-float ${
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

// Tailwind CSS animation for floating images
// Add in tailwind.config.js under theme.extend:
// animation: { float: 'float 4s ease-in-out infinite' },
// keyframes: {
//   float: {
//     '0%, 100%': { transform: 'translateY(0px)' },
//     '50%': { transform: 'translateY(-5px)' },
//   },
// }
