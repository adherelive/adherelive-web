import cronofy from "../cronofy/cronofy.service";
import userService from "../user/user.service";
import { EVENT_TYPE } from "../../../constant";
const Response = require("../../helper/responseFormat");

class CalendarService {
  constructor() {}

  async upsertCalendarEvent(participants, payload) {
    try {
      const { participantOne, participantTwo } = participants;
      const userOne = await userService.getUserById(participantOne);
      const userTwo = await userService.getUserById(participantTwo);
      if (userOne && userOne.settings && userOne.settings.isCalendarSynced) {
        const calendarEvent = await this.markUserCalendar(userOne, payload);
      }
      if (userTwo && userTwo.settings && userTwo.settings.isCalendarSynced) {
        const calendarEvent = await this.markUserCalendar(userTwo, payload);
      }
      const response = new Response(true, 200);
      response.setMessage("Added Event Details.");
      return response;
    } catch (err) {
      let response = new Response(false, 500);
      response.setError({
        status: "INTERNAL_SERVER_ERROR",
        message: String(err)
      });
      return response.getResponse();
    }
  }

  async markUserCalendar(user, payload) {
    try {
      const { event } = payload;

      const calendarAccessToken = user.calendar
        ? user.calendar.calendarAccessToken
        : null;
      const calendarList = await cronofy.readCalendars(calendarAccessToken);
      const userCalendarId = calendarList
        ? calendarList.calendars[0].calendar_id
        : null;
      const eventId = event._id;
      const summary =
        event.eventType === EVENT_TYPE.APPOINTMENT ? "Appointment" : "Reminder";
      const description = event.data.notes ? event.data.notes : null;
      const start = event.startTime;
      const end = event.endTime;

      const calendarEvent = await cronofy.createEvent(
        userCalendarId,
        eventId,
        summary,
        description,
        start,
        end,
        calendarAccessToken
      );
      const response = new Response(true, 200);
      response.setData({ event: calendarEvent });
      response.setMessage("Added Event Details.");
      return response;
    } catch (err) {
      let response = new Response(false, 500);
      response.setError({
        status: "INTERNAL_SERVER_ERROR",
        message: String(err)
      });
      return response.getResponse();
    }
  }

  async deleteCalendarEvent(participants, payload) {
    try {
      const { participantOne, participantTwo } = participants;
      const { event } = payload;
      const userOne = await userService.getUserById(participantOne);
      const userTwo = await userService.getUserById(participantTwo);
      if (userOne && userOne.settings && userOne.settings.isCalendarSynced) {
        const calendarEvent = await this.deleteUserCalendar(userOne, payload);
        //
      }
      if (userTwo && userTwo.settings && userTwo.settings.isCalendarSynced) {
        const calendarEvent = await this.deleteUserCalendar(userTwo, payload);
        //
      }
      const response = new Response(true, 200);
      response.setMessage("Added Event Details.");
      return response;
    } catch (err) {
      let response = new Response(false, 500);
      response.setError({
        status: "INTERNAL_SERVER_ERROR",
        message: String(err)
      });
      return response.getResponse();
    }
  }

  async deleteUserCalendar(user, payload) {
    try {
      const { event } = payload;
      const calendarAccessToken = user.calendar
        ? user.calendar.calendarAccessToken
        : null;
      const calendarList = await cronofy.readCalendars(calendarAccessToken);
      const userCalendarId = calendarList
        ? calendarList.calendars[0].calendar_id
        : null;
      const eventId = event._id;

      const calendarEvent = await cronofy.deleteEvent(
        userCalendarId,
        eventId,
        calendarAccessToken
      );

      const response = new Response(true, 200);
      response.setData({ eventId: calendarEvent });
      response.setMessage("Added Event Details.");
      return response;
    } catch (err) {
      let response = new Response(false, 500);
      response.setError({
        status: "INTERNAL_SERVER_ERROR",
        message: String(err)
      });
      return response.getResponse();
    }
  }
}

export default new CalendarService();
