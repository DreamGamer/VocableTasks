import React from "react";
import { useEffect, useRef } from "react";
import { NavigationActions } from "react-navigation";
import { useSelector } from "react-redux";
import MainNavigation from "./MainNavigation";

const NavigationContainer = props => {
    const navRef = useRef();
    const isAuth = useSelector(state => !!state.auth.idToken);
    const tryedAutoLogin = useSelector(state => state.auth.tryedAutoLogin);
    const hasDisplayName = useSelector(state => !!state.auth.displayName);
    /*
    useEffect(() => {
        if (!isAuth) {
            navRef.current.dispatch(NavigationActions.navigate({ routeName: "Auth" }));
        }
    }, [isAuth]);
    */
    
    useEffect(() => {
        if (isAuth && hasDisplayName && tryedAutoLogin) {
            navRef.current.dispatch(NavigationActions.navigate({ routeName: "VocabelTasks" }));
        } else if (isAuth && !hasDisplayName) { 
            navRef.current.dispatch(NavigationActions.navigate({ routeName: "Welcome" }));
        } else if (!isAuth && tryedAutoLogin) {
            navRef.current.dispatch(NavigationActions.navigate({ routeName: "Auth" }));
        } else if (!isAuth && !tryedAutoLogin) {
            navRef.current.dispatch(NavigationActions.navigate({ routeName: "Startup" }));
        }
    }, [isAuth, tryedAutoLogin, hasDisplayName])

    return <MainNavigation ref={navRef} />;
};

export default NavigationContainer;
