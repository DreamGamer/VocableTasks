import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import DefaultValues from "../constants/DefaultValues";
import GlobalStyles from "../constants/GlobalStyles";

const SettingsButton = props => {
    return (
        <TouchableOpacity style={props.arrow ? styles.touchableButtonSpaceBetween : styles.touchableButtonCenter} onPress={props.onPress}>
            <View style={styles.buttonLeft}>
                <Ionicons name={props.iconName} size={23} color={props.iconColor ? props.iconColor : Colors.grey} style={styles.iconLeft} />
                <Text style={{ ...styles.buttonText, ...{ color: props.titleColor ? props.titleColor : Colors.grey } }}>{props.title}</Text>
            </View>
            {props.arrow ? <Ionicons name="chevron-forward-outline" size={23} color={Colors.grey} /> : null}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    touchableButtonSpaceBetween: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        margin: 10,
    },
    touchableButtonCenter: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
    },
    buttonText: {
        fontFamily: DefaultValues.fontRegular,
        fontSize: 16,
    },
    buttonLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconLeft: {
        marginRight: 10,
    },
});

export default SettingsButton;
