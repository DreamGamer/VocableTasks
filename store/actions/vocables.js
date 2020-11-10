import Vocable from "../../models/Vocable";

export const ADD_VOCABLE = "ADD_VOCABLE";
export const SET_VOCABLES = "SET_VOCABLES";
export const DELETE_VOCABLE = "DELETE_VOCABLE";
export const UPDATE_VOCABLE = "UPDATE_VOCABLE";

export const fetchVocables = () => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch("https://vocabeltasks.firebaseio.com/vocables.json", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Something went wrong while fetching Vocables!");
      }

      const responseData = await response.json();
      const loadedVocables = [];

      for (const key in responseData) {
        loadedVocables.push(new Vocable(key, responseData[key].wordENG, responseData[key].wordDE, responseData[key].known));
      }

      dispatch({
        type: SET_VOCABLES,
        vocables: loadedVocables,
      });
    } catch (error) {
      throw error;
    }
  };
};

export const deleteVocable = (id) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch("https://vocabeltasks.firebaseio.com/vocables/" + id + ".json", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Something went wrong while deleteing the Vocable!");
      }

      dispatch({
        type: DELETE_VOCABLE,
        id: id,
      });
    } catch (error) {
      throw error;
    }
  };
};

export const addVocable = (wordENG, wordDE, known) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch("https://vocabeltasks.firebaseio.com/vocables.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wordENG: wordENG,
          wordDE: wordDE,
          known: known,
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong while uploading Vocable!");
      }

      const responseData = await response.json();

      dispatch({
        type: ADD_VOCABLE,
        data: {
          id: responseData.name,
          wordENG: wordENG,
          wordDE: wordDE,
          known: known,
        },
      });
    } catch (error) {
      throw error;
    }
  };
};

export const updateVocable = (id, wordENG, wordDE) => {
  return async (dispatch, getState) => {
    try {
      const response = await fetch("https://vocabeltasks.firebaseio.com/vocables/" + id + ".json", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          wordENG: wordENG,
          wordDE: wordDE,
        }),
      });

      if (!response.ok) {
        throw new Error("Something went wrong while updating Vocable");
      }

      dispatch({
        type: UPDATE_VOCABLE,
        id: id,
        wordENG: wordENG,
        wordDE: wordDE,
      });
    } catch (error) {
      throw error;
    }
  };
};
