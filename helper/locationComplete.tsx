interface LocationResult {
    admin1?: string;
    admin2?: string;
    country: string;
    latitude: number;
    longitude: number;
    name: string;
    timezone: string;
  }
  
  interface LocationResponse {
    results?: LocationResult[];
  }
  
  async function fetchLocations(text: string): Promise<LocationResult[]> {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${text}&count=5&language=en&format=json`;
  
    try {
      const response = await fetch(url);
      const data: LocationResponse = await response.json();
  
      if (!data.results) return [];
  
      return data.results.map(({ 
        admin1, 
        admin2, 
        country, 
        latitude, 
        longitude, 
        name, 
        timezone 
      }) => ({
        admin1, 
        admin2, 
        country, 
        latitude, 
        longitude, 
        name, 
        timezone
      }));
    } catch (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
  }
  
  export default fetchLocations;
  