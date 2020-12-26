import Vocable from "../../models/Vocable";

const TAG = "[Vocables Action]: ";

import * as authActions from "./auth";

export const ADD_VOCABLE = "ADD_VOCABLE";
export const SET_VOCABLES = "SET_VOCABLES";
export const DELETE_VOCABLE = "DELETE_VOCABLE";
export const UPDATE_VOCABLE = "UPDATE_VOCABLE";

export const fetchVocables = () => {
    return async (dispatch, getState) => {
        try {
            await dispatch(authActions.updateToken());
            const idToken = await getState().auth.idToken;
            const UID = await getState().auth.UID;

            const response = await fetch("https://vocabeltasks.firebaseio.com/vocables/" + UID + ".json?auth=" + idToken, {
                method: "GET",
            });

            if (!response.ok) {
                const errorResponseData = await response.json();
                console.log(TAG + "Error while fetching vocables " + JSON.stringify(errorResponseData));
                throw new Error("Something went wrong while fetching Vocables!");
            }

            const responseData = await response.json();
            const loadedVocables = [];

            for (const key in responseData) {
                loadedVocables.push(new Vocable(key, responseData[key].wordENG, responseData[key].wordDE, responseData[key].known));
            }
            console.log(TAG + "Successfully loaded vocables.")

            dispatch({
                type: SET_VOCABLES,
                vocables: loadedVocables,
            });
        } catch (error) {
            throw error;
        }
    };
};

export const deleteVocable = id => {
    return async (dispatch, getState) => {
        try {
            const token = await getState().auth.token;
            const UID = await getState().auth.UID;
            const response = await fetch("https://vocabeltasks.firebaseio.com/vocables/" + UID + "/" + id + ".json?auth=" + token, {
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
            const token = getState().auth.token;
            const UID = getState().auth.UID;

            const response = await fetch("https://vocabeltasks.firebaseio.com/vocables/" + UID + ".json?auth=" + token, {
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
            const token = getState().auth.token;
            const UID = getState().auth.UID;

            const response = await fetch("https://vocabeltasks.firebaseio.com/vocables/" + UID + "/" + id + ".json?auth=" + token, {
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
