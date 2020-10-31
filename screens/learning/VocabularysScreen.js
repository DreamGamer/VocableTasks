import React from 'react';
import { StyleSheet, View, Text } from "react-native";
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from "../../components/HeaderButton";

const VocabularysScreen = props => {
    return (
        <View>
            <Text>VocabularysScreen</Text>
        </View>
    )
};

VocabularysScreen.navigationOptions = navigationData => {
    return {
        title: "Vocabulary",
        headerLeft: () => (
            // HeaderButton to toggle the Drawer
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title="Menu" iconName="ios-menu" onPress={() => {
                    navigationData.navigation.toggleDrawer();
                }} />
            </HeaderButtons>
        ),
        headerRight: () => (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title="Add" iconName="md-add" onPress={() => {
                    navigationData.navigation.navigate({routeName: "addVocable"});
                }} />
            </HeaderButtons>
        )
    }
};

const styles = StyleSheet.create({

});

export default VocabularysScreen;