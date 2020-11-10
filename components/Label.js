import React from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";
import DefaultValues from "../constants/DefaultValues";
const Label = props => {

    return (
        <View style={styles.container}>
            <Text {...props} style={{...props.style, ...styles.text}}>{props.title}</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 5
    },
    text: {
        fontFamily: DefaultValues.fontRegular,
        fontSize: 16
    }
});

export default Label;