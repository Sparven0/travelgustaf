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
      className="overflow-hidden cursor-pointer group transform transition-transform duration-500 hover:scale-105 
                 border-2 border-orange-600 rounded-2xl shadow-lg bg-black text-orange-100"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Flag */}
      <div className="relative h-44 overflow-hidden bg-black">
        <img
          src={country.flags.svg || country.flags.png}
          alt={country.flags.alt || `Flag of ${country.name.common}`}
          className="w-full h-full object-cover opacity-90 hover:opacity-100 transform 
                     group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Card Content */}
      <CardContent className="p-5 bg-black">
        <h3 className="mb-3 line-clamp-1 text-xl font-extrabold text-orange-400 font-halloween drop-shadow-md">
          {country.name.common}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-purple-400 flex-shrink-0" />
            <span className="line-clamp-1 font-bold text-orange-300">
              {country.capital?.[0] || "N/A"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-green-400 flex-shrink-0" />
            <span className="font-bold text-purple-300">
              {country.population.toLocaleString()}
            </span>
          </div>
          <div className="inline-block px-2 py-1 bg-orange-800 text-orange-100 font-bold rounded-full text-xs shadow-sm">
            {country.region}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
