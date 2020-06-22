import Controller from "../index";
import moment from "moment";
import medicationReminderService from "../../services/medicationReminder/mReminder.service";
import medicineService from "../../services/medicine/medicine.service";

import MedicationWrapper from "../../ApiWrapper/web/medicationReminder";
import MedicineWrapper from "../../ApiWrapper/web/medicine";
import {
  CUSTOM_REPEAT_OPTIONS,
  DAYS,
  DOSE_AMOUNT,
  DOSE_UNIT,
  EVENT_STATUS,
  EVENT_TYPE,
  MEDICATION_TIMING,
  REPEAT_TYPE
} from "../../../constant";
import Log from "../../../libs/log";
import { Proxy_Sdk } from "../../proxySdk";
// import medicineService from "../../services/medicines/medicine.service";

const FILE_NAME = "WEB - MEDICATION REMINDER CONTROLLER";
const Logger = new Log(FILE_NAME);

const KEY_REPEAT_TYPE = "repeat_type";
const KEY_DAYS = "days";
const KEY_TIMING = "timings";
const KEY_DOSE = "dose";
const KEY_UNIT = "dose_unit";
const KEY_CUSTOM_REPEAT_OPTIONS = "custom_repeat_options";

const medicationReminderDetails = {
  [KEY_REPEAT_TYPE]: REPEAT_TYPE,
  [KEY_DAYS]: DAYS,
  [KEY_TIMING]: MEDICATION_TIMING,
  [KEY_DOSE]: DOSE_AMOUNT,
  [KEY_UNIT]: DOSE_UNIT,
  [KEY_CUSTOM_REPEAT_OPTIONS]: CUSTOM_REPEAT_OPTIONS
};

class MReminderController extends Controller {
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

      const medicineDetails = await medicineService.getMedicineById(medicine_id);

      // Logger.debug("medicineDetails --> ", medicineDetails);

      const medicineApiWrapper = await MedicineWrapper(medicineDetails);

      const dataToSave = {
        participant_id: patient_id, // todo: patient_id
        organizer_type: category,
        organizer_id: userId,
        description,
        start_date,
        end_date,
        details: {
          medicine_id,
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

      // const eventScheduleData = {
      //   event_type: EVENT_TYPE.MEDICATION_REMINDER,
      //   event_id: mReminderDetails.id,
      //   data: mReminderDetails.getBasicInfo,
      //   status: EVENT_STATUS.PENDING,
      //   start_time,
      //   end_time: start_time
      // };

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
          },
          medicines: {
            [medicineApiWrapper.getMedicineId()]: {
              ...medicineApiWrapper.getBasicInfo()
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

  getMedicationDetails = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      // Logger.debug("test", medicationReminderDetails);
      return raiseSuccess(
          res,
          200,
          {
            ...medicationReminderDetails
          },
          "create medication basic details"
      );
    } catch (error) {
      console.log("Get m-reminder details error ----> ", error);
      return raiseServerError(res, 500, error.message, "something went wrong");
    }
  };

  getMedicationForId = async (req, res) => {
    const {raiseSuccess, raiseServerError} = this;
    try {
      const {params: {id} = {}} = req;

      const medicationDetails = await medicationReminderService.getMedicationsForParticipant({participant_id : id});

      // console.log("712367132 medicationDetails --> ", medicationDetails);
      // Logger.debug("medication details", medicationDetails);

      let medicationApiData = {};

      await medicationDetails.forEach(async medication => {
        const medicationWrapper = await MedicationWrapper(medication);
        medicationApiData[medicationWrapper.getMReminderId()] = medicationWrapper.getBasicInfo();
      });
      
      return raiseSuccess(
        res,
        200,
        {
          medications: {
            ...medicationApiData
          }
        },
        "medications fetched successfully"
      );
    } catch(error) {
      return raiseServerError(res);
    }
  };
}

export default new MReminderController();