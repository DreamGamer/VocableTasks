import React, { forwardRef, useRef } from "react";
import { StyleSheet, View, TextInput, Text, useColorScheme } from "react-native";
import Colors from "../constants/Colors";
import DefaultValues from "../constants/DefaultValues";
import { Ionicons } from "@expo/vector-icons";
import GlobalStyles from "../constants/GlobalStyles";

const Input = forwardRef((props, ref) => {
  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light" ? true : false;

  const { editable, leftIconName, rightIconName, inputStyle, onPressLeftIcon, onPressRightIcon, error, touched } = props;

  return (
    <View style={{ flex: 1 }}>
      <View style={{ ...styles.container, ...{ backgroundColor: isLight ? Colors.neutral[2] : Colors.white } }}>
        {!!leftIconName ? <Ionicons name={leftIconName} size={30} color={Colors.lightGrey} style={styles.iconLeft} onPress={onPressLeftIcon} /> : null}
        <View style={styles.inputContainer}>
          <TextInput
            {...props}
            style={{
              ...inputStyle,
              ...(colorScheme === "light" ? styles.input_light : styles.input_dark),
              ...(!!editable ? null : colorScheme === "light" ? styles.disabled_light : styles.disabled_dark),
            }}
            editable={!!editable}
            ref={ref}
            placeholderTextColor={Colors.neutral[3]}
          />
        </View>
        {!!rightIconName ? <Ionicons name={rightIconName} size={30} color={Colors.lightGrey} style={styles.iconRight} onPress={onPressRightIcon} /> : null}
      </View>
      <View style={styles.errorContainer}>{touched && error ? <Text style={styles.errorText}>{error}</Text> : null}</View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 200,
  },
  input_light: {
    fontSize: 20,
    color: Colors.black,
  },
  input_dark: {
    fontSize: 20,
    color: Colors.lightGrey,
  },
  disabled_light: {
    color: Colors.disabled_light,
  },
  disabled_dark: {
    color: Colors.disabled_dark,
  },
  inputContainer: {
    flex: 1,
  },
  inputContainer_disabled_light: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  inputContainer_disabled_dark: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  iconLeft: {
    marginRight: 5,
  },
  iconRight: {
    marginLeft: 5,
  },
  errorText: {
    fontFamily: DefaultValues.fontRegular,

    color: Colors.danger,
  },
  errorContainer: {
    marginTop: 5,
  },
});

export default Input;
