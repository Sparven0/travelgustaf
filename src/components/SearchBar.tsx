import { Search } from "lucide-react";
import { Input } from "./ui/input";

interface SearchBarProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="country-search" className="sr-only">
        Search for a country
      </label>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <Input
        id="country-search"
        type="text"
        placeholder="Search for a country..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
