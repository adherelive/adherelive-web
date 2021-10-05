import {
    GETTING_INITIAL_DATA,
    GETTING_INITIAL_DATA_COMPLETED,
    GETTING_INITIAL_DATA_COMPLETED_WITH_ERROR,
    GOOGLE_SIGNING_COMPLETED,
    GOOGLE_SIGNING_COMPLETED_WITH_ERROR,
    RESET_ERROR,
    RESET_PASSWORD_LINK_COMPLETED,
    SIGNING,
    SIGNING_COMPLETED,
    SIGNING_COMPLETED_WITH_ERROR,
    SIGNING_UP,
    SIGNING_UP_COMPLETED,
    SIGNING_UP_COMPLETED_WITH_ERROR,
    VALIDATING_LINK,
    VALIDATING_LINK_COMPLETED,
    VALIDATING_LINK_COMPLETED_WITH_ERROR
} from "./modules/auth";
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

const retainState = store => next => action => {
    const storeInstance = store.getState();
    const {auth: {authenticated = false} = {}} = storeInstance;
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
