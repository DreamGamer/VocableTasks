import React, { useState } from "react";
import { ActivityIndicator, Button, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import GlobalStyles from "../../constants/GlobalStyles";
import I18n from "../../i18n/translation";
import { Avatar } from "react-native-paper";
import Colors from "../../constants/Colors";
import Auth from "@react-native-firebase/auth";
import Storage from "@react-native-firebase/storage";
import Modal from "react-native-modal";
import SettingsButton from "../../components/SettingsButton";
import ImagePicker from "react-native-image-crop-picker";
import Bugsnag from "@bugsnag/react-native";
import Spinner from "react-native-loading-spinner-overlay";
import { Ionicons } from "@expo/vector-icons";

const TAG = "[EditProfileScreen]: "; // Console Log Tag

const EditProfileScreen = props => {
    const [showModal, setShowModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const user = Auth().currentUser;
    const photoURL = Auth().currentUser.photoURL;
    const firstLetter = Auth().currentUser.displayName.charAt(0);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const deleteAvatar = async () => {
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
    };

    const updateProfilePicture = async image => {
        setShowModal(false);
        setIsLoading(true);
        const storageRef = Storage().ref(user.uid + "/profilePicture.jpg");
        const task = storageRef.putFile(image.path);

        try {
            await task;
            console.info(TAG + `Successfully uploaded profile picture for user'${user.uid}'`);

            const imageURL = await storageRef.getDownloadURL();
            await user.updateProfile({ photoURL: imageURL });
            console.info(TAG + `Successfully set profile picture for user '${user.uid}'`);
            await user.reload();
        } catch (error) {
            Bugsnag.notify(error);
            console.warn(TAG + "Catched error in ImagePicker: " + error);
        }
        setIsLoading(false);
    };

    return (
        <View style={GlobalStyles.flex1}>
            <Spinner visible={isLoading} />
            <Modal isVisible={showModal} animationIn="slideInDown" animationOut="slideOutUp" style={styles.modal} onBackdropPress={toggleModal}>
                <View style={styles.whiteBox}>
                    <SettingsButton
                        iconName="camera"
                        title="Choose Avatar"
                        arrow
                        onPress={() => {
                            ImagePicker.openPicker({
                                cropping: true,
                                mediaType: "photo",
                                multiple: false,
                                width: 400,
                                height: 400,
                                cropperToolbarTitle: "Choose Profile Picture",
                            })
                                .then(async image => {
                                    await updateProfilePicture(image);
                                })
                                .catch(error => {
                                    setIsLoading(false);
                                    Bugsnag.notify(error);
                                    console.warn(TAG + "Catched error in ImagePicker: " + error);
                                });
                        }}
                    />
                    <SettingsButton iconName="trash" title="Delete Avatar" arrow onPress={deleteAvatar} />
                </View>
            </Modal>

            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.avatarContainer}>
                    <TouchableOpacity onPress={toggleModal}>
                        {photoURL ? <Avatar.Image source={{ uri: photoURL }} size={125} style={styles.avatarStyle} /> : <Avatar.Text size={125} style={styles.avatarStyle} label={firstLetter} />}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
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
});

export const EditProfileScreenOptions = navigationData => {
    return {
        title: I18n.t("editProfile"),
    };
};

export default EditProfileScreen;
