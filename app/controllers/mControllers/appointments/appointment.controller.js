import Controller from "../../index";
import appointmentService from "../../../services/appointment/appointment.service";
import scheduleService from "../../../services/events/event.service";
import {Proxy_Sdk, EVENTS} from "../../../proxySdk";
import {EVENT_STATUS, EVENT_TYPE} from "../../../../constant";

class AppointmentController extends Controller {
    constructor() {
        super();
    }

    create = async (req, res) => {
        try {
            const { body, userDetails } = req;
            const {
                participant_two,
                description,
                start_date,
                end_date,
                organizer,
                start_time,
                end_time,
                participant_one = {}
                // participant_one_type = "",
                // participant_one_id = "",
            } = body;
            const {userId = "10", user : {category = "patient"} = {}} = userDetails || {};
            const {id: participant_one_id, category : participant_one_type} = participant_one || {};
            const {id: participant_two_id, category : participant_two_type} = participant_two || {};

            const appointment_data = {
                participant_one_type: participant_one_type ? participant_one_type : category,
                participant_one_id: participant_one_id ? participant_one_id : userId,
                participant_two_type,
                participant_two_id,
                organizer_type: category,
                organizer_id: userId,
                description,
                start_date,
                end_date,
            };

            const appointment = await appointmentService.addAppointment(appointment_data);
            console.log("[ APPOINTMENTS ] appointments ", appointment);

            const eventScheduleData = {
                event_type: EVENT_TYPE.APPOINTMENT,
                event_id: appointment.id,
                details: {
                    appointment
                },
                status: EVENT_STATUS.PENDING,
                start_time,
                end_time
            };

            const scheduleEvent = await scheduleService.addNewJob(eventScheduleData);
            console.log("[ SCHEDULE EVENT ] scheduleEvent ", scheduleEvent);

            // TODO: schedule event and notifications here
            await Proxy_Sdk.scheduleEvent({data: eventScheduleData});

            // response
            return this.raiseSuccess(res, 200, appointment, "appointment created successfully");
        } catch(error) {
            console.log("[ APPOINTMENTS ] create error ---> ", error);
            return this.raiseServerError(res, 500, error, error.getMessage());
        }
    }

}

export default new AppointmentController();