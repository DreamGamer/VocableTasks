import React, { useEffect, useRef, forwardRef } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, useColorScheme, View } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/HeaderButton";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Colors from "../../constants/Colors";
import translation from "../../i18n/translation";
import Flags from "../../constants/Flags";
import { useDispatch, useSelector } from "react-redux";
import { updateCards } from "../../store/reducers/vocablesSlice";
import Animated, { FadeIn } from "react-native-reanimated";
import { useState } from "react";
import LanguageCard from "../../components/LanguageCard";

const TAG = "[HomeScreen]";

const ReanimatedFlatList = Animated.createAnimatedComponent(FlatList);

const HomeScreen = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const uid = auth().currentUser.uid;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const flatListRef = useRef(null);

  const { t } = translation;
  const dispatch = useDispatch();
  let cards = useSelector((state) => state.vocables.cards)
    .slice()
    .sort((a, b) => {
      const aTime = a.lastModified ? a.lastModified.toMillis() : 0;
      const bTime = b.lastModified ? b.lastModified.toMillis() : 0;
      return bTime - aTime;
    });

  let isMounted = true;

  useEffect(() => {
    isMounted = true;
    return () => {
      console.log(TAG, "Unmounted");
      isMounted = false;
    };
  }, []);

  // Scrolls back to top, when cards changing
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
          const { flag, language, lastModified } = card.doc.data();
          newCards.push({ id, type: card.type, flag, language, lastModified });
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
      <CustomFlatList ref={flatListRef} AddCardComponent={AddCardComponent} cards={cards} />
    </View>
  );
};

export const HomeScreenOptions = (navigationData) => {
  const { t } = translation;
  return {
    title: t("title", { ns: "HomeScreen" }),
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

const CustomFlatList = forwardRef((props, ref) => {
  return (
    <ReanimatedFlatList
      ref={ref}
      data={props.cards}
      contentContainerStyle={styles.flatList}
      entering={FadeIn}
      renderItem={(item) => {
        const language = item.item.flag;
        const Flag = Flags[language] || Flags["unkown"];
        return <LanguageCard itemId={item.item.id} flag={item.item.flag} language={item.item.language} />;
      }}
      ListFooterComponent={props.AddCardComponent}
      showsVerticalScrollIndicator={false}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    paddingVertical: 12,
  },
});

export default HomeScreen;
