import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import Home from "./Home";
import Map from "./Map";
import Dashboard from "./Dashboard";
import Add from "./Add";
import MapLocation from "./MapLocation";
import Viewer from "./Viewer";
import { NavigationContainer } from "@react-navigation/native";
const Stack = createStackNavigator();

export default function Navigator() {
  return (
    <Stack.Navigator initialRouteName={"Home"}>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Map"
        component={Map}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Add"
        component={Add}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MapLocation"
        component={MapLocation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Viewer"
        component={Viewer}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
