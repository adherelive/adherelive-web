import BaseDoctorQualification from "../../../services/doctorQualifications";
import doctorQualificationService from "../../../services/doctorQualifications/doctorQualification.service";

class DoctorQualificationWrapper extends BaseDoctorQualification {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {} = _data || {};
        return {
            basic_info: {

            }
        };
    };
}

export default async (data = null, id = null) => {
    if(data) {
        return new DoctorQualificationWrapper(data);
    }
    const doctorQualification = await doctorQualificationService.getQualificationById(id);
    return new DoctorQualificationWrapper(doctorQualification.get());
};