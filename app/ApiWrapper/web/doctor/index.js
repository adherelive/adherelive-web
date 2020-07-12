import BaseDoctor from "../../../services/doctor";
import doctorService from "../../../services/doctor/doctor.service";


class DoctorWrapper extends BaseDoctor {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {
            id,
            user_id,
            gender,
            first_name,
            middle_name,
            last_name,
            address,
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
                address,
                profile_pic: profile_pic ? `${process.config.minio.MINIO_S3_HOST}/${process.config.minio.MINIO_BUCKET_NAME}${profile_pic}` : profile_pic,
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
            address,
            qualifications,
            activated_on,
            profile_pic,
        } = _data || {};

        console.log("PROFILE PIC ------------------------------------- ", profile_pic);
        return {
            basic_info: {
                id,
                user_id,
                gender,
                first_name,
                middle_name,
                last_name,
                address,
                profile_pic: profile_pic ? `${process.config.minio.MINIO_S3_HOST}/${process.config.minio.MINIO_BUCKET_NAME}${profile_pic}` : ""
            },
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