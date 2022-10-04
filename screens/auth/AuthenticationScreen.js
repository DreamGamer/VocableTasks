import React, { useEffect, useState } from "react";
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, useColorScheme, View } from "react-native";
import DefaultValues from "../../constants/DefaultValues";
import auth from "@react-native-firebase/auth";
import { Formik } from "formik";
import Input from "../../components/Input";
import * as yup from "yup";
import Colors from "../../constants/Colors";
import GlobalStyles, { normalize } from "../../constants/GlobalStyles";
import Animated, { SlideInDown } from "react-native-reanimated";
import f_logo from "../../assets/logos/f_logo.svg";
import g_logo from "../../assets/logos/g_logo.svg";
import { SvgXml } from "react-native-svg";
import CustomButton from "../../components/CustomButton";
import translation from "../../i18n/translation";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";
import CustomAlert from "../../components/CustomAlert";
import Bugsnag from "@bugsnag/react-native";

const TAG = "[AuthenticationScreen]";

const yupSchema = (t) => {
  return yup.object({
    email: yup.string(t("emailMustBeAString")).email(t("emailMustBeAValidEmail")).required(t("emailIsRequired")).min(5),
  });
};

const AuthenticationScreen = (props) => {
  const [isLoadingContinueButton, setIsLoadingContinueButton] = useState(false);
  const [isLoadingGoogleAuthentication, setIsLoadingGoogleAuthentication] = useState(false);
  const [isLoadingFacebookAuthentication, setIsLoadingFacebookAuthentication] = useState(false);
  const [hasError, setHasError] = useState("");

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const { t } = translation;

  let isMounted = true;

  useEffect(() => {
    isMounted = true;
    return () => {
      console.log(TAG, "Unmounted");
      isMounted = false;
    };
  }, []);

  const checkEmail = async (email) => {
    try {
      const methods = await auth().fetchSignInMethodsForEmail(email);
      // Check if user is registered
      if (methods.length !== 0) {
        // Check if the registered user is registered with email and password
        const isRegisteredWithPassword = methods.some((value) => value === "password");
        if (isRegisteredWithPassword) {
          console.info(TAG, `Email '${email}' exist with method 'password'. Forwarding to login screen`);
          props.navigation.navigate("login", { email });
        } else {
          console.info(TAG, `Email '${email}' is registered with another platform [${methods}]`);
          setHasError({ title: t("youAlreadyHaveAnAccount", { ns: "authentication" }), message: t("yourEmailIsAlreadyRegisteredWithGoogleOrFacebook", { ns: "authentication" }) });
        }
      } else {
        console.info(TAG, `Email '${email}' don't exist. Forwarding to signup screen`);
        props.navigation.navigate("signup", { email });
      }
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          setHasError({ title: t("authInvalidEmailTitle", { ns: "authentication" }), message: t("authInvalidEmailMessage", { ns: "authentication" }) });
          break;
        case "auth/network-request-failed":
          setHasError({ title: t("authNetworkRequestFailedTitle", { ns: "authentication" }), message: t("authNetworkRequestFailedMessage", { ns: "authentication" }) });
          break;
        default:
          console.warn(TAG, "Unknown error while checking email: ", error);
          Bugsnag.notify(error);
          setHasError({ title: t("unknownError", { ns: "authentication" }), message: error.message });
          break;
      }
    }
  };

  const handleSignInWithGoogle = async () => {
    try {
      setIsLoadingGoogleAuthentication(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: false });
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      await auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.info(TAG, `Error while sign in with google: ${error.message}`);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // The user cancelled the sign in
      } else if (error.code === statusCodes.IN_PROGRESS) {
        setHasError({ title: t("googleInProgressTitle", { ns: "authentication" }), message: t("googleInProgressMessage", { ns: "authentication" }) });
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        setHasError({ title: t("googlePlayServicesNotAvailableTitle", { ns: "authentication" }), message: t("googlePlayServicesNotAvailableMessage", { ns: "authentication" }) });
      } else {
        console.warn(TAG, "Unknown error while sign in with google");
        Bugsnag.notify(error);
        setHasError({ title: t("unknownError", { ns: "authentication" }), message: error.message });
      }
    }
    setIsLoadingGoogleAuthentication(false);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <CustomAlert
        visible={!!hasError}
        title={hasError.title}
        message={hasError.message}
        rightButtonText={t("ok", { ns: "authentication" })}
        onPressRightButton={() => {
          setHasError("");
        }}
      />
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Animated.Text entering={SlideInDown} style={{ ...styles.firstTitle, ...{ color: isDarkMode ? Colors.white : Colors.black } }}>
                {t("hello", { ns: "authentication" })}
              </Animated.Text>
              <Animated.Text entering={SlideInDown} style={{ ...styles.secondTitle, ...{ color: isDarkMode ? Colors.white : Colors.black } }}>
                {t("welcomeToVocableTasks", { ns: "authentication" })}
              </Animated.Text>
            </View>

            <Formik
              initialValues={{
                email: "",
              }}
              validationSchema={() => {
                return yupSchema(t);
              }}
              onSubmit={async (values, actions) => {
                setIsLoadingContinueButton(true);
                setHasError("");
                try {
                  await checkEmail(values.email);
                  if (isMounted) setIsLoadingContinueButton(false);
                } catch (error) {
                  console.log(error);
                  setIsLoadingContinueButton(false);
                  setHasError(error);
                }
              }}>
              {(formikProps) => (
                <View>
                  <Input
                    placeholder={t("email", { ns: "authentication" })}
                    onBlur={formikProps.handleBlur("email")}
                    onChangeText={formikProps.handleChange("email")}
                    value={formikProps.values.email}
                    editable={!isLoadingContinueButton}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    leftIconName="mail-outline"
                    onSubmitEditing={formikProps.handleSubmit}
                    error={formikProps.errors.email}
                    touched={formikProps.touched.email}
                  />
                  <CustomButton rightIconName="arrow-forward-sharp" title={t("continue", { ns: "authentication" })} onPress={formikProps.handleSubmit} style={styles.continueButton} isLoading={isLoadingContinueButton} />
                </View>
              )}
            </Formik>

            <View style={styles.otherLogin}>
              <View style={styles.orContainer}>
                <View style={{ ...styles.orLine, ...{ backgroundColor: isDarkMode ? Colors.neutral[4] : Colors.neutral[2] } }}></View>
                <Text style={{ ...styles.orText, ...{ color: isDarkMode ? Colors.white : Colors.black } }}>{t("or", { ns: "authentication" })}</Text>
                <View style={{ ...styles.orLine, ...{ backgroundColor: isDarkMode ? Colors.neutral[4] : Colors.neutral[2] } }}></View>
              </View>

              <View style={styles.externalSignInContainer}>
                <View style={styles.externalSignInItem}>
                  <TouchableOpacity style={styles.externalSignInContainerOuter} onPress={handleSignInWithGoogle}>
                    <View style={styles.externalSignInContainerInner}>
                      {isLoadingGoogleAuthentication ? <ActivityIndicator size="large" color={Colors.primary} /> : <SvgXml width="100%" height="100%" xml={g_logo} />}
                    </View>
                  </TouchableOpacity>
                  <Text style={{ ...styles.externalSignInText, ...{ color: isDarkMode ? Colors.white : Colors.black } }}>{t("google", { ns: "authentication" })}</Text>
                </View>
                <View style={styles.externalSignInItem}>
                  <TouchableOpacity style={styles.externalSignInContainerOuter}>
                    <View style={styles.externalSignInContainerInner}>
                      {isLoadingFacebookAuthentication ? <ActivityIndicator size="large" color={Colors.primary} /> : <SvgXml width="100%" height="100%" xml={f_logo} />}
                    </View>
                  </TouchableOpacity>
                  <Text style={{ ...styles.externalSignInText, ...{ color: isDarkMode ? Colors.white : Colors.black } }}>{t("facebook", { ns: "authentication" })}</Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export const AuthenticationScreenOptions = (navigationData) => {
  return {
    title: "",
  };
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "space-evenly",
  },
  header: {
    alignItems: "center",
    overflow: "hidden",
  },
  firstTitle: {
    fontFamily: DefaultValues.fontRegular,
    fontSize: normalize(40),
    textAlign: "center",
  },
  secondTitle: {
    fontFamily: DefaultValues.fontRegular,
    fontSize: normalize(30),
    textAlign: "center",
  },
  textInput: {
    height: 40,
    borderColor: Colors.black,
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  orContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  orText: {
    fontFamily: DefaultValues.fontRegular,
    paddingHorizontal: 10,
    textTransform: "lowercase",
  },
  orLine: {
    flex: 1,
    height: 1,
  },
  externalSignInContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  externalSignInContainerOuter: {
    width: 70,
    aspectRatio: 1,
    borderRadius: 70,
    backgroundColor: "#fff",
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  externalSignInContainerInner: {
    width: 40,
    aspectRatio: 1,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  externalSignInItem: {
    alignItems: "center",
  },
  externalSignInText: {
    fontFamily: DefaultValues.fontRegular,
    marginTop: 10,
  },
  continueButton: {
    marginTop: 20,
  },
});

export default AuthenticationScreen;
