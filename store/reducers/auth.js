import { AUTHENTICATE, LOGOUT, SETTRYEDAUTOLOGIN } from "../actions/auth";

const initialState = {
    token: null,
    UID: null,
    displayName: null,
    tryedAutoLogin: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case AUTHENTICATE:
            return {
                token: action.token,
                UID: action.UID,
                displayName: action.displayName,
                tryedAutoLogin: true
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
                tryedAutoLogin: true
            }
        default:
            return state;
    }
};
