import React from "react";
import { StyleSheet, View, Text, ScrollView } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/HeaderButton";
import Colors from "../../constants/Colors";
import DefaultValues from "../../constants/DefaultValues";
import GlobalStyles from "../../constants/GlobalStyles";
import SettingsButton from "../../components/SettingsButton";
import { useDispatch } from "react-redux";
import * as authActions from "../../store/actions/auth";
import { useTranslation } from "react-i18next";
import { Translation } from "../../i18n/translation";

const SettingsScreen = props => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    return (
        <View style={GlobalStyles.flex1}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.topContent}>
                    <Text style={styles.title}>{t("account")}</Text>
                    <View style={styles.whiteBox}>
                        <SettingsButton
                            iconName="person-outline"
                            title={t("editProfile")}
                            arrow
                            onPress={() => {
                                props.navigation.navigate("editProfile");
                            }}
                        />
                        <SettingsButton
                            iconName="key-outline"
                            title={t("changePassword")}
                            arrow
                            onPress={() => {
                                props.navigation.navigate("changePassword");
                            }}
                        />
                    </View>

                    <Text style={styles.title}>{t("general")}</Text>
                    <View style={styles.whiteBox}>
                        <SettingsButton
                            iconName="globe-outline"
                            title={t("changeLanguage")}
                            arrow
                            onPress={() => {
                                props.navigation.navigate("changeLanguage");
                            }}
                        />
                        <SettingsButton
                            iconName="help-buoy-outline"
                            title={t("helpAndSupport")}
                            arrow
                            onPress={() => {
                                props.navigation.navigate("helpAndSupport");
                            }}
                        />
                    </View>
                </View>
                <View style={styles.bottomContent}>
                    <View style={styles.whiteBox}>
                        <SettingsButton
                            iconName="log-out-outline"
                            iconColor={Colors.red}
                            title={t("logout")}
                            titleColor={Colors.red}
                            onPress={() => {
                                dispatch(authActions.logout());
                            }}
                        />
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export const SettingsScreenOptions = navigationData => {
    return {
        title: <Translation name="settings" />,
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
    scrollView: {
        flexGrow: 1,
        justifyContent: "space-between",
    },
    topContent: {
        margin: 15,
    },
    bottomContent: {
        margin: 30,
        marginHorizontal: 60,
    },
    title: {
        fontSize: 14,
        fontFamily: DefaultValues.fontRegular,
    },
    whiteBox: {
        backgroundColor: Colors.white,
        width: "100%",
        borderRadius: 5,
        marginBottom: 10,
    },
});

export default SettingsScreen;
