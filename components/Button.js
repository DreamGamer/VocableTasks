import React from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import Colors from "../constants/Colors";
import DefaultValues from "../constants/DefaultValues";

const Button = (props) => {
    return (
        <Pressable onPress={props.onPress}>
            <View style={styles.container}>
                <Text  style={styles.text}>{props.title}</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.primary,
        padding: 8,
        borderRadius: 5,
    },
    text: {
        fontFamily: DefaultValues.fontRegular,
        fontSize: 20,
        textTransform: "uppercase",
        color: Colors.white
    }
});

export default Button;
