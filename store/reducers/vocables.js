import { ADD_VOCABLE, DELETE_VOCABLE, SET_VOCABLES } from "../actions/vocables";
import Vocable from "../../models/Vocable";

const initStates = {
    vocables: []
};

const vocableReducer = (state = initStates, action) => {
    switch (action.type) {
        case ADD_VOCABLE:
            const newVocable = new Vocable(action.id, action.data.wordENG, action.data.wordDE, action.data.known);

            return {
                ...state,
                vocables: state.vocables.concat(newVocable)
            }

        case SET_VOCABLES:
            return {
                ...state,
                vocables: action.vocables
            }

        case DELETE_VOCABLE:
            return {
                ...state,
                vocables: state.vocables.filter(vocable => vocable.id !== action.id)
            }
        default:
            return state;
    }
};

export default vocableReducer;