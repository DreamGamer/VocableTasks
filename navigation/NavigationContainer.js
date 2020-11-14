import React from "react";
import { useEffect, useRef } from "react";
import { NavigationActions } from "react-navigation";
import { useSelector } from "react-redux";
import MainNavigation from "./MainNavigation";

const NavigationContainer = props => {
    const navRef = useRef();
    const isAuth = useSelector(state => !!state.auth.token);
    const tryedAutoLogin = useSelector(state => !!state.auth.tryedAutoLogin);
    /*
    useEffect(() => {
        if (!isAuth) {
            navRef.current.dispatch(NavigationActions.navigate({ routeName: "Auth" }));
        }
    }, [isAuth]);
    */

    useEffect(() => {
        if (isAuth) {
            navRef.current.dispatch(NavigationActions.navigate({ routeName: "VokabelTasks" }));
        } else if (!isAuth && tryedAutoLogin) {
            navRef.current.dispatch(NavigationActions.navigate({ routeName: "Auth" }));
        } else if (!isAuth && !tryedAutoLogin) {
            navRef.current.dispatch(NavigationActions.navigate({ routeName: "Startup" }));
        }
    }, [isAuth, tryedAutoLogin])

    return <MainNavigation ref={navRef} />;
};

export default NavigationContainer;
