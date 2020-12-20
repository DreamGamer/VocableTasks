import AsyncStorage from "@react-native-community/async-storage";
import * as config from "../../constants/config/Keys";

export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
export const SETTRYEDAUTOLOGIN = "SETTRYEDAUTOLOGIN";
export const LOOKUPUSERDATA = "LOOKUPUSERDATA";

let logoutTimer;

export const authenticate = (token, UID, expirationTime) => {
    return async dispatch => {
        dispatch(setLogoutTimer(expirationTime));
        await dispatch(lookupUser(token));
        dispatch({ type: AUTHENTICATE, token: token, UID: UID });
    };
};

export const updateDisplayName = name => {
    return async (dispatch, getState) => {
        const token = getState().auth.token;
        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:update?key=" + config.FIREBASE_API_KEY, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idToken: token,
                displayName: name,
            }),
        });

        if (!response.ok) {
            try {
                const errorReponseData = await response.json();
                console.log(errorReponseData);
                const errorCode = errorResponseData.error.message;

                let errorMessage = "Something went wrong while Sign Up! " + errorCode;
                if ((errorCode = "CREDENTIAL_TOO_OLD_LOGIN_AGAIN")) {
                    errorMessage = "Please login egain.";
                } else if ((errorCode = "TOKEN_EXPIRED")) {
                    errorMessage = "Please login egain.";
                } else if ((errorCode = "INVALID_ID_TOKEN")) {
                    errorMessage = "Please login egain.";
                }

                throw new Error(errorMessage);
            } catch (error) {
                throw error;
            }
        }

        await dispatch(lookupUser(token));
    };
};

export const lookupUser = token => {
    return async (dispatch, getState) => {
        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + config.FIREBASE_API_KEY, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idToken: token,
            }),
        });

        if (!response.ok) {
            try {
                const errorReponseData = await response.json();
                console.log(errorReponseData);
                const errorCode = errorResponseData.error.message;

                let errorMessage = "Something went wrong while Sign Up!";
                if ((errorCode = "INVALID_ID_TOKEN")) {
                    errorMessage = "Please login egain.";
                } else if ((errorCode = "USER_NOT_FOUND")) {
                    errorMessage = "User not found.";
                }

                throw new Error(errorMessage);
            } catch (error) {
                throw error;
            }
        }

        const responseData = await response.json();
        const displayName = responseData.users[0].displayName ? responseData.users[0].displayName : null;
        const isEmailVerified = responseData.users[0].emailVerified;
        const email = responseData.users[0].email;

        dispatch({ type: LOOKUPUSERDATA, displayName: displayName, isEmailVerified: isEmailVerified, email: email });
    };
};

export const setTryedAutoLogin = () => {
    return { type: SETTRYEDAUTOLOGIN };
};

export const sendEmail = () => {
    return async (dispatch, getState) => {
        const token = await getState().auth.token;
        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=" + config.FIREBASE_API_KEY, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                requestType: "VERIFY_EMAIL",
                idToken: token,
            }),
        });

        if (!response.ok) {
            try {
                const errorResponseData = await response.json();
                console.log(errorResponseData);
                const errorCode = errorResponseData.error.message;

                let errorMessage = "Something went wrong while Sign Up!";
                if (errorCode === "EMAIL_EXISTS") {
                    errorMessage = "There is already an account with this Email.";
                } else if (errorCode === "TOO_MANY_ATTEMPTS_TRY_LATER") {
                    errorMessage = "Too many attempts, try again later.";
                } else if (errorCode === "OPERATION_NOT_ALLOWED") {
                    errorMessage = "Sign up not allowed. Please contact Support.";
                }

                throw new Error(errorMessage);
            } catch (error) {
                throw error;
            }
        }

        const responseData = await response.json();

        console.log(responseData);
    };
};

export const signUp = (email, password) => {
    return async dispatch => {
        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=" + config.FIREBASE_API_KEY, {
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
                console.log(errorResponseData);
                const errorCode = errorResponseData.error.message;

                let errorMessage = "Something went wrong while Sign Up!";
                if (errorCode === "EMAIL_EXISTS") {
                    errorMessage = "There is already an account with this Email.";
                } else if (errorCode === "TOO_MANY_ATTEMPTS_TRY_LATER") {
                    errorMessage = "Too many attempts, try again later.";
                } else if (errorCode === "OPERATION_NOT_ALLOWED") {
                    errorMessage = "Sign up not allowed. Please contact Support.";
                }

                throw new Error(errorMessage);
            } catch (error) {
                throw error;
            }
        }

        const responseData = await response.json();

        await dispatch(authenticate(responseData.idToken, responseData.localId, parseInt(responseData.expiresIn) * 1000));

        const expireDate = new Date(new Date().getTime() + parseInt(responseData.expiresIn) * 1000);

        saveUserToStorage(responseData.idToken, responseData.localId, expireDate);
    };
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

        await dispatch(authenticate(responseData.idToken, responseData.localId, parseInt(responseData.expiresIn) * 1000));

        const expireDate = new Date(new Date().getTime() + parseInt(responseData.expiresIn) * 1000);

        saveUserToStorage(responseData.idToken, responseData.localId, expireDate);
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
