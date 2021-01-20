import { AUTHENTICATE, LOGOUT, LOOKUPUSERDATA, SETTRYEDAUTOLOGIN } from "../actions/auth";

const initialState = {
    idToken: null,
    refreshToken: null,
    UID: null,
    displayName: null,
    isEmailVerified: null,
    email: null,
    tryedAutoLogin: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {
                ...state,
                idToken: action.idToken,
                refreshToken: action.refreshToken,
                UID: action.UID,
                tryedAutoLogin: true,
            };
            break;
        case LOGOUT:
            return {
                ...initialState,
                tryedAutoLogin: true,
            };
        case SETTRYEDAUTOLOGIN:
            return {
                ...state,
                tryedAutoLogin: true,
            };
        case LOOKUPUSERDATA:
            return {
                ...state,
                displayName: action.displayName,
                isEmailVerified: action.isEmailVerified,
                email: action.email,
            };
        default:
            return state;
    }
};
