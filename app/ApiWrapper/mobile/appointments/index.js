import BaseAppointment from "../../../services/appointment";

import appointmentService from "../../../services/appointment/appointment.service";

import { OBJECT_NAME } from "../../../../constant";

class MAppointmentWrapper extends BaseAppointment {
    constructor(id, data) {
        super(id, data);
        this._objectName = OBJECT_NAME.APPOINTMENT;
    }

    getBasicInfo = () => {
        const { _objectName, _appointmentId, _data } = this;
        const {
            id,
            participant_one_id,
            participant_one_type,
            participant_two_id,
            participant_two_type,
            organizer_id,
            organizer_type,
            description,
            details,
            start_date,
            end_date,
            rr_rule = ""
        } = _data || {};
        return {
            [_objectName]: {
                [_appointmentId]: {
                    basic_info: {
                        id,
                        description,
                        details,
                        start_date,
                        end_date
                    },
                    participant_one: {
                        id: participant_one_id,
                        category: participant_one_type
                    },
                    participant_two: {
                        id: participant_two_id,
                        category: participant_two_type
                    },
                    organizer: {
                        id: organizer_id,
                        category: organizer_type
                    },
                    rr_rule
                }
            }
        };
    };
}

export default async (id, data = null) => {
    if (data !== null) {
        return new MAppointmentWrapper(id, data);
    }
    const appointment = await appointmentService.getAppointment({ id });
    return new MAppointmentWrapper(appointment.get("id"), appointment.get());
};
