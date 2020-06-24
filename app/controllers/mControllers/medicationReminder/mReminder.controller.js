import Controller from "../../index";
import moment from "moment";
import medicationReminderService from "../../../services/medicationReminder/mReminder.service";
import MobileMReminderWrapper from "../../../ApiWrapper/mobile/medicationReminder";
import MedicineApiWrapper from "../../../ApiWrapper/mobile/medicine";
import {
  EVENT_STATUS,
  EVENT_TYPE,
  REPEAT_TYPE,
  DAYS_MOBILE,
  MEDICATION_TIMING,
  DOSE_AMOUNT,
  DOSE_UNIT,
  CUSTOM_REPEAT_OPTIONS
} from "../../../../constant";
import Log from "../../../../libs/log";
// import { Proxy_Sdk } from "../../proxySdk";
import medicineService from "../../../services/medicine/medicine.service";;

const FILE_NAME = "MOBILE - MEDICATION REMINDER CONTROLLER";
const Logger = new Log(FILE_NAME);

const KEY_REPEAT_TYPE = "repeat_type";
const KEY_DAYS = "days";
const KEY_TIMING = "timings";
const KEY_DOSE = "dose";
const KEY_UNIT = "dose_unit";
const KEY_CUSTOM_REPEAT_OPTIONS = "custom_repeat_options";

const medicationReminderDetails = {
  [KEY_REPEAT_TYPE]: REPEAT_TYPE,
  [KEY_DAYS]: DAYS_MOBILE,
  [KEY_TIMING]: MEDICATION_TIMING,
  [KEY_DOSE]: DOSE_AMOUNT,
  [KEY_UNIT]: DOSE_UNIT,
  [KEY_CUSTOM_REPEAT_OPTIONS]: CUSTOM_REPEAT_OPTIONS
};

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
        repeat_days = [],
        repeat_interval = 0,
        medicine_id,
        quantity,
        strength,
        unit,
        when_to_take,
        medication_stage = "",
        description,
        start_time
      } = body;
      const { userId, userData: { category } = {} } = userDetails || {};

      // const {text: doseUnit} = DOSE_UNIT[unit] || {};
      // const {text, time} = MEDICATION_TIMING[when_to_take] || {};
      // const whenToTake = `${text}(${time})`;

      const repeatDays = repeat_days.map(day => day.substring(0,3));

      // const medicineDetails = await medicineService.getMedicineByData({id: medicine_id});

      // const medicineWrapper = new MedicineApiWrapper(medicineDetails);
      // const medicine = "test medicine";

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
          repeat: REPEAT_TYPE[repeat] || "weekly",
          repeat_days: repeatDays,
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

      const mReminderApiWrapper = await MobileMReminderWrapper(
        mReminderDetails
      );

      const eventScheduleData = {
        event_type: EVENT_TYPE.MEDICATION_REMINDER,
        event_id: mReminderApiWrapper.getMReminderId(),
        data: mReminderApiWrapper.getExistingData(),
        status: EVENT_STATUS.PENDING,
        start_time,
        end_time: start_time
      };

      return this.raiseSuccess(
        res,
        200,
        {
          ...mReminderApiWrapper.getBasicInfo()
        },
        "medication reminder added successfully"
      );

      // await Proxy_Sdk.scheduleEvent({data: eventScheduleData});
    } catch (error) {
      console.log("Add m-reminder error ----> ", error);
      return this.raiseServerError(
        res,
        500,
        error.message,
        "something went wrong"
      );
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
      let medicineApiData = {};
      let medicineId = [];

      await medicationDetails.forEach(async medication => {
        const medicationWrapper = await MobileMReminderWrapper(medication);
        medicationApiData[medicationWrapper.getMReminderId()] = medicationWrapper.getBasicInfo();
        medicineId.push(medicationWrapper.getMedicineId());
      });

      // Logger.debug("medicineId", medicineId.filter(id => !medicineId.includes(id)));

      const medicineData = await medicineService.getMedicineByData({
        id: medicineId
      });

      // Logger.debug("medicineData", medicineData);

      const medicineWrapper = await MedicineApiWrapper(medicineData);
      
      return raiseSuccess(
        res,
        200,
        {
          medications: {
            ...medicationApiData
          },
          ...medicineWrapper.getBasicInfoBulk(),
        },
        "medications fetched successfully"
      );
    } catch(error) {
      // Logger.debug("500 error ", error);
      return raiseServerError(res);
    }
  };

  update = async (req, res) => {
    try {
      const { body, userDetails, params: { id } = {} } = req;
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
        participant_id
      } = body;
      const { userId, userData: { category } = {} } = userDetails || {};
      const medicineData = await medicineService.getMedicineByData({
        id: medicine_id
      });

      // Logger.debug("medicineDetails --> ", medicineDetails);

      const medicineApiWrapper = await MedicineApiWrapper(medicineData);

      const dataToSave = {
        participant_id, // todo: patient_id
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

      const mReminderDetails = await medicationReminderService.updateMedication(
        dataToSave,
        id
      );


      const updatedMedicationDetails = await medicationReminderService.getMedication({participant_id});

      // Logger.debug("updatedMedicationDetails --> ", updatedMedicationDetails);

      const medicationApiDetails = await MobileMReminderWrapper(updatedMedicationDetails);

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
            [medicationApiDetails.getMReminderId()]: {
                ...medicationApiDetails.getBasicInfo()
            }
          },
          medicines: {
            [medicineApiWrapper.getMedicineId()]: {
              ...medicineApiWrapper.getBasicInfoBulk()
            }
          }
        },
        "medication reminder updated successfully"
      );

      // await Proxy_Sdk.scheduleEvent({data: eventScheduleData});
    } catch (error) {
      console.log("update m-reminder error ----> ", error);
      return this.raiseServerError(res, 500, error.message, "something went wrong");
    }
  };

  delete = async (req, res) => {
    const {raiseSuccess, raiseServerError} = this;
    try {
      const {params: {id} = {}} = req;

      const medicationDetails = await medicationReminderService.deleteMedication(id);

      // console.log("712367132 medicationDetails --> ", medicationDetails);
      // Logger.debug("medication details", medicationDetails);
      
      return raiseSuccess(
        res,
        200,
        {},
        "medication deleted successfully"
      );
    } catch(error) {
      return raiseServerError(res);
    }
  };
}

export default new MobileMReminderController();
