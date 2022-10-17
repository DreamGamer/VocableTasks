import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, useColorScheme, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../../components/HeaderButton";
import Colors from "../../constants/Colors";
import translation from "../../i18n/translation";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import Card from "../../models/Card";
import { updateVocables } from "../../store/reducers/vocablesSlice";
import { useDispatch, useSelector } from "react-redux";
import VocableCard from "../../components/VocableCard";
import { Ionicons } from "@expo/vector-icons";
import Animated, { cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withSpring, withTiming } from "react-native-reanimated";
import { Trans, useTranslation } from "react-i18next";

const ARROW_Y_RADIUS = 10;

const VocablesScreen = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const uid = auth().currentUser.uid;
  const selectedCard = props.route.params;
  const allVocables = useSelector((state) => state.vocables.vocables);
  const cardIndexForVocables = allVocables.findIndex((state) => state.cardId === selectedCard.id);
  const vocables = useSelector((state) => state.vocables.vocables[cardIndexForVocables]?.vocables);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    const subscriber = firestore()
      .collection("users")
      .doc(uid)
      .collection("cards")
      .doc(selectedCard.id)
      .collection("vocables")
      .onSnapshot(async (snap) => {
        let newVocables = [];
        snap.docChanges().forEach((vocable) => {
          const id = vocable.doc.id;
          const { firstWord, secondWord } = vocable.doc.data();
          newVocables.push({ id, type: vocable.type, firstWord, secondWord });
        });

        await dispatch(updateVocables({ cardId: selectedCard.id, newVocables }))
          .unwrap()
          .then(() => {
            setIsLoading(false);
          });
      });

    return () => subscriber();
  }, []);

  const arrowIconTranslateY = useSharedValue(ARROW_Y_RADIUS);

  const rArrowIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: arrowIconTranslateY.value }],
    };
  });

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={isDarkMode ? Colors.white : Colors.black} />
        <Text>{t("loadingText", { ns: "VocablesScreen" })}</Text>
      </View>
    );
  }

  if (!vocables.length) {
    arrowIconTranslateY.value = withRepeat(withTiming(0), -1, true);

    return (
      <View style={styles.noVocablesContainer}>
        <Animated.View style={[styles.arrowIconContainer, rArrowIconStyle]}>
          <Ionicons name="arrow-up" size={45} color={Colors.black} />
        </Animated.View>
        <Text>Add your first Vocable to your {t(selectedCard.language, { ns: "languageNames" })} card</Text>
      </View>
    );
  } else {
    cancelAnimation(arrowIconTranslateY);
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={vocables}
        renderItem={(item) => {
          return <VocableCard id={item.item.id} firstWord={item.item.firstWord} secondWord={item.item.secondWord} />;
        }}
      />
    </View>
  );
};

export const VocablesScreenOptions = (navigationData) => {
  const cardLanguage = navigationData.route.params.language;
  return {
    title: <Trans i18nKey={cardLanguage} ns="languageNames" />,
    headerRight: () => (
      <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
        <Item title="Options" iconName="ios-options" onPress={() => {}} />
        <Item title="Add" iconName="ios-add-sharp" onPress={() => {}} />
      </HeaderButtons>
    ),
    headerTitleAlign: "left"
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.neutral[1],
  },
  noVocablesContainer: {
    position: "absolute",
    right: 4,
    alignItems: "flex-end",
    width: "40%",
  },
  arrowIconContainer: {
    marginBottom: ARROW_Y_RADIUS,
  },
});

export default VocablesScreen;
