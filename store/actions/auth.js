import AsyncStorage from "@react-native-community/async-storage";
import { useSelector } from "react-redux";
import * as config from "../../constants/config/Keys";

const TAG = "[Auth Action]: "; // Console Log Tag

export const LOGIN = "LOGIN";
export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";
export const SETTRYEDAUTOLOGIN = "SETTRYEDAUTOLOGIN";
export const LOOKUPUSERDATA = "LOOKUPUSERDATA";

let logoutTimer;

// Authenticate User in App
export const authenticate = (idToken, refreshToken, UID, expirationTime) => {
    return async dispatch => {
        // await dispatch(setLogoutTimer(expirationTime));
        await dispatch(lookupUser(idToken));
        dispatch({ type: AUTHENTICATE, idToken: idToken, refreshToken: refreshToken, UID: UID });
    };
};

// Get new token from refreshToken
export const updateToken = () => {
    return async (dispatch, getState) => {
        try {
            // Get current refreshToken
            const refreshToken = await getState().auth.refreshToken;

            // REST request to get new idToken, refreshToken and so on
            const response = await fetch("https://securetoken.googleapis.com/v1/token?key=" + config.FIREBASE_API_KEY, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    grant_type: "refresh_token",
                    refreshToken: refreshToken,
                }),
            });

            if (!response.ok) {
                const errorResponseData = await response.json();
                console.log(TAG + "UpdateToken -> " + JSON.stringify(errorResponseData));
                const errorCode = errorResponseData.error.message;

                let errorMessage = "Something went wrong while getToken! " + JSON.stringify(errorResponseData);
                if (errorCode === "TOKEN_EXPIRED") {
                    errorMessage = "Please login again.";
                } else if (errorCode === "USER_DISABLED") {
                    errorMessage = "Your Account is disabled, please contact support!.";
                } else if (errorCode === "USER_NOT_FOUND") {
                    errorMessage = "User not found.";
                    dispatch(logout());
                } else if (errorCode === "INVALID_REFRESH_TOKEN") {
                    errorMessage = "Invalid refresh token. Please login again..";
                } else if (errorCode === "INVALID_GRANT_TYPE") {
                    errorMessage = "Invalid grant type. Please contact support!";
                } else if (errorCode === "MISSING_REFRESH_TOKEN") {
                    errorMessage = "Missing refresh token. Please login again or contact support!.";
                }
                console.log(TAG + "UpdateToken -> " + errorMessage);
                throw new Error(errorMessage);
            }

            const responseData = await response.json();
            const accessToken = responseData.access_token;
            const expires_in = responseData.expires_in;
            const idToken = responseData.id_token;
            const newRefreshToken = responseData.refresh_token;
            const UID = responseData.user_id;

            console.log(TAG + "UpdateToken -> " + "Sucessfully refreshed token.");

            await dispatch(authenticate(idToken, newRefreshToken, UID));
        } catch (error) {
            console.log(TAG + "UpdateToken -> " + error);
            throw error;
        }
    };
};

// Updates the displayName of user
export const updateDisplayName = name => {
    return async (dispatch, getState) => {
        await dispatch(updateToken());
        const idToken = await getState().auth.idToken;
        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:update?key=" + config.FIREBASE_API_KEY, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idToken: idToken,
                displayName: name,
            }),
        });

        if (!response.ok) {
            try {
                const errorResponseData = await response.json();
                console.log(TAG + "UpdateToken -> " + JSON.stringify(errorResponseData.error.message));
                const errorCode = errorResponseData.error.message;

                let errorMessage = "Something went wrong while Sign Up! " + errorCode;
                if (errorCode === "CREDENTIAL_TOO_OLD_LOGIN_AGAIN") {
                    errorMessage = "Please login egain.";
                } else if (errorCode === "TOKEN_EXPIRED") {
                    errorMessage = "Please login egain.";
                } else if (errorCode === "INVALID_ID_TOKEN") {
                    errorMessage = "Please login egain.";
                }

                throw new Error(errorMessage);
            } catch (error) {
                throw error;
            }
        }

        await dispatch(lookupUser(idToken));
    };
};

// Looks for user data like displayName or if email is verified
export const lookupUser = idToken => {
    return async (dispatch, getState) => {
        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + config.FIREBASE_API_KEY, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                idToken: idToken,
            }),
        });

        if (!response.ok) {
            try {
                const errorResponseData = await response.json();
                const errorCode = errorResponseData.error.message;

                let errorMessage = "Something went wrong while Sign Up! " + JSON.stringify(errorResponseData.error.message);
                if (errorCode === "INVALID_ID_TOKEN") {
                    errorMessage = "Please login egain.";
                } else if (errorCode === "USER_NOT_FOUND") {
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
        const idToken = await getState().auth.idToken;
        const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=" + config.FIREBASE_API_KEY, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                requestType: "VERIFY_EMAIL",
                idToken: idToken,
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

// Reset Password with Email function
export const resetPasswordWithEmail = email => {
    return async (dispatch, getState) => {
        try {
            // Send POST request to firebase
            const response = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=" + config.FIREBASE_API_KEY, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    requestType: "PASSWORD_RESET",
                    email: email,
                }),
            });

            if (!response.ok) {
                const errorResponseData = await response.json();
                console.log(TAG + JSON.stringify(errorResponseData));
                const errorCode = errorResponseData.error.message;

                let errorMessage = "Something went wrong while getToken! " + JSON.stringify(errorResponseData.error.message);
                if (errorCode === "EMAIL_NOT_FOUND") {
                    errorMessage = "No account found with this email.";
                } else if (errorCode === "RESET_PASSWORD_EXCEED_LIMIT") {
                    errorMessage = "Too many attempts, try again later.";
                }
                console.log(TAG + errorMessage);
                throw new Error(errorMessage);
            }

            const responseData = await response.json();

            console.log(responseData);
        } catch (error) {
            console.log(TAG + "Error while reset password with email! " + error);
            throw error;
        }
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

        await dispatch(authenticate(responseData.idToken, responseData.refreshToken, responseData.localId, parseInt(responseData.expiresIn) * 1000));

        const expireDate = new Date(new Date().getTime() + parseInt(responseData.expiresIn) * 1000);

        saveUserToStorage(responseData.idToken, responseData.refreshToken, responseData.localId, expireDate);
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

        await dispatch(authenticate(responseData.idToken, responseData.refreshToken, responseData.localId, parseInt(responseData.expiresIn) * 1000));

        const expireDate = new Date(new Date().getTime() + parseInt(responseData.expiresIn) * 1000);

        saveUserToStorage(responseData.idToken, responseData.refreshToken, responseData.localId, expireDate);
    };
};

// Logout user function
export const logout = () => {
    return async dispatch => {
        try {
            // Clear Timeout
            await clearLogoutTimer();
            // Logout user in storage
            await AsyncStorage.removeItem("userData");
            // Dispatch to logout user
            dispatch({ type: LOGOUT });
        } catch (error) {
            throw error;
        }
    };
};

const setLogoutTimer = expirationTime => {
    return async dispatch => {
        logoutTimer = await setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    };
};

const clearLogoutTimer = async () => {
    if (logoutTimer) {
        await clearTimeout(logoutTimer);
    }
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
        console.log(error);
        throw error;
    }
};
