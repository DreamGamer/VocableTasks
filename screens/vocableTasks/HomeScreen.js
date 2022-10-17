import React, { useEffect, useRef } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, useColorScheme, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/HeaderButton";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Colors from "../../constants/Colors";
import translation from "../../i18n/translation";
import { useDispatch, useSelector } from "react-redux";
import { updateCards } from "../../store/reducers/vocablesSlice";
import { useState } from "react";
import LanguageCard from "../../components/LanguageCard";
import { Trans, useTranslation } from "react-i18next";

const TAG = "[HomeScreen]";

const HomeScreen = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const uid = auth().currentUser.uid;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const flatListRef = useRef(null);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const cards = useSelector((state) => state.vocables.cards);

  const handleCardPress = (card) => {
    props.navigation.navigate("vocables", card);
  };

  // Scrolls back to top, when cards changing
  // When cards changing, the lastModified value will change,
  // so the changed card will be always at the top with the current sorting
  useEffect(() => {
    flatListRef?.current?.scrollToOffset({ animated: true, offset: 0 });
  }, [cards]);

  useEffect(() => {
    const subscriber = firestore()
      .collection("users")
      .doc(uid)
      .collection("cards")
      .onSnapshot(async (snap) => {
        let newCards = [];
        snap.docChanges().forEach((card) => {
          const id = card.doc.id;
          const { flag, language, created, lastModified } = card.doc.data();
          newCards.push({ id, type: card.type, flag, language, created, lastModified });
        });

        await dispatch(updateCards(newCards))
          .unwrap()
          .then(() => {
            setIsLoading(false);
          });
      });

    return () => subscriber();
  }, []);

  const test2 = async () => {
    const vocables = await firestore()
      .collection("users")
      .doc(uid)
      .collection("cards")
      .doc("pMEjsbkChy4Cd6hi4VZJ")
      .collection("vocables")
      .add({
        firstWord: "Hallo",
        secondWord: "Hello",
      })
      .then((values) => {
        console.log(values.id);
      });
  };

  const AddCardComponent = () => {
    return (
      <LanguageCard
        icon="add"
        onPress={() => {
          props.navigation.navigate("addCard");
        }}
      />
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={isDarkMode ? Colors.white : Colors.black} />
        <Text>{t("loadingText", { ns: "HomeScreen" })}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={cards}
        contentContainerStyle={styles.flatList}
        renderItem={(item) => {
          return (
            <LanguageCard
              onPress={() => {
                handleCardPress(item.item);
              }}
              itemIndex={item.index}
              itemId={item.item.id}
              flag={item.item.flag}
              language={item.item.language}
            />
          );
        }}
        ListFooterComponent={AddCardComponent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export const HomeScreenOptions = (navigationData) => {
  return {
    title: <Trans i18nKey="title" ns="HomeScreen" />,
    headerLeft: () => (
      // HeaderButton to toggle the Drawer
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName="ios-menu"
          onPress={() => {
            navigationData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    paddingVertical: 12,
  },
});

export default HomeScreen;
