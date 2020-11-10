import { createAppContainer, createSwitchNavigator } from "react-navigation";

import StartScreen from "../screens/StartScreen";
import AppNavigation from "./AppNavigation";
import AuthNavigation from "./AuthNavigation";

const MainNavigation = createSwitchNavigator({
    Startup: {
        screen: StartScreen,
    },
    Auth: {
        screen: AuthNavigation,
    },
    VokabelTasks: {
        screen: AppNavigation,
    },
});

export default createAppContainer(MainNavigation);
