import { DELETEUSERINFO, UPDATEUSERINFO } from "../actions/auth";

const initialState = {
    displayName: null,
    emailVerified: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATEUSERINFO:
            return {
                ...state,
                displayName: action.displayName,
                emailVerified: action.emailVerified,
            };
        case DELETEUSERINFO:
            return {
                ...initialState,
            };
        default:
            return state;
    }
};
