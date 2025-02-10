import { useState, useEffect } from 'react';
import { StyleSheet, TextInput, Text } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import fetchData from '../../helper/fetchData';

interface Coords {
  lat: number;
  long: number;
}

export default function HomeScreen() {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [city, onChangeCity] = useState("");

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

  console.log(coords);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <TextInput
          style={styles.input}
          onChangeText={onChangeCity}
          placeholder="Enter the name of your city"
        />
        <Text style={styles.paragraph}>{errorMsg ? errorMsg : "Location Loaded"}</Text>
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
