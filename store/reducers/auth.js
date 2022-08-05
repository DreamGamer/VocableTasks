import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector } from "react-redux";
import * as environments from "../../environments/env";
import Bugsnag from "@bugsnag/react-native";
import auth from "@react-native-firebase/auth";
import { useTranslation } from "react-i18next";
import { firebase } from "@react-native-firebase/firestore";
//import { DELETEUSERINFO, UPDATEUSERINFO, CHANGEDISPLAYNAME } from "../actions/auth";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  displayName: null,
  emailVerified: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    UPDATEUSERINFO: (state, action) => {
      state.displayName = action.payload.displayName;
      state.emailVerified = action.payload.emailVerified;
    },
    DELETEUSERINFO: (state, action) => {
      state = initialState;
    },
    CHANGEDISPLAYNAME: (state, action) => {
      state.displayName = action.payload.displayName;
    },
  },
});

export const { CHANGEDISPLAYNAME, DELETEUSERINFO, UPDATEUSERINFO } = authSlice.actions;
export default authSlice.reducer;

/*

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
*/
