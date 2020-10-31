import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons } from "@expo/vector-icons";

// Import Screens
import OptionsScreen from "../screens/options/OptionsScreen";
import VocabularysScreen from "../screens/learning/VocabularysScreen";
import LearnScreen from "../screens/learning/LearnScreen";
import AddVocableScreen from "../screens/learning/AddVocableScreen";



const vocabularyStackNavigator = createStackNavigator({
    vocabularys: {
        screen: VocabularysScreen
    },
    addVocable: {
        screen: AddVocableScreen
    }
});

const learnStackNavigator = createStackNavigator({
    learn: {
        screen: LearnScreen
    }
});


const optionsStackNavigator = createStackNavigator({
    options: {
        screen: OptionsScreen
    }
});


const learningBottomTabNavigator = createBottomTabNavigator({
    vocabulary: {
        screen: vocabularyStackNavigator,
        navigationOptions: {
            tabBarLabel: "Vocabulary",
            tabBarIcon: (tabInformationn) => {
                return <Ionicons name="md-book" size={25} color={tabInformationn.tintColor} />
            }
        }
    },
    learn: {
        screen: learnStackNavigator,
        navigationOptions: {
            tabBarLabel: "Learn",
            tabBarIcon: (tabInformationn) => {
                return <Ionicons name="md-create" size={25} color={tabInformationn.tintColor} />
            }
        }
    }
});


const DrawerNavigator = createDrawerNavigator({
    learning: {
        screen: learningBottomTabNavigator,
        navigationOptions: {
            drawerLabel: "Learning"
        }
    },
    options: {
        screen: optionsStackNavigator,
        navigationOptions: {
            drawerLabel: "Options"
        }
    }
});

export default DrawerNavigator;