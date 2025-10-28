import { useState, useEffect, useMemo } from "react";
import { SearchBar } from "./SearchBar";
import { ContinentFilter } from "./ContinentFilter";
import { CountryCard } from "./CountryCard";
import { PaginationControls } from "./PaginationControls";
import { LoadingSpinner } from "./LoadingSpinner";
import { ErrorDisplay } from "./ErrorDisplay";


interface HomePageProps {
  onCountrySelect: (countryCode: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  continent: string;
  onContinentChange: (continent: string) => void;
  page: number;
  onPageChange: (page: number) => void;
}

const ITEMS_PER_PAGE = 15;

export function HomePage({
  onCountrySelect,
  searchQuery,
  onSearchChange,
  continent,
  onContinentChange,
  page,
  onPageChange,
}: HomePageProps) {
  const [countries, setCountries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,region,subregion,population,flags,cca3,languages,currencies,latlng');
      if (!response.ok) throw new Error("Failed to fetch countries");
      const data = await response.json();
      setCountries(data.sort((a: any, b: any) => 
        a.name.common.localeCompare(b.name.common)
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const filteredCountries = useMemo(() => {
    let filtered = countries;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((country) =>
        country.name.common.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by continent
    if (continent) {
      filtered = filtered.filter((country) => country.region === continent);
    }

    return filtered;
  }, [countries, searchQuery, continent]);

  const totalPages = Math.ceil(filteredCountries.length / ITEMS_PER_PAGE);
  const paginatedCountries = filteredCountries.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleSearchChange = (query: string) => {
    onSearchChange(query);
    onPageChange(1);
  };

  const handleContinentChange = (newContinent: string) => {
    onContinentChange(newContinent);
    onPageChange(1);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} onRetry={fetchCountries} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
    <header className="bg-gradient-to-r from-pink-300 via-yellow-200 to-green-300 border-b-4 border-purple-500 sticky top-0 z-10 shadow-[0_8px_20px_rgba(255,0,150,0.7)]">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <img 
            src="src/assets/planeicon.jpg" 
            alt="planeicon" 
            className="w-20 rounded-full border-4 border-yellow-400 shadow-[0_4px_15px_rgba(0,255,255,0.7)]"
          />
          <h1 className="text-4xl font-extrabold text-purple-800 drop-shadow-[2px_2px_0_rgba(255,255,0,0.8)] specialfont">
            Explore the World
          </h1>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SearchBar 
            value={searchQuery} 
            onChange={handleSearchChange} 
            className="border-4 border-pink-500 rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
          />
          <ContinentFilter 
            selected={continent} 
            onChange={handleContinentChange} 
            className="border-4 border-blue-500 rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
          />
        </div>
      </div>
    </header>
  

      <main className="container mx-auto px-4 py-8">
        {filteredCountries.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No countries found matching your criteria.</p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Showing {paginatedCountries.length} of {filteredCountries.length} countries
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedCountries.map((country) => (
                <CountryCard
                  key={country.cca3}
                  country={country}
                  onClick={() => onCountrySelect(country.cca3)}
                />
              ))}
            </div>
            {totalPages > 1 && (
              <PaginationControls
                currentPage={page}
                totalPages={totalPages}
                onPageChange={onPageChange}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
