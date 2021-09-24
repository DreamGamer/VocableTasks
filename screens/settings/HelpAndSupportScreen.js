import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Translation } from "../../i18n/translation";

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
        title: <Translation name="helpAndSupport" />,
    };
};

export default HelpAndSupportScreen;
