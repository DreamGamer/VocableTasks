import React from "react";
import { Animated, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";
import DefaultValues from "../constants/DefaultValues";

const SearchHits = props => {
    return (
        <View style={styles.container}>
            <TouchableHighlight underlayColor={Colors.lightGrey} onPress={() => {
                props.onPress(props.word, props.secondWord);
            }}>
                <Text style={styles.text}>{props.word}</Text>
            </TouchableHighlight>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: 40,
        justifyContent: "center",
    },
    text: {
        fontFamily: DefaultValues.fontRegular,
        fontSize: 20,
        color: Colors.grey,
    },
    button: {
        padding: 5,
        borderRadius: 5,
    }
});

export default SearchHits;
