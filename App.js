import { NavigationContainer } from "@react-navigation/native";
import Navigator from "./screens/Navigator";
import { StatusBar } from "expo-status-bar";
import * as SQLite from "expo-sqlite";
import { useEffect } from "react";
const db = SQLite.openDatabase("routerevise.db");

export default function App() {
  useEffect(() => {
    db.transaction((tx) => {
      // tx.executeSql("DROP TABLE IF EXISTS USERS;");

      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS USERS (ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Location TEXT, Address TEXT, SENSOR REAL, LastCollected TEXT, Frequency INTEGER, Dates TEXT);"
      );

      // tx.executeSql(
      //   "INSERT INTO USERS (name, location, sensor, frequency) VALUES (?, ?, ?, ?);",
      //   ["John Doe", "New York", "SensorXYZ", 100]
      // );

      // tx.executeSql(
      //   "SELECT * FROM USERS;",
      //   [],
      //   (_, result) => {
      //     const users = result.rows._array;
      //     console.log("Users:", users);
      //   },
      //   (_, error) => {
      //     console.error("Error querying USERS table:", error);
      //   }
      // );
      //----------------
    });
  }, []);

  return (
    <NavigationContainer>
      <StatusBar hidden={true} />
      <Navigator />
    </NavigationContainer>
  );
}
