import React, { useCallback, useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from "react-native";
import { styles } from "./styles";
import DropDownPicker from "react-native-dropdown-picker";
import SquareButton from "./components/SquareButton";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("routerevise.db");

export default function Add() {
  const nav = useNavigation();
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedValue, setSelectedValue] = useState("None");
  const [text, setText] = useState("");
  const [address, setAddress] = useState("");
  const [Location, setLocation] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      getLocation();
    }, [])
  );

  async function getLocation() {
    const item = await AsyncStorage.getItem("COORD");
    await AsyncStorage.removeItem("COORD");
    setLocation(JSON.parse(item));
  }

  function uploadData() {
    console.log(text, Location, selectedValue);
    if (
      text.trim() !== "" &&
      address.trim() !== "" &&
      Location &&
      selectedValue
    ) {
      let sensor;
      if (selectedValue == "None" || selectedValue == "No Sensor") {
        sensor = 0;
      } else {
        sensor = 0;
      }
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO USERS (Name, Location, Address, Sensor, LastCollected, Frequency, Dates ) VALUES (?, ?, ?, ?, ?, ?, ?);",
          [text, JSON.stringify(Location), address, sensor, "", 0, "[]"],
          (_, result) => {
            const users = result.rows._array;
            console.log("Sucessfully Saved!");
            alert("Sucessfully Saved!!");
            nav.navigate("Dashboard");
          },
          (_, error) => {
            console.error("Error Saving!");
            alert("Error Saving!");
            nav.navigate("Dashboard");
          }
        );
      });
    } else {
      alert("Can't Leave Blank!");
    }
  }

  //-----------------------------------------------------

  return (
    <SafeAreaView style={styles.screen}>
      <View
        style={[
          styles.container,
          {
            justifyContent: "center",
            paddingBottom: 30,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            { alignSelf: "center", position: "absolute", top: 40 },
          ]}
        >
          Add Entry
        </Text>
        <View style={{ alignSelf: "center", position: "absolute", bottom: 30 }}>
          <SquareButton
            icon={"plus"}
            size={40}
            height={60}
            width={200}
            onPress={uploadData}
          />
        </View>
        <View
          style={{
            flex: 1,
            maxHeight: "50%",
            justifyContent: "space-around",
          }}
        >
          <View>
            <TextInput
              style={[
                styles.textinput,
                {
                  fontSize: 20,
                  padding: 5,
                  margin: 10,
                  marginTop: 0,
                  width: 300,
                  alignSelf: "center",
                },
              ]}
              placeholder="Enter Name"
              placeholderTextColor={"rgb(177, 186, 196)"}
              value={text}
              onChangeText={(text) => setText(text)}
            />
          </View>
          <View>
            <TextInput
              style={[
                styles.textinput,
                {
                  fontSize: 20,
                  padding: 5,
                  margin: 10,
                  marginTop: 0,
                  width: 300,
                  alignSelf: "center",
                },
              ]}
              placeholder="Enter Address"
              placeholderTextColor={"rgb(177, 186, 196)"}
              value={address}
              onChangeText={(text) => setAddress(text)}
            />
          </View>
          <View>
            <DropDownPicker
              open={openDropdown}
              value={selectedValue}
              items={[
                { label: "None", value: "None" },
                text
                  ? {
                      label: `${text}'s Sensor`,
                      value: `${text}'s Sensor`,
                    }
                  : {
                      label: `No Sensor`,
                      value: `No Sensor`,
                    },
              ]}
              setOpen={setOpenDropdown}
              setValue={setSelectedValue}
              placeholder={selectedValue}
              style={{
                backgroundColor: "black",
                borderColor: "white",
                borderWidth: 2,
                width: 300,
                alignSelf: "center",
              }}
              dropDownContainerStyle={{
                backgroundColor: "black",
                borderColor: "white",
                width: 300,
                alignSelf: "center",
              }}
              textStyle={{
                color: "white",
                fontWeight: "bold",
              }}
            />
          </View>
          <View>
            <Text
              style={[
                styles.text,
                { textAlign: "center", fontSize: 18, margin: 10 },
              ]}
            >
              Set Location
            </Text>
            <View style={{ alignSelf: "center" }}>
              <SquareButton
                icon={"map"}
                size={40}
                height={60}
                width={200}
                onPress={() => nav.navigate("MapLocation")}
              />
            </View>
            {Location && (
              <Text
                style={[
                  styles.text,
                  { textAlign: "center", fontSize: 18, margin: 10 },
                ]}
              >
                {`${Location.latitude}\n${Location.longitude}`}
              </Text>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
