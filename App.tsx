import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert, PermissionsAndroid, Platform, Image } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';

export default function App() {
const [sending, setSending] = useState(false);

const requestLocationPermission = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true;
};

const sendLocation = async () => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    Alert.alert('Permission Denied', 'Location permission is required.');
    return;
  }

  setSending(true);

  // Get the location with fresh data
  Geolocation.getCurrentPosition(
    async position => {
      const { latitude, longitude } = position.coords;
      console.log('Latitude:', latitude);
      console.log('Longitude:', longitude);

      try {
        await axios.post('http://100.89.116.48:8000/emergency', {
          latitude,
          longitude
        });

        Alert.alert('Success', 'Drone activated!');
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to contact drone.');
      }

      setSending(false);
    },
    error => {
      console.error(error);
      Alert.alert('Error', 'Could not get location.');
      setSending(false);
    },
    {   enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000,
        forceRequestLocation: true,
        showLocationDialog: true
    }

  );
};

  return (
    <View style={styles.container}>
      <Image source={require('./assets/vayun1.png')} style={styles.image} />
      <Text style={styles.title}>VAYUN</Text>
      <View style={styles.buttonWrapper}>
          <Button height='60' color='#ffcc22' title={sending ? 'Sending...' : 'HELP!'} onPress={sendLocation} disabled={sending} style={styles.button}/>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 36,
    marginBottom: 20,
    marginTop:20,
    fontWeight: 'bold'
  },
  image: {
      width: 200,
      height: 200,
      resizeMode: 'contain', // or 'cover', 'stretch'
    },
  buttonWrapper: {
      width:200,
      marginTop:40,
      backgroundColor: '#ffcc22'
      }
});