import React, { useEffect, useRef, useState } from "react";
import { Dimensions, KeyboardAvoidingView, Pressable, StyleSheet, Text, View, Platform, TextInput, ActivityIndicator, Alert, ScrollView } from "react-native";
import Input from "../../components/Input";
import Button from "../../components/Button";
import Colors from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import Label from "../../components/Label";
import DefaultValues from "../../constants/DefaultValues";
import { Formik } from "formik";
import * as yup from "yup";
import GlobalStyles from "../../constants/GlobalStyles";
import * as authActions from "../../store/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const LoginScreen = (props) => {
    const { t } = useTranslation();
    // States
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    let isMounted = true;

    const yupSchema = yup.object({
        Email: yup.string(t("emailMustBeAString")).email(t("emailMustBeAValidEmail")).required(t("emailIsRequired")).min(5),
        Password: yup.string(t("passwordMustBeAString")).required(t("passwordIsRequired")),
    });

    // Redux Dispatch
    const dispatch = useDispatch();

    const passwordInput = useRef();

    useEffect(() => {
        if (hasError && isMounted) {
            Alert.alert(t("anErrorOccurred"), hasError.message, [{ text: t("okay") }]);
        }
        return () => {
            isMounted = false;
        };
    }, [hasError]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.screen}>
            <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
                <View style={styles.welcomeTextContainer}>
                    <Text style={styles.welcomeTextTop}>{t("hello")}!</Text>
                    <Text style={styles.welcomeTextBottom}>{t("loginWelcomeToVocableTasks")}</Text>
                </View>
                <View style={styles.loginLabel}>
                    <Text style={styles.loginLabelText}>{t("labelLogin")}</Text>
                </View>
                <Formik
                    initialValues={{
                        Email: "",
                        Password: "",
                    }}
                    validationSchema={yupSchema}
                    onSubmit={async (values, actions) => {
                        setIsLoading(true);
                        setHasError("");

                        try {
                            dispatch(await authActions.login(values.Email, values.Password));
                            setIsLoading(false);
                        } catch (error) {
                            console.log(error);
                            setIsLoading(false);
                            setHasError(error);
                        }
                    }}>
                    {(formikProps) => (
                        <View>
                            <View style={styles.input}>
                                <Input
                                    placeholder={t("labelEmail")}
                                    onBlur={formikProps.handleBlur("Email")}
                                    onChangeText={formikProps.handleChange("Email")}
                                    value={formikProps.values.Email}
                                    editable={!isLoading}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    blurOnSubmit={false}
                                    leftIconName="mail-outline"
                                    onSubmitEditing={() => {
                                        passwordInput.current.focus();
                                    }}
                                />
                                {formikProps.errors.Email && formikProps.touched.Email ? <Text style={GlobalStyles.errorText}>{formikProps.touched.Email && formikProps.errors.Email}</Text> : null}
                            </View>

                            <View style={styles.input}>
                                <Input
                                    placeholder={t("labelPassword")}
                                    onBlur={formikProps.handleBlur("Password")}
                                    onChangeText={formikProps.handleChange("Password")}
                                    value={formikProps.values.Password}
                                    editable={!isLoading}
                                    keyboardType="default"
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    returnKeyType="done"
                                    blurOnSubmit={true}
                                    ref={passwordInput}
                                    onSubmitEditing={formikProps.handleSubmit}
                                    leftIconName="lock-closed-outline"
                                    rightIconName={showPassword ? "eye-outline" : "eye-off-outline"}
                                    onPressRightIcon={() => {
                                        setShowPassword(!showPassword);
                                    }}
                                />
                                {formikProps.errors.Password && formikProps.touched.Password ? <Text style={GlobalStyles.errorText}>{formikProps.touched.Password && formikProps.errors.Password}</Text> : null}
                            </View>

                            <Pressable
                                style={styles.forgetPasswordContainer}
                                onPress={() => {
                                    props.navigation.navigate("forgotPassword");
                                }}>
                                <Text style={styles.forgetPasswordText}>{t("forgotPassword")}</Text>
                            </Pressable>

                            {isLoading ? (
                                <ActivityIndicator size="small" color={Colors.ActivityIndicatorWhite} />
                            ) : (
                                <View style={styles.buttonContainer}>
                                    <Button title="Login" onPress={formikProps.handleSubmit} color={Colors.primary} />
                                </View>
                            )}
                        </View>
                    )}
                </Formik>

                <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>{t("noAccountYet")}</Text>
                    <Pressable
                        onPress={() => {
                            props.navigation.navigate("signup");
                        }}>
                        <Text style={styles.signupTextLink}>{t("signUpHere")}</Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export const LoginScreenOptions = (navigationData) => {
    return {
        title: "",
        headerTransparent: true,
    };
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.white
    },
    welcomeTextContainer: {
        marginVertical: 30,
        alignItems: "center",
    },
    welcomeTextTop: {
        fontFamily: DefaultValues.fontMedium,
        fontSize: 38,
        textAlign: "center",
    },
    welcomeTextBottom: {
        fontFamily: DefaultValues.fontRegular,
        fontSize: 30,
        textAlign: "center",
        color: Colors.lightGrey,
    },
    loginLabel: {
        marginTop: 40,
    },
    loginLabelText: {
        fontFamily: DefaultValues.fontMedium,
        fontSize: 32,
        color: Colors.black,
    },
    buttonContainer: {
        marginVertical: 10,
    },
    scrollView: {
        flexGrow: 1,
        margin: 20,
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
    signupContainer: {
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "flex-end",
    },
    signupText: {
        color: Colors.black,
        fontSize: 15,
        fontFamily: DefaultValues.fontRegular,
    },
    signupTextLink: {
        color: Colors.link,
        fontSize: 15,
        fontFamily: DefaultValues.fontRegular,
    },
    input: {
        marginVertical: 5,
    },
    submitButton: {
        backgroundColor: "purple"
    }, 
});

export default LoginScreen;
