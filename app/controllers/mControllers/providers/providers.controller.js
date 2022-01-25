import Controller from "../..";
import moment from "moment";
import Log from "../../../../libs/log";
import providerService from "../../../services/provider/provider.service";
import appointmentService from "../../../services/appointment/appointment.service";
import UserRoleService from "../../../services/userRoles/userRoles.service";
import DoctorService from "../../../services/doctor/doctor.service";
import UserWrapper from "../../../ApiWrapper/web/user";
import DoctorWrapper from "../../../ApiWrapper/web/doctor";
import ProviderWrapper from "../../../ApiWrapper/web/provider";
import AppointmentWrapper from "../../../ApiWrapper/web/appointments";
import PatientWrapper from "../../../ApiWrapper/web/patient";
import UserRoleWrapper from "../../../ApiWrapper/web/userRoles";
import { USER_CATEGORY } from "../../../../constant";
const Logger = new Log("MOBILE > PROVIDERS > CONTROLLER");

const APPOINTMENT_QUERY_TYPE = {
  DAY: "d",
  MONTH: "m",
};
class MobileProvidersController extends Controller {
  constructor() {
    super();
  }
  getAppointmentForDoctors = async (req, res) => {
    const { raiseSuccess, raiseServerError, raiseClientError } = this;
    try {
      const {
        userDetails: { userId } = {},
        query: { type = APPOINTMENT_QUERY_TYPE.DAY, value = null } = {},
      } = req;

      const validDate = moment(value).isValid();
      if (!validDate) {
        return raiseClientError(
          res,
          402,
          {},
          "Please enter the correct date value"
        );
      }

      const providerData = await providerService.getProviderByData({
        user_id: userId,
      });
      const provider = await ProviderWrapper(providerData);
      const providerId = provider.getProviderId();

      let userApiDetails = {};
      let doctorApiDetails = {};
      let patientsApiDetails = {};
      let appointmentApiDetails = {};
      let dateWiseAppointmentDetails = {};

      let patientIds = [];
      let doctorIds = [];

      const UserRoles = await UserRoleService.getAllByData({
        linked_id: providerId,
        linked_with: USER_CATEGORY.PROVIDER,
      });

      if (UserRoles && UserRoles.length) {
        for (let i = 0; i < UserRoles.length; i++) {
          const UserRole = UserRoles[i];
          const userRoleWrapper = await UserRoleWrapper(UserRole);
          const DoctorUserId = await userRoleWrapper.getUserId();
          const doctor = await DoctorService.getDoctorByData({
            user_id: DoctorUserId,
          });
          if (doctor) {
            const doctorWrapper = await DoctorWrapper(doctor);
            const doctorId = await doctorWrapper.getDoctorId();
            doctorIds.push(doctorId);
          }
        }
      }

      for (const doctorId of doctorIds) {
        let appointmentList = [];

        switch (type) {
          case APPOINTMENT_QUERY_TYPE.DAY:
            appointmentList =
              await appointmentService.getDayAppointmentForDoctor(
                doctorId,
                value
              );
            break;
          case APPOINTMENT_QUERY_TYPE.MONTH:
            appointmentList =
              await appointmentService.getMonthAppointmentForDoctor(
                doctorId,
                value
              );
            break;
          default:
            return raiseClientError(
              res,
              422,
              {},
              "Please check selected value for getting upcoming schedules"
            );
        }

        if (appointmentList && appointmentList.length) {
          for (const appointment of appointmentList) {
            const appointmentData = await AppointmentWrapper(appointment);
            const { participant_one_id, participant_two_id } =
              appointmentData.getParticipants();

            const {
              [appointmentData.getFormattedStartDate()]:
                dateAppointments = null,
            } = dateWiseAppointmentDetails;

            if (dateAppointments) {
              dateWiseAppointmentDetails[
                appointmentData.getFormattedStartDate()
              ].push(appointmentData.getAppointmentId());
            } else {
              dateWiseAppointmentDetails[
                appointmentData.getFormattedStartDate()
              ] = [appointmentData.getAppointmentId()];
            }

            appointmentApiDetails[appointmentData.getAppointmentId()] =
              appointmentData.getBasicInfo();

            if (participant_one_id !== doctorId) {
              patientIds.push(participant_one_id);
            } else {
              patientIds.push(participant_two_id);
            }
          }
        }
      }

      for (const patientId of patientIds) {
        const patientData = await PatientWrapper(null, patientId);
        const patientUserId = patientData.getUserId();
        const patientUserData = await UserWrapper(null, patientUserId);

        userApiDetails[patientUserId] = patientUserData.getBasicInfo();
        patientsApiDetails[patientId] = patientData.getBasicInfo();
      }

      return raiseSuccess(
        res,
        200,
        {
          users: { ...userApiDetails },
          doctors: { ...doctorApiDetails },
          date_wise_appointments: { ...dateWiseAppointmentDetails },
          patients: { ...patientsApiDetails },
          appointments: { ...appointmentApiDetails },
        },
        "Appointments data fetched successfully."
      );
    } catch (error) {
      Logger.debug("getAllAppointmentForDoctors 500 error ", error);
      return raiseServerError(res);
    }
  };
}

export default new MobileProvidersController();
