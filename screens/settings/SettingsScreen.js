import React from "react";
import { StyleSheet, View, Text, ScrollView, useColorScheme } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../components/HeaderButton";
import Colors from "../../constants/Colors";
import DefaultValues from "../../constants/DefaultValues";
import GlobalStyles, { normalize } from "../../constants/GlobalStyles";
import SettingsButton from "../../components/SettingsButton";
import { useDispatch } from "react-redux";
import * as authActions from "../../store/actions/auth";
import { Trans, useTranslation } from "react-i18next";
import { Translation } from "../../i18n/translation";

const SettingsScreen = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <View style={GlobalStyles.flex1}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.topContent}>
          <Text style={{ ...styles.title, ...{ color: isDarkMode ? Colors.white : Colors.black } }}>{t("account")}</Text>

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

          <Text style={{ ...styles.title, ...{ color: isDarkMode ? Colors.white : Colors.black } }}>{t("general")}</Text>

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
        <View style={styles.bottomContent}>
          <SettingsButton
            iconName="log-out-outline"
            iconColor={Colors.danger}
            title={t("logout")}
            titleColor={Colors.danger}
            onPress={() => {
              dispatch(authActions.logout());
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export const SettingsScreenOptions = (navigationData) => {
  return {
    title: <Trans name="settings" />,
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
    fontSize: normalize(14),
    fontFamily: DefaultValues.fontRegular,
  },
});

export default SettingsScreen;
