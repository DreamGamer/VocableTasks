import React, { useEffect, useRef } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
//import MainNavigation from "./MainNavigation";
import auth from "@react-native-firebase/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import * as vocablesActions from "../store/actions/vocables";
import { VocableTasksNavigator, AuthNavigator, StartupNavigator, WelcomeNavigator } from "./VocableTasksNavigator";

const TestStack = createStackNavigator();

const AppNavigator = props => {
    const navRef = useRef();
    /*
    const isAuth = useSelector(state => !!state.auth.idToken);
    const tryedAutoLogin = useSelector(state => state.auth.tryedAutoLogin);
    const hasDisplayName = useSelector(state => !!state.auth.displayName);
    */

    const [isAuth, setIsAuth] = useState(false);
    const hasDisplayName = useSelector(state => !!state.auth.displayName);
    const [initialized, setInitialized] = useState(false);

    const dispatch = useDispatch();

    const onAuthStateChanged = async user => {
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

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, [onAuthStateChanged]);

    return (
        <NavigationContainer>
            {isAuth && hasDisplayName && <VocableTasksNavigator />}
            {isAuth && !hasDisplayName && <WelcomeNavigator />}
            {!isAuth && initialized && <AuthNavigator />}
            {!isAuth && !initialized && <StartupNavigator />}
        </NavigationContainer>
    );
};

export default AppNavigator;
