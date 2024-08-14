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
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import * as SQLite from "expo-sqlite";
import Tile2 from "./components/Tile2";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";

const db = SQLite.openDatabase("routerevise.db");

export default function Viewer() {
  const nav = useNavigation();
  const route = useRoute();
  const { mergedArray } = route.params;
  const [data, setData] = useState(mergedArray);

  useEffect(() => {
    setData(mergedArray);
  }, []);

  const getCurrentDateTime = () => {
    const currentDateTime = new Date();

    const dateFormatOptions = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const formattedDate = currentDateTime.toLocaleDateString(
      undefined,
      dateFormatOptions
    );

    const timeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    const formattedTime = currentDateTime.toLocaleTimeString(
      undefined,
      timeFormatOptions
    );

    return { formattedDate, formattedTime };
  };

  const { formattedDate, formattedTime } = getCurrentDateTime();

  const handleClick = (id) => {
    console.log(id);
    handleDB(id);
  };

  const handleDB = (id) => {
    const date = `${formattedDate},${formattedTime}`;
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM USERS WHERE ID = ?;",
        [id],
        (_, result) => {
          const row = result.rows._array;
          //   console.log(row);
          const dateArray = JSON.parse(row[0].Dates);
          const freqArray = row[0].Frequency;
          dateArray.push(date);
          tx.executeSql(
            "UPDATE USERS SET LastCollected = ?, Frequency = ?, Dates = ?, SENSOR = ? WHERE ID = ?;",
            [date, freqArray + 1, JSON.stringify(dateArray), 0, id],
            (_, updateResult) => {
              const newdata = data.filter((item) => item.id !== id);
              setData(newdata);
              console.log(`Value set for user with id ${row[0].ID}`);
            },
            (_, updateError) => {
              console.error(
                `Error updating SENSOR value for user with id ${row[0].ID}:`,
                updateError
              );
            }
          );
        },
        (_, error) => {
          console.error("Error selecting rows from USERS table:", error);
        }
      );
    });
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View
        style={[
          styles.container,
          { paddingTop: 20, padding: 10, paddingBottom: 20 },
        ]}
      >
        <View>
          <Text
            style={[
              styles.text,
              {
                alignSelf: "center",
              },
            ]}
          >
            List
          </Text>
        </View>
        <ScrollView
          contentContainerStyle={{ gap: 5, paddingTop: 20, paddingBottom: 20 }}
        >
          {data &&
            data
              .filter((item) => item.sensor > 0.3)
              .sort((a, b) => a.distance - b.distance)
              .map((item) => (
                <Tile2
                  icon={"trash-can"}
                  color={"white"}
                  onPress={(id) => {
                    handleClick(id);
                  }}
                  key={item.id}
                  data={{
                    ID: item.id,
                    name: item.title,
                    address: item.description,
                    location: item.coordinate,
                    sensor: item.sensor,
                    distance: item.distance,
                  }}
                />
              ))}
        </ScrollView>
      </View>
      <TouchableOpacity
        style={{ position: "absolute", right: 20, top: 20 }}
        onPress={() => nav.goBack()}
      >
        <MaterialIcons name={"arrow-left"} size={40} color={"white"} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
