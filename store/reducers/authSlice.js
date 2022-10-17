import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Bugsnag from "@bugsnag/react-native";

const TAG = "[Auth Slice]";

const initialState = {
  isAuth: false,
  displayName: null,
  photoURL: null,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    UPDATEUSERINFO: (state, action) => {
      state.displayName = action.payload.displayName;
      state.photoURL = action.payload.photoURL;
      state.initialized = true;
    },
    INITIALSTATE: () => initialState,
    CHANGEDISPLAYNAME: (state, action) => {
      state.displayName = action.payload.displayName;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initializeUser.fulfilled, (state, action) => {
      if (state.initialized) {
        console.info(TAG, "initializeUser was triggered, but the user is already initialized");
        return;
      }
      state.initialized = true;
      state.displayName = action.payload.displayName;
      state.photoURL = action.payload.photoURL;
      state.isAuth = true;
    });
  },
});

export const { CHANGEDISPLAYNAME, INITIALSTATE, UPDATEUSERINFO } = authSlice.actions;
export default authSlice.reducer;

export const initializeUser = createAsyncThunk("auth/initializeUserStatus", async (user, thunkAPI) => {
  const initialized = thunkAPI.getState().auth.initialized;
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

      // thunkAPI.dispatch(UPDATEUSERINFO({ uid, displayName, photoURL }));
      console.info(TAG, `Successfully created user in database [uid: '${uid}', displayName: '${displayName}', photoURL: '${photoURL}']`);
      return { displayName, photoURL };
    } else {
      // thunkAPI.dispatch(UPDATEUSERINFO({ uid, displayName: userData.data().displayName, photoURL: userData.data().photoURL }));
      console.info(TAG, `Successfully got user data from database [uid: '${uid}', displayName: '${userData.data().displayName}', photoURL: '${userData.data().photoURL}']`);
      return { displayName: userData.data().displayName, photoURL: userData.data().photoURL };
    }
  }
});
