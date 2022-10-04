import React from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import Colors from "../constants/Colors";

const TAG = "[StartScreen]";

const StartScreen = (props) => {
  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={Colors.ActivityIndicatorDark} />
    </View>
  );
};

export const StartScreenOptions = (navigationData) => {
  return {
    title: "",
    headerTransparent: true,
  };
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StartScreen;
