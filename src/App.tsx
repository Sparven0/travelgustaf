import { useState, useEffect } from "react";
import { HomePage } from "./components/HomePage";
import { CountryDetail } from "./components/CountryDetail";

type View = "home" | "detail";

function App() {
  const [view, setView] = useState<View>("home");
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [continent, setContinent] = useState("");
  const [page, setPage] = useState(1);

  // Initialize state from URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const params = new URLSearchParams(hash.split("?")[1] || "");
      
      if (hash.startsWith("country/")) {
        const countryCode = hash.split("/")[1].split("?")[0];
        setView("detail");
        setSelectedCountry(countryCode);
      } else {
        setView("home");
        setSearchQuery(params.get("search") || "");
        setContinent(params.get("continent") || "");
        setPage(parseInt(params.get("page") || "1", 10));
      }
    };

    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Update URL when state changes
  useEffect(() => {
    if (view === "home") {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      if (continent) params.set("continent", continent);
      if (page > 1) params.set("page", page.toString());
      
      const hash = params.toString() ? `#?${params.toString()}` : "#";
      if (window.location.hash !== hash) {
        window.history.replaceState(null, "", hash);
      }
    }
  }, [view, searchQuery, continent, page]);

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setView("detail");
    window.location.hash = `#country/${countryCode}`;
  };

  const handleBack = () => {
    setView("home");
    const params = new URLSearchParams();
    if (searchQuery) params.set("search", searchQuery);
    if (continent) params.set("continent", continent);
    if (page > 1) params.set("page", page.toString());
    window.location.hash = params.toString() ? `#?${params.toString()}` : "#";
  };

  return (
    <>
      {view === "home" ? (
        <HomePage
          onCountrySelect={handleCountrySelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          continent={continent}
          onContinentChange={setContinent}
          page={page}
          onPageChange={setPage}
        />
      ) : (
        <CountryDetail
          countryCode={selectedCountry}
          onBack={handleBack}
        />
      )}
    </>
  );
}

export default App;
