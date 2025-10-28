import { Card, CardContent } from "./ui/card";
import { MapPin, Users } from "lucide-react";

interface Country {
  cca3: string;
  name: {
    common: string;
  };
  capital?: string[];
  region: string;
  population: number;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
}

interface CountryCardProps {
  country: Country;
  onClick: () => void;
}

export function CountryCard({ country, onClick }: CountryCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer group transform transition-transform duration-500 hover:scale-105 shadow-[0_8px_30px_rgba(255,0,150,0.6)] border-4 border-yellow-400 rounded-3xl"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="relative h-44 overflow-hidden bg-gradient-to-tr from-pink-400 via-yellow-300 to-purple-500">
        <img
          src={country.flags.svg || country.flags.png}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          className="w-full h-full object-cover opacity-90 hover:opacity-100 transform group-hover:rotate-3 group-hover:scale-110 transition-all duration-500"
        />
      </div>
      <CardContent className="p-6 bg-gradient-to-br from-yellow-100 via-pink-100 to-purple-100">
        <h3 className="mb-4 line-clamp-1 text-2xl font-extrabold text-fuchsia-700 drop-shadow-lg">
          {country.name.common}
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600 flex-shrink-0" />
            <span className="line-clamp-1 font-bold text-orange-600">
              {country.capital?.[0] || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <span className="font-bold text-pink-600">
              {country.population.toLocaleString()}
            </span>
          </div>
          <div className="inline-block px-3 py-1 bg-gradient-to-r from-green-300 via-yellow-200 to-pink-300 text-purple-800 font-bold rounded-full text-sm shadow-lg">
            {country.region}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
