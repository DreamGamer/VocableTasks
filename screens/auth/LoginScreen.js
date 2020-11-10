import React, { useState } from "react";
import { Button, Dimensions, KeyboardAvoidingView, Pressable, StyleSheet, Text, View, Platform } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Input from "../../components/Input";
import Colors from "../../constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import Label from "../../components/Label";
import DefaultValues from "../../constants/DefaultValues";
import { Formik } from "formik";
import * as yup from "yup";

const yupSchema = yup.object({
    Email: yup.string().email().required().min(5),
    Password: yup.string().required()
  });

const LoginScreen = props => {
    // States
    const [isLoading, setIsLoading] = useState(false);

    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={styles.screen}>
            <LinearGradient colors={["#1a3d56", "#363636"]} style={styles.gradient}>
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
                                console.log(values);
                            }}>
                            {formikProps => (
                                <View>
                                    <Label title="Email:" style={styles.label} />
                                    <Input
                                        placeholder="Email"
                                        onBlur={formikProps.handleBlur("Email")}
                                        onChangeText={formikProps.handleChange("Email")}
                                        value={formikProps.values.Email}
                                        editable={isLoading ? false : true}
                                        keyboardType="email-address"
                                    />
                                    {formikProps.errors.Email ? <Text style={styles.errorText}>{formikProps.touched.Email && formikProps.errors.Email}</Text> : null}

                                    <Label title="Password:" style={styles.label} />
                                    <Input
                                        placeholder="Password"
                                        onBlur={formikProps.handleBlur("Password")}
                                        onChangeText={formikProps.handleChange("Password")}
                                        value={formikProps.values.Password}
                                        editable={isLoading ? false : true}
                                        keyboardType="default"
                                        secureTextEntry
                                        autoCapitalize="none"
                                    />
                                    {formikProps.errors.Password ? <Text style={styles.errorText}>{formikProps.touched.Password && formikProps.errors.Password}</Text> : null}

                                    <Pressable style={styles.forgetPasswordContainer}>
                                        <Text style={styles.forgetPasswordText}>Forget Password?</Text>
                                    </Pressable>

                                    <View style={styles.buttonContainer}>
                                        <Button title="Login" onPress={formikProps.handleSubmit} />
                                    </View>
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
    errorText: {
        color: "#ee0000",
        marginTop: 5,
        marginBottom: 10,
        fontFamily: DefaultValues.fontBold,
    },
});

export default LoginScreen;
