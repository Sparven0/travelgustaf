import { Button } from "./ui/button";

const CONTINENTS = [
  { value: "", label: "All" },
  { value: "Africa", label: "Africa" },
  { value: "Americas", label: "Americas" },
  { value: "Asia", label: "Asia" },
  { value: "Europe", label: "Europe" },
  { value: "Oceania", label: "Oceania" },
  { value: "Antarctic", label: "Antarctic" },
];

interface ContinentFilterProps {
  className?: string;
  selected: string;
  onChange: (continent: string) => void;
}

export function ContinentFilter({ selected, onChange }: ContinentFilterProps) {
  return (
    <nav aria-label="Filter by continent" className="flex flex-wrap gap-2">
      {CONTINENTS.map((continent) => (
        <Button
          key={continent.value}
          onClick={() => onChange(continent.value)}
          variant={selected === continent.value ? "default" : "outline"}
          size="sm"
          aria-pressed={selected === continent.value}
        >
          {continent.label}
        </Button>
      ))}
    </nav>
  );
}
