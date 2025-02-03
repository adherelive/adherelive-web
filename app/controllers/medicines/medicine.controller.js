import Controller from "../index";

import medicineService from "../../services/medicine/medicine.service";
import AlgoliaService from "../../services/algolia/algolia.service";
import doctorService from "../../services/doctor/doctor.service";

import TemplateMedicationService from "../../services/templateMedication/templateMedication.service";
import MedicationService from "../../services/medicationReminder/mReminder.service";
import CarePlanMedicationService from "../../services/carePlanMedication/carePlanMedication.service";
import ScheduleEventService from "../../services/scheduleEvents/scheduleEvent.service";

import MedicineWrapper from "../../apiWrapper/web/medicine";
import DoctorWrapper from "../../apiWrapper/web/doctor";

import { createLogger } from "../../../libs/log";
import { EVENT_TYPE } from "../../../constant";

const log = createLogger("WEB MEDICINE CONTROLLER");

class MedicineController extends Controller {
  constructor() {
    super();
  }

  getAll = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query } = req;
      const { value } = query || {};

      // log.debug("value in req: ", value);
      const medicineDetails = await medicineService.search(value);

      if (medicineDetails.length > 0) {
        let medicineApiData = {};
        await medicineDetails.forEach(async (medicine) => {
          const medicineWrapper = await new MedicineWrapper(medicine);
          medicineApiData[medicineWrapper.getMedicineId()] =
            medicineWrapper.getBasicInfo();
        });

        return raiseSuccess(
          res,
          200,
          {
            medicines: {
              ...medicineApiData,
            },
          },
          "Medicine data fetched successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          `No medicine found with name including ${value}`
        );
      }
    } catch (error) {
      // log.debug("getAll 500 error: ", error);
      return raiseServerError(res);
    }
  };

  addMedicine = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      const { body = {}, userDetails = {} } = req;

      const algoliaService = new AlgoliaService();

      const {
        userCategoryData: { basic_info: { id: categoryId = null } = {} } = {},
      } = userDetails || {};

      const { name = "", type = "", generic_name = "" } = body;

      const new_medicine_data = {
        name,
        creator_id: categoryId,
        created_at: new Date(),
        type,
        public_medicine: false,
        details: { generic_name },
      };

      const medicineDetails = await medicineService.add(new_medicine_data);
      let medicineApiDetails = {};

      if (medicineDetails) {
        const medicine_id = medicineDetails.get("id");
        const response = await algoliaService.addNewMedicineData(medicine_id);
        medicineApiDetails = await MedicineWrapper(null, medicine_id);
      }

      return raiseSuccess(
        res,
        200,
        {
          medicines: {
            [medicineApiDetails.getMedicineId()]:
              medicineApiDetails.getBasicInfo(),
          },
        },
        "New medicine added successfully."
      );
    } catch (error) {
      log.debug("500 addMedicine error: ", error);
      return raiseServerError(res);
    }
  };

  addMedicineByAdmin = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      const { body } = req;

      const algoliaService = new AlgoliaService();
      const { name = "", type = "", generic_name = "" } = body || {};

      const new_medicine_data = {
        name,
        creator_id: null,
        created_at: new Date(),
        public_medicine: true,
        type,
        details: { generic_name },
      };

      const medicineDetails = await medicineService.add(new_medicine_data);
      let medicineApiDetails = {};

      if (medicineDetails) {
        const medicine_id = medicineDetails.get("id");
        const response = await algoliaService.addNewMedicineData(medicine_id);
        medicineApiDetails = await MedicineWrapper(null, medicine_id);
      }

      return raiseSuccess(
        res,
        200,
        {
          medicines: {
            [medicineApiDetails.getMedicineId()]:
              medicineApiDetails.getBasicInfo(),
          },
        },
        "New medicine added successfully."
      );
    } catch (error) {
      log.debug("500 addMedicine error: ", error);
      return raiseServerError(res);
    }
  };

  makeMedicinePublic = async (req, res) => {
    const { raiseServerError, raiseSuccess, raiseClientError } = this;
    try {
      const { params: { id: medicine_id = null } = {} } = req;

      if (!medicine_id) {
        return raiseClientError(res, 422, {}, "Invalid medicine selected.");
      }

      const algoliaService = new AlgoliaService();

      const medicineDetails = await medicineService.updateMedicine(
        { public_medicine: true },
        medicine_id
      );
      let medicineApiDetails = {};

      const updatedMedicineDetails = await medicineService.getMedicineById(
        medicine_id
      );
      if (updatedMedicineDetails) {
        medicineApiDetails = await MedicineWrapper(updatedMedicineDetails);
        const medicineId = medicineApiDetails.getMedicineId();
        const response = await algoliaService.updateMedicineData(medicineId);
      }

      return raiseSuccess(
        res,
        200,
        {
          medicines: {
            [medicineApiDetails.getMedicineId()]:
              medicineApiDetails.getBasicInfo(),
          },
        },
        "Medicine is made public to all doctors successfully."
      );
    } catch (error) {
      log.debug("500 makeMedicinePublic error: ", error);
      return raiseServerError(res);
    }
  };

  getMedicinesForAdmin = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { query } = req;
      const { value, offset = 0, public_medicine = 1 } = query || {};

      let doctorIds = [];
      let doctors = {};
      const doctorDetails = await doctorService.search(value);

      if (doctorDetails && doctorDetails.length > 0) {
        await doctorDetails.forEach(async (doctor) => {
          const doctorWrapper = await DoctorWrapper(doctor);
          doctorIds.push(doctorWrapper.getDoctorId());
        });
      }

      const limit = process.config.ADMIN_MEDICINE_ONE_PAGE_LIMIT;

      const offsetLimit = parseInt(limit, 10) * parseInt(offset, 10);
      const endLimit = parseInt(limit, 10);

      const publicMedicine = parseInt(public_medicine, 10) === 0 ? 0 : 1;

      const total_count = await medicineService.getMedicineCountForAdmin(
        value,
        publicMedicine,
        doctorIds
      );
      const medicineDetails = await medicineService.searchMedicineForAdmin(
        value,
        offsetLimit,
        endLimit,
        publicMedicine,
        doctorIds
      );
      log.debug("Get Medicines for Admin: ", {
        total_count,
        l: medicineDetails.length,
        medicineDetails,
        doctorIds,
        doctorDetails,
        value,
        offset,
        public_medicine,
      });

      const creatorIds = [];
      if (medicineDetails.length > 0) {
        let medicineApiData = {};
        await medicineDetails.forEach(async (medicine) => {
          const medicineWrapper = await new MedicineWrapper(medicine);
          medicineApiData[medicineWrapper.getMedicineId()] =
            medicineWrapper.getAllInfo();

          const creator_id = medicineWrapper.getCreatorId();

          if (creator_id) {
            creatorIds.push(creator_id);
          }
        });

        for (const id of creatorIds) {
          const doctorApiWrapper = await DoctorWrapper(null, id);
          doctors[doctorApiWrapper.getDoctorId()] =
            doctorApiWrapper.getBasicInfo();
        }

        return raiseSuccess(
          res,
          200,
          {
            total_count,
            page_size: limit,
            medicines: {
              ...medicineApiData,
            },
            doctors,
          },
          "Medicine data fetched successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          `No medicine found with name including ${value}`
        );
      }
    } catch (error) {
      log.debug("500 getMedicinesForAdmin error", error);
      return raiseServerError(res);
    }
  };

  deleteMedicine = async (req, res) => {
    const { raiseServerError, raiseSuccess, raiseClientError } = this;
    try {
      const { params: { id: medicine_id = null } = {} } = req;

      if (!medicine_id) {
        return raiseClientError(res, 422, {}, "Invalid medicine selected.");
      }

      const algoliaService = new AlgoliaService();

      // delete template medication wrt medicine_id
      const templateMedication =
        await TemplateMedicationService.deleteMedication({
          medicine_id,
        });

      // delete medications wrt medicine_id
      const medicationData =
        (await MedicationService.getAllMedicationByData({
          medicine_id,
        })) || [];

      let medicationIds = [];

      if (medicationData.length > 0) {
        for (let index = 0; index < medicationData.length; index++) {
          const { id } = medicationData[index] || {};
          medicationIds.push(id);
        }
      }

      log.debug("medicationIds", medicationIds);

      // delete events wrt medications
      const scheduleEventService = new ScheduleEventService();
      const deleteScheduleEvents = await scheduleEventService.deleteBatch({
        event_type: EVENT_TYPE.MEDICATION_REMINDER,
        event_id: medicationIds,
      });

      const deleteCarePlanMedications =
        await CarePlanMedicationService.deleteCarePlanMedicationByMedicationId(
          medicationIds
        );
      const deleteMedications = await MedicationService.deleteMedication(
        medicationIds
      );

      // delete medicine
      const medicineDetails = await medicineService.deleteMedicine(medicine_id);

      if (medicineDetails) {
        const response = await algoliaService.deleteMedicineData(medicine_id);
        log.debug("algolia delete response", response);
      }

      return raiseSuccess(res, 200, {}, "Medicine deleted successfully.");
    } catch (error) {
      log.debug("500 deleteMedicine error", error);
      return raiseServerError(res);
    }
  };
}

export default new MedicineController();
