import React, { useEffect, useRef, useState } from "react";
import { Button, Dimensions, KeyboardAvoidingView, Pressable, StyleSheet, Text, View, Platform, TextInput, ActivityIndicator, Alert } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Input from "../../components/Input";
import Colors from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import Label from "../../components/Label";
import DefaultValues from "../../constants/DefaultValues";
import { Formik } from "formik";
import * as yup from "yup";
import GlobalStyles from "../../constants/GlobalStyles";
import * as authActions from "../../store/actions/auth";
import { useDispatch } from "react-redux";

// Import Translation function
import I18n from "../../i18n/translation";

const yupSchema = yup.object({
    Email: yup.string().email().required().min(5),
    Password: yup.string().required().min(6),
    Confirm_Password: yup
        .string()
        .required("Confirmed Password is a required field")
        .oneOf([yup.ref("Password"), null], "Passwords must match"),
});

const SignUpScreen = props => {
    // States
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(null);

    const passwordInput = useRef();
    const confirmPasswordInput = useRef();

    const dispatch = useDispatch();

    useEffect(() => {
        if (hasError) {
            Alert.alert(I18n.t("anErrorOccurred"), hasError, [{ text: "Okay" }]);
        }
    }, [hasError]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={GlobalStyles.flex1}>
            <LinearGradient colors={[Colors.backgroundTop, Colors.backgroundBottom]} style={styles.gradient}>
                <ScrollView contentContainerStyle={styles.scrollViewCentered}>
                    <View style={styles.container}>
                        <View style={GlobalStyles.centered}>
                            <Text style={GlobalStyles.h1}>{I18n.t("createAccount")}</Text>
                        </View>
                        <Formik
                            initialValues={{
                                Email: "",
                                Password: "",
                                Confirm_Password: "",
                            }}
                            validationSchema={yupSchema}
                            onSubmit={async (values, actions) => {
                                setIsLoading(true);
                                setHasError("");
                                try {
                                    if (values.Password == values.Confirm_Password) {
                                        await dispatch(authActions.signUp(values.Email, values.Password)).then(() => {
                                            setIsLoading(false);
                                        });
                                    } else {
                                        throw new Error("Passwords don't match!");
                                    }
                                } catch (error) {
                                    setIsLoading(false);
                                    setHasError(error);
                                }
                            }}>
                            {formikProps => (
                                <View>
                                    <Label title={I18n.t("labelEmail") + ":"} style={styles.label} />
                                    <Input
                                        placeholder={I18n.t("labelEmail")}
                                        onBlur={formikProps.handleBlur("Email")}
                                        onChangeText={formikProps.handleChange("Email")}
                                        value={formikProps.values.Email}
                                        editable={isLoading ? false : true}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        returnKeyType="next"
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => {
                                            passwordInput.current.focus();
                                        }}
                                    />
                                    {formikProps.errors.Email && formikProps.touched.Email ? <Text style={GlobalStyles.errorText}>{formikProps.touched.Email && formikProps.errors.Email}</Text> : null}

                                    <Label title={I18n.t("labelPassword") + ":"} style={styles.label} />
                                    <Input
                                        placeholder={I18n.t("labelPassword")}
                                        onBlur={formikProps.handleBlur("Password")}
                                        onChangeText={formikProps.handleChange("Password")}
                                        value={formikProps.values.Password}
                                        editable={isLoading ? false : true}
                                        keyboardType="default"
                                        secureTextEntry
                                        autoCapitalize="none"
                                        returnKeyType="next"
                                        ref={passwordInput}
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => {
                                            confirmPasswordInput.current.focus();
                                        }}
                                    />
                                    {formikProps.errors.Password && formikProps.touched.Password ? <Text style={GlobalStyles.errorText}>{formikProps.touched.Password && formikProps.errors.Password}</Text> : null}

                                    <Label title={I18n.t("confirmPassword") + ":"} style={styles.label} />
                                    <TextInput
                                        style={{ ...GlobalStyles.input, ...(isLoading ? GlobalStyles.inputDisabled : null) }}
                                        placeholder={I18n.t("confirmPassword")}
                                        onBlur={formikProps.handleBlur("Confirm_Password")}
                                        onChangeText={formikProps.handleChange("Confirm_Password")}
                                        value={formikProps.values.Confirm_Password}
                                        editable={isLoading ? false : true}
                                        keyboardType="default"
                                        secureTextEntry
                                        autoCapitalize="none"
                                        returnKeyType="done"
                                        ref={confirmPasswordInput}
                                        onSubmitEditing={formikProps.handleSubmit}
                                    />
                                    {formikProps.errors.Confirm_Password && formikProps.touched.Confirm_Password ? (
                                        <Text style={GlobalStyles.errorText}>{formikProps.touched.Confirm_Password && formikProps.errors.Confirm_Password}</Text>
                                    ) : null}

                                    {isLoading ? (
                                        <ActivityIndicator size="small" color={Colors.ActivityIndicatorWhite} />
                                    ) : (
                                        <View style={styles.buttonContainer}>
                                            <Button title={I18n.t("signUp")} onPress={formikProps.handleSubmit} />
                                        </View>
                                    )}
                                </View>
                            )}
                        </Formik>
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>{I18n.t("alreadySignedUp")}</Text>
                            <Pressable
                                onPress={() => {
                                    props.navigation.goBack();
                                }}>
                                <Text style={styles.LoginTextLink}> {I18n.t("loginHere")}</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

export const SignUpScreenOptions = navigationData => {
    return {
        title: "",
        headerTransparent: true,
    };
};

const styles = StyleSheet.create({
    container: {
        width: Dimensions.get("window").width * 0.925,
        backgroundColor: "rgba(3, 5, 8, 0.5)",
        padding: 10,
        overflow: "hidden",
    },
    gradient: {
        flex: 1,
    },
    label: {
        color: Colors.lightWhite,
    },
    buttonContainer: {
        marginVertical: 10,
    },
    scrollViewCentered: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    forgetPasswordText: {
        color: Colors.link,
        textAlign: "right",
        fontSize: 15,
    },
    forgetPasswordContainer: {
        marginVertical: 5,
        justifyContent: "flex-end",
    },
    loginContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    loginText: {
        color: Colors.lightWhite,
        fontSize: 15,
        fontFamily: DefaultValues.fontRegular,
    },
    LoginTextLink: {
        color: Colors.link,
        fontSize: 15,
        fontFamily: DefaultValues.fontRegular,
    },
});

export default SignUpScreen;
