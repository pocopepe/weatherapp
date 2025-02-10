interface Location {
  coords: {
    latitude: number;
    longitude: number;
  };
}


async function fetchData(location: Location) {
    if (!location?.coords?.latitude || !location?.coords?.longitude) {
      console.error("Error: Location not available");
      return;
    }
  
    const params = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      current: 'temperature_2m',
      daily: 'weather_code,temperature_2m_max,temperature_2m_min',
      temperature_unit: 'celsius',
      timezone: 'auto'
    };
  
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${params.latitude}&longitude=${params.longitude}&current=${params.current}&daily=${params.daily}&temperature_unit=${params.temperature_unit}&timezone=${params.timezone}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (!data.daily || !data.current) {
        console.error("Error: No weather data received.");
        return;
      }
  
      const currentTemp = data.current.temperature_2m;  
      console.log(`Current Temperature: ${currentTemp}°C`);
  
      const weatherCodeMapping: Record<number, string> = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Fog",
        48: "Rime fog",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Heavy drizzle",
        61: "Light rain",
        63: "Moderate rain",
        65: "Heavy rain",
        80: "Light rain showers",
        81: "Moderate rain showers",
        82: "Heavy rain showers",
        95: "Thunderstorm",
        96: "Thunderstorm with hail",
        99: "Severe thunderstorm with hail"
      };
  
      const dailyWeather = data.daily;
      const weatherData = [];
  
      for (let i = 0; i < 7; i++) {  
        const weatherCode = dailyWeather.weather_code[i];
        weatherData.push({
          date: new Date(dailyWeather.time[i]).toISOString().split("T")[0], 
          description: weatherCodeMapping[weatherCode] || "Unknown",
          temperature: currentTemp,
        });
      }
  
      console.log("7-day weather forecast:", weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
  }

export default fetchData;