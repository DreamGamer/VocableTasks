import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Card from "../../models/Card";
import thunk from "redux-thunk";
import Bugsnag from "@bugsnag/react-native";
import Vocable from "../../models/Vocable";

const TAG = "[Vocables Slice]";

const initialState = {
  cards: [],
  vocables: [],
  loadingCards: false,
  loadingVocables: false,
};

const vocablesSlice = createSlice({
  name: "vocables",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateCards.pending, (state, action) => {
      state.loadingCards = true;
    });
    builder.addCase(updateCards.fulfilled, (state, action) => {
      const sortedCards = action.payload.sort((a, b) => {
        const aTime = a.lastModified ? a?.lastModified.toMillis() : 0;
        const bTime = b.lastModified ? b?.lastModified.toMillis() : 0;
        return bTime - aTime;
      });
      state.cards = sortedCards;
      state.loadingCards = false;
    });
    builder.addCase(updateCards.rejected, (state, action) => {
      console.warn(TAG, "Error in updateCards: ", action.error);
      Bugsnag.notify(action.error);
    });

    builder.addCase(updateVocables.pending, (state, action) => {
      state.loadingVocables = true;
    });
    builder.addCase(updateVocables.fulfilled, (state, action) => {
      const updatedVocables = state.vocables;
      const cardId = action.payload.cardId;
      const cardIndex = updatedVocables.findIndex((state) => state.cardId === cardId);

      const sortedVocables = action.payload.updatedVocables.sort((a, b) => {
        if (a.firstWord < b.firstWord) return -1;
        else if (a.firstWord > b.firstWord) return 1;

        return 0;
      });

      if (cardIndex >= 0) {
        updatedVocables[cardIndex].vocables = sortedVocables;
      } else {
        updatedVocables.push({ cardId, vocables: sortedVocables });
      }

      state.vocables = updatedVocables;
      state.loadingVocables = false;
    });
    builder.addCase(updateVocables.rejected, (state, action) => {
      console.warn(TAG, "Error in updateVocables: ", action.error);
      Bugsnag.notify(action.error);
    });
  },
});

export const { UPDATECARDS } = vocablesSlice.actions;
export default vocablesSlice.reducer;

/**
 * @param {Array} newCards And array with Cards (id, flag, language, lastModified)
 */

export const updateCards = createAsyncThunk("vocables/updateCardsStatus", async (newCards, thunkAPI) => {
  const updatedCards = [...thunkAPI.getState().vocables.cards];

  await newCards.forEach((card) => {
    const cardIndex = updatedCards.findIndex((state) => state.id === card.id);

    switch (card.type) {
      case "modified":
      case "added":
        const newCard = new Card(card.id, card.flag, card.language, card.created, card.lastModified);
        if (cardIndex >= 0) {
          console.info(TAG, `Updating card '${card.language}' with id '${card.id}'`);
          updatedCards[cardIndex] = newCard;
        } else {
          console.info(TAG, `Adding card '${card.language}' with id '${card.id}'`);
          updatedCards.push(newCard);
        }
        break;
      case "removed":
        if (cardIndex >= 0) {
          updatedCards.splice(cardIndex, 1);
        }
        break;
      default:
        console.warn(TAG, `Unkown type '${card.type}' of cardId '${card.id}'`);
        Bugsnag.notify(new Error(`Unkown type '${card.type}' of card ${card.id}`));
        break;
    }
  });

  return updatedCards;
});

export const updateVocables = createAsyncThunk("vocables/updateVocablesStatus", async ({ cardId, newVocables }, thunkAPI) => {
  const vocables = thunkAPI.getState().vocables.vocables;
  const cardIndex = vocables.findIndex((state) => state.cardId === cardId);
  const updatedVocables = cardIndex >= 0 ? vocables[cardIndex].vocables.slice() : [];

  await newVocables.forEach((vocable) => {
    const vocableIndex = updatedVocables.findIndex((state) => state.id === vocable.id);

    switch (vocable.type) {
      case "modified":
      case "added":
        const newVocable = new Vocable(vocable.id, vocable.firstWord, vocable.secondWord);
        if (vocableIndex >= 0) {
          console.info(TAG, `Updating vocable '${vocable.id}' firstWord '${vocable.firstWord}' secondWord '${vocable.secondWord}'`);
          updatedVocables[vocableIndex] = newVocable;
        } else {
          console.info(TAG, `Adding vocable '${vocable.id}' firstWord '${vocable.firstWord}' secondWord '${vocable.secondWord}'`);
          updatedVocables.push(newVocable);
        }
        break;
      case "removed":
        if (vocableIndex >= 0) {
          updatedVocables.splice(vocableIndex, 1);
        }
        break;
      default:
        console.warn(TAG, `Unkown type '${vocable.type}' of cardId '${vocable.id}'`);
        Bugsnag.notify(new Error(`Unkown type '${vocable.type}' of card ${vocable.id}`));
        break;
    }
  });

  return { updatedVocables, cardId };
});
