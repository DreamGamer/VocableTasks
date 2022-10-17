import React from "react";
import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import GlobalStyles from "../constants/GlobalStyles";
import { DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import CustomDrawerContentScrollView from "../components/CustomDrawerContentScrollView";
import { Title, Avatar, Caption } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useDispatch } from "react-redux";
import Colors from "../constants/Colors";
import * as authActions from "../store/actions/auth";
import auth from "@react-native-firebase/auth";
import DefaultValues from "../constants/DefaultValues";
import { useTranslation } from "react-i18next";
import Auth from "@react-native-firebase/auth";
import translation from "../i18n/translation";

const DrawerContent = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const photoURL = Auth().currentUser.photoURL;
  const firstLetter = Auth().currentUser.displayName.charAt(0);

  return (
    <View style={GlobalStyles.flex1}>
      <CustomDrawerContentScrollView {...props}>
        <View style={GlobalStyles.flex1}>
          <View style={styles.userInfoContainer}>
            {photoURL ? <Avatar.Image source={{ uri: photoURL }} size={50} style={styles.avatarStyle} /> : <Avatar.Text size={50} color={Colors.neutral[3]} label={firstLetter} style={styles.avatarStyle} />}
            <View style={{ marginLeft: 15, flexDirection: "column" }}>
              <Title style={styles.displayName}>{auth().currentUser.displayName}</Title>
              <Caption style={styles.email}>{auth().currentUser.email}</Caption>
            </View>
          </View>
        <DrawerItem
          label={ t("learn", { ns: "navigation" })}
          icon={ ({ color, size, focused }) => <Ionicons name={focused ? "book" : "book-outline"} size={size} color={color} />}
          onPress={() => {
            props.navigation.navigate("learning");
          }}
          focused={props.navigation.getState().index === 0}
        />
        </View>
      </CustomDrawerContentScrollView>
      <View style={styles.bottomSection}>
        <DrawerItem
          icon={({ color, size, focused }) => <Ionicons name={focused ? "settings" : "settings-outline"} size={size} color={color} />}
          label={t("settings", { ns: "navigation" })}
          onPress={() => {
            props.navigation.navigate("settings");
          }}
          focused={props.navigation.getState().index === 1}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomSection: {
    borderTopColor: Colors.neutral[2],
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
  avatarStyle: {
    backgroundColor: Colors.neutral[2],
  },
});

export default DrawerContent;
