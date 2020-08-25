import BaseMedicationReminder from "../../../services/medicationReminder";
import mReminderService from "../../../services/medicationReminder/mReminder.service";

// API WRAPPERS
import MedicineWrapper from "../medicine";

class MReminderWrapper extends BaseMedicationReminder {
  constructor(data) {
    super(data);
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

  getReferenceInfo = async () => {
    const {getBasicInfo, _data} = this;
    const {medicine} = _data || {};
    const medicineData = await MedicineWrapper(medicine);

    return {
      medications: {
        [this.getMReminderId()]: getBasicInfo()
      },
      medicines: {
        [medicineData.getMedicineId()]: medicineData.getBasicInfo()
      }
    }
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new MReminderWrapper(data);
  }
  const medicationReminder = await mReminderService.getMedication({ id });
  return new MReminderWrapper(medicationReminder);
};
