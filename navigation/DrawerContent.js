import React from "react";
import { Button, SafeAreaView, StyleSheet, View } from "react-native";
import GlobalStyles from "../constants/GlobalStyles";
import { DrawerItemList, DrawerContentScrollView } from "@react-navigation/drawer";
import { Drawer, Title, Avatar, Caption } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import Colors from "../constants/Colors";
import * as authActions from "../store/actions/auth";
import auth from "@react-native-firebase/auth";
import DefaultValues from "../constants/DefaultValues";
import I18n from "i18n-js";
import Auth from "@react-native-firebase/auth";

const DrawerContent = props => {
    const dispatch = useDispatch();
    const photoURL = Auth().currentUser.photoURL;
    const firstLetter = Auth().currentUser.displayName.charAt(0);

    return (
        <View style={GlobalStyles.flex1}>
            <DrawerContentScrollView {...props}>
                <View style={GlobalStyles.flex1}>
                    <View style={styles.userInfoContainer}>
                        {photoURL ? <Avatar.Image source={{ uri: photoURL }} size={50} /> : <Avatar.Text size={50} label={firstLetter} />}
                        <View style={{ marginLeft: 15, flexDirection: "column" }}>
                            <Title style={styles.displayName}>{auth().currentUser.displayName}</Title>
                            <Caption style={styles.email}>{auth().currentUser.email}</Caption>
                        </View>
                    </View>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>
            <Drawer.Section style={styles.bottomSection}>
                <Drawer.Item
                    icon={({ color, size }) => <Ionicons name="log-out-outline" size={size} color={color} />}
                    label={I18n.t("logout")}
                    onPress={() => {
                        dispatch(authActions.logout());
                    }}
                />
            </Drawer.Section>
        </View>
    );
};

const styles = StyleSheet.create({
    bottomSection: {
        borderTopColor: Colors.lightGrey,
        borderTopWidth: 1,
    },
    userInfoContainer: {
        flexDirection: "row",
        paddingLeft: 10,
        marginTop: 10,
        marginBottom: 15,
    },
    displayName: {
        fontSize: 16,
        fontFamily: DefaultValues.fontBold,
    },
    email: {
        fontSize: 12,
        fontFamily: DefaultValues.fontRegular,
    },
});

export default DrawerContent;
