import React, { forwardRef, useRef } from "react";
import { StyleSheet, View, TextInput, Text, useColorScheme } from "react-native";
import Colors from "../constants/Colors";
import DefaultValues from "../constants/DefaultValues";
import { Ionicons } from "@expo/vector-icons";
import GlobalStyles from "../constants/GlobalStyles";

const Input = forwardRef((props, ref) => {
    const colorScheme = useColorScheme();

    const editable = !!props.editable;
    const leftIconName = !!props.leftIconName;
    const rightIconName = !!props.rightIconName;

    return (
        <View style={GlobalStyles.flex1}>
            {props.title ? (
                <View style={styles.labelContainer}>
                    <Text {...props} style={{ ...props.textStyle, ...(colorScheme === "light" ? styles.text_light : styles.text_dark) }}>
                        {props.title}
                    </Text>
                </View>
            ) : null}
            <View style={styles.container}>
                {leftIconName ? <Ionicons name={props.leftIconName} size={40} color={Colors.lightGrey} style={styles.icon} onPress={props.onPressLeftIcon} /> : null}
                <View style={editable ? styles.inputContainer : colorScheme === "light" ? styles.inputContainer_disabled_light : styles.inputContainer_disabled_dark}>
                    <TextInput
                        {...props}
                        style={{
                            ...props.inputStyle,
                            ...(colorScheme === "light" ? styles.input_light : styles.input_dark),
                            ...(rightIconName || leftIconName ? styles.inputWithIcon : null),
                            ...(editable ? null : colorScheme === "light" ? styles.disabled_light : styles.disabled_dark),
                        }}
                        editable={editable}
                        ref={ref}
                        placeholderTextColor={Colors.lightGrey}
                    />
                    {rightIconName ? <Ionicons name={props.rightIconName} size={23} color={Colors.lightGrey} style={styles.icon} onPress={props.onPressRightIcon} /> : null}
                </View>
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    input_light: {
        fontSize: 20,
        paddingVertical: 10,
        color: Colors.black,
    },
    input_dark: {
        fontSize: 20,
        paddingVertical: 10,
        color: Colors.lightGrey,
    },
    inputWithIcon: {
        flex: 1,
    },
    disabled_light: {
        color: Colors.disabled_light,
    },
    disabled_dark: {
        color: Colors.disabled_dark,
    },
    text_light: {
        fontFamily: DefaultValues.fontRegular,
        fontSize: 16,
        color: Colors.black,
    },
    text_dark: {
        fontFamily: DefaultValues.fontRegular,
        fontSize: 16,
        color: Colors.white,
    },
    labelContainer: {
        flex: 1,
        marginVertical: 5,
    },
    container: {
        flex: 1,
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
    },
    inputContainer_disabled_light: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: Colors.disabled_light,
        borderBottomWidth: 1,
    },
    inputContainer_disabled_dark: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        borderBottomColor: Colors.disabled_dark,
        borderBottomWidth: 1,
    },
    icon: {
        marginRight: 5,
    },
});

export default Input;
