import BaseMedicationReminder from "../../../services/medicationReminder";

import mReminderService from "../../../services/medicationReminder/mReminder.service";

import { OBJECT_NAME } from "../../../../constant";

class MReminderWrapper extends BaseMedicationReminder {
  constructor(data) {
    super(data);
    this._objectName = OBJECT_NAME.MEDICATION;
  }

  getBasicInfo = () => {
    const { _data } = this;
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
      basic_info: {
        id,
        description,
        details,
        start_date,
        end_date,
      },
      organizer: {
        id: organizer_id,
        category: organizer_type,
      },
      participant_id,
      rr_rule,
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new MReminderWrapper(data);
  }
  const medicationReminder = await mReminderService.getMedication({ id });
  return new MReminderWrapper(medicationReminder);
};
