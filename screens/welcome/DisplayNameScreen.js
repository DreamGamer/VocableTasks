import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, KeyboardAvoidingView, Dimensions, TextInput, ActivityIndicator, Button, Alert, ScrollView } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { useDispatch } from "react-redux";
import HeaderButton from "../../components/HeaderButton";
import * as authActions from "../../store/actions/auth";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "../../constants/Colors";
import GlobalStyles from "../../constants/GlobalStyles";
import { Formik } from "formik";
import Label from "../../components/Label";
import * as yup from "yup";
import I18n from "../../i18n/translation";

const yupSchema = yup.object({
    name: yup.string("Name must be a string").required("Name is required").matches("^[A-z0-9]+$", "Name can't have symbols"),
});

const DisplayNameScreen = props => {
    // React States
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(null);

    // Init redux Dispatch
    const dispatch = useDispatch();

    // Handler to logout user
    const logoutHandler = () => {
        dispatch(authActions.logout());
    };

    // Setup logoutHandler to logout over NavigationData
    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item title="Logout" iconName="log-out" onPress={logoutHandler} />
                </HeaderButtons>
            ),
        });
    }, [logoutHandler]);

    // Only appears if hasError change
    useEffect(() => {
        if (hasError) {
            Alert.alert(I18n.t("anErrorOccurred"), hasError.message, [{ text: I18n.t("okay") }]);
        }
    }, [hasError]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.screen}>
            <LinearGradient colors={[Colors.backgroundTop, Colors.backgroundBottom]} style={styles.gradient}>
                <ScrollView contentContainerStyle={styles.scrollViewCentered}>
                    <View style={styles.container}>
                        <Text style={{ ...GlobalStyles.h3, ...GlobalStyles.centerText, ...styles.heading }}>Let's Get Started! What's your name?</Text>

                        <Formik
                            initialValues={{
                                name: "",
                            }}
                            validationSchema={yupSchema}
                            onSubmit={async (values, actions) => {
                                setIsLoading(true);
                                setHasError("");

                                try {
                                    await dispatch(authActions.changeDisplayName(values.name));
                                    setIsLoading(false);
                                } catch (error) {
                                    setIsLoading(false);
                                    setHasError(error);
                                }
                            }}>
                            {formikProps => (
                                <View>
                                    <TextInput
                                        style={{ ...GlobalStyles.input, ...(isLoading ? GlobalStyles.inputDisabled : null) }}
                                        placeholder="Your Name"
                                        onBlur={formikProps.handleBlur("name")}
                                        onChangeText={formikProps.handleChange("name")}
                                        value={formikProps.values.name}
                                        editable={isLoading ? false : true}
                                        keyboardType="default"
                                        returnKeyType="done"
                                        onSubmitEditing={formikProps.handleSubmit}
                                    />
                                    {formikProps.errors.name && formikProps.touched.name ? <Text style={GlobalStyles.errorText}>{formikProps.touched.name && formikProps.errors.name}</Text> : null}

                                    {isLoading ? (
                                        <ActivityIndicator size="small" color={Colors.ActivityIndicatorWhite} />
                                    ) : (
                                        <View style={styles.buttonContainer}>
                                            <Button title="Save" onPress={formikProps.handleSubmit} />
                                        </View>
                                    )}
                                </View>
                            )}
                        </Formik>
                    </View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

export const DisplayNameScreenOptions = navigationData => {
    return {
        title: "",
        headerTransparent: true,
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    container: {
        width: Dimensions.get("window").width * 0.925,
        backgroundColor: "rgba(3, 5, 8, 0.5)",
        padding: 10,
        overflow: "hidden",
    },
    gradient: {
        flex: 1,
    },
    scrollViewCentered: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        color: Colors.lightWhite,
    },
    buttonContainer: {
        marginVertical: 10,
    },
    heading: {
        marginBottom: 10,
    },
});

export default DisplayNameScreen;
