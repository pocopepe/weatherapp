interface Coords {
  lat: number;
  long: number;
}

interface WeatherData {
  date: string;
  description: string;
  code: number;
  maxTemp: number;
  minTemp: number;
  currentTemp: number;
}

async function fetchData(coords: Coords): Promise<WeatherData[] | null> {
  if (!coords?.lat || !coords?.long) {
    console.error("Error: Coordinates not available");
    return null;
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.long}&current=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.daily || !data.current) {
      console.error("Error: No weather data received.");
      return null;
    }

    const currentTemp = data.current.temperature_2m;

    const weatherCodeMapping: Record<number, { description: string; code: number }> = {
      0: { description: "Clear", code: 0 },
      1: { description: "Sunny", code: 1 },
      2: { description: "Cloudy", code: 2 },
      3: { description: "Cloudy", code: 2 },
      45: { description: "Cloudy", code: 2 },
      48: { description: "Cloudy", code: 2 },
      51: { description: "Rainy", code: 3 },
      53: { description: "Rainy", code: 3 },
      55: { description: "Rainy", code: 3 },
      61: { description: "Rainy", code: 3 },
      63: { description: "Rainy", code: 3 },
      65: { description: "Rainy", code: 3 },
      80: { description: "Rainy", code: 3 },
      81: { description: "Rainy", code: 3 },
      82: { description: "Rainy", code: 3 },
      95: { description: "Rainy", code: 3 },
      96: { description: "Rainy", code: 3 },
      99: { description: "Rainy", code: 3 },
    };

    return data.daily.time.map((time: string, index: number) => {
      const weatherCode = data.daily.weather_code[index];
      const mappedWeather = weatherCodeMapping[weatherCode] || { description: "Unknown", code: -1 };

      return {
        date: new Date(time).toISOString().split("T")[0],
        description: mappedWeather.description,
        code: mappedWeather.code,
        maxTemp: data.daily.temperature_2m_max[index],
        minTemp: data.daily.temperature_2m_min[index],
        currentTemp,
      };
    });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

export default fetchData;
