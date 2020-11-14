import AsyncStorage from "@react-native-community/async-storage";
import * as config from "../../constants/config/Keys";

export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
export const SETTRYEDAUTOLOGIN = "SETTRYEDAUTOLOGIN";

let logoutTimer;

export const authenticate = (token, UID, expirationTime, displayName) => {
    return dispatch => {
        dispatch(setLogoutTimer(expirationTime));
        dispatch({ type: AUTHENTICATE, token: token, UID: UID, displayName: "test" });
    };
};

export const setTryedAutoLogin = () => {
    return { type: SETTRYEDAUTOLOGIN };
};

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=" + config.FIREBASE_API_KEY, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true,
            }),
        });

        if (!response.ok) {
            try {
                const errorResponseData = await response.json();
                const errorCode = errorResponseData.error.message;
                let errorMessage = "Something went wrong while login!";
                if (errorCode === "EMAIL_NOT_FOUND") {
                    errorMessage = "No user with this Email found.";
                } else if (errorCode === "INVALID_PASSWORD") {
                    errorMessage = "Invalid Password.";
                } else if (errorCode === "USER_DISABLED") {
                    errorMessage = "You account is disabled. Please contact Support.";
                } else if (errorCode === "INVALID_EMAIL") {
                    errorMessage = "No valid Email entered.";
                } else if (errorCode === "MISSING_EMAIL") {
                    errorMessage = "No Email entered.";
                } else if (errorCode === "MISSING_PASSWORD") {
                    errorMessage = "No Password entered.";
                }

                throw new Error(errorMessage);
            } catch (error) {
                throw error;
            }
        }

        const responseData = await response.json();
        console.log(responseData);

        dispatch(authenticate(responseData.localId, responseData.idToken, parseInt(responseData.expiresIn) * 1000, responseData.displayName));

        const expireDate = new Date(new Date().getTime() + parseInt(responseData.expiresIn) * 1000);

        saveUserToStorage(responseData.localId, responseData.idToken, expireDate);
    };
};

export const logout = () => {
    try {
        clearLogoutTimer();
        AsyncStorage.removeItem("userData");
        return { type: LOGOUT };
    } catch (error) {
        throw error;
    }
};

const setLogoutTimer = expirationTime => {
    return dispatch => {
        logoutTimer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    };
};

const clearLogoutTimer = () => {
    if (logoutTimer) {
        clearTimeout(logoutTimer);
    }
};

const saveUserToStorage = (token, UID, expireData, displayName) => {
    try {
        AsyncStorage.setItem(
            "userData",
            JSON.stringify({
                token: token,
                UID: UID,
                expireData: expireData.toISOString(),
                displayName: displayName,
            })
        );
    } catch (error) {
        throw error;
    }
};
