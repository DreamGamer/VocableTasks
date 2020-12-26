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

const yupSchema = yup.object({
    Email: yup.string().email().required().min(5),
    Password: yup.string().required(),
});

const LoginScreen = props => {
    // States
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(null);

    // Redux Dispatch
    const dispatch = useDispatch();

    const passwordInput = useRef();

    useEffect(() => {
        if (hasError) {
            Alert.alert("An error occured!", hasError.message, [{ text: "Okay" }]);
        }
    }, [hasError]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.screen}>
            <LinearGradient colors={[Colors.backgroundTop, Colors.backgroundBottom]} style={styles.gradient}>
                <ScrollView contentContainerStyle={styles.scrollViewCentered}>
                    <View style={styles.container}>
                        <View style={GlobalStyles.centered}>
                            <Text style={GlobalStyles.h1}>Login</Text>
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
                                    <Label title="Email:" style={styles.label} />
                                    <TextInput
                                        style={{ ...GlobalStyles.input, ...(isLoading ? GlobalStyles.inputDisabled : null) }}
                                        placeholder="Email"
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

                                    <Label title="Password:" style={styles.label} />
                                    <TextInput
                                        style={{ ...GlobalStyles.input, ...(isLoading ? GlobalStyles.inputDisabled : null) }}
                                        placeholder="Password"
                                        onBlur={formikProps.handleBlur("Password")}
                                        onChangeText={formikProps.handleChange("Password")}
                                        value={formikProps.values.Password}
                                        editable={isLoading ? false : true}
                                        keyboardType="default"
                                        secureTextEntry
                                        autoCapitalize="none"
                                        returnKeyType="done"
                                        blurOnSubmit={false}
                                        ref={passwordInput}
                                        onSubmitEditing={formikProps.handleSubmit}
                                    />
                                    {formikProps.errors.Password && formikProps.touched.Password ? <Text style={GlobalStyles.errorText}>{formikProps.touched.Password && formikProps.errors.Password}</Text> : null}
                                    <Pressable style={styles.forgetPasswordContainer}>
                                        <Text style={styles.forgetPasswordText}>Forget Password?</Text>
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
                            <Text style={styles.signupText}>Don't have an account yet?</Text>
                            <Pressable
                                onPress={() => {
                                    props.navigation.navigate({ routeName: "signup" });
                                }}>
                                <Text style={styles.signupTextLink}> Signup here</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </LinearGradient>
        </KeyboardAvoidingView>
    );
};

LoginScreen.navigationOptions = navigationData => {
    return {
        title: "Login",
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
