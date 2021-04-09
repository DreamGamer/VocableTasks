import React, { useEffect } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import Colors from "../constants/Colors";
import AsyncStorage from "@react-native-community/async-storage";
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "../store/actions/auth";
import Bugsnag from "@bugsnag/react-native";

const TAG = "[StartScreen]: ";

const StartScreen = props => {
    const dispatch = useDispatch();

    useEffect(() => {
        const tryLogin = async () => {
            try {
                const userData = await AsyncStorage.getItem("userData");

                if (!userData) {
                    console.info(TAG + "No userData found in storage");
                    dispatch(authActions.setTryedAutoLogin());
                    return;
                }

                const transformedData = JSON.parse(userData);
                const { idToken, refreshToken, UID, expireDate, displayName } = transformedData;

                const convertedExpireDate = new Date(expireDate);
                if (convertedExpireDate <= new Date() || refreshToken) {
                    console.info(TAG + "Token expired");
                    await dispatch(authActions.updateToken());

                    dispatch(authActions.setTryedAutoLogin());
                    return;
                } else if (convertedExpireDate <= new Date() || !refreshToken) {
                    // Logout user if refreshToken missing in userData
                    dispatch(authActions.setTryedAutoLogin());
                    return;
                }

                const expirationTime = convertedExpireDate.getTime() - new Date().getTime();

                await dispatch(authActions.authenticate(idToken, refreshToken, UID, expirationTime, displayName));
            } catch (error) {
                try {
                    console.warn(TAG + "Fatal error catched in tryLogin: " + error);
                    Bugsnag.notify(error);
                    dispatch(authActions.setTryedAutoLogin());
                    dispatch(authActions.logout());
                } catch (error) {
                    Bugsnag.notify(error);
                    console.warn(TAG + "CATCHED FATAL ERROR: " + error);
                }
            }
        };
        tryLogin();
    }, [dispatch]);

    return (
        <View style={styles.screen}>
            <ActivityIndicator size="large" color={Colors.lightGrey} />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default StartScreen;
