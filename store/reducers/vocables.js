import Vocable from "../../models/Vocable";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import Bugsnag from "@bugsnag/react-native";
//import { ADD_VOCABLE, DELETE_VOCABLE, SET_VOCABLES, UPDATE_VOCABLE, END_REACHED, INITIALSTATES } from "../actions/vocables";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  vocables: [],
  endReached: false,
};

const vocablesSlice = createSlice({
  name: "vocables",
  initialState,
  reducers: {
    ADD_VOCABLE: (state, action) => {
      const newVocable = new Vocable(action.payload.data.id, action.payload.data.wordENG, action.payload.data.wordDE, action.payload.data.known);
      console.log(newVocable);
      state.vocables = newVocable;
    },
    SET_VOCABLES: (state, action) => {
      const newVocables = state.vocables.concat(action.payload.vocables);
      console.log("SetVocable", newVocables);
      state.vocables = state.vocables.concat(action.payload.vocables);
    },
    DELETE_VOCABLE: (state, action) => {
      state.vocables = state.vocables.filter((vocable) => vocable.id !== action.payload.id);
    },
    UPDATE_VOCABLE: (state, action) => {
      const vocableIndex = state.vocables.findIndex((state) => state.id === action.payload.id);
      const updatedVocable = new Vocable(action.payload.id, action.payload.wordENG, action.payload.wordDE, state.vocables[vocableIndex].known);
      const updatedVocables = [...state.vocables];
      updatedVocables[vocableIndex] = updatedVocable;

      state.vocables = updatedVocables;
    },
    END_REACHED: (state, action) => {
      state.endReached = action.payload.endReached;
    },
    INITIALSTATE: () => initialState,
  },
});

export const { ADD_VOCABLE, SET_VOCABLES, DELETE_VOCABLE, END_REACHED, INITIALSTATE, UPDATE_VOCABLE } = vocablesSlice.actions;
export default vocablesSlice.reducer;

/*

const vocableReducer = (state = initStates, action) => {
    switch (action.type) {
        case ADD_VOCABLE:
            const newVocable = new Vocable(action.data.id, action.data.wordENG, action.data.wordDE, action.data.known);
            console.log(newVocable);

            return {
                ...state,
                vocables: state.vocables.concat(newVocable),
            };

        case SET_VOCABLES:
            return {
                ...state,
                vocables: state.vocables.concat(action.vocables),
            };

        case DELETE_VOCABLE:
            return {
                ...state,
                vocables: state.vocables.filter(vocable => vocable.id !== action.id),
            };
        case UPDATE_VOCABLE:
            const vocableIndex = state.vocables.findIndex(state => state.id === action.id);
            const updatedVocable = new Vocable(action.id, action.wordENG, action.wordDE, state.vocables[vocableIndex].known);
            const updatedVocables = [...state.vocables];
            updatedVocables[vocableIndex] = updatedVocable;

            return {
                ...state,
                vocables: updatedVocables,
            };
        case END_REACHED:
            return {
                ...state,
                endReached: action.endReached,
            };
        case INITIALSTATES:
            return initStates;

        default:
            return state;
    }
};

export default vocableReducer;
*/
