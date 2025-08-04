import React, { useState, useRef, useEffect } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { weatherApi } from '../services/weatherApi';
import { SearchLocation } from '../types/weather';

interface SearchBarProps {
  onLocationSelect: (lat: number, lon: number, name: string) => void;
  onCurrentLocation: () => void;
  isLoading?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  onLocationSelect, 
  onCurrentLocation,
  isLoading = false
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const searchLocations = async () => {
      if (query.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setIsSearching(true);
      try {
        const results = await weatherApi.searchLocations(query);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsSearching(false);
      }
    };

    const debounceTimer = setTimeout(searchLocations, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  const handleSuggestionClick = (location: SearchLocation) => {
    const locationName = `${location.name}${location.region ? `, ${location.region}` : ''}, ${location.country}`;
    onLocationSelect(location.lat, location.lon, locationName);
    setQuery('');
    setShowSuggestions(false);
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a location..."
          className="w-full pl-10 pr-12 py-3 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
        />
        <button
          onClick={onCurrentLocation}
          disabled={isLoading}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/70 hover:text-white transition-colors duration-200 disabled:opacity-50"
          title="Use current location"
        >
          <MapPin className="h-5 w-5" />
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden z-50">
          {suggestions.map((location, index) => (
            <button
              key={location.id}
              onClick={() => handleSuggestionClick(location)}
              className="w-full text-left px-4 py-3 text-gray-800 hover:bg-blue-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium">
                {location.name}
                {location.region && `, ${location.region}`}
              </div>
              <div className="text-sm text-gray-600">{location.country}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};