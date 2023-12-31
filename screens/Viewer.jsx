import React, { useEffect, useState } from "react";
import { SafeAreaView, ScrollView, Text, TextInput, View } from "react-native";
import { styles } from "./styles";
import SquareButton from "./components/SquareButton";
import Tile from "./components/Tile";
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import * as SQLite from "expo-sqlite";
import Tile2 from "./components/Tile2";

const db = SQLite.openDatabase("routerevise.db");

export default function Viewer() {
  const route = useRoute();
  const { mergedArray } = route.params;
  const [data, setData] = useState(mergedArray);

  useEffect(() => {
    setData(mergedArray);
  }, []);

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
                  onPress={() => {}}
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
    </SafeAreaView>
  );
}
