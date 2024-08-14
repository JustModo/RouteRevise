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

import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";

export default function Info() {
  const nav = useNavigation();
  const route = useRoute();

  const { data } = route.params;
  useEffect(() => {
    setData(data);
    console.log(data);
  }, [data]);
  const [Data, setData] = useState(data);

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
            Info
          </Text>
        </View>
        <View style={{ flex: 1, rowGap: 20, paddingTop: 50 }}>
          <View style={styles.tile}>
            <Text style={[styles.text, { fontSize: 24 }]}>Name</Text>
            <Text style={[styles.text, { fontSize: 20, fontWeight: "normal" }]}>
              {Data[0].Name}
            </Text>
          </View>
          <View style={styles.tile}>
            <Text style={[styles.text, { fontSize: 24 }]}>Address</Text>
            <Text style={[styles.text, { fontSize: 20, fontWeight: "normal" }]}>
              {Data[0].Address}
            </Text>
          </View>

          <View style={styles.tile}>
            <Text style={[styles.text, { fontSize: 24 }]}>Status</Text>
            <Text style={[styles.text, { fontSize: 20, fontWeight: "normal" }]}>
              {`${Data[0].SENSOR * 100}%`}
            </Text>
          </View>

          <View style={styles.tile}>
            <Text style={[styles.text, { fontSize: 24 }]}>Date Visited</Text>
            <Text style={[styles.text, { fontSize: 20, fontWeight: "normal" }]}>
              {Data[0].LastCollected}
            </Text>
          </View>
        </View>
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
