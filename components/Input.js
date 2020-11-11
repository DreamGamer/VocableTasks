import React, { useRef } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import Colors from "../constants/Colors";

const Input = props => {
    return <Text>PLEASE UPDATE INPUT</Text>
    //<TextInput {...props} style={{ ...styles.input, ...(props.editable ? null : styles.inputDisabled) }} />;
};

const styles = StyleSheet.create({
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        fontSize: 18,
        //borderRadius: 6,
        backgroundColor: Colors.lightWhite,
        marginVertical: 5,
    },
    inputDisabled: {
        backgroundColor: "#ccc",
    },
});

export default Input;
