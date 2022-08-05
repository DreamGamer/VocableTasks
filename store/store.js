import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import ReduxThunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import authSlice from "./reducers/auth";
import vocablesSlice from "./reducers/vocables";

const middlewares = [ReduxThunk, composeWithDevTools];

if (__DEV__) {
  const createDebugger = require("redux-flipper").default;
  middlewares.push(createDebugger());
}

const rootReducer = combineReducers({
  auth: authSlice,
  vocables: vocablesSlice,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: middlewares,
});

export default store;
