import BaseUserFavourites from "../../../services/userFavourites";
import userFavouritesService from "../../../services/userFavourites/userFavourites.service";
import {FAVOURITE_TYPE} from "../../../../constant";
import MedicineWrapper from "../medicine";

class UserFavouritesWrapper extends BaseUserFavourites {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {
            id,
            user_category_id,
            user_category_type,
            marked_favourite_id,
            marked_favourite_type,
            details,
            created_at,
            updated_at,
            deleted_at
        } = _data || {};

        return {
            basic_info: {
                id,
                user_category_id,
                user_category_type,
                marked_favourite_id,
                marked_favourite_type,
            },
            details,
            created_at,
            updated_at,
            deleted_at
        };
    };

    getReferenceInfo = async () => {
        const {
            getMarkedFavouriteType, getMarkedFavouriteId,
            getBasicInfo
        } = this;

        let marked_favourites_data = {};
        const basic_info = getBasicInfo();

        switch (getMarkedFavouriteType()) {
            case FAVOURITE_TYPE.MEDICINE:
                const id = getMarkedFavouriteId();
                const medicine = await MedicineWrapper(null, id);
                const ref_info = await medicine.getAllInfo();
                const medicineId = await medicine.getMedicineId();
                marked_favourites_data[medicineId] = {...ref_info};
                break;
            default:
                break;
        }

        return {
            ...basic_info,
            marked_favourites_data
        };
    };
}

export default async (data = null, id = null) => {
    if (data) {
        return new UserFavouritesWrapper(data);
    }
    const favourite = await userFavouritesService.getByData({id});
    return new UserFavouritesWrapper(favourite);
};