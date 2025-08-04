import React from 'react';
import { ForecastData } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';

interface ForecastCardProps {
  data: ForecastData;
  unit: 'C' | 'F';
}

export const ForecastCard: React.FC<ForecastCardProps> = ({ data, unit }) => {
  const getTemp = (tempC: number, tempF: number) => {
    return unit === 'F' ? Math.round(tempF) : Math.round(tempC);
  };

  const forecastDays = data.forecast.forecastday.map((day, index) => ({
    date: day.date,
    dayName: index === 0 ? 'Today' : new Date(day.date).toLocaleDateString([], { weekday: 'short' }),
    condition: day.day.condition,
    maxTemp: day.day.maxtemp_c,
    maxTempF: day.day.maxtemp_f,
    minTemp: day.day.mintemp_c,
    minTempF: day.day.mintemp_f
  }));

  return (
    <div className="bg-white/20 backdrop-blur-md rounded-3xl p-8 shadow-xl border border-white/30">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        5-Day Forecast
      </h3>
      
      <div className="space-y-4">
        {forecastDays.map((day, index) => (
          <div 
            key={day.date}
            className="flex items-center justify-between p-4 bg-white/10 rounded-2xl hover:bg-white/15 transition-all duration-200"
          >
            <div className="flex items-center flex-1">
              <div className="text-white font-medium w-12">
                {day.dayName}
              </div>
              <div className="ml-4 flex items-center">
                <WeatherIcon 
                  weatherMain={day.condition.text}
                  weatherId={day.condition.code}
                  size={32}
                  className="text-white mr-3"
                />
                <div className="text-white/80 text-sm capitalize">
                  {day.condition.text}
                </div>
              </div>
            </div>
            
            <div className="flex items-center text-white">
              <span className="text-lg font-semibold">
                {getTemp(day.maxTemp, day.maxTempF)}°
              </span>
              <span className="text-white/60 ml-2">
                {getTemp(day.minTemp, day.minTempF)}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};