import React from "react";
import { View, StyleSheet, Text, Pressable, ActivityIndicator, useColorScheme, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import DefaultValues from "../constants/DefaultValues";
import { normalize } from "../constants/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import { SvgXml } from "react-native-svg";
import PropTypes from "prop-types";
import { useEffect } from "react";
import Flags from "../constants/Flags";

const LanguageButton = ({ flag, title, onPress }) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <View>
      <TouchableOpacity onPress={onPress}>
        <View style={{ ...styles.container, ...{ backgroundColor: isDarkMode ? Colors.neutral[4] : Colors.neutral[2] } }}>
          <View style={styles.buttonItems}>
            {!!flag ? <SvgXml xml={Flags[flag]} width={23} style={styles.flag} /> : null}
            <Text style={{ ...styles.text, ...{ color: isDarkMode ? Colors.white : Colors.black } }}>{title}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

LanguageButton.propTypes = { title: PropTypes.string, flag: PropTypes.string, onPress: PropTypes.func };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    // alignItems: "center",
    height: 50,
    borderRadius: 200,
  },
  text: {
    fontFamily: DefaultValues.fontRegular,
    fontSize: normalize(18),
  },
  buttonItems: {
    flexDirection: "row",
    // alignItems: "center",
    paddingHorizontal: 20,
  },
  flag: {
    marginRight: 10,
  },
});

export default LanguageButton;
