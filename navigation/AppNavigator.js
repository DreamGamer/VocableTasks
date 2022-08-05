import React, { useEffect, useRef, useState } from "react";
import { useColorScheme } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
//import MainNavigation from "./MainNavigation";
import auth from "@react-native-firebase/auth";
import * as authActions from "../store/actions/auth";
import * as vocablesActions from "../store/actions/vocables";
import { VocableTasksNavigator, AuthNavigator, StartupNavigator, WelcomeNavigator } from "./VocableTasksNavigator";
import Colors from "../constants/Colors";
import { StatusBar } from "expo-status-bar";

const TestStack = createStackNavigator();

const AppNavigator = (props) => {
    const navRef = useRef();
    /*
    const isAuth = useSelector(state => !!state.auth.idToken);
    const tryedAutoLogin = useSelector(state => state.auth.tryedAutoLogin);
    const hasDisplayName = useSelector(state => !!state.auth.displayName);
    */

    const colorScheme = useColorScheme();

    const [isAuth, setIsAuth] = useState(false);
    const hasDisplayName = useSelector((state) => !!state.auth.displayName);
    const [initialized, setInitialized] = useState(false);

    const dispatch = useDispatch();

    const onAuthStateChanged = async (user) => {
        console.info("onAuthStateChanged");
        console.info(JSON.stringify(user, null, 2));
        if (user) {
            await dispatch(authActions.updateUserInfo(user));
            setIsAuth(true);
        } else {
            await dispatch(vocablesActions.initialStates());
            await dispatch(authActions.deleteUserInfo());
            setIsAuth(false);
        }

        if (!initialized) setInitialized(true);
    };

    const myCustomTheme = {
        ...DefaultTheme,
        colors: {
            ...DefaultTheme.colors,
            background: colorScheme === "light" ? Colors.white : Colors.black,
        },
    };

    useEffect(() => {
        const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged);
        return () => {
            unsubscribe();
        };
    }, []);

    return (
        <NavigationContainer theme={myCustomTheme}>
            {isAuth && hasDisplayName && <VocableTasksNavigator />}
            {isAuth && !hasDisplayName && <WelcomeNavigator />}
            {!isAuth && initialized && <AuthNavigator />}
            {!isAuth && !initialized && <StartupNavigator />}
        </NavigationContainer>
    );
};

export default AppNavigator;
