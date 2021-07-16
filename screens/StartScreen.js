import React, { useEffect } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import Colors from "../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import * as authActions from "../store/actions/auth";
import Bugsnag from "@bugsnag/react-native";

const TAG = "[StartScreen]: ";

const StartScreen = props => {
    const dispatch = useDispatch();

    useEffect(() => {
        const tryLogin = async () => {
            
        };
        tryLogin();
    }, [dispatch]);

    return (
        <View style={styles.screen}>
            <ActivityIndicator size="large" color={Colors.lightGrey} />
        </View>
    );
};

export const StartScreenOptions = navigationData => {
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
