import React from "react";
import { View, StyleSheet, Text, Pressable, ActivityIndicator } from "react-native";
import Colors from "../constants/Colors";
import DefaultValues from "../constants/DefaultValues";
import { normalize } from "../constants/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";

const CustomButton = (props) => {
  const { color: customColor, backgroundColor: customBackgroundColor, disabled, isLoading, leftIconName, rightIconName } = props;

  const backgroundColor = customBackgroundColor ? customBackgroundColor : Colors.primary[1];
  const color = customColor ? customColor : Colors.white;

  return (
    <View>
      <Pressable onPress={props.onPress} style={props.style}>
        <View style={{ ...styles.container, ...{ backgroundColor: disabled || isLoading ? Colors.neutral[2] : backgroundColor } }}>
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.neutral[3]} />
          ) : (
            <View style={styles.buttonItems}>
              {!!leftIconName ? <Ionicons name={leftIconName} size={30} color={disabled ? Colors.neutral[3] : color} style={styles.icon}/> : null}
              <Text style={{ ...styles.text, ...{ color: disabled ? Colors.neutral[3] : color } }}>{props.title}</Text>
              {!!rightIconName ? <Ionicons name={rightIconName} size={normalize(24)} color={disabled ? Colors.neutral[3] : color} style={styles.icon} /> : null}
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 50,
    borderRadius: 200,
  },
  text: {
    fontFamily: DefaultValues.fontRegular,
    fontSize: normalize(18),
    textTransform: "uppercase",
  },
  buttonItems: {
    flexDirection: "row",
    alignItems: "center"
  },
  icon: {
    marginHorizontal: 5
  }
});

export default CustomButton;
