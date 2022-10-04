import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import DefaultValues from "../constants/DefaultValues";
import GlobalStyles, { normalize } from "../constants/GlobalStyles";

const SettingsButton = (props) => {
  return (
    <TouchableOpacity style={{ ...styles.touchableButton, ...{ justifyContent: props.arrow ? "space-between" : "center" } }} onPress={props.onPress}>
      <View style={styles.buttonLeft}>
        <Ionicons name={props.iconName} size={23} color={props.iconColor ? props.iconColor : Colors.black} style={styles.iconLeft} />
        <Text style={{ ...styles.buttonText, ...{ color: props.titleColor ? props.titleColor : Colors.black } }}>{props.title}</Text>
      </View>
      {props.arrow ? <Ionicons name="chevron-forward-outline" size={23} color={Colors.black} /> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    padding: 5,
    backgroundColor: Colors.neutral[2],
    borderRadius: 10,
    height: 50,
  },
  buttonText: {
    fontFamily: DefaultValues.fontRegular,
    fontSize: normalize(14),
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
