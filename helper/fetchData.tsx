interface Coords {
  lat: number;
  long: number;
}

async function fetchData(coords: Coords) {
  if (!coords?.lat || !coords?.long) {
    console.error("Error: Coordinates not available");
    return;
  }

  const url = `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.long}&current=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&temperature_unit=celsius&timezone=auto`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.daily || !data.current) {
      console.error("Error: No weather data received.");
      return;
    }

    const currentTemp = data.current.temperature_2m;

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
      99: "Severe thunderstorm with hail",
    };

    const weatherData = data.daily.time.map((time: string, index: number) => ({
      date: new Date(time).toISOString().split("T")[0],
      description: weatherCodeMapping[data.daily.weather_code[index]] || "Unknown",
      maxTemp: data.daily.temperature_2m_max[index],
      minTemp: data.daily.temperature_2m_min[index],
      currentTemp,
    }));

    console.log("7-day weather forecast:", weatherData);
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

export default fetchData;
