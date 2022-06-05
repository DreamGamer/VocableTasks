import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
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
    const [appIsReady, setAppIsReady] = useState(false);

    useEffect(() => {
        async function prepareApp() {
            try {
                // Keep the splash screen visible while we fetch resources
                await SplashScreen.preventAutoHideAsync();
                await initLanguage();
                // Start Bugsnag to log crashes or errors while running this app
                Bugsnag.start();
                // Pre-load fonts
                await Font.loadAsync({
                    "roboto": require("./assets/fonts/roboto-regular.ttf"),
                    "roboto-medium": require("./assets/fonts/roboto-medium.ttf"),
                    "roboto-bold": require("./assets/fonts/roboto-bold.ttf"),
                });
                // Artificially delay for two seconds to simulate a slow loading
                // experience. Please remove this if you copy and paste the code!
                //await new Promise((resolve) => setTimeout(resolve, 2000));
            } catch (e) {
                console.log(e);
            } finally {
                // Tell the application to render
                setAppIsReady(true);
            }
        }

        prepareApp();
    }, []);

    /*
    // Function to load Fonts
    const fetchFonts = async () => {
        await initLanguage();
        Bugsnag.start();
        return Font.loadAsync({
            "roboto": require("./assets/fonts/roboto-regular.ttf"),
            "roboto-bold": require("./assets/fonts/roboto-bold.ttf"),
        });
    };
    */

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
            <Provider store={store}>
                <AppNavigator />
            </Provider>
        </View>
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
