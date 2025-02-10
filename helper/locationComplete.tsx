async function fetchLocations(text:string) {
    const url = "https://geocoding-api.open-meteo.com/v1/search?name="+text+"&count=5&language=en&format=json";
    try {
      const response = await fetch(url);        
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

export default fetchLocations;