import { ADD_VOCABLE, DELETE_VOCABLE, SET_VOCABLES, UPDATE_VOCABLE } from "../actions/vocables";
import Vocable from "../../models/Vocable";

const initStates = {
  vocables: [],
};

const vocableReducer = (state = initStates, action) => {
  switch (action.type) {
    case ADD_VOCABLE:
      const newVocable = new Vocable(action.id, action.data.wordENG, action.data.wordDE, action.data.known);

      return {
        ...state,
        vocables: state.vocables.concat(newVocable),
      };

    case SET_VOCABLES:
      return {
        ...state,
        vocables: action.vocables,
      };

    case DELETE_VOCABLE:
      return {
        ...state,
        vocables: state.vocables.filter((vocable) => vocable.id !== action.id),
      };
    case UPDATE_VOCABLE:
      const vocableIndex = state.vocables.findIndex((state) => state.id === action.id);
      const updatedVocable = new Vocable(action.id, action.wordENG, action.wordDE, state.vocables[vocableIndex]);
      const updatedVocables = [...state.vocables];
      updatedVocables[vocableIndex] = updatedVocable;

      return {
        ...state,
        vocables: updatedVocables,
      };
    default:
      return state;
  }
};

export default vocableReducer;
