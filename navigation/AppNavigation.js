import React from "react";
import { Button, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createDrawerNavigator, DrawerNavigatorItems } from "react-navigation-drawer";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";

// Import Navigations
import LearningNavigation from "./LearningNavigation";
import OptionsNavigation from "./OptionsNavigation";

const DrawerNavigator = createDrawerNavigator(
    {
        learning: {
            screen: LearningNavigation,
            navigationOptions: {
                drawerLabel: "Learning",
            },
        },
        options: {
            screen: OptionsNavigation,
            navigationOptions: {
                drawerLabel: "Options",
            },
        },
    },
    {
        contentComponent: props => {
            const dispatch = useDispatch();

            return (
                <View style={styles.content}>
                    <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
                        <DrawerNavigatorItems {...props} />
                        <Button
                            title="Logout"
                            onPress={() => {
                                dispatch(authActions.logout());
                            }}
                        />
                    </SafeAreaView>
                </View>
            );
        },
    }
);

const styles = StyleSheet.create({
    content: {
        flex: 1,
        paddingTop: 35,
    },
});

export default DrawerNavigator;
