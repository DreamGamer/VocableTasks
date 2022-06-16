import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import GlobalStyles from "../constants/GlobalStyles";

const DrawerContentScrollView = ({ contentContainerStyle, style, children, ...rest }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={GlobalStyles.flex1}>
            <View
                style={{
                    height: insets.top,
                    backgroundColor: "rgba(0,0,0,0.25)",
                }}
            />
            <ScrollView
                {...rest}
                contentContainerStyle={[
                    {
                        marginTop: 4,
                        paddingStart: insets.left,
                    },
                    contentContainerStyle,
                ]}
                style={[styles.container, style]}>
                {children}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default DrawerContentScrollView;
