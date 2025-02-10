import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Text, FlatList, TouchableOpacity, View, Button } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import fetchData from '../../helper/fetchData';
import fetchLocations from '../../helper/locationComplete';

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
  const [weather, setWeather] = useState<WeatherData[] | null>(null);
  const [city, onChangeCity] = useState<string | null>(null);
  const [location, setLocation] = useState<LocationResult[]>([]);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
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
      const locations = await fetchLocations(city);
      setLocation(locations);

    }, 400);

    return () => clearTimeout(timeoutId);
  }, [city]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            onChangeText={onChangeCity}
            value={city ?? ""}
            placeholder="Enter city name"
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {location.length > 0 && (
          <View style={styles.dropdownContainer}>
            <FlatList
              data={location}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => {
                    const fullLocation = `${item.name}, ${item.admin1 ? `${item.admin1}, ` : ""}${item.admin2 ? `${item.admin2}, ` : ""}${item.country}`;
                    onChangeCity(fullLocation);
                    setCoords({ lat: item.latitude, long: item.longitude });
                    setLocation([]);
                  }}
                >
                  <Text style={styles.dropdownText}>
                    {item.name}, {item.admin1 ? `${item.admin1}, ` : ""}
                    {item.admin2 ? `${item.admin2}, ` : ""}
                    {item.country}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b3b3b5', 
    paddingHorizontal: 10, 
    paddingTop: 20, 
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A", // Dark background
    borderRadius: 25, // Pill shape
    paddingHorizontal: 10, // Inner spacing
    paddingVertical: 5,
    marginHorizontal: 12,
  },
  input: {
    flex: 1, // Makes input take available space
    height: 40,
    color: "#e0e0e0",
    backgroundColor: "#1E1E1E",
    borderRadius: 20,
    paddingHorizontal: 12,
  },
  searchButton: {
    backgroundColor: "#252525", // Dark grey button
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20, // Rounded button edges
    marginLeft: 8,
  },
  searchButtonText: {
    color: "#e0e0e0",
    fontSize: 16,
  },
  dropdownContainer: {
    marginTop: 5,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    backgroundColor: '#1e1e1e',
  },
  dropdownText: {
    fontSize: 16,
    color: '#ddd',
  },
});