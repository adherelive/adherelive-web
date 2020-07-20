import BaseDoctorClinic from "../../../services/doctorClinics";
import doctorClinicsService from "../../../services/doctorClinics/doctorClinics.service";

class DoctorClinicWrapper extends BaseDoctorClinic {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {
            id,
            doctor_id,
            name,
            location,
            details
        } = _data || {};

        const {time_slots} = details || {};

        let filteredTimeSlot = {};

        Object.keys(time_slots).map(day => {
            let slots = [];
           time_slots[day].forEach(slot => {
               const {startTime, endTime} = slot || {};
               if(startTime !== "" && endTime !== "") {
                   slots.push(slot);
               }
           });
           filteredTimeSlot[day] = slots;
        });
        return {
            basic_info: {
                id,
                doctor_id,
                name,
            },
            location,
            details : {
                ...details,
                time_slots: filteredTimeSlot
            }
        };
    };
}

export default async (data = null, id = null) => {
    if(data) {
        return new DoctorClinicWrapper(data);
    }
    const doctorClinic = await doctorClinicsService.getClinicById(id);
    return new DoctorClinicWrapper(doctorClinic.get());
};