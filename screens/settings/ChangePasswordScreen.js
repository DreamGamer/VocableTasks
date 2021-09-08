import React, { useState, useEffect } from "react";
import { Alert, Button, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from "react-native";
import I18n from "../../i18n/translation";
import Auth from "@react-native-firebase/auth";
import GlobalStyles from "../../constants/GlobalStyles";
import Input from "../../components/Input";
import DefaultValues from "../../constants/DefaultValues";
import Colors from "../../constants/Colors";
import { Formik } from "formik";
import * as yup from "yup";
import Modal from "react-native-modal";
import Spinner from "react-native-loading-spinner-overlay";
import Label from "../../components/Label";
import Bugsnag from "@bugsnag/react-native";

const TAG = "[ChangePasswordScreen]: "; // Console Log Tag

const yupSchema = yup.object({
    currentPassword: yup.string(I18n.t("currentPasswordMustBeAString")).required(I18n.t("currentPasswordIsRequired")),
    newPassword: yup.string(I18n.t("newPasswordMustBeAString")).required(I18n.t("newPasswordIsRequired")).min(6, I18n.t("newPasswordMustBeAtLeast6Characters")),
    confirmNewPassword: yup
        .string(I18n.t("confirmNewPasswordMustBeAString"))
        .required(I18n.t("confirmNewPasswordIsRequired"))
        .oneOf([yup.ref("newPassword"), null], I18n.t("passwordsMustMatch")),
});

const ChangePasswordScreen = props => {
    const [formButtonClicked, setFormButtonClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(null);
    const [changedPassword, setChangedPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

    useEffect(() => {
        if (hasError) {
            Alert.alert(I18n.t("anErrorOccurred"), hasError, [{ text: I18n.t("okay") }]);
        }
    }, [hasError]);

    return (
        <ScrollView keyboardShouldPersistTaps="handled">
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={GlobalStyles.flex1}>
                <Spinner visible={isLoading} />

                <Modal isVisible={changedPassword} animationIn="slideInUp" animationOut="slideOutDown" backdropTransitionOutTiming={0} style={styles.modal}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.headerText}>{I18n.t("passwordChanged")}</Text>
                            <Text style={styles.text}>{I18n.t("yourPasswordHasBeenChangedSuccessfully")}</Text>
                            <Button
                                title={I18n.t("continue")}
                                onPress={() => {
                                    props.navigation.goBack();
                                }}
                            />
                        </View>
                    </View>
                </Modal>

                <Formik
                    initialValues={{ currentPassword: "", newPassword: "", confirmNewPassword: "" }}
                    validationSchema={yupSchema}
                    validateOnChange={formButtonClicked}
                    onSubmit={async (values, actions) => {
                        setIsLoading(true);
                        setHasError("");
                        try {
                            if (values.newPassword == values.confirmNewPassword) {
                                const user = Auth().currentUser;
                                const credentials = Auth.EmailAuthProvider.credential(Auth().currentUser.email, values.currentPassword);
                                user.reauthenticateWithCredential(credentials)
                                    .then(async () => {
                                        await Auth().currentUser.updatePassword(values.newPassword);
                                        console.info(TAG + "Successfully changed password!");
                                        setIsLoading(false);
                                        setChangedPassword(true);
                                    })
                                    .catch(error => {
                                        setIsLoading(false);
                                        switch (error.code) {
                                            case "auth/wrong-password":
                                                setIsLoading(false);
                                                setHasError(I18n.t("currentPasswordWrong"));
                                                console.info(TAG + `Handled error: '${error.code}'`);
                                                break;
                                            case "auth/too-many-requests":
                                                setIsLoading(false);
                                                setHasError(I18n.t("authTooManyRequests"));
                                                console.info(TAG + `Handled error: '${error.code}'`);
                                                break;
                                            default:
                                                setIsLoading(false);
                                                setHasError(I18n.t("somethingWentWrong"));
                                                console.warn(TAG + "Catched error in change password form: " + error);
                                                Bugsnag.notify(error);
                                        }
                                    });
                            } else {
                                setIsLoading(false);
                                setHasError(I18n.t("passwordsDontMatch"));
                            }
                        } catch (error) {
                            setIsLoading(false);
                            setHasError(I18n.t("somethingWentWrong"));
                            console.warn(TAG + "Catched error in change password form: " + error);
                            Bugsnag.notify(error);
                        }
                    }}>
                    {formikProps => (
                        <View style={styles.container}>
                            <Text style={styles.resetPasswordText}>{I18n.t("changePassword")}</Text>
                            <Input
                                title={I18n.t("currentPassword")}
                                onChangeText={formikProps.handleChange("currentPassword")}
                                value={formikProps.values.currentPassword}
                                editable={!isLoading}
                                secureTextEntry={!showCurrentPassword}
                                showIcon
                                iconName={showCurrentPassword ? "eye-sharp" : "eye-off-sharp"}
                                onPressIcon={() => {
                                    setShowCurrentPassword(!showCurrentPassword);
                                }}
                            />
                            {formikProps.errors.currentPassword && formikProps.touched.currentPassword ? (
                                <Text style={GlobalStyles.errorText}>{formikProps.touched.currentPassword && formikProps.errors.currentPassword}</Text>
                            ) : null}

                            <Input
                                title={I18n.t("newPassword")}
                                onChangeText={formikProps.handleChange("newPassword")}
                                value={formikProps.values.newPassword}
                                editable={!isLoading}
                                secureTextEntry={!showNewPassword}
                                showIcon
                                iconName={showNewPassword ? "eye-sharp" : "eye-off-sharp"}
                                onPressIcon={() => {
                                    setShowNewPassword(!showNewPassword);
                                }}
                            />
                            {formikProps.errors.newPassword && formikProps.touched.newPassword ? <Text style={GlobalStyles.errorText}>{formikProps.touched.newPassword && formikProps.errors.newPassword}</Text> : null}

                            <Input
                                title={I18n.t("confirmNewPassword")}
                                onChangeText={formikProps.handleChange("confirmNewPassword")}
                                value={formikProps.values.confirmNewPassword}
                                editable={!isLoading}
                                secureTextEntry={!showConfirmNewPassword}
                                showIcon
                                iconName={showConfirmNewPassword ? "eye-sharp" : "eye-off-sharp"}
                                onPressIcon={() => {
                                    setShowConfirmNewPassword(!showConfirmNewPassword);
                                }}
                            />
                            {formikProps.errors.confirmNewPassword && formikProps.touched.confirmNewPassword ? (
                                <Text style={GlobalStyles.errorText}>{formikProps.touched.confirmNewPassword && formikProps.errors.confirmNewPassword}</Text>
                            ) : null}
                            <View style={styles.submitButtonContainer}>
                                <Button
                                    title={I18n.t("changePassword")}
                                    onPress={() => {
                                        setFormButtonClicked(true);
                                        formikProps.handleSubmit();
                                    }}
                                />
                            </View>
                        </View>
                    )}
                </Formik>
            </KeyboardAvoidingView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 15,
    },
    resetPasswordText: {
        fontSize: 26,
        fontFamily: DefaultValues.fontBold,
        color: Colors.black,
        marginBottom: 10,
    },
    modal: {
        margin: 0,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    modalContent: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    headerText: {
        color: Colors.black,
        fontSize: 24,
        fontFamily: DefaultValues.fontBold,
        padding: 5,
    },
    text: {
        fontSize: 14,
        fontFamily: DefaultValues.fontRegular,
        marginBottom: 25,
    },
    submitButtonContainer: {
        marginTop: 10,
    },
});

export const ChangePasswordScreenOptions = navigationData => {
    return {
        title: I18n.t("changePassword"),
    };
};

export default ChangePasswordScreen;
