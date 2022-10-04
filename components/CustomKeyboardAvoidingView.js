import React, { useState, useEffect } from "react";
import { StatusBar, KeyboardAvoidingView } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const CustomKeyboardAvoidingView = (props) => {
    const headerHeight = useHeaderHeight();
    const tabHeight = useBottomTabBarHeight();
    //console.log("headerHeight: " + headerHeight);
    //console.log("tabHeight: " + tabHeight);
    //console.log("StatusBar.currentHeight: " + StatusBar.currentHeight);

    const insets = useSafeAreaInsets();
    const [bottomPadding, setBottomPadding] = useState(insets.bottom);
    const [topPadding, setTopPadding] = useState(insets.top);

    useEffect(() => {
        // This useEffect is needed because insets are undefined at first for some reason
        // https://github.com/th3rdwave/react-native-safe-area-context/issues/54
        setBottomPadding(insets.bottom);
        setTopPadding(insets.top);

        //console.log("topPadding: " + topPadding);
        //console.log("bottomPadding: " + bottomPadding);
    }, [insets.bottom, insets.top]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} keyboardVerticalOffset={headerHeight + topPadding + bottomPadding + StatusBar.currentHeight} {...props}>
            {props.children}
        </KeyboardAvoidingView>
    );
};

export default CustomKeyboardAvoidingView;
