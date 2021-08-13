import { DELETEUSERINFO, UPDATEUSERINFO, CHANGEDISPLAYNAME } from "../actions/auth";

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
            case CHANGEDISPLAYNAME:
                return {
                    ...state,
                    displayName: action.displayName
                };
        default:
            return state;
    }
};
