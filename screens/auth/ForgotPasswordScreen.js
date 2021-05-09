import React, { useEffect, useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Formik } from "formik";
import { StyleSheet, View, Text, KeyboardAvoidingView, Dimensions, ScrollView, Button, ActivityIndicator, Alert } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Label from "../../components/Label";
import Input from "../../components/Input";
import Colors from "../../constants/Colors";
import GlobalStyles from "../../constants/GlobalStyles";
import * as yup from "yup";
import * as authActions from "../../store/actions/auth";
import { useDispatch } from "react-redux";
import TimerMixin from "react-timer-mixin";

// Import Translation function
import I18n from "../../i18n/translation";

const ForgotPasswordScreen = props => {
    // States
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(null);
    const [emailSended, setEmailSended] = useState(false);
    const [waitTimer, setWaitTimer] = useState(0);

    const yupSchema = yup.object({
        email: yup.string(I18n.t("emailMustBeAString")).email(I18n.t("emailMustBeAValidEmail")).required(I18n.t("emailIsRequired")).min(5),
    });

    // Redux Dispatch
    const dispatch = useDispatch();

    useEffect(() => {
        if (hasError) {
            Alert.alert("An error occured!", hasError, [{ text: "Okay" }]);
        }
    }, [hasError]);

    // Init timer
    let timer = null;

    useEffect(() => {
        // Start Timer to count down every second
        timer = TimerMixin.setInterval(() => {
            if (waitTimer > 0) {
                setWaitTimer(state => state - 1);
            } else {
                setEmailSended(false);
            }
        }, 1000);
        return () => {
            // Clear interval timer
            TimerMixin.clearInterval(timer);
        };
    }, [waitTimer, emailSended]);

    return (
        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={GlobalStyles.flex1}>
            <LinearGradient colors={[Colors.backgroundTop, Colors.backgroundBottom]} style={GlobalStyles.flex1}>
                <ScrollView contentContainerStyle={styles.scrollViewCentered}>
                    <View style={styles.container}>
                        <View style={GlobalStyles.centered}>
                            <Text style={GlobalStyles.h1}>{I18n.t("resetPassword")}</Text>
                        </View>

                        <Formik
                            initialValues={{
                                email: "",
                            }}
                            validationSchema={yupSchema}
                            onSubmit={async (values, actions) => {
                                setIsLoading(true);
                                setHasError("");
                                try {
                                    await dispatch(authActions.resetPasswordWithEmail(values.email));
                                    setEmailSended(true);
                                    setWaitTimer(10);
                                    setIsLoading(false);
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
                                        onBlur={formikProps.handleBlur("email")}
                                        onChangeText={formikProps.handleChange("email")}
                                        value={formikProps.values.Email}
                                        editable={isLoading || emailSended ? false : true}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        returnKeyType="done"
                                        onSubmitEditing={formikProps.handleSubmit}
                                    />
                                    {formikProps.errors.email && formikProps.touched.email ? <Text style={GlobalStyles.errorText}>{formikProps.touched.email && formikProps.errors.email}</Text> : null}

                                    {emailSended ? (
                                        <View>
                                            <Text style={styles.timer}>
                                                {I18n.t("pleaseWait")} {waitTimer} {I18n.t("seconds")}.
                                            </Text>
                                        </View>
                                    ) : isLoading ? (
                                        <ActivityIndicator size="small" color={Colors.ActivityIndicatorWhite} />
                                    ) : (
                                        <View style={styles.buttonContainer}>
                                            <Button title={I18n.t("sendEmail")} onPress={formikProps.handleSubmit} />
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

ForgotPasswordScreen.navigationOptions = navigationData => {
    return {
        title: "",
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
    timer: {
        color: Colors.lightWhite,
    },
});

export default ForgotPasswordScreen;
