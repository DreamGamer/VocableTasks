import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { enableScreens } from "react-native-screens";
import * as Font from "expo-font";
import AppLoading from "expo-app-loading";
import AppNavigator from "./navigation/AppNavigator";
import { combineReducers, createStore, applyMiddleware } from "redux";
import vocableReducer from "./store/reducers/vocables";
import authReducer from "./store/reducers/auth";
import ReduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import { Provider } from "react-redux";
import { initLanguage } from "./i18n/translation";
import Bugsnag from "@bugsnag/react-native";

const TAG = "[App.js]: "; // Console Log Tag


const rootReducer = combineReducers({
    vocables: vocableReducer,
    auth: authReducer,
});

const middlewares = [ReduxThunk];

if (__DEV__) {
    console.info(TAG + "Developer mode enabled");
    const createDebugger = require("redux-flipper").default;
    middlewares.push(createDebugger());
}

const store = createStore(rootReducer, applyMiddleware(...middlewares));

export default function App() {
    // Optimize Screens
    //enableScreens();

    // States
    const [fontLoaded, setFontLoaded] = useState(false);

    // Function to load Fonts
    const fetchFonts = async () => {
        await initLanguage();
        Bugsnag.start();
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
                onError={console.error}
            />
        );
    }

    return (
        <Provider store={store}>
            <AppNavigator />
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
