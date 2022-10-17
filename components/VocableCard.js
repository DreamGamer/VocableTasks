import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, SvgXml } from "react-native-svg";
import Colors from "../constants/Colors";
import DefaultValues from "../constants/DefaultValues";
import GlobalStyles, { normalize } from "../constants/GlobalStyles";
import Vocable from "../models/Vocable";
import dot from "../assets/dot.svg";

const ITEM_HEIGHT = 100;
const DOT_SIZE = 10;

const VocableCard = (props) => {
  const vocable = new Vocable(props.id, props.firstWord, props.secondWord);
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardContainer}>
          <View style={styles.status}>
            <Svg height={DOT_SIZE} width={DOT_SIZE}>
              <Circle cx={DOT_SIZE / 2} cy={DOT_SIZE / 2} r={DOT_SIZE / 2} fill={Colors.info}></Circle>
            </Svg>
            <Text style={styles.statusText}>New Word</Text>
          </View>
          <Text style={styles.firstWordText}>{vocable.firstWord}</Text>
          <Text style={styles.secondWordText}>{vocable.secondWord}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: ITEM_HEIGHT,
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  card: {
    width: "100%",
    height: ITEM_HEIGHT,
    backgroundColor: Colors.neutral[2],
    borderRadius: 10,
    elevation: 2,
  },
  cardContainer: {
    flex: 1,
    padding: 10,
    justifyContent: "center"
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontFamily: DefaultValues.fontRegular,
    fontSize: normalize(12),
    color: Colors.neutral[3],
    marginLeft: 5,
  },
  firstWordText: {
    fontFamily: DefaultValues.fontRegular,
    fontSize: normalize(16),
    color: Colors.black,
  },
  secondWordText: {
    fontFamily: DefaultValues.fontRegular,
    fontSize: normalize(16),
    color: Colors.neutral[3],
  },
});

export default VocableCard;
