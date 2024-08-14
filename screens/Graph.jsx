import React, { useEffect, useRef, useState } from "react";
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
import MaterialIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LineChart, BarChart } from "react-native-chart-kit";
import DropDownPicker from "react-native-dropdown-picker";
import { Table, Row, Rows } from "react-native-table-component";

const db = SQLite.openDatabase("routerevise.db");

export default function Graph() {
  const nav = useNavigation();
  const [data, setData] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [selectedValue, setSelectedValue] = useState(1);
  const [dateFrequency, setDateFrequency] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [])
  );
  const fetchData = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM USERS;",
        [],
        (_, result) => {
          const users = result.rows._array;
          if (users && users.length > 0) {
            const dateFrequency = processDateFrequency(users);
            setDateFrequency(dateFrequency);
            setUsers(users);
            setData(users);
          }
        },
        (_, error) => {
          console.error("Error querying USERS table:", error);
        }
      );
    });
  };

  const getChartData = () => {
    if (data) {
      const chartData = {
        labels: data.map((user) => user.Name),
        datasets: [
          {
            data: data.map((user) => user.Frequency),
          },
        ],
      };
      return chartData;
    }
  };

  const processDateFrequency = (users) => {
    const dateFrequencyMap = new Map();

    users.forEach((user) => {
      const dateArray = JSON.parse(user.Dates);

      dateArray.forEach((date1) => {
        // Ignore blank values
        if (date1.trim() !== "") {
          let date = date1.split(",");
          date = date[0];
          if (dateFrequencyMap.has(date)) {
            dateFrequencyMap.set(date, dateFrequencyMap.get(date) + 1);
          } else {
            dateFrequencyMap.set(date, 1);
          }
        }
      });
    });

    return Array.from(dateFrequencyMap.entries());
  };

  const calculateDaysSinceLastCollected = (lastCollected) => {
    if (!lastCollected) {
      return "-";
    }
    const [datePart, timePart] = lastCollected.split(",");
    const [day, month, year] = datePart.split("/");
    const formattedDateString = `${year}-${month}-${day}T${timePart}`;
    const lastCollectedDate = new Date(formattedDateString);
    const currentDate = new Date();
    const timeDifference = currentDate - lastCollectedDate;
    const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hoursDifference = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    return `${daysDifference}d ${hoursDifference}h`;
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={[styles.container, { padding: 10 }]}>
        <Text style={[styles.text, { alignSelf: "center" }]}>Graph</Text>
        <View
          style={{
            alignItems: "center",
            flexDirection: "column",
            flex: 1,
            paddingTop: 40,
          }}
        >
          <DropDownPicker
            open={openDropdown}
            value={selectedValue}
            items={[
              { label: "Individual Frequency Chart", value: "1" },
              { label: "Daily Cumulative Total Chart ", value: "2" },
              { label: "Recent Timestamp Chart", value: "3" },
            ]}
            setOpen={setOpenDropdown}
            setValue={setSelectedValue}
            style={{
              backgroundColor: "black",
              borderColor: "white",
              borderWidth: 2,
              width: 300,
              alignSelf: "center",
              marginBottom: 20,
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
          <ScrollView
            horizontal
            vertical
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center",
              padding: 20,
            }}
            showsHorizontalScrollIndicator={false}
          >
            {data && selectedValue == 1 && (
              <LineChart
                data={getChartData()}
                width={data.length * 200}
                height={600}
                yAxisLabel=""
                chartConfig={{
                  backgroundGradientFrom: "#005",
                  backgroundGradientTo: "#006",
                  decimalPlaces: 2,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726",
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            )}
            {data && selectedValue == 2 && (
              <BarChart
                data={{
                  labels: dateFrequency.map(([date, frequency]) => date),
                  datasets: [
                    {
                      data: dateFrequency.map(([date, frequency]) => frequency),
                    },
                  ],
                }}
                width={dateFrequency.length * 300}
                height={600}
                //   yAxisLabel="Frequency"
                chartConfig={{
                  backgroundGradientFrom: "#005",
                  backgroundGradientTo: "#005",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                  labelColor: (opacity = 1) =>
                    `rgba(255, 255, 255, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            )}
            {data && selectedValue == 3 && (
              <View style={{ flex: 1 }}>
                <Table
                  borderStyle={{
                    borderWidth: 2,
                    borderColor: "#ffffff",
                  }}
                >
                  <Row
                    data={["User Name", "Time Since", "Last Collected Date"]}
                    style={styles.head}
                    textStyle={styles.text2}
                    widthArr={[300, 150, 200]} // Set the width for each column
                  />
                  {users
                    .slice()
                    .reverse()
                    .map((user) => (
                      <Row
                        key={user.ID}
                        data={[
                          user.Name,
                          calculateDaysSinceLastCollected(
                            user.LastCollected
                          ).toString(),
                          user.LastCollected ? user.LastCollected : "-",
                        ]}
                        style={styles.row}
                        textStyle={styles.text1}
                        widthArr={[300, 150, 200]} // Set the width for each column
                      />
                    ))}
                </Table>
              </View>
            )}
          </ScrollView>
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
