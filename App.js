import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { enableScreens } from 'react-native-screens';
import * as Font from "expo-font";
import { AppLoading } from 'expo';
import NavigationContainer from "./navigation/NavigationContainer";

export default function App() {
  // Optimize Screens
  enableScreens();

  // States
  const [fontLoaded, setFontLoaded] = useState(false);
  
  // Function to load Fonts
  const fetchFonts = () => {
    return Font.loadAsync({
      "ms-new-tai-lue": require("./assets/fonts/microsoft-new-tai-lue-regular.ttf"),
      "ms-new-tai-lue": require("./assets/fonts/microsoft-new-tai-lue-bold.ttf"),
    });
  }

  // Expo loading screen (Check if font loaded)
  if (!fontLoaded) {
    return <AppLoading startAsync={fetchFonts} onFinish={() => { setFontLoaded(true) }} />
  }

  return (
    <NavigationContainer />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
