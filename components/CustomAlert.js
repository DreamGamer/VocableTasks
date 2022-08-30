import React, { useState } from "react";
import { Dimensions, Modal, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import { Animated } from "react-native-reanimated";
import Colors from "../constants/Colors";
import DefaultValues from "../constants/DefaultValues";
import { normalize } from "../constants/GlobalStyles";

const CustomAlert = (props) => {
  const { visible, title, message, leftButtonText, rightButtonText, onPressLeftButton, onPressRightButton } = props;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <Modal visible={visible} transparent={true} statusBarTranslucent={true} animationType="fade">
      <View style={styles.background}>
        <View style={styles.modalView}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>{message}</Text>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable onPress={onPressLeftButton}>
              <Text style={styles.buttonText}>{leftButtonText}</Text>
            </Pressable>
            <TouchableOpacity onPress={onPressRightButton}>
              <Text style={styles.buttonText}>{rightButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: Dimensions.get("window").width * 0.9,
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    padding: 20,
    borderRadius: 5,
  },
  titleContainer: {},
  messageContainer: {
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  titleText: {
    fontFamily: DefaultValues.fontMedium,
    fontSize: normalize(16),
  },
  messageText: {
    fontFamily: DefaultValues.fontRegular,
    fontSize: normalize(14),
  },
  buttonText: {
    padding: 5,
    fontFamily: DefaultValues.fontRegular,
    fontSize: normalize(14),
    textTransform: "uppercase",
    color: Colors.primary[1],
  },
});

export default CustomAlert;
