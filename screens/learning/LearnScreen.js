import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from "../../components/HeaderButton";

const LearnScreen = props => {
    return (
        <View>
            <Text>LearnScreen</Text>
        </View>
    )
};

LearnScreen.navigationOptions = navigationData => {
    return {
        title: "Learn",
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

export default LearnScreen;