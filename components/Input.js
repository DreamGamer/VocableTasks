import React from "react";
import { StyleSheet, View, TextInput } from "react-native";

const Input = props => {

    return (
        <View style={styles.container}>
            <TextInput {...props} style={props.disabled ? styles.input : styles.inputDisabled} editable={props.disabled} />
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
        borderRadius: 6,
    },
    inputDisabled: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        fontSize: 18,
        borderRadius: 6,
        backgroundColor: "#ccc"
    }
});

export default Input;