import BaseMedicationReminder from "../../../services/medicationReminder";

import mReminderService from "../../../services/medicationReminder/mReminder.service";

import { OBJECT_NAME } from "../../../../constant";

class MReminderWrapper extends BaseMedicationReminder {
    constructor(id, data) {
        super(id, data);
        this._objectName = OBJECT_NAME.MEDICATION;
    }

    getBasicInfo = () => {
        const { _objectName, _medicationReminderId, _data } = this;
        const {
            id,
            participant_id,
            organizer_type,
            organizer_id,
            description,
            start_date,
            end_date,
            details,
            rr_rule = "",
        } = _data || {};
        return {
            [_objectName]: {
                [_medicationReminderId]: {
                    basic_info: {
                        id,
                        description,
                        details,
                        start_date,
                        end_date
                    },
                    organizer: {
                        id: organizer_id,
                        category: organizer_type
                    },
                    participant_id,
                    rr_rule
                }
            }
        };
    };
}

export default async (id, data = null) => {
    if (data !== null) {
        return new MReminderWrapper(id, data);
    }
    const medicationReminder = await mReminderService.getMedication({ id });
    return new MReminderWrapper(medicationReminder.get("id"), medicationReminder.get());
};
