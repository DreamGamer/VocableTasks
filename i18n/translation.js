import React from "react";
import { Text } from "react-native";
// import * as Localization from "expo-localization";
import en from "./locales/en";
import de from "./locales/de";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { useState } from "react";
import i18next from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import * as RNLocalize from "react-native-localize";
import Bugsnag from "@bugsnag/react-native";

const TAG = "[I18n Translation]: "; // Console Log Tag
const APP_LANGUAGE = "app_language"; // AsyncStorage key

const translations = {
  en,
  de,
};

export const initLanguage = async () => {
  try {
    const deviceLanguageCode = RNLocalize.getLocales()[0].languageCode;
    // Gets current LanguageCode like 'en' from storage
    const savedLanguageCode = await AsyncStorage.getItem(APP_LANGUAGE);
    await i18next.use(initReactI18next).init({
      compatibilityJSON: "v3",
      debug: false,
      lng: savedLanguageCode ? savedLanguageCode : deviceLanguageCode,
      fallbackLng: "en",
      resources: translations,
    });
  } catch (error) {
    console.warn(TAG + "Catched error in initLanguage: " + error);
    Bugsnag.notify(error);
    await i18next.use(initReactI18next).init({
      debug: true,
      lng: "en",
      fallbackLng: "en",
      resources: {
        en,
        de,
      },
    });
    console.log(TAG + error);
  }
};

export default i18next;

/*
export const changeLanguage = async language => {
    try {
        // Set current app language to language
        if (language) {
            I18n.locale = language;
        } else if (Array.isArray(locales)) {
            I18n.locale = locales[0].languageCode;
        }

        // Save LanguageCode in Storage
        await AsyncStorage.setItem(APP_LANGUAGE, language);

        // Log sucessfully
        console.info(TAG + "Sucessfully set app language to '" + language + "'");
    } catch (error) {
        console.warn(TAG + "Catched error while setting up language: " + error);
    }
};

export const initLanguage = async () => {
    try {
        // Gets current LanguageCode like 'en' from storage
        const savedLanguageCode = await AsyncStorage.getItem(APP_LANGUAGE);

        // Check if LanguageCode exists, if yes locale will be set to 'currentLanguage'
        if (!savedLanguageCode) {
            // Get's Device LanguageCode
            const deviceLanguageCode = Localization.locale;

            // Set app language to device language
            changeLanguage(deviceLanguageCode);
        } else {
            changeLanguage(savedLanguageCode);
        }
    } catch (error) {
        I18n.locale = Localization.locale;
        console.log(TAG + error);
    }
};

I18n.fallbacks = true;

I18n.translations = {
    en,
    de,
};
*/
