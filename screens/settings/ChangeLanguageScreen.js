import React from "react";
import { StyleSheet, Text, View } from "react-native";
import I18n from "../../i18n/translation";

const ChangeLanguageScreen = props => {
    return (
        <View>
            <Text>ChangeLanguageScreen</Text>
        </View>
    )
};

const styles = StyleSheet.create({

});

export const ChangeLanguageScreenOptions = navigationData => {
    return {
        title: I18n.t("changeLanguage"),
    }
}

export default ChangeLanguageScreen;