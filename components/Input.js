import React, { forwardRef, useRef } from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";
import Colors from "../constants/Colors";
import DefaultValues from "../constants/DefaultValues";
import { Ionicons } from "@expo/vector-icons";
import GlobalStyles from "../constants/GlobalStyles";

const Input = forwardRef((props, ref) => {
    const editable = !!props.editable;
    const leftIconName = !!props.leftIconName;
    const rightIconName = !!props.rightIconName;

    return (
        <View style={GlobalStyles.flex1}>
            {props.title ? (
                <View style={styles.labelContainer}>
                    <Text {...props} style={{ ...props.textStyle, ...styles.text }}>
                        {props.title}
                    </Text>
                </View>
            ) : null}
            <View style={{ ...styles.container, ...(editable ? null : styles.inputContainerDisabled) }}>
                {leftIconName ? <Ionicons name={props.leftIconName} size={40} color={Colors.lightGrey} style={styles.icon} onPress={props.onPressLeftIcon} /> : null}
                <View style={styles.inputContainer}>
                    <TextInput
                        {...props}
                        style={{ ...props.inputStyle, ...styles.input, ...(rightIconName || leftIconName ? styles.inputWithIcon : null), ...(editable ? null : styles.inputDisabled) }}
                        editable={editable}
                        ref={ref}
                    />
                    {rightIconName ? <Ionicons name={props.rightIconName} size={23} color={Colors.lightGrey} style={styles.icon} onPress={props.onPressRightIcon} /> : null}
                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    input: {
        fontSize: 20,
        paddingVertical: 10,
        color: Colors.black,
    },
    inputWithIcon: {
        flex: 1,
    },
    inputDisabled: {
        color: Colors.disabledText,
    },
    inputContainerDisabled: {
        backgroundColor: Colors.disabled,
        borderColor: "#ddd",
    },
    text: {
        fontFamily: DefaultValues.fontRegular,
        fontSize: 16,
        color: Colors.black,
    },
    labelContainer: {
        marginVertical: 5,
    },
    container: {
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexDirection: "row",
    },
    inputContainer: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: Colors.lightGrey,
        borderBottomWidth: 1,
        marginLeft: 5,
    },
    icon: {
        
    },
});

export default Input;
