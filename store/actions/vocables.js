import Vocable from "../../models/Vocable";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import Bugsnag from "@bugsnag/react-native";

const TAG = "[Vocables Action]: ";

export const ADD_VOCABLE = "ADD_VOCABLE";
export const SET_VOCABLES = "SET_VOCABLES";
export const DELETE_VOCABLE = "DELETE_VOCABLE";
export const UPDATE_VOCABLE = "UPDATE_VOCABLE";
export const END_REACHED = "END_REACHED";

export const fetchVocables = () => {
    return async (dispatch, getState) => {
        try {
            const UID = auth().currentUser.uid;
            const lastVocable = await getState().vocables.vocables.pop();
            console.log(TAG + "Fetching Vocables");
            console.log(TAG + "Last Vocable:");
            console.log(lastVocable);

            await database()
                .ref(`vocables/${UID}`)
                .orderByChild("wordENG")
                .startAt(lastVocable ? lastVocable.wordENG : 0)
                .limitToFirst(40)
                .once("value")
                .then(snap => {
                    const responseData = snap.val();
                    const loadedVocables = [];
                    for (const key in responseData) {
                        loadedVocables.push(new Vocable(key, responseData[key].wordENG, responseData[key].wordDE, responseData[key].known));
                    }
                    console.log("LOADED VOCABLES: ");
                    console.log(loadedVocables);
                    console.log("-------");

                    if (loadedVocables.length < 2) {
                        dispatch(setEndReached(true));
                    }

                    dispatch({
                        type: SET_VOCABLES,
                        vocables: loadedVocables,
                    });
                })
                .catch(error => {
                    console.error(error);
                });
            /*

            const response = await fetch("https://vocabeltasks.firebaseio.com/vocables/" + UID + ".json?auth=" + idToken, {
                method: "GET",
            });

            if (!response.ok) {
                const errorResponseData = await response.json();
                console.log(TAG + "Error while fetching vocables " + JSON.stringify(errorResponseData));
                Bugsnag.notify(new Error(JSON.stringify(errorResponseData)));
                throw new Error("Something went wrong while fetching Vocables!");
            }

            const responseData = await response.json();
            const loadedVocables = [];

            for (const key in responseData) {
                loadedVocables.push(new Vocable(key, responseData[key].wordENG, responseData[key].wordDE, responseData[key].known));
            }
            console.log(TAG + "Successfully loaded vocables.");

            dispatch({
                type: SET_VOCABLES,
                vocables: loadedVocables,
            });
            */
        } catch (error) {
            console.warn(TAG + "Catched fatal error in fetchVocables: " + error);
            Bugsnag.notify(error);
            throw error;
        }
    };
};

export const setEndReached = bool => {
    return { type: END_REACHED, endReached: bool };
};

export const deleteVocable = id => {
    return async (dispatch, getState) => {
        try {
            const token = await getState().auth.idToken;
            const UID = await getState().auth.UID;
            const response = await fetch("https://vocabeltasks.firebaseio.com/vocables/" + UID + "/" + id + ".json?auth=" + token, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorResponseData = await response.json();
                console.log(TAG + "Error while deleting vocable " + JSON.stringify(errorResponseData));
                throw new Error("Something went wrong while deleteing the Vocable!");
            }

            dispatch({
                type: DELETE_VOCABLE,
                id: id,
            });
        } catch (error) {
            console.warn(TAG + "Catched fatal error in deleteVocable: " + error);
            Bugsnag.notify(error);
            throw error;
        }
    };
};

export const addVocable = (wordENG, wordDE, known) => {
    return async (dispatch, getState) => {
        try {
            const UID = auth().currentUser.uid;
            const englishVocableLowerCase = wordENG.toLowerCase();
            const germanVocableLowerCase = wordDE.toLowerCase();

            const engVocableFirstLetter = englishVocableLowerCase.charAt(0).toUpperCase() + englishVocableLowerCase.slice(1);
            const germanVocableFirstLetter = germanVocableLowerCase.charAt(0).toUpperCase() + germanVocableLowerCase.slice(1);

            const newReference = await database().ref(`vocables/${UID}`).push();

            await newReference
                .set({ wordENG: engVocableFirstLetter, wordDE: germanVocableFirstLetter, known: known })
                .then(() => {
                    console.info(TAG + `Successfully uploaded vocable '${englishVocableLowerCase}' to '${newReference.key}'`);
                })
                .catch(error => {
                    console.log("Error:");
                    console.log(error);
                });

            const currentTime = firestore.Timestamp.now().toDate();

            const vocableFirestoreDatabase = firestore().collection("vocables").doc(englishVocableLowerCase);

            // Upload the vocables to Firestore and update timesSearched
            // and list the word in database to find it easier
            await vocableFirestoreDatabase
                .get()
                .then(data => {
                    if (data.exists) {
                        vocableFirestoreDatabase
                            .update({ timesSearched: firestore.FieldValue.increment(1), lastUpdate: currentTime })
                            .then(() => {
                                console.log(TAG + `Successfully updated timesSearched for Vocable '${engVocableFirstLetter}'`);
                            })
                            .catch(error => {
                                console.log(TAG + "Catched Error: " + error);
                                Bugsnag.notify(error);
                            });
                    } else {
                        vocableFirestoreDatabase
                            .set({ timesSearched: firestore.FieldValue.increment(1), english: engVocableFirstLetter, german: germanVocableFirstLetter, firstAdd: currentTime })
                            .then(() => {
                                console.log(TAG + `Successfully added Vocable en: '${engVocableFirstLetter}' | de: '${germanVocableFirstLetter}' to firestore`);
                            })
                            .catch(error => {
                                console.log(TAG + "Catched Error: " + error);
                                Bugsnag.notify(error);
                            });
                    }
                })
                .catch(error => {
                    console.log("Error: " + error);
                });

            dispatch({
                type: ADD_VOCABLE,
                data: {
                    id: newReference.key,
                    wordENG: wordENG,
                    wordDE: wordDE,
                    known: known,
                },
            });
        } catch (error) {
            console.warn(TAG + "Catched fatal error in addVocable: " + error);
            Bugsnag.notify(error);
            throw error;
        }
    };
};

export const updateVocable = (id, wordENG, wordDE) => {
    return async (dispatch, getState) => {
        try {
            const UID = auth().currentUser.uid;
            await database().ref(`vocables/${UID}/${id}`).update({
                wordENG: wordENG,
                wordDE: wordDE,
            });

            dispatch({
                type: UPDATE_VOCABLE,
                id: id,
                wordENG: wordENG,
                wordDE: wordDE,
            });
        } catch (error) {
            console.warn(TAG + "Catched fatal error in updateVocable: " + error);
            Bugsnag.notify(error);
            throw error;
        }
    };
};
