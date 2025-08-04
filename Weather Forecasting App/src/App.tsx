import React, { useState, useEffect } from 'react';
import { Thermometer } from 'lucide-react';
import { WeatherData, ForecastData } from './types/weather';
import { weatherApi } from './services/weatherApi';
import { SearchBar } from './components/SearchBar';
import { WeatherCard } from './components/WeatherCard';
import { ForecastCard } from './components/ForecastCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';

function App() {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<'C' | 'F'>('C');
  const [locationName, setLocationName] = useState<string>('');

  const getWeatherBackground = (weatherMain?: string) => {
    if (!weatherMain) return 'from-blue-500 to-purple-600';
    
    const condition = weatherMain.toLowerCase();
    
    if (condition.includes('clear') || condition.includes('sunny')) {
        return 'from-yellow-400 via-orange-500 to-red-500';
    } else if (condition.includes('cloud') || condition.includes('overcast')) {
        return 'from-gray-400 via-gray-500 to-gray-600';
    } else if (condition.includes('rain') || condition.includes('drizzle') || condition.includes('shower')) {
        return 'from-blue-600 via-blue-700 to-indigo-800';
    } else if (condition.includes('thunder') || condition.includes('storm')) {
        return 'from-gray-800 via-gray-900 to-black';
    } else if (condition.includes('snow') || condition.includes('blizzard')) {
        return 'from-blue-200 via-blue-300 to-blue-400';
    } else if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze')) {
        return 'from-gray-300 via-gray-400 to-gray-500';
    } else {
        return 'from-blue-500 to-purple-600';
    }
  };

  const fetchWeatherData = async (lat: number, lon: number, name?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [weatherData, forecastData] = await Promise.all([
        weatherApi.getCurrentWeather(lat, lon),
        weatherApi.getForecast(lat, lon)
      ]);
      
      setCurrentWeather(weatherData);
      setForecast(forecastData);
      setLocationName(name || `${weatherData.location.name}, ${weatherData.location.country}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSelect = (lat: number, lon: number, name: string) => {
    fetchWeatherData(lat, lon, name);
  };

  const handleCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const position = await weatherApi.getCurrentPosition();
      await fetchWeatherData(position.coords.latitude, position.coords.longitude);
    } catch (err) {
      setError('Unable to get your location. Please search for a city instead.');
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (currentWeather) {
      fetchWeatherData(currentWeather.location.lat, currentWeather.location.lon);
    } else {
      handleCurrentLocation();
    }
  };

  useEffect(() => {
    handleCurrentLocation();
  }, []);

  const backgroundGradient = getWeatherBackground(currentWeather?.current?.condition?.text);

  return (
    <div className={`min-h-screen bg-gradient-to-br ${backgroundGradient} transition-all duration-1000`}>
      <div className="min-h-screen backdrop-blur-sm bg-black/10">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Weather Forecast
            </h1>
            <p className="text-white/80 text-lg">
              Get current weather and 5-day forecast for any location
            </p>
          </div>

          {/* Search and Controls */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
            <SearchBar 
              onLocationSelect={handleLocationSelect}
              onCurrentLocation={handleCurrentLocation}
              isLoading={isLoading}
            />
            
            <button
              onClick={() => setUnit(unit === 'C' ? 'F' : 'C')}
              className="flex items-center px-4 py-3 bg-white/20 hover:bg-white/30 rounded-2xl text-white font-medium transition-all duration-200 border border-white/30"
            >
              <Thermometer className="h-5 w-5 mr-2" />
              °{unit}
            </button>
          </div>

          {/* Content */}
          <div className="max-w-6xl mx-auto">
            {isLoading && (
              <LoadingSpinner message="Getting weather data..." />
            )}

            {error && (
              <ErrorMessage message={error} onRetry={handleRetry} />
            )}

            {!isLoading && !error && currentWeather && forecast && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <WeatherCard data={currentWeather} unit={unit} />
                </div>
                <div className="space-y-8">
                  <ForecastCard data={forecast} unit={unit} />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-center mt-12 text-white/60">
            <p>Weather data provided by OpenWeatherMap</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;