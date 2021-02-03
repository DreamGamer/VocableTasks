import { createStackNavigator } from "react-navigation-stack";

// Import Screens
import VocabularysScreen from "../screens/learning/vocabulary/VocabularysScreen";
import AddVocableScreen from "../screens/learning/vocabulary/AddVocableScreen";
import EditVocableScreen from "../screens/learning/vocabulary/EditVocableScreen";

const vocabularyStackNavigator = createStackNavigator({
    vocabularys: {
        screen: VocabularysScreen,
    },
    addVocable: {
        screen: AddVocableScreen,
    },
    editVocable: {
        screen: EditVocableScreen,
    },
});


export default vocabularyStackNavigator;