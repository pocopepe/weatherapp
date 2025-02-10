import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Text } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import fetchData from '../../helper/fetchData';
import fetchLocations from '../../helper/locationComplete'
interface LocationResult {
  admin1?: string;
  admin2?: string;
  country: string;
  latitude: number;
  longitude: number;
  name: string;
  timezone: string;
}


interface WeatherData {
  date: string;
  description: string;
  maxTemp: number;
  minTemp: number;
  currentTemp: number;
}

interface Coords {
  lat: number;
  long: number;
}
export default function HomeScreen() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [weather, setWeather] = useState<WeatherData[] | null>(null); 
  const [city, onChangeCity] = useState<string | null>(null);
  let location;
  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setCoords({
        lat: location.coords.latitude,
        long: location.coords.longitude,
      });
    }
    getCurrentLocation();
  }, []);
  useEffect(() => {
    if (coords) {
      fetchData(coords);
    }
  }, [coords]);
  useEffect(() => {
    async function fetchWeather() {
      if (coords) {
        const weatherData = await fetchData(coords);
        if (weatherData) {
          setWeather(weatherData);
        }
      }
    }
    fetchWeather();
  }, [coords]);

  useEffect(() => {
    if (!city) return;
    const timeoutId = setTimeout(async () => {
      console.log("Fetching locations for:", city);
      const locations = await fetchLocations(city);
      location=locations
    }, 500);
  
    return () => clearTimeout(timeoutId);
  }, [city]);
  

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <TextInput
          style={styles.input}
          onChangeText={onChangeCity}
          placeholder="Enter the name of your city"
        />
        <Text style={styles.paragraph}>{location}</Text>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
});
