import React from "react";
import { View, StyleSheet, Text, Pressable, ActivityIndicator, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import DefaultValues from "../constants/DefaultValues";
import { normalize } from "../constants/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";

const CustomTextButton = (props) => {
  const { color: customColor, disabled, isLoading, leftIconName, rightIconName } = props;

  const color = customColor ? customColor : Colors.primary[1];

  return (
    <View>
      <View style={{ ...styles.container }}>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.neutral[3]} />
        ) : (
          <TouchableOpacity onPress={props.onPress} style={styles.buttonItems}>
            <Text style={{ ...styles.text, ...{ color: disabled ? Colors.neutral[3] : color } }}>{props.title}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
  },
  text: {
    fontFamily: DefaultValues.fontRegular,
    fontSize: normalize(16),
    textTransform: "uppercase",
  },
  buttonItems: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 5,
  },
});

export default CustomTextButton;
