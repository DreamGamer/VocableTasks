import React, { useEffect } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import Colors from "../constants/Colors";
import AsyncStorage from "@react-native-community/async-storage";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";

const StartScreen = props => {
    const dispatch = useDispatch();

    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem("userData");
            if (!userData) {
                dispatch(authActions.setTryedAutoLogin());
                return;
            }

            const transformedData = JSON.parse(userData);
            const { token, UID, expireData, displayName } = transformedData;

            const convertedExpireDate = new Date(expireData);
            if (convertedExpireDate <= new Date() || !token || !UID) {
                dispatch(authActions.setTryedAutoLogin());
                return;
            }

            const expirationTime = convertedExpireDate.getTime() - new Date().getTime();

            await dispatch(authActions.authenticate(token, UID, expirationTime, displayName));
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
