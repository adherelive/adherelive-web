// import DoctorWrapper from "../../services/doctor/doctorHelper";

import Controller from "../index";
import userService from "../../services/user/user.service";
// import doctorService from "../../services/doctor/doctor.service";
import patientService from "../../services/patients/patients.service";
import carePlanService from "../../services/carePlan/carePlan.service";

import UserWrapper from "../../ApiWrapper/web/user";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import PatientWrapper from "../../ApiWrapper/web/patient";
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";

import doctorService from "../../services/doctors/doctors.service";
import qualificationService from "../../services/doctorQualifications/doctorQualification.service";
import clinicService from "../../services/doctorClinics/doctorClinics.service";
import documentService from "../../services/uploadDocuments/uploadDocuments.service";
import CarePlanTemplateService from '../../services/carePlanTemplate/carePlanTemplate.service'

class DoctorController extends Controller {
  constructor() {
      super();
  }

 

};

export default new DoctorController();