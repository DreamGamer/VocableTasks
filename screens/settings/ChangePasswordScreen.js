import React from "react";
import { StyleSheet, Text, View } from "react-native";
import I18n from "../../i18n/translation";

const ChangePasswordScreen = props => {
    return (
        <View>
            <Text>ChangePasswordScreen</Text>
        </View>
    )
};

const styles = StyleSheet.create({

});

export const ChangePasswordScreenOptions = navigationData => {
    return {
        title: I18n.t("changePassword"),
    }
}

export default ChangePasswordScreen;