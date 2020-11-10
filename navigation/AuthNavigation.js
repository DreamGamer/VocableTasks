import { createStackNavigator } from "react-navigation-stack";

// Screens
import LoginScreen from "../screens/auth/LoginScreen";

const AuthNavigation = createStackNavigator({
    login: {
        screen: LoginScreen,
        navigationOptions: {
            headerShown: false
        }
    },
});

export default AuthNavigation;
