import React, { useEffect, useRef, useState } from "react";
import { Button, Dimensions, KeyboardAvoidingView, Pressable, StyleSheet, Text, View, Platform, TextInput, ActivityIndicator, Alert, ScrollView } from "react-native";
import Input from "../../components/Input";
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

const LoginScreen = props => {
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
            Alert.alert(t("anErrorOccurred"), hasError, [{ text: t("okay") }]);
        }
        return () => {
            isMounted = false;
        };
    }, [hasError]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={GlobalStyles.flex1}>
            <LinearGradient colors={[Colors.backgroundTop, Colors.backgroundBottom]} style={styles.gradient}>
                <ScrollView contentContainerStyle={styles.scrollViewCentered} keyboardShouldPersistTaps="handled">
                    <View style={styles.container}>
                        <View style={GlobalStyles.centered}>
                            <Text style={GlobalStyles.h1}>{t("labelLogin")}</Text>
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
                                    await dispatch(authActions.login(values.Email, values.Password));
                                    setIsLoading(false);
                                } catch (error) {
                                    setIsLoading(false);
                                    setHasError(error);
                                }
                            }}>
                            {formikProps => (
                                <View>
                                    <Label title={t("labelEmail") + ":"} style={styles.label} />
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
                                        onSubmitEditing={() => {
                                            passwordInput.current.focus();
                                        }}
                                    />
                                    {formikProps.errors.Email && formikProps.touched.Email ? <Text style={GlobalStyles.errorText}>{formikProps.touched.Email && formikProps.errors.Email}</Text> : null}

                                    <Label title={t("labelPassword") + ":"} style={styles.label} />
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
                                        showIcon
                                        iconName={showPassword ? "eye-sharp" : "eye-off-sharp"}
                                        onPressIcon={() => {
                                            setShowPassword(!showPassword);
                                        }}
                                    />
                                    {formikProps.errors.Password && formikProps.touched.Password ? <Text style={GlobalStyles.errorText}>{formikProps.touched.Password && formikProps.errors.Password}</Text> : null}
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
                                            <Button title="Login" onPress={formikProps.handleSubmit} />
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
                                <Text style={styles.signupTextLink}> {t("signUpHere")}</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

export const LoginScreenOptions = navigationData => {
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
    centered: {
        justifyContent: "center",
        alignItems: "center",
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
    signupContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    signupText: {
        color: Colors.lightWhite,
        fontSize: 15,
        fontFamily: DefaultValues.fontRegular,
    },
    signupTextLink: {
        color: Colors.link,
        fontSize: 15,
        fontFamily: DefaultValues.fontRegular,
    },
});

export default LoginScreen;
