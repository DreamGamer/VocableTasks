import React, { forwardRef, useRef } from "react";
import { StyleSheet, View, TextInput, Text, useColorScheme, TextInputProps } from "react-native";
import Colors from "../constants/Colors";
import DefaultValues from "../constants/DefaultValues";
import { Ionicons } from "@expo/vector-icons";
import GlobalStyles, { normalize } from "../constants/GlobalStyles";
import Animated, { FadeIn, FadeOut, SlideInDown, SlideInUp, SlideOutDown } from "react-native-reanimated";

export type Props = TextInputProps & { editable?: ?boolean, leftIconName?: ?string, rightIconName?: ?string, onPressLeftIcon?: ?function, onPressRightIcon?: ?function, error?: ?string, touched?: ?string };

const Input = forwardRef((props: Props, ref) => {
  const { editable, leftIconName, rightIconName, style, onPressLeftIcon, onPressRightIcon, error, touched } = props;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const darkInput = { color: !!editable ? Colors.white : Colors.neutral[3] };
  const lightInput = { color: !!editable ? Colors.black : Colors.neutral[3] };

  return (
    <View>
      <View style={{ ...styles.container, ...{ backgroundColor: isDarkMode ? Colors.neutral[4] : Colors.neutral[2] } }}>
        {!!leftIconName ? <Ionicons name={leftIconName} size={30} color={Colors.neutral[3]} style={styles.iconLeft} onPress={onPressLeftIcon} /> : null}
        <View style={{ flex: 1 }}>
          <TextInput
            {...props}
            style={{
              ...styles.input,
              ...style,
              ...(isDarkMode ? darkInput : lightInput),
            }}
            editable={!!editable}
            ref={ref}
            placeholderTextColor={Colors.neutral[3]}
          />
        </View>
        {!!rightIconName ? <Ionicons name={rightIconName} size={30} color={Colors.neutral[3]} style={styles.iconRight} onPress={onPressRightIcon} /> : null}
      </View>
      <View style={styles.errorContainer}>{touched && error ? <Text style={styles.errorText}>{error}</Text> : null}</View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 200,
  },
  input: {
    flex: 1,
    fontSize: normalize(16),
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
