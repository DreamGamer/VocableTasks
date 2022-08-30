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

const TAG = "[SignUpScreen]";

const yupSchema = (t) => {
  return yup.object({
    password: yup
      .string()
      .required()
      .min(6, "testetetete testetetete testetetete testetetete testetetete testetetete testetetete testetetete testetetete testetetete ")
  });
};

const SignUpScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
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

  const handleSignUp = async (email, password) => {
    try {
      await auth().createUserWithEmailAndPassword(email, password);
      console.info(TAG, `Successfully created account and signed in with email '${email}'`);
    } catch (error) {
      console.log(TAG, error.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={{ ...styles.title, ...{ color: isDarkMode ? Colors.white : Colors.black } }}>{t("createAPassword", { ns: "signUp" })}</Text>
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
                    await handleSignUp(email, values.password);
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
                      placeholder={t("yourPassword", { ns: "signUp" })}
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
                      autoCorrect={false}
                      autoComplete="off"
                    />
                    <CustomButton rightIconName="arrow-forward-sharp" title={t("continue", { ns: "signUp" })} onPress={formikProps.handleSubmit} style={styles.continueButton} isLoading={isLoading} />
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

export const SignUpScreenOptions = (navigationData) => {
  return {
    title: <Trans i18nKey="title" ns="signUp" />,
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
  },
});

export default SignUpScreen;
