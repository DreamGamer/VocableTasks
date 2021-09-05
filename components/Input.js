import React, { forwardRef, useRef } from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";
import Colors from "../constants/Colors";
import DefaultValues from "../constants/DefaultValues";
import { Ionicons } from "@expo/vector-icons";
import GlobalStyles from "../constants/GlobalStyles";

const Input = forwardRef((props, ref) => {
    const editable = !!props.editable;
    const showIcon = !!props.showIcon;

    return (
        <View style={GlobalStyles.flex1}>
            {props.title ? (
                <View style={styles.labelContainer}>
                    <Text {...props} style={{ ...props.textStyle, ...styles.text }}>
                        {props.title}
                    </Text>
                </View>
            ) : null}
            <View style={{ ...styles.inputContainer, ...(editable ? null : styles.inputContainerDisabled) }}>
                <TextInput {...props} style={{ ...props.inputStyle, ...styles.input, ...(showIcon ? styles.inputWithIcon : null), ...(editable ? null : styles.inputDisabled) }} editable={editable} ref={ref} />
                {props.showIcon ? <Ionicons name={props.iconName} size={23} color={Colors.grey} style={styles.icon} onPress={props.onPressIcon} /> : null}
            </View>
        </View>
    );
});

const styles = StyleSheet.create({
    input: {
        fontSize: 18,
        //borderRadius: 6,
        paddingVertical: 10,
        color: Colors.black,
        width: "100%",
    },
    inputWithIcon: {
        flex: 1
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
    inputContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: "row",
        borderWidth: 1,
        borderRadius: 5,
        borderColor: Colors.lightGrey,
        marginVertical: 5,
        backgroundColor: Colors.lightWhite,
        paddingHorizontal: 5
    },
    icon: {
        padding: 5,
    },
});

export default Input;
