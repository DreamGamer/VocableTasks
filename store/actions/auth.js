import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import * as environments from "../../environments/env";
import Bugsnag from "@bugsnag/react-native";
import auth from "@react-native-firebase/auth";
import { useTranslation } from "react-i18next";
import { firebase } from "@react-native-firebase/firestore";

import { CHANGEDISPLAYNAME, DELETEUSERINFO, UPDATEUSERINFO } from "../reducers/auth";

const TAG = "[Auth Action]: "; // Console Log Tag

export const changeDisplayName = (name) => {
  return async (dispatch) => {
    try {
      await auth()
        .currentUser.updateProfile({
          displayName: name,
        })
        .then((userInfo) => {
          console.info(TAG + `Sucessfully updated displayName to '${name}'`);
          console.log(userInfo);
          dispatch(CHANGEDISPLAYNAME({ displayName: name }));
        })
        .catch((error) => {
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
  return async (dispatch) => {
    try {
      //auth().currentUser.verifyBeforeUpdateEmail();
    } catch (error) {}
  };
};

export const resetPasswordWithEmail = (email) => {
  return async (dispatch) => {
    const { t } = useTranslation();
    await auth().fetchSignInMethodsForEmail(email).then((result) => {
        console.log("result", result)
    }).catch((error) => {
        console.log("fetchTest" + error)
    });
    await auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        console.info(TAG + `Sucessfully send reset email to '${email}'`);
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
            return Promise.reject(t("authInvalidEmail"));

          case "auth/missing-android-pkg-name":
            return Promise.reject(t("authMissingAndroidPKGName"));

          case "auth/missing-continue-uri":
            return Promise.reject(t("authMissingContinueURL"));

          case "auth/missing-ios-bundle-id":
            return Promise.reject(t("authMissingIOSBundleID"));

          case "auth/invalid-continue-uri":
            return Promise.reject(t("authInvalidContinueURL"));

          case "auth/unauthorized-continue-uri":
            return Promise.reject(t("authUnauthorizedContinueURL"));

          case "auth/user-not-found":
            return Promise.reject(t("authUserNotFound"));

          case "auth/too-many-requests":
            return Promise.reject(t("authTooManyRequests"));

          case "auth/network-request-failed":
            return Promise.reject(t("authNetworkRequestFailed"));

          default:
            Bugsnag.notify(error);
            console.warn(TAG + "Undefined error while resetPasswordWithEmail: " + error);
            return Promise.reject(t("somethingWentWrong"));
        }
      });
  };
};

export const updateUserInfo = (user) => {
  return async (dispatch) => {
    try {
      let displayName = null;
      let emailVerified = null;

      if (user != null) {
        displayName = user.displayName ? user.displayName : null;
        emailVerified = user.emailVerified;
      }

      console.info(TAG + `Successfully updated user info to displayName: '${displayName}', emailVerified: '${emailVerified}'`);
      await dispatch(UPDATEUSERINFO({ displayName, emailVerified }));
    } catch (error) {
      console.log(TAG + "Catched error in updateUserInfo: " + error);
      Bugsnag.notify(error);
    }
  };
};

export const signUp = (email, password) => {
  return async (dispatch) => {
    const { t } = useTranslation();
    await auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        console.info(TAG + `Sucessfully send reset email to '${email}'`);
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/invalid-email":
            return Promise.reject(t("authInvalidEmail"));

          case "auth/missing-android-pkg-name":
            return Promise.reject(t("authMissingAndroidPKGName"));

          case "auth/missing-continue-uri":
            return Promise.reject(t("authMissingContinueURL"));

          case "auth/missing-ios-bundle-id":
            return Promise.reject(t("authMissingIOSBundleID"));

          case "auth/invalid-continue-uri":
            return Promise.reject(t("authInvalidContinueURL"));

          case "auth/unauthorized-continue-uri":
            return Promise.reject(t("authUnauthorizedContinueURL"));

          case "auth/user-not-found":
            return Promise.reject(t("authUserNotFound"));

          case "auth/too-many-requests":
            return Promise.reject(t("authTooManyRequests"));

          case "auth/network-request-failed":
            return Promise.reject(t("authNetworkRequestFailed"));

          default:
            Bugsnag.notify(error);
            console.warn(TAG + "Undefined error while resetPasswordWithEmail: " + error.message);
            return Promise.reject(t("somethingWentWrong"));
        }
      });
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    try {
      await auth()
        .signInWithEmailAndPassword(email, password)
        .then((userInfo) => {
          console.info(TAG + "Successfully logged in");
          dispatch(UPDATEUSERINFO(userInfo.user));
        })
        .catch((error) => {
          if (error.code) {
            return Promise.reject(error.code);
          } else {
            Bugsnag.notify(error);
            console.warn(TAG + "Error while dispatch login: " + error);
            console.warn(error);
            return Promise.reject(error);
          }
          switch (error.code) {
            case "auth/invalid-email":
              return Promise.reject(t("authInvalidEmail"));

            case "auth/user-disabled":
              return Promise.reject(t("authUserDisabled"));

            case "auth/user-not-found":
              return Promise.reject(t("authUserNotFound"));

            case "auth/wrong-password":
              return Promise.reject(t("authWrongPassword"));

            case "auth/too-many-requests":
              return Promise.reject(t("authTooManyRequests"));

            case "auth/network-request-failed":
              return Promise.reject(t("authNetworkRequestFailed"));

            default:
              Bugsnag.notify(error);
              console.warn(TAG + "Undefined error while signUp: " + error.message);
              return Promise.reject(t("somethingWentWrong"));
          }
        });
    } catch (error) {
      console.log(error);
    }
  };
};

export const logout = () => {
  return async (dispatch) => {
    try {
      await auth()
        .signOut()
        .catch((error) => {});
      console.info(TAG + "Successfully logged out!");
    } catch (error) {
      console.warn(TAG + "Catched fatal error in logout: " + error);
      Bugsnag.notify(error);
      throw error;
    }
  };
};

export const deleteUserInfo = () => {
  return async (dispatch) => {
    dispatch(DELETEUSERINFO);
  };
};

export const saveUserToStorage = (idToken, refreshToken, UID, expireDate, displayName) => {
  return async (dispatch) => {
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
};

export const getRefreshTokenFromStorage = () => {
  return async (dispatch) => {
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
};
