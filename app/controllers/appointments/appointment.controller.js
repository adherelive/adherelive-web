import Controller from "../index";
import appointmentService from "../../services/appointment/appointment.service";
import scheduleService from "../../services/events/event.service";
import AppointmentWrapper from "../../ApiWrapper/web/appointments";
import { Proxy_Sdk, EVENTS } from "../../proxySdk";
import { EVENT_STATUS, EVENT_TYPE } from "../../../constant";
import moment from "moment";

import Log from "../../../libs/log";
import { raiseClientError } from "../../../routes/helper";

const FILE_NAME = "WEB APPOINTMENT CONTROLLER";

const Logger = new Log(FILE_NAME);

class AppointmentController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseClientError } = this;
    try {
      const { body, userDetails } = req;
      const {
        participant_two,
        description = "",
        date,
        organizer = {},
        start_time,
        end_time,
        treatment = "",
        // participant_one_type = "",
        // participant_one_id = "",
      } = body;
      console.log("====================> ", userDetails);
      const { userId, userData: { category } = {} } = userDetails || {};
      const { id: participant_two_id, category: participant_two_type } =
        participant_two || {};

      const getAppointmentForTimeSlot = await appointmentService.checkTimeSlot(
        start_time,
        end_time
      );

      Logger.debug("getAppointmentForTimeSlot", getAppointmentForTimeSlot);

      if (getAppointmentForTimeSlot.length > 0) {
        return raiseClientError(
          res,
          422,
          {
            error_type: "slot_present",
          },
          `Appointment Slot already present between`
        );
      }

      const appointment_data = {
        participant_one_type: category,
        participant_one_id: userId,
        participant_two_type,
        participant_two_id,
        organizer_type:
          Object.keys(organizer).length > 0 ? organizer.category : category,
        organizer_id: Object.keys(organizer).length > 0 ? organizer.id : userId,
        description,
        start_date: moment(date),
        end_date: moment(date),
        start_time,
        end_time,
        details: {
          treatment,
        },
      };

      const appointment = await appointmentService.addAppointment(
        appointment_data
      );
      console.log("[ APPOINTMENTS ] appointments ", appointment.getBasicInfo);

      const appointmentApiData = await new AppointmentWrapper(appointment);

      const eventScheduleData = {
        event_type: EVENT_TYPE.APPOINTMENT,
        event_id: appointmentApiData.getAppointmentId(),
        details: appointmentApiData.getExistingData(),
        status: EVENT_STATUS.PENDING,
        start_time,
        end_time,
      };

      // const scheduleEvent = await scheduleService.addNewJob(eventScheduleData);
      // console.log("[ APPOINTMENTS ] scheduleEvent ", scheduleEvent);

      // TODO: schedule event and notifications here
      await Proxy_Sdk.scheduleEvent({ data: eventScheduleData });

      // response
      return this.raiseSuccess(
        res,
        200,
        {
          appointments: {
            [appointmentApiData.getAppointmentId()]: {
              ...appointmentApiData.getBasicInfo(),
            },
          },
        },
        "appointment created successfully"
      );
    } catch (error) {
      console.log("[ APPOINTMENTS ] create error ---> ", error);
      return this.raiseServerError(res);
    }
  };

  getAppointmentForPatient = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      const { params: { id } = {}, userDetails: { userId } = {} } = req;

      const appointmentList = await appointmentService.getAppointmentForPatient(
        id
      );
      Logger.debug("appointmentList", appointmentList);

      // if (appointmentList.length > 0) {
      let appointmentApiData = {};

      await appointmentList.forEach(async (appointment) => {
        const appointmentWrapper = await new AppointmentWrapper(appointment);
        appointmentApiData[
          appointmentWrapper.getAppointmentId()
        ] = appointmentWrapper.getBasicInfo();
      });

      return raiseSuccess(
        res,
        200,
        {
          appointments: {
            ...appointmentApiData,
          },
        },
        `appointment data for patient: ${id} fetched successfully`
      );
      // } else {
      // }
    } catch (error) {
      Logger.debug("500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new AppointmentController();
