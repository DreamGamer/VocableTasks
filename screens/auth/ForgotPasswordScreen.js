import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableWithoutFeedback, useColorScheme, View } from "react-native";
import { useDispatch } from "react-redux";
import CustomButton from "../../components/CustomButton";
import CustomAlert from "../../components/CustomAlert";
import Input from "../../components/Input";
import Colors from "../../constants/Colors";
import DefaultValues from "../../constants/DefaultValues";
import { normalize } from "../../constants/GlobalStyles";
import translation from "../../i18n/translation";
import * as yup from "yup";
import auth from "@react-native-firebase/auth";
import Bugsnag from "@bugsnag/react-native";

const TAG = "[ForgotPasswordScreen]";

const yupSchema = (t) => {
  return yup.object({
    email: yup.string(t("emailMustBeAString")).email(t("emailMustBeAValidEmail")).required(t("emailIsRequired")).min(5),
  });
};

const ForgotPasswordScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState("");

  const emailFromParams = props.route.params.email;

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const { t } = useTranslation();
  const dispatch = useDispatch();

  let isMounted = true;

  useEffect(() => {
    isMounted = true;
    return () => {
      console.log(TAG, "Unmounted");
      isMounted = false;
    };
  }, []);

  const handleResetPassword = async (email) => {
    try {
      await auth().sendPasswordResetEmail(email);
      console.info(TAG, `Successfully send password reset mail to '${email}'`);
      setHasError({ title: t("successfullySendEmailTitle", { ns: "forgotPassword" }), message: t("successfullySendEmailMessage", { ns: "forgotPassword" }) });
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setHasError({ title: t("authInvalidEmailTitle", { ns: "forgotPassword" }), message: t("authInvalidEmailMessage", { ns: "forgotPassword" }) });
          break;
        case "auth/user-not-found":
          setHasError({ title: t("authUserNotFoundTitle", { ns: "forgotPassword" }), message: t("authUserNotFoundMessage", { ns: "forgotPassword" }) });
          break;
        case "auth/too-many-requests":
            setHasError({ title: t("authTooManyRequestsTitle", { ns: "forgotPassword" }), message: t("authTooManyRequestsMessage", { ns: "forgotPassword" }) });
          break;
        default:
          console.warn(TAG, "Catched fatal error in handleResetPassword: " + error);
          Bugsnag.notify(error);
          setHasError({ title: t("unknownError", { ns: "forgotPassword" }), message: error.message });
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <CustomAlert
        visible={!!hasError}
        title={hasError.title}
        message={hasError.message}
        rightButtonText={t("ok", { ns: "forgotPassword" })}
        onPressRightButton={() => {
          setHasError("");
        }}
      />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={{ ...styles.title, ...{ color: isDarkMode ? Colors.white : Colors.black } }}>{t("yourEmail", { ns: "forgotPassword" })}</Text>
            </View>

            <View style={styles.form}>
              <Formik
                initialValues={{
                  email: emailFromParams,
                }}
                validationSchema={() => {
                  return yupSchema(t);
                }}
                onSubmit={async (values, actions) => {
                  setIsLoading(true);
                  setHasError("");

                  try {
                    await handleResetPassword(values.email);
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
                      placeholder={t("email", { ns: "forgotPassword" })}
                      onBlur={formikProps.handleBlur("email")}
                      onChangeText={formikProps.handleChange("email")}
                      value={formikProps.values.email}
                      editable={!isLoading}
                      keyboardType="default"
                      autoCapitalize="none"
                      returnKeyType="next"
                      blurOnSubmit={false}
                      onSubmitEditing={formikProps.handleSubmit}
                      error={formikProps.errors.email}
                      touched={formikProps.touched.email}
                      autoComplete="email"
                    />
                    <CustomButton title={t("send", { ns: "forgotPassword" })} onPress={formikProps.handleSubmit} style={styles.continueButton} isLoading={isLoading} />
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

export const ForgotPasswordScreenOptions = (navigationData) => {
  return {
    title: <Trans i18nKey="title" ns="forgotPassword" />,
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

export default ForgotPasswordScreen;
