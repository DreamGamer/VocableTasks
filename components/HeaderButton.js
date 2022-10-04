import React from "react";
import { useColorScheme } from "react-native";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import PropTypes, { bool } from "prop-types";

const CustomHeaderButton = (props) => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  return <HeaderButton {...props} IconComponent={Ionicons} iconSize={23} color={isDarkMode ? Colors.white : Colors.black} />;
};

export default CustomHeaderButton;
