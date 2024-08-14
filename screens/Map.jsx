import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import * as Location from "expo-location";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as SQLite from "expo-sqlite";
import haversine from "haversine";

const db = SQLite.openDatabase("routerevise.db");

export default function Map() {
  const navigation = useNavigation();
  const [fallbackCoordinates, setFallbackCoordinates] = useState({
    latitude: 12.7211451,
    longitude: 74.9691234,
  });
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loc, setLoc] = useState(null);

  useEffect(() => {
    const fetchLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission to access location was denied");
        setCurrentLocation(fallbackCoordinates);
        return;
      }

      try {
        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;
        if (latitude && longitude) {
          clearInterval(intervalId);
          setLoc({ latitude, longitude });
          console.log("Interval cleared!");
        }
        setCurrentLocation({ latitude, longitude });
      } catch (error) {
        console.error("Error getting current location:", error);
        setCurrentLocation(fallbackCoordinates);
      }
    };

    fetchLocation();

    // Set up interval only once
    const intervalId = setInterval(() => {
      fetchLocation();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  // useEffect(() => {
  //   console.log(loc);
  // }, [loc]);

  const [data, setData] = useState(null);
  const [markers, setMarkers] = useState(null);

  function getData() {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT id, Name, Location, Sensor, Address FROM USERS;",
        [],
        (_, result) => {
          const users = result.rows._array;
          setData(users);
          if (users.length > 0) {
            mapData(users);
          } else {
            alert("No Data!");
            navigation.goBack();
          }
        },
        (_, error) => {
          console.error("Error querying USERS table:", error);
        }
      );
    });
  }

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  const mapData = (users) => {
    const mappedMarkers = users.map((item) => {
      const location = JSON.parse(item.Location);
      const latitude = location.latitude;
      const longitude = location.longitude;
      return {
        id: item.ID,
        title: item.Name,
        coordinate: { latitude, longitude },
        description: `${item.Address}`,
        pinColor: "red",
        sensor: item.SENSOR,
      };
    });

    setMarkers(mappedMarkers);
  };

  const [mapLoaded, setMapLoaded] = useState(false);
  const onMapReady = () => {
    setMapLoaded(true);
  };

  const [distances, setDistances] = useState([]);

  const calculateDistances = () => {
    if (markers && loc) {
      const distancesArray = markers.map((marker) => {
        const distance1 = haversine(loc, marker.coordinate);
        const distance = Number(distance1.toFixed(2));
        console.log("Distance Calculated!");
        return { id: marker.id, distance };
      });
      setDistances(distancesArray);
    }
  };

  function openView() {
    console.log(distances, markers);
    calculateDistances();
    if (
      mapLoaded &&
      distances &&
      distances.length > 0 &&
      markers &&
      markers.length > 0
    ) {
      const mergedArray = markers.map((marker) => {
        const distanceObj = distances.find(
          (distance) => distance.id === marker.id
        );
        return { ...marker, ...distanceObj };
      });
      navigation.navigate("Viewer", { mergedArray });
    }
  }

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
          onMapReady={onMapReady}
        >
          {markers
            ? markers
                .filter((marker) => marker.sensor > 0.3)
                .map((marker) => (
                  <Marker
                    key={marker.id}
                    coordinate={marker.coordinate}
                    title={marker.title}
                    description={marker.description}
                    pinColor={marker.color} // Use pinColor instead of color
                  />
                ))
            : null}
          {currentLocation ? (
            <Marker
              key={0}
              coordinate={currentLocation}
              title="Current Location"
              description="You are Here!"
              pinColor={"green"}
            />
          ) : null}
          {markers && markers.length > 0 && currentLocation ? (
            <Polyline
              coordinates={[
                currentLocation,
                ...markers
                  .filter((marker) => marker.sensor > 0.3)
                  .map((marker) => marker.coordinate),
              ]}
              strokeColor="#3498db"
              strokeWidth={4}
            />
          ) : null}
        </MapView>
      )}
      <TouchableOpacity
        style={{ position: "absolute", right: 20, top: 20 }}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name={"arrow-left"} size={40} color={"black"} />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ position: "absolute", right: 20, bottom: 20 }}
        onPress={() => openView()}
      >
        <MaterialIcons name={"menu-open"} size={40} color={"black"} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
