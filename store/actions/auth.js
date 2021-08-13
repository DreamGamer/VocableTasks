import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import * as environments from "../../environments/env";
import Bugsnag from "@bugsnag/react-native";
import auth from "@react-native-firebase/auth";
import I18n from "i18n-js";
import { firebase } from "@react-native-firebase/firestore";

const TAG = "[Auth Action]: "; // Console Log Tag

export const DELETEUSERINFO = "DELETEUSERINFO";
export const UPDATEUSERINFO = "UPDATEUSERINFO";
export const CHANGEDISPLAYNAME = "CHANGEDISPLAYNAME";

// Change the Display Name of user
export const changeDisplayName = name => {
    return async (dispatch, getState) => {
        try {
            await auth()
                .currentUser.updateProfile({
                    displayName: name,
                })
                .then(userInfo => {
                    console.info(TAG + `Sucessfully updated displayName to '${name}'`);
                    console.log(userInfo)
                    dispatch( {type: CHANGEDISPLAYNAME, displayName: name} );
                })
                .catch(error => {
                    Bugsnag.notify(error);
                    console.log(TAG + error);
                });
        } catch (error) {
            console.warn(TAG + "Catched fatal error in updateDisplayName: " + error);
            Bugsnag.notify(error);
            throw error;
        }
    };
};

export const sendEmail = () => {
    return async (dispatch, getState) => {
        try {
            //auth().currentUser.verifyBeforeUpdateEmail();
        } catch (error) {}
    };
};

// Reset Password with Email function
export const resetPasswordWithEmail = email => {
    return async (dispatch, getState) => {
        await auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                console.info(TAG + `Sucessfully send reset email to '${email}'`);
            })
            .catch(error => {
                switch (error.code) {
                    case "auth/invalid-email":
                        return Promise.reject(I18n.t("authInvalidEmail"));

                    case "auth/missing-android-pkg-name":
                        return Promise.reject(I18n.t("authMissingAndroidPKGName"));

                    case "auth/missing-continue-uri":
                        return Promise.reject(I18n.t("authMissingContinueURL"));

                    case "auth/missing-ios-bundle-id":
                        return Promise.reject(I18n.t("authMissingIOSBundleID"));

                    case "auth/invalid-continue-uri":
                        return Promise.reject(I18n.t("authInvalidContinueURL"));

                    case "auth/unauthorized-continue-uri":
                        return Promise.reject(I18n.t("authUnauthorizedContinueURL"));

                    case "auth/user-not-found":
                        return Promise.reject(I18n.t("authUserNotFound"));

                    case "auth/too-many-requests":
                        return Promise.reject(I18n.t("authTooManyRequests"));

                    case "auth/network-request-failed":
                        return Promise.reject(I18n.t("authNetworkRequestFailed"));

                    default:
                        Bugsnag.notify(error);
                        console.warn(TAG + "Undefined error while resetPasswordWithEmail: " + error.message);
                        return Promise.reject(I18n.t("somethingWentWrong"));
                }
            });
    };
};

export const updateUserInfo = user => {
    return async dispatch => {
        try {
            let displayName = null;
            let emailVerified = null;

            console.log(user);

            if (user != null) {
                displayName = user.displayName ? user.displayName : null;
                emailVerified = user.emailVerified;
            }

            console.info(TAG + `Successfully updated user info to displayName: '${displayName}', emailVerified: '${emailVerified}'`);
            await dispatch({ type: UPDATEUSERINFO, displayName, emailVerified });
        } catch (error) {
            console.log(TAG + "Catched error in updateUserInfo: " + error);
            Bugsnag.notify(error);
        }
    };
};

export const signUp = (email, password) => {
    return async dispatch => {
        await auth()
            .createUserWithEmailAndPassword(email, password)
            .then(userInfo => {
                console.log(TAG + `Sucessfully registered user with the email '${email}'`);
                dispatch(updateUserInfo(userInfo.user));
            })
            .catch(error => {
                switch (error.code) {
                    case "auth/email-already-in-use":
                        return Promise.reject(I18n.t("authEmailAlreadyInUse"));

                    case "auth/invalid-email":
                        return Promise.reject(I18n.t("authInvalidEmail"));

                    case "auth/operation-not-allowed":
                        return Promise.reject(I18n.t("authOperationNotAllowed"));

                    case "auth/weak-password":
                        return Promise.reject(I18n.t("authWeakPassword"));

                    case "auth/too-many-requests":
                        return Promise.reject(I18n.t("authTooManyRequests"));

                    case "auth/network-request-failed":
                        return Promise.reject(I18n.t("authNetworkRequestFailed"));

                    default:
                        Bugsnag.notify(error);
                        console.warn(TAG + "Undefined error while signUp: " + error.message);
                        return Promise.reject(I18n.t("somethingWentWrong"));
                }
            });
    };
};

export const login = (email, password) => {
    return async dispatch => {
        await auth()
            .signInWithEmailAndPassword(email, password)
            .then(userInfo => {
                console.info(TAG + "Successfully logged in");
                dispatch(updateUserInfo(userInfo.user));
            })
            .catch(error => {
                switch (error.code) {
                    case "auth/invalid-email":
                        return Promise.reject(I18n.t("authInvalidEmail"));

                    case "auth/user-disabled":
                        return Promise.reject(I18n.t("authUserDisabled"));

                    case "auth/user-not-found":
                        return Promise.reject(I18n.t("authUserNotFound"));

                    case "auth/wrong-password":
                        return Promise.reject(I18n.t("authWrongPassword"));

                    case "auth/too-many-requests":
                        return Promise.reject(I18n.t("authTooManyRequests"));

                    case "auth/network-request-failed":
                        return Promise.reject(I18n.t("authNetworkRequestFailed"));

                    default:
                        Bugsnag.notify(error);
                        console.warn(TAG + "Undefined error while signUp: " + error.message);
                        return Promise.reject(I18n.t("somethingWentWrong"));
                }
            });
    };
};

// Logout user function
export const logout = () => {
    return async dispatch => {
        try {
            await auth()
                .signOut()
                .catch(error => {});
            console.info(TAG + "Successfully logged out!");
        } catch (error) {
            console.warn(TAG + "Catched fatal error in logout: " + error);
            Bugsnag.notify(error);
            throw error;
        }
    };
};

export const deleteUserInfo = () => {
    return { type: DELETEUSERINFO };
};

const saveUserToStorage = (idToken, refreshToken, UID, expireDate, displayName) => {
    try {
        AsyncStorage.setItem(
            "userData",
            JSON.stringify({
                idToken: idToken,
                refreshToken: refreshToken,
                UID: UID,
                expireDate: expireDate.toISOString(),
                displayName: displayName,
            })
        );
        console.log(TAG + "Sucessfully saved user");
    } catch (error) {
        console.warn(TAG + "Catched fatal error in saveUserToStorage: " + error);
        Bugsnag.notify(error);
        throw error;
    }
};

const getRefreshTokenFromStorage = async () => {
    try {
        const userData = await AsyncStorage.getItem("userData");
        const transformedUserData = JSON.parse(userData);
        const refreshToken = transformedUserData.refreshToken;

        return refreshToken;
    } catch (error) {
        console.warn(TAG + "Catched fatal error in getRefreshTokenFromStorage: " + error);
        Bugsnag.notify(error);
        throw error;
    }
};
