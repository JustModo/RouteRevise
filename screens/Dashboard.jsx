import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { styles } from "./styles";
import SquareButton from "./components/SquareButton";
import Tile from "./components/Tile";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("routerevise.db");

export default function Dashboard() {
  const nav = useNavigation();
  const [data, setData] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      getData();
    }, [])
  );

  const getData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM USERS;",
        [],
        (_, result) => {
          const users = result.rows._array;
          setData(users);
          console.log("Users:", users);
        },
        (_, error) => {
          console.error("Error querying USERS table:", error);
        }
      );
    });
  };

  const randomizeSensorValues = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT id FROM USERS;",
        [],
        (_, result) => {
          const rows = result.rows._array;
          console.log(rows);

          rows.forEach((row) => {
            const randomValue = getRandomValue();
            tx.executeSql(
              "UPDATE USERS SET SENSOR = ? WHERE ID = ?;",
              [randomValue, row.ID],
              (_, updateResult) => {
                // console.log(
                //   `Sensor value randomized for user with id ${row.ID}`
                // );
              },
              (_, updateError) => {
                console.error(
                  `Error updating SENSOR value for user with id ${row.id}:`,
                  updateError
                );
              }
            );
          });
          getData();
        },
        (_, error) => {
          console.error("Error selecting rows from USERS table:", error);
        }
      );
    });
  };

  const getRandomValue = () => {
    const randomValue = Math.random();
    const roundedValue = Math.round(randomValue * 100) / 100;
    return roundedValue;
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View
          style={{
            height: 80,
            borderBottomWidth: 2,
            borderColor: "white",
            alignItems: "center",
            justifyContent: "space-around",
            flexDirection: "row",
          }}
        >
          <SquareButton
            icon={"graph"}
            color={"white"}
            width={50}
            height={50}
            size={30}
            onPress={() => nav.navigate("Graph")}
          />
          <SquareButton
            icon={"plus"}
            color={"white"}
            width={50}
            height={50}
            size={30}
            onPress={() => nav.navigate("Add")}
          />
        </View>
        <ScrollView
          contentContainerStyle={{ gap: 5, paddingTop: 10, paddingBottom: 20 }}
        >
          {data &&
            data
              .slice() // Create a shallow copy of the array
              .sort((a, b) => b.SENSOR - a.SENSOR) // Sort in descending order based on SENSOR
              .map((item) => (
                <Tile
                  icon={"trash-can"}
                  text={"Name"}
                  color={"white"}
                  key={item.ID}
                  data={{
                    ID: item.ID,
                    name: item.Name,
                    address: item.Address,
                    location: item.Location,
                    sensor: item.SENSOR,
                    lastcollected: item.LastCollected,
                    frequency: item.Frequency,
                    dates: item.Dates,
                  }}
                  onPress={() => nav.navigate("Info", { data })}
                />
              ))}
        </ScrollView>
        <View style={{ position: "absolute", bottom: 10, right: 10 }}>
          <SquareButton
            icon={"dice-6"}
            color={"white"}
            width={50}
            height={50}
            size={30}
            onPress={() => randomizeSensorValues()}
          />
        </View>
        <TouchableOpacity
          style={{ position: "absolute", right: 20, top: 20 }}
          onPress={() => nav.goBack()}
        >
          <MaterialIcons name={"arrow-left"} size={40} color={"white"} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
