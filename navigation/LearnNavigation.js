import { createStackNavigator } from "react-navigation-stack";

// Import Screens
import LearnScreen from "../screens/learning/learn/LearnScreen";

const learnStackNavigator = createStackNavigator({
    learn: {
        screen: LearnScreen,
    },
});

export default learnStackNavigator;