import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";
import DrawerContent from "./DrawerContent";
import I18n from "i18n-js";

// Screens
import VocabularysScreen, { VocabularysScreenOptions } from "../screens/learning/vocabulary/VocabularysScreen";
import AddVocableScreen, { AddVocableScreenOptions } from "../screens/learning/vocabulary/AddVocableScreen";
import EditVocableScreen, { EditVocableScreenOptions } from "../screens/learning/vocabulary/EditVocableScreen";
import LearnScreen, { LearnScreenOptions } from "../screens/learning/learn/LearnScreen";
import StartScreen, { StartScreenOptions } from "../screens/StartScreen";
import LoginScreen, { LoginScreenOptions } from "../screens/auth/LoginScreen";
import SignUpScreen, { SignUpScreenOptions } from "../screens/auth/SignUpScreen";
import ForgotPasswordScreen, { ForgotPasswordScreenOptions } from "../screens/auth/ForgotPasswordScreen";
import DisplayNameScreen, { DisplayNameScreenOptions } from "../screens/welcome/DisplayNameScreen";
import SettingsScreen, { SettingsScreenOptions } from "../screens/settings/SettingsScreen";
import EditProfileScreen, { EditProfileScreenOptions } from "../screens/settings/EditProfileScreen";
import ChangePasswordScreen, { ChangePasswordScreenOptions } from "../screens/settings/ChangePasswordScreen";
import ChangeLanguageScreen, { ChangeLanguageScreenOptions } from "../screens/settings/ChangeLanguageScreen";
import HelpAndSupportScreen, { HelpAndSupportScreenOptions } from "../screens/settings/HelpAndSupportScreen";

//#region VocableTasks

const VocableTasksDrawerNavigator = createDrawerNavigator();

export const VocableTasksNavigator = () => {
    const dispatch = useDispatch();
    return (
        <VocableTasksDrawerNavigator.Navigator
            drawerContent={props => {
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
                    title: I18n.t("learn"),
                    drawerIcon: ({ color, size }) => <Ionicons name="book-outline" size={size} color={color} />,
                }}
            />
            <VocableTasksDrawerNavigator.Screen
                name="settings"
                component={SettingsNavigator}
                options={{
                    title: I18n.t("settings"),
                    drawerIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
                }}
            />
        </VocableTasksDrawerNavigator.Navigator>
    );
};

const LearningBottomTabsNavigator = createBottomTabNavigator();

const LearningNavigator = () => {
    return (
        <LearningBottomTabsNavigator.Navigator>
            <LearningBottomTabsNavigator.Screen
                name="vocabulary"
                component={VocabularyNavigator}
                options={{
                    tabBarLabel: I18n.t("vocabulary"),
                    tabBarIcon: tabInformation => {
                        return <Ionicons name="book" size={25} color={tabInformation.tintColor} />;
                    },
                }}
            />
            <LearningBottomTabsNavigator.Screen
                name="learn"
                component={LearnNavigator}
                options={{
                    tabBarLabel: I18n.t("learn"),
                    tabBarIcon: tabInformation => {
                        return <Ionicons name="create" size={25} color={tabInformation.tintColor} />;
                    },
                }}
            />
        </LearningBottomTabsNavigator.Navigator>
    );
};

const VocabularyStackNavigator = createStackNavigator();

const VocabularyNavigator = () => {
    return (
        <VocabularyStackNavigator.Navigator>
            <VocabularyStackNavigator.Screen name="vocabularys" component={VocabularysScreen} options={VocabularysScreenOptions} />
            <VocabularyStackNavigator.Screen name="addVocable" component={AddVocableScreen} options={AddVocableScreenOptions} />
            <VocabularyStackNavigator.Screen name="editVocable" component={EditVocableScreen} options={EditVocableScreenOptions} />
        </VocabularyStackNavigator.Navigator>
    );
};

const LearnStackNavigator = createStackNavigator();

const LearnNavigator = () => {
    return (
        <LearnStackNavigator.Navigator>
            <LearnStackNavigator.Screen name="learn" component={LearnScreen} options={LearnScreenOptions} />
        </LearnStackNavigator.Navigator>
    );
};

const SettingsStackNavigator = createStackNavigator();

const SettingsNavigator = () => {
    return (
        <SettingsStackNavigator.Navigator>
            <SettingsStackNavigator.Screen name="settings" component={SettingsScreen} options={SettingsScreenOptions} />
            <SettingsStackNavigator.Screen name="editProfile" component={EditProfileScreen} options={EditProfileScreenOptions} />
            <SettingsStackNavigator.Screen name="changePassword" component={ChangePasswordScreen} options={ChangePasswordScreenOptions} />
            <SettingsStackNavigator.Screen name="changeLanguage" component={ChangeLanguageScreen} options={ChangeLanguageScreenOptions} />
            <SettingsStackNavigator.Screen name="helpAndSupport" component={HelpAndSupportScreen} options={HelpAndSupportScreenOptions} />
        </SettingsStackNavigator.Navigator>
    );
};
//#endregion

//#region Startup

const StartupStackNavigator = createStackNavigator();

export const StartupNavigator = () => {
    return (
        <StartupStackNavigator.Navigator>
            <StartupStackNavigator.Screen name="startup" component={StartScreen} options={StartScreenOptions} />
        </StartupStackNavigator.Navigator>
    );
};

//#endregion

//#region Auth

const AuthStackNavigator = createStackNavigator();

export const AuthNavigator = () => {
    return (
        <AuthStackNavigator.Navigator>
            <AuthStackNavigator.Screen name="login" component={LoginScreen} options={LoginScreenOptions} />
            <AuthStackNavigator.Screen name="signup" component={SignUpScreen} options={SignUpScreenOptions} />
            <AuthStackNavigator.Screen name="forgotPassword" component={ForgotPasswordScreen} options={ForgotPasswordScreenOptions} />
        </AuthStackNavigator.Navigator>
    );
};

//#endregion

//#region Welcome

const WelcomeStackNavigator = createStackNavigator();

export const WelcomeNavigator = () => {
    return (
        <WelcomeStackNavigator.Navigator>
            <WelcomeStackNavigator.Screen name="displayName" component={DisplayNameScreen} options={DisplayNameScreenOptions} />
        </WelcomeStackNavigator.Navigator>
    );
};

//#endregion
