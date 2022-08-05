import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, useColorScheme, View, StatusBar } from "react-native";
//import { StatusBar } from "expo-status-bar";
import { enableScreens } from "react-native-screens";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import * as SplashScreen from "expo-splash-screen";
import AppNavigator from "./navigation/AppNavigator";
import { combineReducers, createStore, applyMiddleware } from "redux";
import vocableReducer from "./store/reducers/vocables";
import authReducer from "./store/reducers/auth";
import ReduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import store from "./store/store";
import { initLanguage } from "./i18n/translation";
import Bugsnag from "@bugsnag/react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Colors from "./constants/Colors";
import GlobalStyles from "./constants/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const TAG = "[App.js]"; // Console Log Tag

const middlewares = [ReduxThunk, composeWithDevTools];

if (__DEV__) {
  console.info(TAG, "Developer mode enabled");
}

export default function App() {
  // Optimize Screens
  //enableScreens();

  // States
  const [appIsReady, setAppIsReady] = useState(false);

  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light" ? true : false;

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Keep the splash screen visible while we fetch resources
        await SplashScreen.preventAutoHideAsync();
        await initLanguage();
        // Start Bugsnag to log crashes or errors while running this app
        Bugsnag.start();
        // Pre-load fonts
        await Font.loadAsync({
          roboto: require("./assets/fonts/roboto-regular.ttf"),
          "roboto-medium": require("./assets/fonts/roboto-medium.ttf"),
          "roboto-bold": require("./assets/fonts/roboto-bold.ttf"),
          ...Ionicons.font,
        });

        GoogleSignin.configure({ webClientId: "240878761247-4e2oa3rbbjln20n35ejv1cadm2m5s0ms.apps.googleusercontent.com" });
      } catch (error) {
        console.warn(TAG, "Catched fatal error in prepareApp: " + error);
        Bugsnag.notify(error);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    };

    prepareApp();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  // Expo loading screen (Check if font loaded)
  if (!appIsReady) {
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar translucent backgroundColor={"rgba(0,0,0,0)"} barStyle={isLight ? "dark-content" : "light-content"} />
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
