import React, { useState, useEffect } from "react";
import { FlatList, Keyboard, KeyboardAvoidingView, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Input from "../../components/Input";
import { Formik } from "formik";
import translation from "../../i18n/translation";
import LanguageButton from "../../components/LanguageButton";
import filter from "lodash.filter";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import Bugsnag from "@bugsnag/react-native";
import Spinner from "react-native-loading-spinner-overlay";

const TAG = "[AddCardScreen]";

const keyExtractor = (item) => item.flag;

const flags = [
  { flag: "spain", language: "spanish" },
  { flag: "germany", language: "german" },
  { flag: "england", language: "english" },
  { flag: "italy", language: "italian" },
  { flag: "japan", language: "japanese" },
  { flag: "netherlands", language: "dutch" },
  { flag: "norway", language: "norwegian" },
  { flag: "portugal", language: "portuguese" },
  { flag: "russia", language: "russian" },
  { flag: "serbia", language: "serbian" },
  { flag: "sweden", language: "swedish" },
  { flag: "thailand", language: "thai" },
]
  .slice()
  .sort((a, b) => {
    if (a.language < b.language) {
      return -1;
    } else if (a.language > b.language) {
      return 1;
    }
    return 0;
  });

const AddCardScreen = (props) => {
  const [data, setData] = useState(flags);
  const [isLoading, setIsLoading] = useState(false);

  const { t } = translation;

  let isMounted = true;

  useEffect(() => {
    isMounted = true;
    return () => {
      console.log(TAG, "Unmounted");
      isMounted = false;
    };
  }, []);

  const renderItem = (item) => {
    return (
      <View style={styles.languageButtons}>
        <LanguageButton onPress={addCard.bind(this, item.item)} flag={item.item.flag} title={t(item.item.language, { ns: "languageNames" })} />
      </View>
    );
  };

  const addCard = async (card) => {
    setIsLoading(true);
    try {
      const uid = auth().currentUser.uid;
      const timestamp = firestore.Timestamp.now();
      const timestampCreated = firestore.FieldValue.serverTimestamp();

      firestore()
        .collection("users")
        .doc(uid)
        .collection("cards")
        .add({
          created: timestampCreated,
          lastModified: timestamp,
          flag: card.flag,
          language: card.language,
        })
        .then((result) => {
          console.info(TAG, `Successfully added card '${card.language}' to database with id '${result.id}'`);
        });
      console.info(TAG, `Successfully added card '${card.language}' local`);
      props.navigation.goBack();
    } catch (error) {
      console.warn(TAG, "Catched error while adding card: ", error);
      Bugsnag.notify(error);
    }
    if (isMounted) setIsLoading(false);
  };

  const handleSearch = (query) => {
    const newData = filter(flags, (flag) => {
      const translatedName = t(flag.language, { ns: "languageNames" });
      if (translatedName.toLowerCase().includes(query) || flag.language.toLowerCase().includes(query)) {
        return true;
      }
      return false;
    });
    setData(newData);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <TouchableWithoutFeedback touchSoundDisabled onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <View style={styles.SearchBar}>
            <Formik
              initialValues={{
                search: "",
              }}>
              {(formikProps) => (
                <Input
                  placeholder={t("title", { ns: "AddCardScreen" })}
                  onBlur={formikProps.handleBlur("search")}
                  onChangeText={(event) => {
                    formikProps.handleChange("search")(event);
                    handleSearch(event.toLowerCase());
                  }}
                  value={formikProps.values.search}
                  keyboardType="default"
                  autoCapitalize="none"
                  returnKeyType="next"
                  blurOnSubmit={false}
                  onSubmitEditing={formikProps.handleSubmit}
                  error={formikProps.errors.search}
                  touched={formikProps.touched.search}
                  editable
                  leftIconName={"ios-search-outline"}
                />
              )}
            </Formik>
          </View>
          <FlatList keyExtractor={keyExtractor} data={data} keyboardShouldPersistTaps="handled" renderItem={renderItem} />
          <Spinner visible={isLoading} />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export const AddCardScreenOptions = (navigationData) => {
  const { t } = translation;
  return {
    title: t("title", { ns: "AddCardScreen" }),
  };
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  SearchBar: {
    // paddingBottom: 12,
    paddingHorizontal: 24,
  },
  languageButtons: {
    paddingHorizontal: 24,
    paddingVertical: 5,
  },
});

export default AddCardScreen;
