import BaseProfile from "../../../services/profiles";
import profileService from "../../../services/profiles/profiles.service";

class MProfileWrapper extends BaseProfile {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {
            id,
            user_id,
            category_id,
            category_type,
            created_at,
            deleted_at,
            updated_at
        } = _data || {};

        return {
            basic_info: {
                id,
                user_id,
                category_id,
                category_type
            },
            updated_at,
            deleted_at,
            created_at
        };
    };
}

export default async (data = null, id = null) => {
    if(data) {
        return new MProfileWrapper(data);
    }
    const profile = await profileService.getProfileById(id);
    return new MProfileWrapper(profile);
}