import React from "react";
import { View, useColorScheme, StyleSheet, Platform } from "react-native";
import { CardStyleInterpolators, createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import DrawerContent from "./DrawerContent";
import { useTranslation } from "react-i18next";

// Screens
import VocabularysScreen, { VocabularysScreenOptions } from "../screens/learning/vocabulary/VocabularysScreen";
import AddVocableScreen, { AddVocableScreenOptions } from "../screens/learning/vocabulary/AddVocableScreen";
import EditVocableScreen, { EditVocableScreenOptions } from "../screens/learning/vocabulary/EditVocableScreen";
import LearnScreen, { LearnScreenOptions } from "../screens/learning/learn/LearnScreen";
import StartScreen, { StartScreenOptions } from "../screens/StartScreen";
import LoginScreen, { LoginScreenOptions } from "../screens/auth/LoginScreen";
import SignUpScreen, { SignUpScreenOptions } from "../screens/auth/SignUpScreen";
import ForgotPasswordScreen, { ForgotPasswordScreenOptions } from "../screens/auth/ForgotPasswordScreen";
import AuthenticationScreen, { AuthenticationScreenOptions } from "../screens/auth/AuthenticationScreen";
import DisplayNameScreen, { DisplayNameScreenOptions } from "../screens/welcome/DisplayNameScreen";
import SettingsScreen, { SettingsScreenOptions } from "../screens/settings/SettingsScreen";
import EditProfileScreen, { EditProfileScreenOptions } from "../screens/settings/EditProfileScreen";
import ChangePasswordScreen, { ChangePasswordScreenOptions } from "../screens/settings/ChangePasswordScreen";
import ChangeLanguageScreen, { ChangeLanguageScreenOptions } from "../screens/settings/ChangeLanguageScreen";
import HelpAndSupportScreen, { HelpAndSupportScreenOptions } from "../screens/settings/HelpAndSupportScreen";
import Colors from "../constants/Colors";
import DefaultValues from "../constants/DefaultValues";
import { normalize } from "../constants/GlobalStyles";

const useDefaultNavigationOptions = () => {
  const colorScheme = useColorScheme();
  return {
    headerTintColor: colorScheme === "light" ? Colors.textBlack : Colors.textWhite,
    //headerStyle: { backgroundColor: colorScheme === "light" ? Colors.white : Colors.lightBlack },
    headerStyle: { backgroundColor: colorScheme === "light" ? Colors.primary : Colors.grey },
    headerTintColor: "#fff",
    headerShadowVisible: false,
  };
};

//#region VocableTasks

const VocableTasksDrawerNavigator = createDrawerNavigator();

export const VocableTasksNavigator = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const DefaultScreenOptions = useDefaultNavigationOptions();

  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <VocableTasksDrawerNavigator.Navigator
        screenOptions={{
          headerTintColor: "#ffffff",
        }}
        drawerContent={(props) => {
          return (
            <DrawerContent
              {...props}
              logoutHandler={() => {
                dispatch(authActions.logout());
              }}
            />
          );
        }}>
        <VocableTasksDrawerNavigator.Screen
          name="learning"
          component={LearningNavigator}
          options={{
            title: t("learn"),
            drawerIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
            headerShown: false,
          }}
        />
        <VocableTasksDrawerNavigator.Screen
          name="settings"
          component={SettingsNavigator}
          options={{
            title: t("settings"),
            drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
            headerShown: false,
          }}
        />
      </VocableTasksDrawerNavigator.Navigator>
    </View>
  );
};

const LearningBottomTabsNavigator = createBottomTabNavigator();

const LearningNavigator = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <LearningBottomTabsNavigator.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: colorScheme === "light" ? Colors.white : Colors.black, borderTopColor: Colors.lightGrey, borderTopWidth: 0.2 },
          tabBarInactiveTintColor: colorScheme === "light" ? Colors.black : Colors.white,
          tabBarActiveTintColor: colorScheme === "light" ? Colors.primary : Colors.primary,
          tabBarHideOnKeyboard: true,
        }}>
        <LearningBottomTabsNavigator.Screen
          name="vocabulary"
          component={VocabularyNavigator}
          options={{
            tabBarLabel: t("vocabulary"),
            tabBarIcon: ({ focused, color, size }) => {
              return <Ionicons name={focused ? "book" : "book-outline"} size={size} color={color} />;
            },
            headerShown: false,
          }}
        />
        <LearningBottomTabsNavigator.Screen
          name="learnTab"
          component={LearnNavigator}
          options={{
            tabBarLabel: t("learn"),
            tabBarIcon: ({ focused, color, size }) => {
              return <Ionicons name={focused ? "create" : "create-outline"} size={size} color={color} />;
            },
            headerShown: false,
          }}
        />
      </LearningBottomTabsNavigator.Navigator>
    </View>
  );
};

const VocabularyStackNavigator = createStackNavigator();

const VocabularyNavigator = () => {
  const DefaultScreenOptions = useDefaultNavigationOptions();
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <VocabularyStackNavigator.Navigator screenOptions={DefaultScreenOptions}>
        <VocabularyStackNavigator.Screen name="vocabularys" component={VocabularysScreen} options={VocabularysScreenOptions} />
        <VocabularyStackNavigator.Screen name="addVocable" component={AddVocableScreen} options={AddVocableScreenOptions} />
        <VocabularyStackNavigator.Screen name="editVocable" component={EditVocableScreen} options={EditVocableScreenOptions} />
      </VocabularyStackNavigator.Navigator>
    </View>
  );
};

const LearnStackNavigator = createStackNavigator();

const LearnNavigator = () => {
  const DefaultScreenOptions = useDefaultNavigationOptions();
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <LearnStackNavigator.Navigator screenOptions={DefaultScreenOptions}>
        <LearnStackNavigator.Screen name="learn" component={LearnScreen} options={LearnScreenOptions} />
      </LearnStackNavigator.Navigator>
    </View>
  );
};

const SettingsStackNavigator = createStackNavigator();

const SettingsNavigator = () => {
  const DefaultScreenOptions = useDefaultNavigationOptions();

  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <SettingsStackNavigator.Navigator screenOptions={DefaultScreenOptions}>
        <SettingsStackNavigator.Screen name="menu" component={SettingsScreen} options={SettingsScreenOptions} />
        <SettingsStackNavigator.Screen
          name="editProfile"
          component={EditProfileScreen}
          options={(navigationOptions) => {
            return {
              ...EditProfileScreenOptions(navigationOptions),
              ...{ headerTintColor: "#fff" },
            };
          }}
        />
        <SettingsStackNavigator.Screen name="changePassword" component={ChangePasswordScreen} options={ChangePasswordScreenOptions} />
        <SettingsStackNavigator.Screen name="changeLanguage" component={ChangeLanguageScreen} options={ChangeLanguageScreenOptions} />
        <SettingsStackNavigator.Screen name="helpAndSupport" component={HelpAndSupportScreen} options={HelpAndSupportScreenOptions} />
      </SettingsStackNavigator.Navigator>
    </View>
  );
};
//#endregion

//#region Startup

const StartupStackNavigator = createStackNavigator();

export const StartupNavigator = () => {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <StartupStackNavigator.Navigator screenOptions={{ headerShown: false }}>
        <StartupStackNavigator.Screen name="startup" component={StartScreen} options={StartScreenOptions} />
      </StartupStackNavigator.Navigator>
    </View>
  );
};

//#endregion

//#region Auth

const config = {
  animation: "spring",
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <AuthStackNavigator.Navigator
        screenOptions={{
          headerTitleStyle: { fontFamily: DefaultValues.fontRegular, fontSize: normalize(16) },
          headerTransparent: true,
          headerTitleAlign: "center",
          transitionSpec: { open: config, close: config },
          headerTintColor: isDarkMode ? Colors.white : Colors.black,
          headerBackImage: () => (
            <View style={styles.backButton}>
              <Ionicons size={24} color={isDarkMode ? Colors.white : Colors.black} name="arrow-back-outline" />
            </View>
          ),
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <AuthStackNavigator.Screen name="authentication" component={AuthenticationScreen} options={AuthenticationScreenOptions} />
        <AuthStackNavigator.Screen name="login" component={LoginScreen} options={LoginScreenOptions} />
        <AuthStackNavigator.Screen name="signup" component={SignUpScreen} options={SignUpScreenOptions} />
        <AuthStackNavigator.Screen name="forgotPassword" component={ForgotPasswordScreen} options={ForgotPasswordScreenOptions} />
      </AuthStackNavigator.Navigator>
    </View>
  );
};

//#endregion

//#region Welcome

const WelcomeStackNavigator = createStackNavigator();

export const WelcomeNavigator = () => {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <WelcomeStackNavigator.Navigator>
        <WelcomeStackNavigator.Screen name="displayName" component={DisplayNameScreen} options={DisplayNameScreenOptions} />
      </WelcomeStackNavigator.Navigator>
    </View>
  );
};

//#endregion

const styles = StyleSheet.create({
  backButton: Platform.select({
    ios: {
      height: 21,
      width: 13,
      marginLeft: 8,
      marginRight: 22,
      marginVertical: 12,
    },
    default: {
      height: 24,
      width: 24,
      margin: 3,
    },
  }),
});
