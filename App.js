import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { enableScreens } from "react-native-screens";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import NavigationContainer from "./navigation/NavigationContainer";
import { combineReducers, createStore, applyMiddleware } from "redux";
import vocableReducer from "./store/reducers/vocables";
import ReduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";

export default function App() {
  // Optimize Screens
  enableScreens();

  // States
  const [fontLoaded, setFontLoaded] = useState(false);

  const rootReducer = combineReducers({
    vocables: vocableReducer,
  });

  const store = createStore(rootReducer, composeWithDevTools(applyMiddleware(ReduxThunk)));

  // Function to load Fonts
  const fetchFonts = () => {
    return Font.loadAsync({
      "ms-new-tai-lue": require("./assets/fonts/microsoft-new-tai-lue-regular.ttf"),
      "ms-new-tai-lue-bold": require("./assets/fonts/microsoft-new-tai-lue-bold.ttf"),
    });
  };

  // Expo loading screen (Check if font loaded)
  if (!fontLoaded) {
    return (
      <AppLoading
        startAsync={fetchFonts}
        onFinish={() => {
          setFontLoaded(true);
        }}
      />
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
