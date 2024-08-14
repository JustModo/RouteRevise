import { View, Text, TouchableOpacity, Image } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from "../styles";
import { useEffect, useState } from "react";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("routerevise.db");

export default function Tile2({ icon, size, data, onPress }) {
  useEffect(() => {
    setData(data);
  }, [data]);

  const [Data, setData] = useState(data);

  const getIconColor = (sensorValue) => {
    if (sensorValue >= 0 && sensorValue <= 0.3) {
      return "green";
    } else if (sensorValue > 0.3 && sensorValue <= 0.7) {
      return "yellow";
    } else {
      return "red";
    }
  };

  return (
    <View
      style={{
        borderRadius: 10,
        height: 50,
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#ffffff",
        flex: 1,
      }}
    >
      <View
        style={{
          position: "absolute",
          left: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MaterialIcons
          name={icon ? icon : "home"}
          size={size ? size : 30}
          color={getIconColor(Data.sensor)}
        />
        <Text
          style={[styles.text, { fontSize: 12, marginLeft: 5 }]}
        >{`${data.distance}Km`}</Text>
      </View>
      <Text
        style={[
          styles.text,
          {
            alignSelf: "center",
            width: 200,
            textAlign: "center",
            fontSize: 16,
          },
        ]}
        numberOfLines={1}
      >
        {Data.name ? `${Data.name}'s House` : null}
      </Text>
      <TouchableOpacity
        style={{
          position: "absolute",
          right: 10,
          borderWidth: 2,
          borderColor: "white",
          borderRadius: 10,
        }}
        onPress={onPress ? () => onPress(data.ID) : () => {}}
      >
        <MaterialIcons name={"check"} size={25} color={"lightgreen"} />
      </TouchableOpacity>
    </View>
  );
}
