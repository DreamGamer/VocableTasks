import React from "react";
import { StyleSheet, View, Text, ActivityIndicator, Dimensions, TouchableOpacity } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../../../components/HeaderButton";
import GlobalStyles from "../../../constants/GlobalStyles";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../../../constants/Colors";

const LearnScreen = props => {
    return (
        <View style={GlobalStyles.flex1}>
            <View style={styles.header}>
                <Text style={GlobalStyles.h2}>Choose your gamemode</Text>
            </View>
            <View style={styles.content}>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.item} onPress={() => {}}>
                        <View style={styles.container}>
                            <Ionicons name="md-create" size={45} color={Colors.grey} />
                        </View>
                        <View style={styles.container}>
                            <Text style={{ ...GlobalStyles.h5, ...styles.gameModeText }}>Vocabularies</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.item} onPress={() => {}}>
                        <View style={styles.container}>
                            <Ionicons name="people" size={45} color={Colors.grey} />
                        </View>
                        <View style={styles.container}>
                            <Text style={{ ...GlobalStyles.h5, ...styles.gameModeText }}>Battle</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export const LearnScreenOptions = navigationData => {
    return {
        title: "Learn",
        headerLeft: () => (
            // HeaderButton to toggle the Drawer
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item
                    title="Menu"
                    iconName="ios-menu"
                    onPress={() => {
                        navigationData.navigation.toggleDrawer();
                    }}
                />
            </HeaderButtons>
        ),
    };
};

const styles = StyleSheet.create({
    header: {
        flex: 2,
        backgroundColor: Colors.backgroundTop,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
    },
    content: {
        flex: 8,
        paddingVertical: 20,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-around",
    },
    item: {
        width: Dimensions.get("window").width * 0.3,
        height: Dimensions.get("window").width * 0.3,
        backgroundColor: "#fff",
        justifyContent: "center",
        borderRadius: 100,
        elevation: 5,
    },
    container: {
        alignItems: "center",
    },
    gameModeText: {
        color: Colors.black,
    },
});

export default LearnScreen;
