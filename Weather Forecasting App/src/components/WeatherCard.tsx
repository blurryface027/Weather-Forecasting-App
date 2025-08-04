import React from 'react';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Eye, 
  Gauge,
  Sunrise,
  Sunset
} from 'lucide-react';
import { WeatherData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface WeatherCardProps {
  data: WeatherData;
  unit: 'C' | 'F';
}

export const WeatherCard: React.FC<WeatherCardProps> = ({ data, unit }) => {
  const getTemp = (tempC: number, tempF: number) => {
    return unit === 'F' ? Math.round(tempF) : Math.round(tempC);
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">
          {data.location.name}, {data.location.country}
        </h2>
        <p className="text-white/80 capitalize">
          {data.current.condition.text}
        </p>
      </div>

      <div className="flex items-center justify-center mb-8">
        <WeatherIcon 
          weatherMain={data.current.condition.text}
          weatherId={data.current.condition.code}
          isDay={data.current.is_day === 1}
          size={80}
          className="text-white mr-6"
        />
        <div className="text-center">
          <div className="text-6xl font-bold text-white">
            {getTemp(data.current.temp_c, data.current.temp_f)}°{unit}
          </div>
          <div className="text-white/80 text-lg">
            Feels like {getTemp(data.current.feelslike_c, data.current.feelslike_f)}°{unit}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/10 rounded-2xl p-4">
          <div className="flex items-center text-white/80 mb-2">
            <Droplets className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Humidity</span>
          </div>
          <div className="text-white text-lg font-semibold">
            {data.current.humidity}%
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-4">
          <div className="flex items-center text-white/80 mb-2">
            <Wind className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Wind</span>
          </div>
          <div className="text-white text-lg font-semibold">
            {Math.round(data.current.wind_kph)} km/h
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-4">
          <div className="flex items-center text-white/80 mb-2">
            <Eye className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Visibility</span>
          </div>
          <div className="text-white text-lg font-semibold">
            {data.current.vis_km} km
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-4">
          <div className="flex items-center text-white/80 mb-2">
            <Gauge className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Pressure</span>
          </div>
          <div className="text-white text-lg font-semibold">
            {data.current.pressure_mb} mb
          </div>
        </div>

        <div className="bg-white/10 rounded-2xl p-4">
          <div className="flex items-center text-white/80 mb-2">
            <Thermometer className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">UV Index</span>
          </div>
          <div className="text-white text-lg font-semibold">
            {data.current.uv}
          </div>
        </div>
      </div>
    </div>
  );
};