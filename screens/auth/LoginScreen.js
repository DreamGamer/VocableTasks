import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Keyboard, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, useColorScheme, View } from "react-native";
import Input from "../../components/Input";
import Colors from "../../constants/Colors";
import DefaultValues from "../../constants/DefaultValues";
import { normalize } from "../../constants/GlobalStyles";
import CustomButton from "../../components/CustomButton";
import translation from "../../i18n/translation";
import CustomTextButton from "../../components/CustomTextButton";
import * as yup from "yup";
import { Trans } from "react-i18next";
import { useDispatch } from "react-redux";
import * as authActions from "../../store/actions/auth";
import auth from "@react-native-firebase/auth";
import Bugsnag from "@bugsnag/react-native";
import CustomAlert from "../../components/CustomAlert";

const TAG = "[LoginScreen]";

const yupSchema = (t) => {
  return yup.object({
    password: yup.string(t("passwordMustBeAString")).required(t("passwordIsRequired")).min(6),
  });
};

const LoginScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const email = props.route.params.email;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const { t } = translation;
  const dispatch = useDispatch();

  let isMounted = true;

  useEffect(() => {
    isMounted = true;
    return () => {
      console.log(TAG, "Unmounted");
      isMounted = false;
    };
  }, []);

  const handleLogin = async (email, password) => {
    try {
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.info(TAG, error.message);
      switch (error.code) {
        case "auth/invalid-email":
          setHasError({ title: t("authInvalidEmailTitle", { ns: "login" }), message: t("authInvalidEmailMessage", { ns: "login" }) });
          break;
        case "auth/user-disabled":
          setHasError({ title: t("authUserDisabledTitle", { ns: "login" }), message: t("authUserDisabledMessage", { ns: "login" }) });
          break;
        case "auth/user-not-found":
          setHasError({ title: t("authUserNotFoundTitle", { ns: "login" }), message: t("authUserNotFoundMessage", { ns: "login" }) });
          break;
        case "auth/wrong-password":
          setHasError({ title: t("authWrongPasswordTitle", { ns: "login" }), message: t("authWrongPasswordMessage", { ns: "login" }) });
          break;
        case "auth/too-many-requests":
          setHasError({ title: t("authTooManyRequestsTitle", { ns: "login" }), message: t("authTooManyRequestsMessage", { ns: "login" }) });
          break;
        case "auth/network-request-failed":
          setHasError({ title: t("authNetworkRequestFailedTitle", { ns: "login" }), message: t("authNetworkRequestFailedMessage", { ns: "login" }) });
          break;
        default:
          Bugsnag.notify(error);
          console.warn(TAG, "Undefined error while signUp: " + error.message);
          setHasError({ title: t("unknownError", { ns: "login" }), message: error.message });
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <CustomAlert
        visible={!!hasError}
        title={hasError.title}
        message={hasError.message}
        rightButtonText={t("ok", { ns: "login" })}
        onPressRightButton={() => {
          setHasError("");
        }}
      />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={{ ...styles.title, ...{ color: isDarkMode ? Colors.white : Colors.black } }}>{t("yourPassword", { ns: "login" })}</Text>
            </View>

            <View style={styles.form}>
              <Formik
                initialValues={{
                  password: "",
                }}
                validationSchema={() => {
                  return yupSchema(t);
                }}
                onSubmit={async (values, actions) => {
                  setIsLoading(true);
                  setHasError("");

                  try {
                    await handleLogin(email, values.password);
                    if (isMounted) setIsLoading(false);
                  } catch (error) {
                    console.log(error);
                    setIsLoading(false);
                    setHasError(error);
                  }
                }}>
                {(formikProps) => (
                  <View>
                    <Input
                      placeholder={t("password", { ns: "login" })}
                      onBlur={formikProps.handleBlur("password")}
                      onChangeText={formikProps.handleChange("password")}
                      value={formikProps.values.password}
                      editable={!isLoading}
                      keyboardType="default"
                      autoCapitalize="none"
                      returnKeyType="next"
                      blurOnSubmit={false}
                      onSubmitEditing={formikProps.handleSubmit}
                      error={formikProps.errors.password}
                      touched={formikProps.touched.password}
                      rightIconName={showPassword ? "eye-outline" : "eye-off-outline"}
                      secureTextEntry={!showPassword}
                      onPressRightIcon={() => {
                        setShowPassword((prevState) => !prevState);
                      }}
                    />
                    <CustomButton rightIconName="arrow-forward-sharp" title={t("continue", { ns: "login" })} onPress={formikProps.handleSubmit} style={styles.continueButton} isLoading={isLoading} />
                    <CustomTextButton
                      title={t("forgotPassword", { ns: "login" })}
                      color={Colors.danger}
                      onPress={() => {
                        props.navigation.navigate("forgotPassword", { email: email });
                      }}
                    />
                  </View>
                )}
              </Formik>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const LoginScreenOptions = (navigationData) => {
  return {
    title: <Trans i18nKey="title" ns="login" />,
  };
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 80 + 24,
  },
  header: {
    marginBottom: 60,
  },
  title: {
    fontFamily: DefaultValues.fontRegular,
    fontSize: normalize(30),
    textAlign: "center",
  },
  continueButton: {
    marginTop: 25,
    marginBottom: 10,
  },
});

export default LoginScreen;
