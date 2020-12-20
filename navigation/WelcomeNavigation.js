import { createStackNavigator } from "react-navigation-stack";

// Screens
import DisplayNameScreen from "../screens/welcome/DisplayNameScreen";

const WelcomeNavigation = createStackNavigator({
    displayName: {
        screen: DisplayNameScreen,
        navigationOptions: {
            headerTransparent: true,
        }
    }
});

export default WelcomeNavigation;
