import * as Localization from "expo-localization";
import I18n from "i18n-js";
import en from "./locales/en";
import de from "./locales/de";
import AsyncStorage from "@react-native-community/async-storage";

const TAG = "[I18n Translation]: "; // Console Log Tag
const APP_LANGUAGE = "app_language"; // AsyncStorage key

const setLanguage = async language => {
    try {
        // Set current app language to language
        I18n.locale = language;

        // Save LanguageCode in Storage
        await AsyncStorage.setItem(APP_LANGUAGE, language);

        // Log sucessfully
        console.log(TAG + "Sucessfully set language app to '" + language + "'");
    } catch (error) {
        console.log(TAG + "setLanguage - " +  error);
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
            setLanguage(deviceLanguageCode);
        } else {
            setLanguage(savedLanguageCode);
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

export default I18n;
