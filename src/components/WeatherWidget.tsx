import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Cloud, Thermometer, Wind } from 'lucide-react';
import type { WeatherCityData, WeatherWidgetProps } from '@/lib/types';

const WeatherWidgetComponent = ({ theme, counter, data, onCityClick }: WeatherWidgetProps) => {
  const [weatherData, setWeatherData] = useState<WeatherCityData[]>([]);
  const [unit, setUnit] = useState('celsius');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    
    const cities = [
      { name: 'London', lat: 51.5, lon: -0.12 },
      { name: 'New York', lat: 40.71, lon: -74.01 },
      { name: 'Tokyo', lat: 35.68, lon: 139.69 },
      { name: 'Sydney', lat: -33.87, lon: 151.21 },
      { name: 'Paris', lat: 48.85, lon: 2.35 },
      { name: 'Mumbai', lat: 19.07, lon: 72.87 },
      { name: 'Cairo', lat: 30.04, lon: 31.23 },
      { name: 'Berlin', lat: 52.52, lon: 13.4 },
    ];

    const fetchAll = async () => {
        try {
          const results = await Promise.all(
            cities.map(async (city) => {
              try{
            const res =  await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`,
          );
          const data = await res.json();
          return {
                ...city,
                weather: data.current_weather,
                hourly: data.hourly,
              };
            } catch {
              return null;
            }
          })
        );
        setWeatherData(results.filter(Boolean) as WeatherCityData[]);
      } catch (e) {
        console.error('Weather fetch failed', e);
      }
    };

    fetchAll();
  }, []);

  
  const convertTemp = useCallback((celsius: number) => {
    if (unit === 'fahrenheit') {
      return ((celsius * 9) / 5 + 32).toFixed(1) + '°F';
    }
    return celsius?.toFixed(1) + '°C';
  }, [unit]);

  const getWeatherEmoji = useCallback((code: number) => {
    const map: Record<number, string> = {
      0: '☀️ Clear',
      1: '🌤 Mostly Clear',
      2: '⛅ Partly Cloudy',
      3: '☁️ Overcast',
      45: '🌫 Fog',
      48: '🌫 Fog',
      51: '🌦 Light Rain',
      53: '🌧 Rain',
      55: '🌧 Heavy Rain',
      61: '🌦 Light Rain',
      63: '🌧 Rain',
      65: '🌧 Heavy Rain',
      71: '🌨 Snow',
      73: '🌨 Snow',
      75: '❄️ Heavy Snow',
      95: '⛈ Thunderstorm',
    };
    return map[code] || '❓ Unknown';
  }, []);


  const handleUnitChange = useCallback((value: string) => {
    setUnit(value);
  }, []);

  const handleCityClick = useCallback((city: any) => {
    if (onCityClick) onCityClick({ ...city, timestamp: Date.now() });

    setExpanded((prev) => ({
      ...prev,
      [city.name]: !prev[city.name],
    }));
  }, [onCityClick]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Cloud className="h-4 w-4" />
            Weather
          </CardTitle>

          <div className="flex gap-1">
            <Button
              aria-label='celcius'
              variant={unit === 'celsius' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleUnitChange('celsius')}
            >
              °C
            </Button>

            <Button
              aria-label='fahrenite'
              variant={unit === 'fahrenheit' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleUnitChange('fahrenheit')}
            >
              °F
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {weatherData.map((city: WeatherCityData, idx: number) => (
            <button
              aria-label='temprature'
              key={idx}
              className={`p-3 border rounded-lg ${
                theme === 'dark' ? 'border-gray-600' : 'border-gray-200'
              }`}
              onClick={() => handleCityClick(city)}
            >
              <div className="flex justify-between items-center">
                <strong className="text-sm">{city.name}</strong>
                <span className="text-xs">
                  {getWeatherEmoji(city.weather?.weathercode)}
                </span>
              </div>

              <div className="text-2xl font-bold my-1 flex items-center gap-1">
                <Thermometer className="h-5 w-5 text-orange-500" />
                {convertTemp(city.weather?.temperature)}
              </div>

              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Wind className="h-3 w-3" />
                {city.weather?.windspeed} km/h
              </div>

              {expanded[city.name] && city.hourly && (
                <div className="mt-3 max-h-[200px] overflow-auto border-t pt-2">
                  <h4 className="text-xs font-semibold mb-1">Hourly Forecast</h4>

                  {city.hourly.time?.map((time: string, i: number) => (
                    <div
                      key={i}
                      className="flex justify-between text-[11px] py-0.5 border-b"
                    >
                      <span>{moment(time).format('ddd HH:mm')}</span>
                      <span>{convertTemp(city.hourly.temperature_2m[i])}</span>
                      <span>💧 {city.hourly.relative_humidity_2m[i]}%</span>
                    </div>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


export default React.memo(WeatherWidgetComponent);