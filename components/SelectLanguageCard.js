import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";
import { SvgXml } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import DefaultValues from "../constants/DefaultValues";

const SelectLanguageCard = (props) => {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={{ ...styles.container, ...(props.choosedLanguage ? styles.choosedContainer : null) }}>
        <View style={styles.box}>
          <View style={styles.leftSide}>
            <SvgXml xml={props.svg ? props.svg : null} height={32} width={32} style={styles.flag} />
            <Text style={{ ...styles.title, ...(props.choosedLanguage ? styles.choosedTitle : null) }}>{props.title}</Text>
          </View>
          <View style={styles.rightSide}></View>
          {props.choosedLanguage ? <Ionicons name="checkmark" size={23} color={Colors.white} /> : null}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    height: 60,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  choosedContainer: {
    backgroundColor: Colors.info,
  },
  box: {
    paddingHorizontal: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  leftSide: {
    flexDirection: "row",
    alignItems: "center",
  },
  rightSide: {},
  flag: {
    marginRight: 10,
  },
  title: {
    color: Colors.black,
    fontFamily: DefaultValues.fontRegular,
    fontSize: 16,
  },
  choosedTitle: {
    color: Colors.white,
  },
});

export default SelectLanguageCard;
