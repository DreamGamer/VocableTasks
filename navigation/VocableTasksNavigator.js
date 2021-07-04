import React from "react";
import { Button, SafeAreaView, StyleSheet, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerItemList } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";

// Screens
import VocabularysScreen, { VocabularysScreenOptions } from "../screens/learning/vocabulary/VocabularysScreen";
import AddVocableScreen, { AddVocableScreenOptions } from "../screens/learning/vocabulary/AddVocableScreen";
import EditVocableScreen, { EditVocableScreenOptions } from "../screens/learning/vocabulary/EditVocableScreen";
import LearnScreen, { LearnScreenOptions } from "../screens/learning/learn/LearnScreen";
import StartScreen from "../screens/StartScreen";
import LoginScreen, { LoginScreenOptions } from "../screens/auth/LoginScreen";
import SignUpScreen, { SignUpScreenOptions } from "../screens/auth/SignUpScreen";
import ForgotPasswordScreen, { ForgotPasswordScreenOptions } from "../screens/auth/ForgotPasswordScreen";
import DisplayNameScreen, { DisplayNameScreenOptions } from "../screens/welcome/DisplayNameScreen";
import SettingsScreen, { SettingsScreenOptions } from "../screens/settings/SettingsScreen";

//#region VocableTasks

const VocableTasksDrawerNavigator = createDrawerNavigator();

export const VocableTasksNavigator = () => {
    const dispatch = useDispatch();
    return (
        <VocableTasksDrawerNavigator.Navigator
            drawerContent={props => {
                return (
                    <View style={styles.content}>
                        <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
                            <DrawerItemList {...props} />
                            <Button
                                title="Logout"
                                onPress={() => {
                                    dispatch(authActions.logout());
                                }}
                            />
                        </SafeAreaView>
                    </View>
                );
            }}>
            <VocableTasksDrawerNavigator.Screen name="learning" component={LearningNavigator} />
            <VocableTasksDrawerNavigator.Screen name="settings" component={SettingsNavigator} />
        </VocableTasksDrawerNavigator.Navigator>
    );
};

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingTop: 35,
    },
});

const LearningBottomTabsNavigator = createBottomTabNavigator();

const LearningNavigator = () => {
    return (
        <LearningBottomTabsNavigator.Navigator>
            <LearningBottomTabsNavigator.Screen
                name="vocabulary"
                component={VocabularyNavigator}
                options={{
                    tabBarLabel: "Vocabulary",
                    tabBarIcon: tabInformation => {
                        return <Ionicons name="md-book" size={25} color={tabInformation.tintColor} />;
                    },
                }}
            />
            <LearningBottomTabsNavigator.Screen
                name="learn"
                component={LearnNavigator}
                options={{
                    tabBarLabel: "Learn",
                    tabBarIcon: tabInformation => {
                        return <Ionicons name="md-create" size={25} color={tabInformation.tintColor} />;
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
        </SettingsStackNavigator.Navigator>
    );
};
//#endregion

//#region Startup

const StartupStackNavigator = createStackNavigator();

export const StartupNavigator = () => {
    return (
        <StartupStackNavigator.Navigator>
            <StartupStackNavigator.Screen name="startup" component={StartScreen} />
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
