import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    backgroundColor: "black",
    padding: 5,
    flex: 1,
  },
  container: {
    borderWidth: 2,
    borderColor: "white",
    flex: 1,
    borderRadius: 10,
  },
  text: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  textinput: {
    backgroundColor: "transparent",
    paddingLeft: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#ffffff",
    color: "white",
    fontWeight: "bold",
  },
  head: {
    height: 60,
  },
  headText: {
    margin: 6,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
  },
  row: {
    height: 50,
  },
  text1: {
    margin: 6,
    textAlign: "center",
    color: "white",
    fontSize: 18,
  },
  text2: {
    margin: 6,
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  tile: {
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    padding: 20,
  },
});
