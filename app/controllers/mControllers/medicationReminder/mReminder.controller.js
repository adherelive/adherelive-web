import Controller from "../../index";
import moment from "moment";
import medicationReminderService from "../../../services/medicationReminder/mReminder.service";
import carePlanService from "../../../services/carePlan/carePlan.service";

import MobileMReminderWrapper from "../../../ApiWrapper/mobile/medicationReminder";
import MedicineApiWrapper from "../../../ApiWrapper/mobile/medicine";
import CarePlanWrapper from "../../../ApiWrapper/mobile/carePlan";

import carePlanMedicationService from "../../../services/carePlanMedication/carePlanMedication.service";
import {
  EVENT_STATUS,
  EVENT_TYPE,
  REPEAT_TYPE,
  DAYS_MOBILE,
  MEDICATION_TIMING,
  DOSE_AMOUNT,
  DOSE_UNIT,
  CUSTOM_REPEAT_OPTIONS, MEDICINE_FORM_TYPE, USER_CATEGORY
} from "../../../../constant";
import Log from "../../../../libs/log";
// import { Proxy_Sdk } from "../../proxySdk";
import medicineService from "../../../services/medicine/medicine.service";
import {getCarePlanAppointmentIds, getCarePlanMedicationIds, getCarePlanSeverityDetails} from "../../carePlans/carePlanHelper";
import PatientWrapper from "../../../ApiWrapper/mobile/patient";
import doctorService from "../../../services/doctor/doctor.service";
import DoctorWrapper from "../../../ApiWrapper/mobile/doctor";
import MedicationJob from "../../../JobSdk/Medications/observer";
import NotificationSdk from "../../../NotificationSdk";

const FILE_NAME = "MOBILE - MEDICATION REMINDER CONTROLLER";
const Logger = new Log(FILE_NAME);

const KEY_REPEAT_TYPE = "repeat_type";
const KEY_DAYS = "days";
const KEY_TIMING = "timings";
const KEY_DOSE = "dose";
const KEY_UNIT = "dose_unit";
const KEY_CUSTOM_REPEAT_OPTIONS = "custom_repeat_options";
const KEY_MEDICINE_TYPE = "medicine_type";

const medicationReminderDetails = {
  [KEY_REPEAT_TYPE]: REPEAT_TYPE,
  [KEY_DAYS]: DAYS_MOBILE,
  [KEY_TIMING]: MEDICATION_TIMING,
  [KEY_DOSE]: DOSE_AMOUNT,
  [KEY_UNIT]: DOSE_UNIT,
  [KEY_CUSTOM_REPEAT_OPTIONS]: CUSTOM_REPEAT_OPTIONS,
  [KEY_MEDICINE_TYPE]: MEDICINE_FORM_TYPE
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
          medicine_type,
        quantity,
        strength,
        unit,
        when_to_take,
        medication_stage = "",
        description,
        start_time,
          critical = false,
        care_plan_id = null,
      } = body;
      const { userId, userData: { category } = {} } = userDetails || {};

      // const {text: doseUnit} = DOSE_UNIT[unit] || {};
      // const {text, time} = MEDICATION_TIMING[when_to_take] || {};
      // const whenToTake = `${text}(${time})`;

      const repeatDays = repeat_days.map(day => day.substring(0, 3));

      // const medicineDetails = await medicineService.getMedicineByData({id: medicine_id});

      // const medicineWrapper = new MedicineApiWrapper(medicineDetails);
      // const medicine = "test medicine";

      const dataToSave = {
        participant_id: patient_id, // todo: patient_id
        organizer_type: category,
        organizer_id: userId,
        medicine_id,
        description,
        start_date,
        end_date,
        details: {
          medicine_id,
          medicine_type,
          start_time: start_time ? start_time : moment(),
          end_time: start_time ? start_time : moment(),
          repeat: REPEAT_TYPE[repeat] || "weekly",
          repeat_days: repeatDays,
          repeat_interval,
          quantity,
          strength,
          unit,
          when_to_take,
          medication_stage,
          critical
        }
      };

      const mReminderDetails = await medicationReminderService.addMReminder(
        dataToSave
      );

      const mReminderApiWrapper = await MobileMReminderWrapper(
        mReminderDetails
      );

      if(care_plan_id) {
        const data_to_create = {
          care_plan_id,
          medication_id: mReminderDetails.get('id')
        }

        let newMedication = await carePlanMedicationService.addCarePlanMedication(data_to_create);
      }

      // to update later
      const patient = await PatientWrapper(null, patient_id);

      let categoryData = null;
      if(category === USER_CATEGORY.DOCTOR) {
        const doctor = await doctorService.getDoctorByData({user_id: userId});
        categoryData = await DoctorWrapper(doctor);
      }

      const eventData = {
        participants: [userId, patient.getUserId()],
        actor: {
          id: userId,
          details: {
            name: categoryData.getName(),
            category
          }
        }
      };

      const medicationJob = MedicationJob.execute(EVENT_STATUS.SCHEDULED, eventData);
      await NotificationSdk.execute(medicationJob);

      Logger.debug("medicationJob ---> ", medicationJob.getInAppTemplate());

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


  createCarePlanMedication = async (req, res) => {
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
        medicine_type,
        quantity,
        strength,
        unit,
        when_to_take,
        medication_stage = "",
        description,
        start_time,
          critical = false,
        care_plan_id= 0
      } = body;
      const { userId, userData: { category } = {} } = userDetails || {};

      const medicineDetails = await medicineService.getMedicineById(medicine_id);

      const medicineApiWrapper = await MedicineApiWrapper(medicineDetails);

      const dataToSave = {
        participant_id: patient_id, // todo: patient_id
        organizer_type: category,
        organizer_id: userId,
        medicine_id,
        description,
        start_date,
        end_date,
        details: {
          medicine_id,
          medicine_type,
          start_time: start_time ? start_time : moment(),
          end_time: start_time ? start_time : moment(),
          repeat,
          repeat_days,
          repeat_interval,
          quantity,
          strength,
          unit,
          when_to_take,
          medication_stage,
          critical
        }
      };

      const mReminderDetails = await medicationReminderService.addMReminder(
        dataToSave
      );

      let carePlanApiData = {};

      if(care_plan_id) {
        const data_to_create = {
          care_plan_id,
          medication_id: mReminderDetails.get('id')
        }

        const newMedication = await carePlanMedicationService.addCarePlanMedication(data_to_create);
        const carePlan= await carePlanService.getCarePlanById(care_plan_id);

        const carePlanAppointmentIds= await getCarePlanAppointmentIds(care_plan_id);
        const carePlanMedicationIds = await getCarePlanMedicationIds(care_plan_id);
        const carePlanSeverityDetails = await getCarePlanSeverityDetails(care_plan_id);
        const carePlanApiWrapper = await CarePlanWrapper(carePlan);

        carePlanApiData[
            carePlanApiWrapper.getCarePlanId()
            ] = {...carePlanApiWrapper.getBasicInfo(),...carePlanSeverityDetails,carePlanMedicationIds,carePlanAppointmentIds};
      }

      // to update later
      const patient = await PatientWrapper(null, patient_id);

      let categoryData = null;
      if(category === USER_CATEGORY.DOCTOR) {
        const doctor = await doctorService.getDoctorByData({user_id: userId});
        categoryData = await DoctorWrapper(doctor);
      }

      const eventData = {
        participants: [userId, patient.getUserId()],
        actor: {
          id: userId,
          details: {
            name: categoryData.getName(),
            category
          }
        },
        medicationId: mReminderDetails.get("id")
      };

      const medicationJob = MedicationJob.execute(EVENT_STATUS.SCHEDULED, eventData);
      await NotificationSdk.execute(medicationJob);

      Logger.debug("medicationJob ---> ", medicationJob.getInAppTemplate());


      return this.raiseSuccess(
        res,
        200,
        {
          care_plans: {...carePlanApiData},
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
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { id } = {} } = req;

      const medicationDetails = await medicationReminderService.getMedicationsForParticipant(
        { participant_id: id }
      );

      // console.log("712367132 medicationDetails --> ", medicationDetails);
      // Logger.debug("medication details", medicationDetails);

      let medicationApiData = {};
      let medicineId = [];

      for(const medication of medicationDetails) {
        const medicationWrapper = await MobileMReminderWrapper(medication);
        medicationApiData[
            medicationWrapper.getMReminderId()
            ] = medicationWrapper.getBasicInfo();
        medicineId.push(medicationWrapper.getMedicineId());
      }

      Logger.debug(
        "medicineId",
        medicationDetails
      );

      const medicineData = await medicineService.getMedicineById({
        id: medicineId
      });

      let medicineApiData = {};

      if(medicineData !== null) {
        const medicineWrapper = await MedicineApiWrapper(medicineData);
        medicineApiData[medicineWrapper.getMedicineId()] = medicineWrapper.getBasicInfo();
      }

      Logger.debug("medicineData", medicineData);

      return raiseSuccess(
        res,
        200,
        {
          medications: {
            ...medicationApiData
          },
          medicines: {
            ...medicineApiData
          }
        },
        "Medications fetched successfully"
      );
    } catch(error) {
      Logger.debug("500 error ", error);
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
        medicine_type,
        quantity,
        strength,
        unit,
        when_to_take,
        medication_stage = "",
        description,
        start_time,
        participant_id,
          critical = false
      } = body;
      const { userId, userData: { category } = {} } = userDetails || {};
      const medicineData = await medicineService.getMedicineById(medicine_id);

      // Logger.debug("medicineDetails --> ", medicineDetails);

      const medicineApiWrapper = await MedicineApiWrapper(medicineData);

      const dataToSave = {
        participant_id, // todo: patient_id
        organizer_type: category,
        organizer_id: userId,
        medicine_id,
        description,
        start_date,
        end_date,
        details: {
          medicine_id,
          medicine_type,
          start_time: start_time ? start_time : moment(),
          end_time: start_time ? start_time : moment(),
          repeat,
          repeat_days,
          repeat_interval,
          quantity,
          strength,
          unit,
          when_to_take,
          medication_stage,
          critical
        }
      };

      const mReminderDetails = await medicationReminderService.updateMedication(
        dataToSave,
        id
      );


      const updatedMedicationDetails = await medicationReminderService.getMedication({id});

      // Logger.debug("updatedMedicationDetails --> ", updatedMedicationDetails);

      const medicationApiDetails = await MobileMReminderWrapper(
        updatedMedicationDetails
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
            [medicationApiDetails.getMReminderId()]: {
              ...medicationApiDetails.getBasicInfo()
            }
          },
          medicines: {
            [medicineApiWrapper.getMedicineId()]: {
              ...medicineApiWrapper.getBasicInfo()
            }
          }
        },
        "Medication reminder updated successfully"
      );

      // await Proxy_Sdk.scheduleEvent({data: eventScheduleData});
    } catch (error) {
      console.log("update m-reminder error ----> ", error);
      return this.raiseServerError(
        res,
        500,
        error.message,
        "something went wrong"
      );
    }
  };

  delete = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const {params: {id} = {}} = req;
      const carePlanMedicationDetails= await carePlanMedicationService.deleteCarePlanMedicationByMedicationId(id);

      const medicationDetails = await medicationReminderService.deleteMedication(
        id
      );

      // console.log("712367132 medicationDetails --> ", medicationDetails);
      Logger.debug("medication details", medicationDetails);

      return raiseSuccess(res, 200, {}, "medication deleted successfully");
    } catch (error) {
      return raiseServerError(res);
    }
  };
}

export default new MobileMReminderController();
