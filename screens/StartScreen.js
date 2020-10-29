import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import Colors from '../constants/Colors';

const StartScreen = props => {

    useEffect(() => {
        props.navigation.navigate("VokabelTasks");
    });


    return (
        <View style={styles.screen}>
            <ActivityIndicator size="large" color={Colors.lightGrey} />
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
});

export default StartScreen;