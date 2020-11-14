import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { Ionicons } from "@expo/vector-icons";

// Import Screens
import VocabularysScreen from "../screens/learning/VocabularysScreen";
import LearnScreen from "../screens/learning/LearnScreen";
import AddVocableScreen from "../screens/learning/AddVocableScreen";
import EditVocableScreen from "../screens/learning/EditVocableScreen";
import { createBottomTabNavigator } from "react-navigation-tabs";

const vocabularyStackNavigator = createStackNavigator({
    vocabularys: {
        screen: VocabularysScreen,
    },
    addVocable: {
        screen: AddVocableScreen,
    },
    editVocable: {
        screen: EditVocableScreen,
    },
});

const learnStackNavigator = createStackNavigator({
    learn: {
        screen: LearnScreen,
    },
});

const learningBottomTabNavigator = createBottomTabNavigator({
    vocabulary: {
        screen: vocabularyStackNavigator,
        navigationOptions: {
            tabBarLabel: "Vocabulary",
            tabBarIcon: tabInformationn => {
                return <Ionicons name="md-book" size={25} color={tabInformationn.tintColor} />;
            },
        },
    },
    learn: {
        screen: learnStackNavigator,
        navigationOptions: {
            tabBarLabel: "Learn",
            tabBarIcon: tabInformationn => {
                return <Ionicons name="md-create" size={25} color={tabInformationn.tintColor} />;
            },
        },
    },
});

export default learningBottomTabNavigator;
