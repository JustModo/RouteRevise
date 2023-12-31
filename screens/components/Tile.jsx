import { View, Text, TouchableOpacity, Image } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { styles } from "../styles";
import { useEffect, useState } from "react";

export default function Tile({ icon, color, onPress, size, data }) {
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
    <TouchableOpacity
      style={{
        borderRadius: 10,
        height: 50,
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#ffffff",
        flex: 1,
      }}
      onPress={onPress ? () => onPress() : () => {}}
    >
      <View style={{ position: "absolute", left: 20 }}>
        <MaterialIcons
          name={icon ? icon : "home"}
          size={size ? size : 40}
          color={getIconColor(Data.sensor)}
        />
      </View>
      <Text
        style={[
          styles.text,
          {
            alignSelf: "center",
            width: 200,
            textAlign: "center",
            fontSize: 20,
          },
        ]}
        numberOfLines={1}
      >
        {Data.name ? `${Data.name}'s House` : null}
      </Text>
      <View style={{ position: "absolute", right: 20 }}>
        <MaterialIcons
          name={"information-outline"}
          size={30}
          color={"rgb(0, 153, 0)"}
        />
      </View>
    </TouchableOpacity>
  );
}
