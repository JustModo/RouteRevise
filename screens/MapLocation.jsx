import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MapLocation({ route }) {
  const navigation = useNavigation();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [fallbackCoordinates, setFallbackCoordinates] = useState({
    latitude: 12.7211451, // Fallback latitude (e.g., coordinates of San Francisco)
    longitude: 74.9691234, // Fallback longitude
  });
  const [markerCoordinates, setMarkerCoordinates] = useState(null);

  const sendValueBack = async () => {
    await AsyncStorage.setItem("COORD", JSON.stringify(markerCoordinates));
    navigation.goBack();
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setCurrentLocation(fallbackCoordinates);
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        setCurrentLocation({ latitude, longitude });
      } catch (error) {
        console.error("Error getting current location:", error);
        setCurrentLocation(fallbackCoordinates);
      }
    })();
  }, []);

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarkerCoordinates({ latitude, longitude });
  };

  const handleConfirmPress = () => {
    if (markerCoordinates) {
      console.log("Marker Coordinates:", markerCoordinates);
      // alert(
      //   "Coordinates Saved",
      //   "Marker coordinates have been saved successfully."
      // );
      sendValueBack();
    } else {
      alert("No Marker", "Please add a marker before confirming.");
    }
  };

  const [mapLoaded, setMapLoaded] = useState(false);
  const onMapReady = () => {
    // Map is loaded, set mapLoaded to true
    setMapLoaded(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!mapLoaded && (
        <ActivityIndicator
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          size="large"
        />
      )}
      {currentLocation && (
        <MapView
          provider={PROVIDER_DEFAULT}
          style={{ flex: 1, width: "100%", height: 300 }}
          initialRegion={{
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          onPress={handleMapPress}
          onMapReady={onMapReady}
        >
          {markerCoordinates && (
            <Marker
              coordinate={markerCoordinates}
              title="Marker"
              description="Selected Location"
            />
          )}
        </MapView>
      )}
      <Button title="Confirm" onPress={handleConfirmPress} />
    </SafeAreaView>
  );
}
