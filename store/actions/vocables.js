import Vocable from "../../models/Vocable";

export const ADD_VOCABLE = "ADD_VOCABLE";
export const SET_VOCABLES = "SET_VOCABLES";


export const fetchVocables = () => {
    return async (dispatch, getState) => {
        try {
            const response = await fetch("https://vocabeltasks.firebaseio.com/vocables.json", {
                method: "GET"
            });

            if (!response.ok) {
                throw new Error("Something went wrong while fetching Vocables!");
            }

            const responseData = await response.json();
            const loadedVocables = [];

            for (const key in responseData) {
                loadedVocables.push(new Vocable(responseData[key].wordENG, responseData[key].wordDE, responseData[key].known));
            }

            dispatch({
                type: SET_VOCABLES, vocables: loadedVocables
            })

        } catch (error) {
            
        }
    }
};


export const addVocable = (wordENG, wordDE, known) => {
    return async (dispatch, getState) => {
        try {
            const response = await fetch("https://vocabeltasks.firebaseio.com/vocables.json", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    wordENG: wordENG,
                    wordDE: wordDE,
                    known: known
                })
            });

            if (!response.ok) {
                throw new Error("Something went wrong while uploading Vocable!");
            }

        } catch (error) {
            throw new Error(error.message)
        }


        dispatch({
            type: ADD_VOCABLE, data: {
                wordENG: wordENG,
                wordDE: wordDE,
                known: known
            }
        })
    }
};