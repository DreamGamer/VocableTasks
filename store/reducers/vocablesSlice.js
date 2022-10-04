import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import Card from "../../models/Card";
import thunk from "redux-thunk";
import Bugsnag from "@bugsnag/react-native";

const TAG = "[Vocables Slice]";

const initialState = {
  cards: [],
  loadingCards: false,
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
      state.cards = action.payload;
      state.loadingCards = false;
    });
    builder.addCase(updateCards.rejected, (state, action) => {
      console.warn(TAG, "Error in updateCards: ", action.error);
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
        const newCard = new Card(card.id, card.flag, card.language, card.lastModified);
        if (cardIndex >= 0) {
          updatedCards[cardIndex] = newCard;
        } else {
          updatedCards.push(newCard);
        }
        break;
      case "removed":
        if (cardIndex >= 0) {
          updatedCards.splice(cardIndex, 1);
        }
        break;
      default:
        console.warn(TAG, `Unkown type '${card.type}' of card ${card.id}`);
        Bugsnag.notify(new Error(`Unkown type '${card.type}' of card ${card.id}`));
        break;
    }
  });

  return updatedCards;
});
