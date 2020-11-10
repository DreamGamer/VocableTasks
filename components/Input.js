import React from "react";
import { StyleSheet, View, TextInput } from "react-native";
import Colors from "../constants/Colors";

const Input = props => {

    return (
        <View style={styles.container}>
            <TextInput {...props} style={{...styles.input, ...props.editable ? null : styles.inputDisabled}} />
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 5
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        fontSize: 18,
        //borderRadius: 6,
        backgroundColor: Colors.lightWhite,
    },
    inputDisabled: {
        backgroundColor: "#ccc"
    }
});

export default Input;