import Logger from "../../../libs/log";
import {FAVOURITE_TYPE, MEDICAL_TEST} from "../../../constant";

// SERVICES
import FavoriteService from "../../services/userFavourites/userFavourites.service";

const Log = new Logger("APPOINTMENT > HELPER");

export const getFavoriteInDetails = async (userTypeData, typeDescription) => {
    try {

        // get favorites for "1" : medical_tests & "3" : radiology

        // MEDICAL_TESTS
        const medicalTestTypes = await medicalTestFavorites(userTypeData, typeDescription[MEDICAL_TEST]);

    } catch(error) {
        Log.debug("getFavouriteInDetails error", error);
        return null;
    }
};

const medicalTestFavorites = async (userTypeData, types) => {
    try {
        const {id: user_category_id, category: user_category_type} = userTypeData || {};
        const allMedicalTestFavorites = await FavoriteService.getAllFavourites({
            user_category_id,
            user_category_type,
            marked_favourite_type: FAVOURITE_TYPE.MEDICAL_TESTS
        }) || [];

        
    } catch(error) {
        Log.debug("medicalTestFavorites error", error);
    }
};