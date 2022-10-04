import React, { useEffect, useRef, useState } from "react";
import { useColorScheme, StatusBar } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector, useDispatch } from "react-redux";
//import MainNavigation from "./MainNavigation";
import auth from "@react-native-firebase/auth";
import * as authActions from "../store/actions/auth";
import * as authAction from "../store/reducers/authSlice";
import * as vocablesActions from "../store/actions/vocables";
import { VocableTasksNavigator, AuthNavigator, StartupNavigator, WelcomeNavigator } from "./VocableTasksNavigator";
import Colors from "../constants/Colors";
import Bugsnag from "@bugsnag/react-native";
import deepDiffer from "react-native/Libraries/Utilities/differ/deepDiffer";
import CustomAlert from "../components/CustomAlert";
import translation from "../i18n/translation";

const TAG = "[AppNavigator]";

const AppNavigator = (props) => {
  const navRef = useRef();
  /*
    const isAuth = useSelector(state => !!state.auth.idToken);
    const tryedAutoLogin = useSelector(state => state.auth.tryedAutoLogin);
    const hasDisplayName = useSelector(state => !!state.auth.displayName);
    */

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const isAuth = useSelector((state) => !!state.auth.isAuth);
  const initializedAuth = useSelector((state) => !!state.auth.initialized);
  const hasDisplayName = useSelector((state) => !!state.auth.displayName);
  const [initialized, setInitialized] = useState(false);
  const [hasError, setHasError] = useState("");
  let savedUser = {};

  const { t } = translation;

  const dispatch = useDispatch();

  const onAuthStateChanged = async (user) => {
    try {
      const prevUser = savedUser;
      savedUser = user;

      // Check if the previous user is equal to current user
      // to avoid double task e.g. on app start
      // the onAuthStateChanged event gets triggered doubled
      if (deepDiffer(prevUser, user)) {
        if (user) {
          console.info(TAG, `Auth state changed to [Email: '${user.email}', UID: '${user.uid}']`);
          await dispatch(authAction.initializeUser(user)).unwrap();
        } else {
          console.info(TAG, `Auth state changed to [No user]`);
          dispatch(vocablesActions.initialStates());
          dispatch(authActions.initialState());
        }

        if (!initialized) setInitialized(true);
      } else {
        console.info(TAG, "onAuthStateChanged triggerd, but prevUser is equal to new user");
      }
    } catch (error) {
      switch (error?.code) {
        case "firestore/unavailable":
          console.warn(TAG, error?.message);
          setHasError({ title: t("firestoreUnavailableTitle", { ns: "AppNavigator" }), message: t("firestoreUnavailableMessage", { ns: "AppNavigator" }) });
          await auth().signOut();
          console.info(TAG, "Successfully logged out");
          break;
        default:
          console.warn(TAG, "Catched error in onAuthStateChanged: " + error?.message);
          Bugsnag.notify(error);
          setHasError({ title: t("unknownError", { ns: "AppNavigator" }), message: error.message });
      }
    }
  };

  const myCustomTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: colorScheme === "light" ? Colors.white : Colors.darkMode,
    },
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(onAuthStateChanged);
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer theme={myCustomTheme}>
      <StatusBar translucent backgroundColor={"rgba(0,0,0,0)"} barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <CustomAlert
        visible={!!hasError}
        title={hasError.title}
        message={hasError.message}
        rightButtonText={t("ok", { ns: "AppNavigator" })}
        onPressRightButton={() => {
          setHasError("");
        }}
      />
      {isAuth && initializedAuth && hasDisplayName && <VocableTasksNavigator />}
      {isAuth && initializedAuth && !hasDisplayName && <WelcomeNavigator />}
      {!isAuth && initialized && <AuthNavigator />}
      {!isAuth && !initialized && <StartupNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator;
