import BaseSpeciality from "../../../services/speciality";
import specialityService from "../../../services/speciality/speciality.service";

class SpecialityWrapper extends BaseSpeciality {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {
            id,
            name
        } = _data || {};
        return {
            basic_info: {
                id,
                name
            },
        };
    }
}

export default async (data = null, id = null) => {
    if(data) {
        return new SpecialityWrapper(data);
    }
    const doctor = await specialityService.getSpecialityByData({id});
    return new SpecialityWrapper(doctor);
}