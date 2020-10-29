import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from "../../components/HeaderButton";

const vocabularysScreen = props => {
    return (
        <View>
            <Text>vocabularysScreen</Text>
        </View>
    )
};

vocabularysScreen.navigationOptions = navigationData => {
    return {
        title: "Vocabulary",
        headerLeft: () => (
            // HeaderButton to toggle the Drawer
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title="Menu" iconName="ios-menu" onPress={() => {
                    navigationData.navigation.toggleDrawer();
                }} />
            </HeaderButtons>
        )
    }
};

const styles = StyleSheet.create({

});

export default vocabularysScreen;