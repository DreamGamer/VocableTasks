import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GlobalStyles from "../../constants/GlobalStyles";
import { useTranslation } from "react-i18next";
import { Avatar } from "react-native-paper";
import Colors from "../../constants/Colors";
import Auth from "@react-native-firebase/auth";
import Storage from "@react-native-firebase/storage";
import Modal from "react-native-modal";
import SettingsButton from "../../components/SettingsButton";
import ImagePicker from "react-native-image-crop-picker";
import Bugsnag from "@bugsnag/react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Input from "../../components/Input";
import { Formik } from "formik";
import * as yup from "yup";
import { Translation } from "../../i18n/translation";

const TAG = "[EditProfileScreen]: "; // Console Log Tag

const EditProfileScreen = props => {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [usernameEditable, setUsernameEditable] = useState(Auth().currentUser.displayName ? false : true);

    const yupSchema = yup.object({
        username: yup.string(t("usernameMustBeAString")).required(t("usernameRequired")),
    });

    const user = Auth().currentUser;
    const photoURL = Auth().currentUser.photoURL;
    const firstLetter = Auth().currentUser.displayName.charAt(0);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const deleteAvatar = async () => {
        Alert.alert(t("areYouSure"), t("doYouReallyWantToDeleteYourAvatar"), [
            { text: t("no"), style: "default" },
            {
                text: t("yes"),
                style: "destructive",
                onPress: async () => {
                    setShowModal(false);
                    setIsLoading(true);
                    try {
                        await user.updateProfile({ photoURL: null });
                        await user.reload();
                    } catch (error) {
                        Bugsnag.notify(error);
                        console.warn(TAG + "Catched error in deleteAvatar: " + error);
                    }
                    setIsLoading(false);
                },
            },
        ]);
    };

    const updateProfilePicture = async image => {
        setShowModal(false);
        setIsLoading(true);
        const storageRef = Storage().ref("avatars/" + user.uid + "/profilePicture.jpg");
        const task = storageRef.putFile(image.path);

        try {
            await task;
            console.info(TAG + `Successfully uploaded profile picture for user: '${user.uid}'`);

            const imageURL = await storageRef.getDownloadURL();
            await user.updateProfile({ photoURL: imageURL });
            console.info(TAG + `Successfully set profile picture for user: '${user.uid}'`);
            await user.reload();
        } catch (error) {
            console.log(error.code);
            Bugsnag.notify(error);
            console.warn(TAG + "Catched error in ImagePicker: " + error);
        }
        setIsLoading(false);
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={GlobalStyles.flex1}>
            <Spinner visible={isLoading} />
            <Modal isVisible={showModal} animationIn="slideInDown" animationOut="slideOutUp" style={styles.modal} onBackdropPress={toggleModal} backdropTransitionOutTiming={0}>
                <View style={styles.whiteBox}>
                    <SettingsButton
                        iconName="camera"
                        title={t("chooseAvatar")}
                        arrow
                        onPress={() => {
                            ImagePicker.openPicker({
                                cropping: true,
                                mediaType: "photo",
                                multiple: false,
                                width: 400,
                                height: 400,
                                cropperToolbarTitle: t("chooseAvatar"),
                            })
                                .then(async image => {
                                    await updateProfilePicture(image);
                                })
                                .catch(error => {
                                    setIsLoading(false);
                                    switch (error.code) {
                                        case "E_PICKER_CANCELLED":
                                            console.info(TAG + "User cancelled image selection");
                                            return;
                                    }
                                    Bugsnag.notify(error);
                                    console.warn(TAG + "Catched error in ImagePicker: " + error + " Error code: " + error.code);
                                });
                        }}
                    />
                    {photoURL ? <SettingsButton iconName="trash" title={t("deleteAvatar")} arrow onPress={deleteAvatar} /> : null}
                </View>
            </Modal>

            <ScrollView contentContainerStyle={styles.scrollView} keyboardShouldPersistTaps="handled">
                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={toggleModal}>
                        {photoURL ? <Avatar.Image source={{ uri: photoURL }} size={125} style={styles.avatarStyle} /> : <Avatar.Text size={125} style={styles.avatarStyle} label={firstLetter} />}
                    </TouchableOpacity>
                </View>
                <Formik
                    initialValues={{ username: Auth().currentUser.displayName ? Auth().currentUser.displayName : "" }}
                    validationSchema={yupSchema}
                    onSubmit={async (values, actions) => {
                        if (usernameEditable) {
                            if (values.username === Auth().currentUser.displayName) {
                                setUsernameEditable(false);
                                return;
                            }
                            setIsLoading(true);
                            await Auth()
                                .currentUser.updateProfile({ displayName: values.username })
                                .then(() => {
                                    console.log(TAG + `Successfully updated username to '${values.username}'`);
                                    setUsernameEditable(false);
                                })
                                .catch(error => {
                                    Bugsnag.notify(error);
                                    console.warn(TAG + "Error in submit username: " + error);
                                });
                            await Auth().currentUser.reload();
                            setIsLoading(false);
                        } else {
                            setUsernameEditable(true);
                        }
                    }}>
                    {formikProps => (
                        <View style={styles.userdataContainer}>
                            <Input
                                title={t("username")}
                                value={formikProps.values.username}
                                onChangeText={formikProps.handleChange("username")}
                                editable={usernameEditable}
                                showIcon
                                iconName={usernameEditable ? "checkmark-sharp" : "pencil-sharp"}
                                onPressIcon={formikProps.handleSubmit}
                                returnKeyType="done"
                                onSubmitEditing={formikProps.handleSubmit}
                            />
                            {formikProps.errors.username && formikProps.touched.username ? <Text style={GlobalStyles.errorText}>{formikProps.touched.username && formikProps.errors.username}</Text> : null}
                        </View>
                    )}
                </Formik>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
    },
    avatarContainer: {
        alignItems: "center",
        margin: 15,
    },
    avatarStyle: {
        backgroundColor: Colors.white,
    },
    modal: {
        margin: 30,
    },
    whiteBox: {
        backgroundColor: Colors.white,
        width: "100%",
        borderRadius: 5,

        justifyContent: "center",
    },
    userdataContainer: {
        marginHorizontal: 20,
    },
});

export const EditProfileScreenOptions = navigationData => {
    return {
        title: <Translation name="editProfile" />,
    };
};

export default EditProfileScreen;
