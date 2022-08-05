import { Formik } from "formik";
import React, { useState } from "react";
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

const yupSchema = (t) => {
  return yup.object({
    password: yup.string(t("passwordMustBeAString")).required(t("passwordIsRequired")),
  });
};

const LoginScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const { t } = translation;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
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
                    setIsLoading(false);
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
                        console.log("test");
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
