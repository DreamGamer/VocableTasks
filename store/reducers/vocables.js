import { ADD_VOCABLE, SET_VOCABLES } from "../actions/vocables";
import Vocable from "../../models/Vocable";

const initStates = {
    vocables: []
};

const vocableReducer = (state = initStates, action) => {
    switch (action.type) {
        case ADD_VOCABLE:
            const newVocable = new Vocable(action.data.wordENG, action.data.wordDE, action.data.known);

            return {
                ...state,
                vocables: state.vocables.concat(newVocable)
            }

            case SET_VOCABLES:
                return {
                    ...state,
                    vocables: action.vocables
                }
        default:
            return state;
    }
};

export default vocableReducer;