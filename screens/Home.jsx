import React from "react";
import { Button, Image, SafeAreaView, Text, View } from "react-native";
import { styles } from "./styles";
import LOGO from "../assets/logo.png";
import { useNavigation } from "@react-navigation/native";
import SquareButton from "./components/SquareButton";

export default function Home() {
  const nav = useNavigation();
  return (
    <SafeAreaView style={styles.screen}>
      <View
        style={[
          styles.container,
          { padding: 10, justifyContent: "center", paddingBottom: 50 },
        ]}
      >
        <View>
          <Image
            source={LOGO}
            style={{ width: 150, height: 150, alignSelf: "center" }}
          />
          <Text
            style={[
              styles.text,
              {
                alignSelf: "center",
                color: "rgb(0, 153, 0)",
              },
            ]}
          >
            RouteRevise
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 100,
          }}
        >
          <SquareButton
            icon={"map"}
            width={90}
            height={60}
            size={30}
            color={"lightgreen"}
            onPress={() => nav.navigate("Map")}
          />
          <SquareButton
            icon={"desktop-mac-dashboard"}
            width={90}
            height={60}
            size={30}
            color={"lightgreen"}
            onPress={() => nav.navigate("Dashboard")}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
