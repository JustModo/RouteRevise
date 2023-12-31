import { View, Text, TouchableOpacity, Image } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function SquareButton({
  width,
  icon,
  color,
  onPress,
  size,
  height,
}) {
  return (
    <View
      style={{
        padding: 5,
        borderRadius: 10,
        width,
        height,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#ffffff",
      }}
    >
      <TouchableOpacity onPress={onPress ? () => onPress() : () => {}}>
        <MaterialIcons
          name={icon ? icon : "home"}
          size={size ? size : 20}
          color={color ? color : "white"}
        />
      </TouchableOpacity>
    </View>
  );
}
