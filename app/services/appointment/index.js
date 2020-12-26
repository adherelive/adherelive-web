import moment from "moment";

export default class Appointment {
  constructor(data) {
    this._data = data;
  }

  getData = () => {
    return this._data.get();
  };

  getParticipants = () => {
    const { participant_one_id, participant_two_id } = this._data || {};
    return { participant_one_id, participant_two_id };
  };

  getAppointmentId() {
    return this._data.get("id");
  }

  getStartDate = () => {
    return this._data.get("start_date");
  };

  getStartTime = () => {
    return this._data.get("start_time");
  };

  getEndTime = () => {
    return this._data.get("end_time");
  };

  getFormattedStartDate = () => {
    const start_date = this._data.get("start_date");
    const date = moment(start_date)
      .startOf("day")
      .toISOString();
    return date;
  };
}
