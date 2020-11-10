import React, { useEffect } from "react";
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import Colors from "../constants/Colors";
import AsyncStorage from "@react-native-community/async-storage";

const StartScreen = props => {
    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem("userData");
            if (!userData) {
                props.navigation.navigate("Auth");
                return;
            }
        };
        tryLogin();
    });

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
