import BaseDoctor from "../../../services/doctor";
import doctorService from "../../../services/doctor/doctor.service";
import {completePath} from "../../../helper/filePath";
import SpecialityWrapper from "../../mobile/speciality";


class DoctorWrapper extends BaseDoctor {
    constructor(data) {
        super(data);
    }

    getReferenceInfo = async () => {
        const {_data} = this;
        const {speciality} = _data || {};

        if(speciality) {
            const specialityDetails = await SpecialityWrapper(speciality);

            console.log("speciality ----> ", _data);

            return {
                // doctors: {
                //   [getDoctorId()] : getBasicInfo()
                // },
                specialities: {
                    [specialityDetails.getSpecialityId()]: specialityDetails.getBasicInfo()
                }
            }
        } else {
            return {};
        }
    };

    getBasicInfo = () => {
        const {_data} = this;
        const {
            id,
            user_id,
            gender,
            first_name,
            middle_name,
            last_name,
            city,
            speciality_id,
            qualifications,
            activated_on,
            profile_pic
        } = _data || {};
        return {
            basic_info: {
                id,
                user_id,
                gender,
                first_name,
                middle_name,
                last_name,
                city,
                speciality_id,
                profile_pic: completePath(profile_pic)
            },
            qualifications,
            activated_on
        };
    }

    getAllInfo = () => {
        const {_data} = this;
        const {
            id,
            user_id,
            gender,
            first_name,
            middle_name,
            last_name,
            qualifications,
            activated_on,
            profile_pic,
            city,
            speciality_id
        } = _data || {};

        return {
            basic_info: {
                id,
                user_id,
                gender,
                first_name,
                middle_name,
                last_name,
                speciality_id,
                profile_pic: completePath(profile_pic)
            },
            city,
            qualifications,
            activated_on
        };
    };
}

export default async (data = null, userId = null) => {
    if(data) {
        return new DoctorWrapper(data);
    }
    const doctor = await doctorService.getDoctorByData({user_id: userId});
    return new DoctorWrapper(doctor);
}