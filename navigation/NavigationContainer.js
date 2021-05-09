import React, { useEffect, useRef } from "react";
import { NavigationActions } from "react-navigation";
import { useSelector } from "react-redux";
import MainNavigation from "./MainNavigation";
import auth from "@react-native-firebase/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as authActions from "../store/actions/auth";

const NavigationContainer = props => {
    const navRef = useRef();
    /*
    const isAuth = useSelector(state => !!state.auth.idToken);
    const tryedAutoLogin = useSelector(state => state.auth.tryedAutoLogin);
    const hasDisplayName = useSelector(state => !!state.auth.displayName);
    */
    const [isAuth, setIsAuth] = useState(false);
    const hasDisplayName = useSelector(state => !!state.auth.displayName);
    const [initialized, setInitialized] = useState(false);

    const dispatch = useDispatch();

    const onAuthStateChanged = async user => {
        if (user) {
            await dispatch(authActions.updateUserInfo(user));
            setIsAuth(true);
        } else {
            await dispatch(authActions.deleteUserInfo());
            setIsAuth(false);
        }

        if (!initialized) setInitialized(true);
    };

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, [onAuthStateChanged]);

    useEffect(() => {
        if (isAuth && hasDisplayName) {
            navRef.current.dispatch(NavigationActions.navigate({ routeName: "VocabelTasks" }));
        } else if (isAuth && !hasDisplayName) {
            navRef.current.dispatch(NavigationActions.navigate({ routeName: "Welcome" }));
        } else if (!isAuth && initialized) {
            navRef.current.dispatch(NavigationActions.navigate({ routeName: "Auth" }));
        } else if (!isAuth && !initialized) {
            navRef.current.dispatch(NavigationActions.navigate({ routeName: "Startup" }));
        }
    }, [isAuth, initialized, hasDisplayName]);

    return <MainNavigation ref={navRef} />;
};

export default NavigationContainer;
