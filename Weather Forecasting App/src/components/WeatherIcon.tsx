import React from 'react';
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Zap,
  CloudDrizzle,
  Eye,
  Moon,
  CloudLightning,
} from 'lucide-react';

interface WeatherIconProps {
  weatherMain: string;
  weatherId: number;
  isDay?: boolean;
  size?: number;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ 
  weatherMain, 
  weatherId, 
  isDay = true, 
  size = 24,
  className = ""
}) => {
  const getWeatherIcon = () => {
    const iconProps = { size, className };
    const condition = weatherMain.toLowerCase();

    // Thunderstorm conditions
    if (condition.includes('thunder') || condition.includes('storm')) {
      return <CloudLightning {...iconProps} />;
    }
    
    // Drizzle conditions
    if (condition.includes('drizzle') || condition.includes('light rain')) {
      return <CloudDrizzle {...iconProps} />;
    }
    
    // Rain conditions
    if (condition.includes('rain') || condition.includes('shower')) {
      return <CloudRain {...iconProps} />;
    }
    
    // Snow conditions
    if (condition.includes('snow') || condition.includes('blizzard') || condition.includes('sleet')) {
      return <CloudSnow {...iconProps} />;
    }
    
    // Atmosphere conditions (mist, fog, etc.)
    if (condition.includes('mist') || condition.includes('fog') || condition.includes('haze') || condition.includes('dust')) {
      return <Eye {...iconProps} />;
    }
    
    // Clear conditions
    if (condition.includes('clear') || condition.includes('sunny')) {
      return isDay ? <Sun {...iconProps} /> : <Moon {...iconProps} />;
    }
    
    // Cloudy conditions
    if (condition.includes('cloud') || condition.includes('overcast') || condition.includes('partly')) {
      return <Cloud {...iconProps} />;
    }
    
    // Default
    return isDay ? <Sun {...iconProps} /> : <Moon {...iconProps} />;
  };

  return getWeatherIcon();
};