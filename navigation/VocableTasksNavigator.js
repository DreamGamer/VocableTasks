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
import { normalize } from "../constants/GlobalStyles";
import translation from "../i18n/translation";
import Colors from "../constants/Colors";
import DefaultValues from "../constants/DefaultValues";

// Screens
import VocabularysScreen, { VocabularysScreenOptions } from "../screens/learning/vocabulary/VocabularysScreen";
import AddVocableScreen, { AddVocableScreenOptions } from "../screens/learning/vocabulary/AddVocableScreen";
import EditVocableScreen, { EditVocableScreenOptions } from "../screens/learning/vocabulary/EditVocableScreen";
import LearnScreen, { LearnScreenOptions } from "../screens/learning/learn/LearnScreen";
import HomeScreen, { HomeScreenOptions } from "../screens/vocableTasks/HomeScreen";
import AddCardScreen, { AddCardScreenOptions } from "../screens/vocableTasks/AddCardScreen";
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
import VocablesScreen, { VocablesScreenOptions } from "../screens/vocableTasks/VocablesScreen";

const useDefaultNavigationOptions = () => {
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";
  return {
    headerTintColor: isDarkMode ? Colors.white : Colors.black,
    headerStyle: { backgroundColor: isDarkMode ? Colors.darkMode : Colors.white },
    headerShadowVisible: false,
    headerTitleAlign: "center",
  };
};

//#region VocableTasks

const DrawerNavigator = createDrawerNavigator();
// const BottomTabNavigator = createBottomTabNavigator();

// export const VocableTasksNavigator = () => {
//   const { t } = useTranslation();
//   const colorScheme = useColorScheme();
//   const isDarkMode = colorScheme === "dark";

//   return (
//     <View style={{ flex: 1 }} collapsable={false}>
//       <BottomTabNavigator.Navigator
//         screenOptions={{
//           tabBarStyle: { backgroundColor: isDarkMode ? Colors.neutral[4] : Colors.white, borderTopColor: isDarkMode ? Colors.neutral[4] : Colors.neutral[2], borderTopWidth: 0.2 },
//           tabBarInactiveTintColor: isDarkMode ? Colors.white : Colors.neutral[4],
//           tabBarActiveTintColor: Colors.primary[1],
//           tabBarHideOnKeyboard: true,
//           tabBarLabelStyle: { fontFamily: DefaultValues.fontRegular, fontSize: normalize(10) },
//         }}>
//         <BottomTabNavigator.Screen
//           name="vocabulary"
//           component={VocabularyNavigator}
//           options={{
//             tabBarLabel: t("vocabulary"),
//             tabBarIcon: ({ focused, color, size }) => {
//               return <Ionicons name={focused ? "book" : "book-outline"} size={size} color={color} />;
//             },
//             headerShown: false,
//           }}
//         />
//         <BottomTabNavigator.Screen
//           name="learnTab"
//           component={LearnNavigator}
//           options={{
//             tabBarLabel: t("learn"),
//             tabBarIcon: ({ focused, color, size }) => {
//               return <Ionicons name={focused ? "create" : "create-outline"} size={size} color={color} />;
//             },
//             headerShown: false,
//           }}
//         />
//         <BottomTabNavigator.Screen
//           name="settings"
//           component={SettingsNavigator}
//           options={{
//             tabBarLabel: t("settings"),
//             tabBarIcon: ({ focused, color, size }) => {
//               return <Ionicons name={focused ? "settings" : "settings-outline"} size={size} color={color} />;
//             },
//             headerShown: false,
//           }}
//         />
//       </BottomTabNavigator.Navigator>
//     </View>
//   );
// };

export const VocableTasksNavigator = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const DefaultScreenOptions = useDefaultNavigationOptions();

  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <DrawerNavigator.Navigator
        screenOptions={{
          headerTintColor: "#fff",
          drawerLabelStyle: { fontFamily: DefaultValues.fontRegular, fontSize: normalize(13) },
          drawerActiveTintColor: Colors.primary[1],
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
        <DrawerNavigator.Screen
          name="learning"
          component={LearningNavigator}
          options={{
            title: t("learn", { ns: "navigation" }),
            drawerIcon: ({ color, size, focused }) => <Ionicons name={focused ? "book" : "book-outline"} size={size} color={color} />,
            headerShown: false,
          }}
        />
        <DrawerNavigator.Screen
          name="settings"
          component={SettingsNavigator}
          options={{
            title: t("settings", { ns: "navigation" }),
            drawerIcon: ({ color, size, focused }) => <Ionicons name={focused ? "settings" : "settings-outline"} size={size} color={color} />,
            headerShown: false,
            drawerItemStyle: {
              display: "none",
            },
          }}
        />
      </DrawerNavigator.Navigator>
    </View>
  );
};

const LearningBottomTabsNavigator = createBottomTabNavigator();

const LearningNavigator = () => {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <LearningBottomTabsNavigator.Navigator
        screenOptions={{
          tabBarStyle: { backgroundColor: isDarkMode ? Colors.darkMode : Colors.white, borderTopColor: isDarkMode ? Colors.neutral[4] : Colors.neutral[2], borderTopWidth: 0.2 },
          tabBarInactiveTintColor: isDarkMode ? Colors.white : Colors.neutral[4],
          tabBarActiveTintColor: Colors.primary[1],
          tabBarHideOnKeyboard: true,
          tabBarLabelStyle: { fontFamily: DefaultValues.fontRegular, fontSize: normalize(10) },
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
        <VocabularyStackNavigator.Screen name="home" component={HomeScreen} options={HomeScreenOptions} />
        <VocabularyStackNavigator.Screen name="addCard" component={AddCardScreen} options={AddCardScreenOptions} />
        <VocabularyStackNavigator.Screen name="vocables" component={VocablesScreen} options={VocablesScreenOptions} />
        {/* <VocabularyStackNavigator.Screen name="addVocable" component={AddVocableScreen} options={AddVocableScreenOptions} /> */}
        {/* <VocabularyStackNavigator.Screen name="editVocable" component={EditVocableScreen} options={EditVocableScreenOptions} /> */}
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
        <StartupStackNavigator.Screen name="loading" component={StartScreen} options={StartScreenOptions} />
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
            <View style={styles.customIcon}>
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
  customIcon: Platform.select({
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
