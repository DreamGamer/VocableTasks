import React, { useState } from "react";
import {
  Dimensions,
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  PixelRatio,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useColorScheme,
  View,
} from "react-native";
import DefaultValues from "../../constants/DefaultValues";
import auth from "@react-native-firebase/auth";
import { Formik } from "formik";
import Input from "../../components/Input";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import Colors from "../../constants/Colors";
import GlobalStyles, { normalize } from "../../constants/GlobalStyles";
import Animated, { SlideInDown } from "react-native-reanimated";
import f_logo from "../../assets/logos/f_logo.svg";
import g_logo from "../../assets/logos/g_logo.svg";
import { SvgXml } from "react-native-svg";
import CustomButton from "../../components/CustomButton";
import translation from "../../i18n/translation";
import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";

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
  const isLight = colorScheme === "light" ? true : false;

  const { t } = translation;

  const checkMail = async (email) => {
    const methods = await auth().fetchSignInMethodsForEmail(email);
    if (methods) {
      const isRegisteredWithPassword = methods.some((value) => value === "password");
      if (isRegisteredWithPassword) {
        props.navigation.navigate("login", { email });
      } else {
        props.navigation.navigate("signup", { email });
      }
    } else {
      console.log(TAG, "Not Account");
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoadingGoogleAuthentication(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: false });
      const userInfo = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(userInfo.idToken);
      await auth().signInWithCredential(googleCredential);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        console.log(TAG, "SIGN_IN_CANCELLED: " + error.message);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        console.log(TAG, "IN_PROGRESS: " + error.code);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        console.log(TAG, "PLAY_SERVICES_NOT_AVAILABLE: " + error.code);
      } else {
        // some other error happened
        console.log(TAG, "unknown: " + error);
      }
    }
    setIsLoadingGoogleAuthentication(false);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Animated.Text entering={SlideInDown} style={{ ...styles.firstTitle, ...{ color: isLight ? Colors.black : Colors.white } }}>
                {t("hello", { ns: "authentication" })}
              </Animated.Text>
              <Animated.Text entering={SlideInDown} style={{ ...styles.secondTitle, ...{ color: isLight ? Colors.black : Colors.white } }}>
                {t("welcomeToVocableTasks", { ns: "authentication" })}
              </Animated.Text>
            </View>

            <View style={styles.form}>
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
                    //dispatch(await authActions.login(values.Email, values.Password));
                    await checkMail(values.email);
                    setIsLoadingContinueButton(false);
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
            </View>

            <View style={styles.otherLogin}>
              <View style={styles.orContainer}>
                <View style={{ ...styles.orLine, ...{ backgroundColor: isLight ? Colors.neutral[2] : Colors.neutral[4] } }}></View>
                <Text style={{ ...styles.orText, ...{ color: isLight ? Colors.black : Colors.white } }}>{t("or", { ns: "authentication" })}</Text>
                <View style={{ ...styles.orLine, ...{ backgroundColor: isLight ? Colors.neutral[2] : Colors.neutral[4] } }}></View>
              </View>

              <View style={styles.externalSignInContainer}>
                <View style={styles.externalSignInItem}>
                  <TouchableOpacity style={styles.externalSignInContainerOuter} onPress={signInWithGoogle}>
                    <View style={styles.externalSignInContainerInner}>
                      {isLoadingGoogleAuthentication ? <ActivityIndicator size="large" color={Colors.primary} /> : <SvgXml width="100%" height="100%" xml={g_logo} />}
                    </View>
                  </TouchableOpacity>
                  <Text style={{ ...styles.externalSignInText, ...{ color: isLight ? Colors.black : Colors.white } }}>{t("google", { ns: "authentication" })}</Text>
                </View>
                <View style={styles.externalSignInItem}>
                  <TouchableOpacity style={styles.externalSignInContainerOuter}>
                    <View style={styles.externalSignInContainerInner}>
                      {isLoadingFacebookAuthentication ? <ActivityIndicator size="large" color={Colors.primary} /> : <SvgXml width="100%" height="100%" xml={f_logo} />}
                    </View>
                  </TouchableOpacity>
                  <Text style={{ ...styles.externalSignInText, ...{ color: isLight ? Colors.black : Colors.white } }}>{t("facebook", { ns: "authentication" })}</Text>
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
    elevation: 4,
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
