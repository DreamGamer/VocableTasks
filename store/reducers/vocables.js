import { ADD_VOCABLE, DELETE_VOCABLE, SET_VOCABLES, UPDATE_VOCABLE, END_REACHED } from "../actions/vocables";
import Vocable from "../../models/Vocable";

const initStates = {
    vocables: [],
    endReached: false,
};

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

        default:
            return state;
    }
};

export default vocableReducer;
