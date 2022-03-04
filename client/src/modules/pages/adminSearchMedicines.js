import { combineReducers } from "redux";
import search_public_medicines from "./searchPublic";
import search_private_medicines from "./searchPrivate";

const adminSearchMedicinesReducer = combineReducers({
  search_public_medicines,
  search_private_medicines,
});

export default (state, action) => {
  return adminSearchMedicinesReducer(state, action);
};
