import React from "react";
import { Dimensions, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";
import Animated, { Extrapolation, FadeIn, FadeOut, interpolate, runOnJS, SlideInUp, useAnimatedGestureHandler, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SvgXml } from "react-native-svg";
import Flags from "../constants/Flags";
import translation from "../i18n/translation";
import Colors from "../constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { PanGestureHandler } from "react-native-gesture-handler";
import DefaultValues from "../constants/DefaultValues";
import { normalize } from "../constants/GlobalStyles";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Bugsnag from "@bugsnag/react-native";

const TAG = "[LanguageCard]";

const ANIMATION_DURATION = 300;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TRANSLATEX_THRESHOLD = -SCREEN_WIDTH * 0.1;
const ITEM_HEIGHT = 125;

const LanguageCard = (props) => {
  const { t } = translation;
  const { itemIndex, itemId, flag, language, icon, onPress } = props;
  const Flag = Flags[flag] || Flags["unkown"];

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const translateX = useSharedValue(0);
  const itemHeight = useSharedValue(ITEM_HEIGHT);
  const itemOpacity = useSharedValue(1);
  const marginVertical = useSharedValue(12);

  const deleteCard = async () => {
    const uid = auth().currentUser.uid;
    firestore()
      .collection("users")
      .doc(uid)
      .collection("cards")
      .doc(itemId)
      .delete()
      .then(() => {
        console.info(TAG, `Deleted Card with id '${itemId}', language '${language}'`);
      })
      .catch((error) => {
        console.warn(TAG, error);
        Bugsnag.notify(error);
      });
  };

  const dismissItem = (item) => {
    itemHeight.value = withTiming(0, { duration: ANIMATION_DURATION });
    itemOpacity.value = withTiming(0, { duration: ANIMATION_DURATION });
    marginVertical.value = withTiming(0, { duration: ANIMATION_DURATION }, async (isFinished) => {
      if (isFinished) {
        runOnJS(deleteCard)();
      }
    });
  };

  const panGestureEventHandler = useAnimatedGestureHandler({
    onStart: (event, context) => {
      context.translateX = translateX.value;
    },
    onActive: (event, context) => {
      const currentPosition = event.translationX + context.translateX;
      if (currentPosition < 0) {
        translateX.value = currentPosition;
      } else {
        translateX.value = withTiming(0);
      }
    },
    onEnd: () => {
      const thresholdReached = translateX.value < TRANSLATEX_THRESHOLD;
      if (thresholdReached) {
        translateX.value = withTiming(-SCREEN_WIDTH * 0.2);
      } else {
        translateX.value = withTiming(0);
      }
    },
  });

  const reanimatedActionStyle = useAnimatedStyle(() => {
    const opacity = interpolate(translateX.value, [TRANSLATEX_THRESHOLD, 0], [1, 0], { extrapolateLeft: Extrapolation.CLAMP });
    return {
      opacity,
    };
  });

  const reanimatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
      ],
    };
  });

  const renaimatedItemHeight = useAnimatedStyle(() => {
    return {
      height: itemHeight.value,
      marginVertical: marginVertical.value,
      opacity: itemOpacity.value,
    };
  });

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={[styles.container, icon ? null : renaimatedItemHeight]}>
      {icon ? null : (
        <View style={styles.actionsRightContainer}>
          <Animated.View style={[styles.actionCard, reanimatedActionStyle]}>
            <TouchableOpacity style={styles.centerAction} onPress={dismissItem}>
              <Ionicons name="ios-trash-outline" size={23} color={Colors.danger} style={{ marginBottom: 5 }} />
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}
      {icon ? (
        <TouchableOpacity onPress={onPress} style={{ ...styles.card, ...{ backgroundColor: isDarkMode ? Colors.neutral[4] : Colors.neutral[2] } }}>
          <Ionicons name={icon} size={50} color={Colors.primary[1]} />
        </TouchableOpacity>
      ) : (
        <PanGestureHandler onGestureEvent={panGestureEventHandler} activeOffsetX={[-5, 5]}>
          <Animated.View entering={FadeIn} exiting={SlideInUp} style={[reanimatedCardStyle]}>
            <TouchableOpacity onPress={onPress} style={[styles.card, { backgroundColor: Colors.primary[1] }]}>
              <SvgXml xml={Flag} height={32} width={32} />
              <Text style={{ color: "#fff", fontSize: 24 }}>{t(language, { ns: "languageNames" })}</Text>
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    overflow: "hidden"
  },
  card: {
    height: ITEM_HEIGHT,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    // elevation: 3,
  },
  actionsRightContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    height: ITEM_HEIGHT,
    width: "45%",
    position: "absolute",
    right: 24,
  },
  actionCard: {
    width: "45%",
    borderRadius: 10,
    backgroundColor: Colors.lightDanger,
  },
  centerAction: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionText: {
    fontFamily: DefaultValues.fontMedium,
    fontSize: normalize(13),
    color: Colors.danger,
  },
});

export default LanguageCard;
