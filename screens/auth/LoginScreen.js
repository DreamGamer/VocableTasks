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

const yupSchema = yup.object({
    Email: yup.string().email().required().min(5),
    Password: yup.string().required(),
});

const LoginScreen = props => {
    // States
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(null);

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
                        <View style={styles.centered}>
                            <Text style={styles.h1}>Login</Text>
                        </View>
                        <Formik
                            initialValues={{
                                Email: "",
                                Password: "",
                            }}
                            validationSchema={yupSchema}
                            onSubmit={(values, actions) => {
                                setIsLoading(true);
                                console.log(values);
                                setIsLoading(false);
                            }}>
                            {formikProps => (
                                <View>
                                    <Label title="Email:" style={styles.label} />
                                    <TextInput
                                        style={{ ...GlobalStyles.input, ...(props.editable ? null : GlobalStyles.input) }}
                                        placeholder="Email"
                                        onBlur={formikProps.handleBlur("Email")}
                                        onChangeText={formikProps.handleChange("Email")}
                                        value={formikProps.values.Email}
                                        editable={isLoading ? false : true}
                                        keyboardType="email-address"
                                        returnKeyType="next"
                                        blurOnSubmit={false}
                                        onSubmitEditing={() => {
                                            passwordInput.current.focus();
                                        }}
                                    />
                                    {formikProps.errors.Email ? <Text style={GlobalStyles.errorText}>{formikProps.touched.Email && formikProps.errors.Email}</Text> : null}

                                    <Label title="Password:" style={styles.label} />
                                    <TextInput
                                        style={{ ...GlobalStyles.input, ...(props.editable ? null : GlobalStyles.input) }}
                                        placeholder="Password"
                                        onBlur={formikProps.handleBlur("Password")}
                                        onChangeText={formikProps.handleChange("Password")}
                                        value={formikProps.values.Password}
                                        editable={isLoading ? false : true}
                                        keyboardType="default"
                                        secureTextEntry
                                        autoCapitalize="none"
                                        returnKeyType="done"
                                        ref={passwordInput}
                                        onSubmitEditing={formikProps.handleSubmit}
                                    />
                                    {formikProps.errors.Password ? <Text style={GlobalStyles.errorText}>{formikProps.touched.Password && formikProps.errors.Password}</Text> : null}

                                    <Pressable style={styles.forgetPasswordContainer}>
                                        <Text style={styles.forgetPasswordText}>Forget Password?</Text>
                                    </Pressable>

                                    {isLoading ? (
                                        <ActivityIndicator size="small" />
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
                            <Pressable>
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
    h1: {
        color: Colors.lightWhite,
        fontSize: 32,
        fontFamily: DefaultValues.fontRegular,
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
