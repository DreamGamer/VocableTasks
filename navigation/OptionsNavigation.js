import { createStackNavigator } from "react-navigation-stack";

// Import Screens
import OptionsScreen from "../screens/options/OptionsScreen";

const optionsStackNavigator = createStackNavigator({
    options: {
        screen: OptionsScreen,
    },
});

export default optionsStackNavigator;
