import { Dimensions, PixelRatio, StyleSheet } from "react-native";
import Colors from "./Colors";
import DefaultValues from "./DefaultValues";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export const normalize = (size) => {
  const scale = SCREEN_WIDTH / 320;
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

export default StyleSheet.create({
  flex1: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    fontSize: 18,
    //borderRadius: 6,
    backgroundColor: Colors.lightWhite,
    marginVertical: 5,
  },
  inputDisabled: {
    backgroundColor: "#ccc",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  h1: {
    color: Colors.black,
    fontSize: 36,
    fontFamily: DefaultValues.fontRegular,
  },
  h2: {
    color: Colors.black,
    fontSize: 30,
    fontFamily: DefaultValues.fontRegular,
  },
  h3: {
    color: Colors.lightWhite,
    fontSize: 24,
    fontFamily: DefaultValues.fontRegular,
  },
  h4: {
    color: Colors.lightWhite,
    fontSize: 20,
    fontFamily: DefaultValues.fontRegular,
  },
  h5: {
    color: Colors.lightWhite,
    fontSize: 16,
    fontFamily: DefaultValues.fontRegular,
  },
  centerText: {
    textAlign: "center",
  },
  flexGrow1: {
    flexGrow: 1,
  },
});
