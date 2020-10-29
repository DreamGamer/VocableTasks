import { createAppContainer, createSwitchNavigator } from "react-navigation";

import StartScreen from "../screens/StartScreen";
import AppNavigation from "./AppNavigation";

const MainNavigation = createSwitchNavigator({
    startup: {
        screen: StartScreen
    },
    VokabelTasks: {
        screen: AppNavigation
    }
});

export default createAppContainer(MainNavigation);