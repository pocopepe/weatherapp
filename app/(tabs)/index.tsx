import { useState, useEffect } from 'react';
import {StyleSheet, TextInput, Text, Platform} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import fetchData from '../../helper/fetchData';


export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [city, onChangeCity]= useState("");
  const url = "https://api.open-meteo.com/v1/forecast";

  useEffect(() => {
    async function getCurrentLocation() {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location)

    }
    getCurrentLocation();
  }, []);
  
  useEffect(()=>{
    if (location) {
    fetchData(location);}
  }, [location])
  
  

  return (
    <SafeAreaProvider>
      <SafeAreaView>
      <TextInput
          style={styles.input}
          onChangeText={onChangeCity}
          placeholder="Enter the name of your city"
        />
      <Text style={styles.paragraph}>meh</Text>
      </SafeAreaView>
    </SafeAreaProvider>);
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
