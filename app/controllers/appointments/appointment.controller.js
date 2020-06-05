import Controller from "../index";
import appointmentService from "../../services/appointment/appointment.service";
import scheduleService from "../../services/events/event.service";
import {Proxy_Sdk, EVENTS} from "../../proxySdk";
import {EVENT_STATUS, EVENT_TYPE} from "../../../constant";
import moment from "moment";

class AppointmentController extends Controller {
    constructor() {
        super();
    }

    create = async (req, res) => {
        try {
            const {body, userDetails} = req;
            const {
                participant_two,
                description = "",
                date,
                organizer = {},
                start_time,
                end_time,
                // participant_one_type = "",
                // participant_one_id = "",
            } = body;
            console.log("====================> ", userDetails);
            const {userId, userData: {category} = {}} = userDetails || {};
            const {id: participant_two_id, category: participant_two_type} = participant_two || {};

            console.log("1111111111111");

            const appointment_data = {
                participant_one_type: category,
                participant_one_id: userId,
                participant_two_type,
                participant_two_id,
                organizer_type: Object.keys(organizer).length > 0 ? organizer.category : category,
                organizer_id: Object.keys(organizer).length > 0 ? organizer.id : userId,
                description,
                start_date: moment(date),
                end_date: moment(date),
                details: JSON.stringify({
                   start_time,
                   end_time
                }),
            };

            const appointment = await appointmentService.addAppointment(appointment_data);
            console.log("[ APPOINTMENTS ] appointments ", appointment.getBasicInfo);

            const eventScheduleData = {
                event_type: EVENT_TYPE.APPOINTMENT,
                event_id: appointment.id,
                details: appointment,
                status: EVENT_STATUS.PENDING,
                start_time,
                end_time
            };

            // const scheduleEvent = await scheduleService.addNewJob(eventScheduleData);
            // console.log("[ APPOINTMENTS ] scheduleEvent ", scheduleEvent);

            // TODO: schedule event and notifications here
            await Proxy_Sdk.scheduleEvent({data: eventScheduleData});

            // response
            return this.raiseSuccess(res, 200,
                {
                    appointments: {
                        [appointment.id]: {
                            basic_info: {
                                ...appointment.getBasicInfo
                            }
                        }
                    }
                },
                "appointment created successfully");
        } catch (error) {
            console.log("[ APPOINTMENTS ] create error ---> ", error);
            return this.raiseServerError(res, 500, error, error.message);
        }
    }
}

export default new AppointmentController();