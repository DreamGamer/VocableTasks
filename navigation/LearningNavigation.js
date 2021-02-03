import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "react-navigation-tabs";

// Import Screens
import VocabularyNavigation from "./VocabularyNavigation";
import LearnNavigation from "./LearnNavigation";

const learningBottomTabNavigator = createBottomTabNavigator({
    vocabulary: {
        screen: VocabularyNavigation,
        navigationOptions: {
            tabBarLabel: "Vocabulary",
            tabBarIcon: tabInformationn => {
                return <Ionicons name="md-book" size={25} color={tabInformationn.tintColor} />;
            },
        },
    },
    learn: {
        screen: LearnNavigation,
        navigationOptions: {
            tabBarLabel: "Learn",
            tabBarIcon: tabInformationn => {
                return <Ionicons name="md-create" size={25} color={tabInformationn.tintColor} />;
            },
        },
    },
});

export default learningBottomTabNavigator;
