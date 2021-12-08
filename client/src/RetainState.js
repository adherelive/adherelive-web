import { SIGNING_COMPLETED } from "./modules/auth";
import { SIGNING_COMPLETED_WITH_ERROR } from "./modules/auth";

import {
  GOOGLE_SIGNING_COMPLETED,
  GOOGLE_SIGNING_COMPLETED_WITH_ERROR,
} from "./modules/auth";

import { SIGNING, SIGNING_UP } from "./modules/auth";
import { SIGNING_UP_COMPLETED } from "./modules/auth";
import { SIGNING_UP_COMPLETED_WITH_ERROR } from "./modules/auth";

import { VALIDATING_LINK } from "./modules/auth";
import { VALIDATING_LINK_COMPLETED } from "./modules/auth";
import { VALIDATING_LINK_COMPLETED_WITH_ERROR } from "./modules/auth";

import { GETTING_INITIAL_DATA } from "./modules/auth";
import { GETTING_INITIAL_DATA_COMPLETED } from "./modules/auth";
import { GETTING_INITIAL_DATA_COMPLETED_WITH_ERROR } from "./modules/auth";

import { RESET_ERROR } from "./modules/auth";
import { RESET_PASSWORD_LINK_COMPLETED } from "./modules/auth";
// import { CLEAR_MSG } from "./modules/successMsg";

// import {
//   FETCHING_ALL_SPECIALITY_DATA,
//   FETCHING_ALL_SPECIALITY_DATA_COMPLETED,
//   FETCHING_ALL_SPECIALITY_DATA_COMPLETED_WITH_ERROR
// } from "./modules/speciality";
// import {
//   FETCHING_ALL_PHARMA_CO_DATA,
//   FETCHING_ALL_PHARMA_CO_DATA_COMPLETED,
//   FETCHING_ALL_PHARMA_CO_DATA_COMPLETED_WITH_ERROR
// } from "./modules/pharmaCompanies";

const retainState = (store) => (next) => (action) => {
  const storeInstance = store.getState();
  const { auth: { authenticated = false } = {} } = storeInstance;
  if (authenticated) {
    next(action);
  } else {
    switch (action.type) {
      case SIGNING:
      case SIGNING_COMPLETED:
      case SIGNING_COMPLETED_WITH_ERROR:
      case SIGNING_UP:
      case SIGNING_UP_COMPLETED:
      case SIGNING_UP_COMPLETED_WITH_ERROR:
      case VALIDATING_LINK:
      case VALIDATING_LINK_COMPLETED:
      case VALIDATING_LINK_COMPLETED_WITH_ERROR:
      case GETTING_INITIAL_DATA:
      case GETTING_INITIAL_DATA_COMPLETED:
      case GETTING_INITIAL_DATA_COMPLETED_WITH_ERROR:
      case RESET_ERROR:
      case RESET_PASSWORD_LINK_COMPLETED:
      case GOOGLE_SIGNING_COMPLETED:
      case GOOGLE_SIGNING_COMPLETED_WITH_ERROR:
        // case FETCHING_ALL_SPECIALITY_DATA:
        // case FETCHING_ALL_SPECIALITY_DATA_COMPLETED:
        // case FETCHING_ALL_SPECIALITY_DATA_COMPLETED_WITH_ERROR:
        // case FETCHING_ALL_PHARMA_CO_DATA:
        // case FETCHING_ALL_PHARMA_CO_DATA_COMPLETED:
        // case FETCHING_ALL_PHARMA_CO_DATA_COMPLETED_WITH_ERROR:
        // case CLEAR_MSG:
        return next(action);
      default:
        return;
    }
  }
};
export default retainState;
