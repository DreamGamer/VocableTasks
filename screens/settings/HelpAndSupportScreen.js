import React from "react";
import { StyleSheet, Text, View } from "react-native";
import I18n from "../../i18n/translation";

const HelpAndSupportScreen = props => {
    return (
        <View>
            <Text>HelpAndSupportScreen</Text>
        </View>
    );
};

const styles = StyleSheet.create({});

export const HelpAndSupportScreenOptions = navigationData => {
    return {
        title: I18n.t("helpAndSupport"),
    };
};

export default HelpAndSupportScreen;
