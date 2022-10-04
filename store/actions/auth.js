import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import * as environments from "../../environments/env";
import Bugsnag from "@bugsnag/react-native";
import auth from "@react-native-firebase/auth";
import { useTranslation } from "react-i18next";
import firestore from "@react-native-firebase/firestore";

import { CHANGEDISPLAYNAME, INITIALSTATE, UPDATEUSERINFO } from "../reducers/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";

const TAG = "[Auth Action]"; // Console Log Tag

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
    await auth()
      .fetchSignInMethodsForEmail(email)
      .then((result) => {
        console.log("result", result);
      })
      .catch((error) => {
        console.log("fetchTest" + error);
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

export const test = createAsyncThunk("auth/test", async (user, thunkAPI) => {
    
})

export const initializeUser = (user) => {
  return async (dispatch, getState) => {
    try {
      const initialized = getState().auth.initialized;
      const { displayName, photoURL, uid } = user;

      // Only runs one time, to reduce firstore usage
      // So the profile / userData only updates on change in
      // firestore, or in the first start of the application
      if (!initialized) {
        const userData = await firestore().collection("users").doc(uid).get();

        if (!userData.exists) {
          console.info(TAG, `Creating user in database with UID (${uid})`);
          await userData.ref.set({
            displayName,
            photoURL,
          });

          await dispatch(UPDATEUSERINFO({ uid, displayName, photoURL }));
          console.info(TAG, `Successfully created user in database [uid: '${uid}', displayName: '${displayName}', photoURL: '${photoURL}']`);
        } else {
          console.info(TAG, `Successfully got user data from database [uid: '${uid}', displayName: '${userData.data().displayName}', photoURL: '${userData.data().photoURL}']`);
          await dispatch(UPDATEUSERINFO({ uid, displayName: userData.data().displayName, photoURL: userData.data().photoURL }));
        }
      }
    } catch (error) {
      console.warn(TAG, "Catched error in initializeUser: " + error);
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

// export const login = (email, password) => {
//   return async (dispatch) => {
//     try {
//       await auth()
//         .signInWithEmailAndPassword(email, password)
//         .then((userInfo) => {
//           console.info(TAG + "Successfully logged in");
//           dispatch(UPDATEUSERINFO(userInfo.user));
//         })
//         .catch((error) => {
//           if (error.code) {
//             return Promise.reject(error.code);
//           } else {
//             Bugsnag.notify(error);
//             console.warn(TAG + "Error while dispatch login: " + error);
//             console.warn(error);
//             return Promise.reject(error);
//           }
//           switch (error.code) {
//             case "auth/invalid-email":
//               return Promise.reject(t("authInvalidEmail"));

//             case "auth/user-disabled":
//               return Promise.reject(t("authUserDisabled"));

//             case "auth/user-not-found":
//               return Promise.reject(t("authUserNotFound"));

//             case "auth/wrong-password":
//               return Promise.reject(t("authWrongPassword"));

//             case "auth/too-many-requests":
//               return Promise.reject(t("authTooManyRequests"));

//             case "auth/network-request-failed":
//               return Promise.reject(t("authNetworkRequestFailed"));

//             default:
//               Bugsnag.notify(error);
//               console.warn(TAG + "Undefined error while signUp: " + error.message);
//               return Promise.reject(t("somethingWentWrong"));
//           }
//         });
//     } catch (error) {
//       console.log(error);
//     }
//   };
// };

export const logout = () => {
  return async (dispatch) => {
    try {
      await auth().signOut();
      console.info(TAG, "Successfully logged out!");
    } catch (error) {
      console.warn(TAG, "Catched fatal error in logout: " + error);
      Bugsnag.notify(error);
      throw error;
    }
  };
};

export const initialState = () => {
  return async (dispatch) => {
    dispatch(INITIALSTATE());
  };
};

// export const saveUserToStorage = (idToken, refreshToken, UID, expireDate, displayName) => {
//   return async (dispatch) => {
//     try {
//       AsyncStorage.setItem(
//         "userData",
//         JSON.stringify({
//           idToken: idToken,
//           refreshToken: refreshToken,
//           UID: UID,
//           expireDate: expireDate.toISOString(),
//           displayName: displayName,
//         })
//       );
//       console.log(TAG + "Sucessfully saved user");
//     } catch (error) {
//       console.warn(TAG + "Catched fatal error in saveUserToStorage: " + error);
//       Bugsnag.notify(error);
//       throw error;
//     }
//   };
// };

// export const getRefreshTokenFromStorage = () => {
//   return async (dispatch) => {
//     try {
//       const userData = await AsyncStorage.getItem("userData");
//       const transformedUserData = JSON.parse(userData);
//       const refreshToken = transformedUserData.refreshToken;

//       return refreshToken;
//     } catch (error) {
//       console.warn(TAG + "Catched fatal error in getRefreshTokenFromStorage: " + error);
//       Bugsnag.notify(error);
//       throw error;
//     }
//   };
// };
