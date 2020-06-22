// import DoctorWrapper from "../../services/doctor/doctorHelper";

import Controller from "../index";
import Log from "../../../libs/log";

import userService from "../../services/user/user.service";
import doctorService from "../../services/doctor/doctor.service";
import doctorQualificationService from "../../services/doctorQualifications/doctorQualification.service";
import doctorClinicService from "../../services/doctorClinics/doctorClinics.service";

import UserWrapper from "../../ApiWrapper/web/user";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import DoctorQualificationWrapper from "../../ApiWrapper/web/doctorQualification";
import DoctorClinicWrapper from "../../ApiWrapper/web/doctorClinic";
import { USER_CATEGORY } from "../../../constant";

const Logger = new Log("WEB > DOCTOR > CONTROLLER");

class DoctorController extends Controller {
  constructor() {
    super();
  }

  getAll = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const doctors = await doctorService.getAllDoctors();

      let doctorApiDetails = {};
      let userApiDetails = {};
      let userIds = [];

      await doctors.forEach(async (doctor) => {
        const doctorWrapper = await DoctorWrapper(doctor);
        doctorApiDetails[
          doctorWrapper.getDoctorId()
        ] = doctorWrapper.getBasicInfo();
        userIds.push(doctorWrapper.getUserId());
      });

      const userDetails = await userService.getUserByData({
        category: USER_CATEGORY.DOCTOR,
      });

      await userDetails.forEach(async (user) => {
        const userWrapper = await UserWrapper(user.get());
        userApiDetails[userWrapper.getId()] = userWrapper.getBasicInfo();
      });

      return raiseSuccess(
        res,
        200,
        {
          users: {
            ...userApiDetails,
          },
          doctors: {
            ...doctorApiDetails,
          },
        },
        "doctor details fetched successfully"
      );
    } catch (error) {
      return raiseServerError(res);
    }
  };

  getAllDoctorDetails = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { id } = {} } = req;
      const doctors = await doctorService.getDoctorByData({ id });

      let doctorQualificationApiDetails = {};
      let doctorClinicApiDetails = {};

      const doctorWrapper = await DoctorWrapper(doctor);

      const doctorQualifications = await doctorQualificationService.getQualificationsByDoctorId(
        doctorWrapper.getDoctorId()
      );

      const userDetails = await userService.getUserById(
        doctorWrapper.getUserId()
      );
      const userWrapper = await UserWrapper(userDetails.get());

      await doctorQualifications.forEach(async (doctorQualification) => {
        const doctorQualificationWrapper = await DoctorQualificationWrapper(
          doctorQualification
        );
        doctorQualificationApiDetails[
          doctorQualificationWrapper.getDoctorQualificationId()
        ] = doctorQualificationWrapper.getBasicInfo();
      });

      const doctorClinics = await doctorClinicService.getClinicForDoctor(
        doctorWrapper.getDoctorId()
      );

      await doctorClinics.forEach(async (doctorClinic) => {
        const doctorClinicWrapper = await DoctorClinicWrapper(doctorClinic);
        doctorClinicApiDetails[
          doctorClinicWrapper.getDoctorClinicId()
        ] = doctorClinicWrapper.getBasicInfo();
      });

      return raiseSuccess(
        res,
        200,
        {
          users: {
            [userWrapper.getId()]: userWrapper.getBasicInfo(),
          },
          doctors: {
            [doctorWrapper.getDoctorId()]: doctorWrapper.getAllInfo(),
          },
          doctor_qualifications: {
            ...doctorQualificationApiDetails,
          },
          doctor_clinics: {
            ...doctorClinicApiDetails,
          },
        },
        "doctor details fetched successfully"
      );
    } catch (error) {
      return raiseServerError(res);
    }
  };
}

export default new DoctorController();
