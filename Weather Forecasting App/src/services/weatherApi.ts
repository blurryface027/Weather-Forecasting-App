import { WeatherData, ForecastData, SearchLocation } from '../types/weather';

const API_KEY = '68f65840747a4f4a8fa62347250807';
const BASE_URL = 'https://api.weatherapi.com/v1';

export const weatherApi = {
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    const response = await fetch(
      `${BASE_URL}/current.json?key=${API_KEY}&q=${lat},${lon}&aqi=yes`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch current weather');
    }
    return response.json();
  },

  async getForecast(lat: number, lon: number): Promise<ForecastData> {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=5&aqi=no&alerts=no`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch weather forecast');
    }
    return response.json();
  },

  async searchLocations(query: string): Promise<SearchLocation[]> {
    if (query.length < 2) return [];
    const response = await fetch(
      `${BASE_URL}/search.json?key=${API_KEY}&q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error('Failed to search locations');
    }
    return response.json();
  },

  async getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      });
    });
  },
};