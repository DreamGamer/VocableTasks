import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View, FlatList } from "react-native";
import { Trans, useTranslation } from "react-i18next";
import LanguageCard from "../../components/LanguageCard";
import Spinner from "react-native-loading-spinner-overlay";
import Bugsnag from "@bugsnag/react-native";
import { useDispatch, useSelector } from "react-redux";
import { Translation } from "../../i18n/translation";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TAG = "[ChangeLanguageScreen]: "; // Console Log Tag
const APP_LANGUAGE = "app_language"; // AsyncStorage key

const ChangeLanguageScreen = props => {
    const { t, i18n } = useTranslation();
    const selectedLanguage = i18n.language;
    const [isLoading, setIsLoading] = useState(false);

    const availableLanguages = [
        { code: "england", text: t("englishLanguage"), originalCode: "en" },
        { code: "DE", text: t("germanLanguage"), originalCode: "de" },
    ];

    return (
        <View>
            <Spinner visible={isLoading} />

            <FlatList
                data={availableLanguages}
                keyExtractor={item => item.code}
                renderItem={item => (
                    <LanguageCard
                        code={item.item.code}
                        title={item.item.text}
                        onPress={async () => {
                            const language = item.item.originalCode;
                            try {
                                // Set current app language to language
                                await i18n.changeLanguage(language);

                                // Save LanguageCode in Storage
                                await AsyncStorage.setItem(APP_LANGUAGE, language);

                                // Log sucessfully
                                console.info(TAG + "Sucessfully changed app language to '" + language + "'");
                            } catch (error) {
                                console.warn(TAG + "Catched error while changing language: " + error);
                                Bugsnag.notify(error);
                            }
                        }}
                        choosedLanguage={item.item.originalCode == selectedLanguage}
                    />
                )}></FlatList>
        </View>
    );
};

const styles = StyleSheet.create({});

export const ChangeLanguageScreenOptions = navigationData => {
    return {
        title: <Translation name="changeLanguage" />,
    };
};

export default ChangeLanguageScreen;
