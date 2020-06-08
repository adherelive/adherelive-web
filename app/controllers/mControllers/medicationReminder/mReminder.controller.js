import Controller from "../../index";
import moment from "moment";
import medicationReminderService from "../../../services/medicationReminder/mReminder.service";
import { EVENT_STATUS, EVENT_TYPE } from "../../../../constant";
// import { Proxy_Sdk } from "../../proxySdk";
// import medicineService from "../../services/medicines/medicine.service";

class MobileMReminderController extends Controller {
    constructor() {
        super();
    }

    create = async (req, res) => {
        try {
            const { body, userDetails, params: { patient_id } = {} } = req;
            // todo: get patient_id from url
            const {
                start_date,
                end_date,
                repeat,
                repeat_days,
                repeat_interval = 0,
                medicine_id,
                quantity,
                strength,
                unit,
                when_to_take,
                medication_stage = "",
                description,
                start_time,
            } = body;
            const { userId, userData: { category } = {} } = userDetails || {};

            // const medicineDetails = await medicineService.getMedicineById();
            const medicine = "test medicine";

            console.log(
                "222222222333333333333 patient_id     ->>>>>>>>>>>\n",
                category
            );

            const dataToSave = {
                participant_id: patient_id, // todo: patient_id
                organizer_type: category,
                organizer_id: userId,
                description,
                start_date,
                end_date,
                details: {
                    medicine,
                    start_time: start_time ? start_time : moment(),
                    end_time: start_time ? start_time : moment(),
                    repeat,
                    repeat_days,
                    repeat_interval,
                    quantity,
                    strength,
                    unit,
                    when_to_take,
                    medication_stage
                }
            };

            const mReminderDetails = await medicationReminderService.addMReminder(
                dataToSave
            );

            const eventScheduleData = {
                event_type: EVENT_TYPE.MEDICATION_REMINDER,
                event_id: mReminderDetails.id,
                data: mReminderDetails.getBasicInfo,
                status: EVENT_STATUS.PENDING,
                start_time,
                end_time: start_time
            };

            return this.raiseSuccess(
                res,
                200,
                {
                    medications: {
                        [mReminderDetails.getId]: {
                            basic_info: {
                                ...mReminderDetails.getBasicInfo
                            }
                        }
                    }
                },
                "medication reminder added successfully"
            );

            // await Proxy_Sdk.scheduleEvent({data: eventScheduleData});
        } catch (error) {
            console.log("Add m-reminder error ----> ", error);
            return this.raiseServerError(res, 500, error.message, "something went wrong");
        }
    };
}

export default new MobileMReminderController();
