import React from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";

import StartScreen from "../screens/StartScreen";
import AppNavigation from "./AppNavigation";
import AuthNavigation from "./AuthNavigation";
import WelcomeNavigation from "./WelcomeNavigation";

const MainNavigation = createSwitchNavigator({
    Startup: {
        screen: StartScreen,
    },
    Auth: {
        screen: AuthNavigation,
    },
    Welcome: {
        screen: WelcomeNavigation,
    },
    VocabelTasks: {
        screen: AppNavigation,
    },
});

export default createAppContainer(MainNavigation);
