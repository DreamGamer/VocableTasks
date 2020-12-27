import { createStackNavigator } from "react-navigation-stack";

// Screens
import LoginScreen from "../screens/auth/LoginScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";
import ForgotPasswordScreen from "../screens/auth/ForgotPasswordScreen";

const AuthNavigation = createStackNavigator({
    login: {
        screen: LoginScreen,
        navigationOptions: {
            headerShown: false,
        },
    },
    signup: {
        screen: SignUpScreen,
        navigationOptions: {
            headerTransparent: true,
            
        },
    },
    forgotPassword: {
        screen: ForgotPasswordScreen,
        navigationOptions: {
            headerTransparent: true,
        }
    }
});

export default AuthNavigation;
