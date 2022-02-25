import React, { Component } from "react";
import { injectIntl } from "react-intl";
import moment from "../../../../Helper/moment";
import messages from "./messages";

import { EVENT_TYPE, EVENT_STATUS } from "../../../../constant";

class PatientAlerts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      areEvents: true,
      last_visit: [],
    };
  }

  componentDidMount() {
    const { last_visit } = this.state;
    if (last_visit.length === 0) {
      this.getAlertData();
    }
  }

  getAlertData = async () => {
    try {
      this.setState({ loading: true });
      const { getLastVisitAlerts } = this.props;
      const response = await getLastVisitAlerts();
      const { status, payload: { data: { last_visit = [] } = {} } = {} } =
        response || {};
      if (status === true) {
        this.setState({ last_visit, loading: false });
      }
      if (last_visit.length === 0) {
        this.setState({ areEvents: false, loading: false });
      } else {
        this.setState({ loading: false });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  getBlankState = () => {
    const { intl: { formatMessage } = {} } = this.props;
    return (
      <div className="wp100 flex align-center justify-center pt20 pb20 fs20 fw500">
        {formatMessage(messages.blank_state_text)}
      </div>
    );
  };

  getSymptom = ({ id, time }) => {
    const { symptoms, intl: { formatMessage } = {} } = this.props;
    const { text } = symptoms[id] || {};

    return (
      <div
        key={`symptom-${time}`}
        className="wp100 flex align-center pt10 pb10 pl6 pr6 tal"
      >
        <div className="wp30 pl16 bl-dark-aqua fw600">
          {formatMessage(messages.symptom_added_text)}
        </div>
        <div className="wp70 fw600">{text}</div>
        {/*<div className="wp40">{`${moment(time).format("LL")} ${moment(time).format("LT")}`}</div>*/}
      </div>
    );
  };

  getMedication = ({ data, time }) => {
    const { intl: { formatMessage } = {} } = this.props;
    const { status, details } = data || {};

    return (
      <div
        key={`medication-${time}`}
        className="wp100 flex align-center pt10 pb10 pl6 pr6 tal"
      >
        {status === EVENT_STATUS.EXPIRED ? (
          <div className="wp30 pl16 fw600 bl-warning-red ">
            {formatMessage(messages.missed_medication)}
          </div>
        ) : (
          <div className="wp30 pl16 fw600 bl-green ">
            {formatMessage(messages.taken_medication)}
          </div>
        )}
        <div className="wp70 fw600 ">{`${moment(time).format(
          "DD MMM, YYYY"
        )} (${moment(time).format("LT")})`}</div>
      </div>
    );
  };

  getAppointment = ({ data, time }) => {
    const { intl: { formatMessage } = {} } = this.props;
    const { status } = data || {};

    return (
      <div
        key={`appointment-${time}`}
        className="wp100 flex align-center pt10 pb10 pl6 pr6 tal"
      >
        {status === EVENT_STATUS.EXPIRED ? (
          <div className="wp30 pl16 fw600 bl-warning-red">
            {formatMessage(messages.missed_appointment)}
          </div>
        ) : (
          <div className="wp30 pl16 fw600 bl-green">
            {formatMessage(messages.completed_appointment)}
          </div>
        )}
        <div className="wp70 fw600">{`${moment(time).format(
          "DD MMM, YYYY"
        )} (${moment(time).format("LT")})`}</div>
      </div>
    );
  };

  getVitals = ({ data, time }) => {
    const { intl: { formatMessage } = {} } = this.props;
    const {
      status,
      details: { vital_templates: { basic_info: { name } = {} } = {} } = {},
    } = data || {};

    return (
      <div
        key={`vital-${time}`}
        className="wp100 flex align-center pt10 pb10 pl6 pr6 tal"
      >
        {status === EVENT_STATUS.EXPIRED ? (
          <div className="wp30 pl16 fw600 bl-warning-red">
            {formatMessage(messages.missed_vital)}
          </div>
        ) : (
          <div className="wp30 pl16 fw600 bl-green">
            {formatMessage(messages.completed_vital)}
          </div>
        )}
        <div className="wp50 fw600">{`${moment(time).format(
          "DD MMM, YYYY"
        )} (${moment(time).format("LT")})`}</div>
        <div className="wp20 fw500 word-wrap">{`(${name})`}</div>
      </div>
    );
  };

  getDiets = ({ data, time }) => {
    const { intl: { formatMessage } = {} } = this.props;
    const { status } = data || {};
    const { details: { diets = {}, diet_id = null } = {} } = data || {};
    const { basic_info: { name = "" } = {} } = diets[diet_id] || {};
    return (
      <div
        key={`diet-${time}`}
        className="wp100 flex align-center pt10 pb10 pl6 pr6 tal"
      >
        {status === EVENT_STATUS.EXPIRED ? (
          <div className="wp30 pl16 fw600 bl-warning-red">
            {formatMessage(messages.missed_diet)}
          </div>
        ) : (
          <div className="wp30 pl16 fw600 bl-green">
            {formatMessage(messages.completed_diet)}
          </div>
        )}
        <div className="wp50 fw600">{`${moment(time).format(
          "DD MMM, YYYY"
        )} (${moment(time).format("LT")})`}</div>
        <div className="wp20 fw500 word-wrap">{`(${name})`}</div>
      </div>
    );
  };

  getWorkouts = ({ data, time }) => {
    const { intl: { formatMessage } = {} } = this.props;
    const { status } = data || {};
    const { details: { workouts = {}, workout_id = null } = {} } = data || {};
    const { basic_info: { name = "" } = {} } = workouts[workout_id] || {};
    return (
      <div
        key={`workout-${time}`}
        className="wp100 flex align-center pt10 pb10 pl6 pr6 tal"
      >
        {status === EVENT_STATUS.EXPIRED ? (
          <div className="wp30 pl16 fw600 bl-warning-red">
            {formatMessage(messages.missed_workout)}
          </div>
        ) : (
          <div className="wp30 pl16 fw600 bl-green">
            {formatMessage(messages.completed_workout)}
          </div>
        )}
        <div className="wp50 fw600">{`${moment(time).format(
          "DD MMM, YYYY"
        )} (${moment(time).format("LT")})`}</div>
        <div className="wp20 fw500 word-wrap">{`(${name})`}</div>
      </div>
    );
  };

  getScheduleEvent = ({ data, time }) => {
    const { getMedication, getVitals, getAppointment, getDiets, getWorkouts } =
      this;
    const { event_type } = data || {};

    switch (event_type) {
      case EVENT_TYPE.MEDICATION_REMINDER:
        return getMedication({ data, time });
      case EVENT_TYPE.APPOINTMENT:
        return getAppointment({ data, time });
      case EVENT_TYPE.VITALS:
        return getVitals({ data, time });
      case EVENT_TYPE.DIET:
        return getDiets({ data, time });
      case EVENT_TYPE.WORKOUT:
        return getWorkouts({ data, time });
    }
  };

  getEvents = () => {
    const { schedule_events } = this.props;
    const { last_visit } = this.state;
    console.log("7263423847628346872347238", { last_visit });

    const events = last_visit.map((details) => {
      const { event_type, id, updatedAt } = details || {};

      switch (event_type) {
        case EVENT_TYPE.SYMPTOMS:
          return this.getSymptom({ time: updatedAt, id });
        default:
          return this.getScheduleEvent({
            data: schedule_events[id],
            time: updatedAt,
          });
      }
    });

    return events;
  };

  render() {
    const { intl: { formatMessage } = {} } = this.props;
    const { loading, areEvents, last_visit = [] } = this.state;
    const { getBlankState, getEvents } = this;

    if (loading) {
      return null;
    }

    return (
      <div className="br10 p10 wp100 bg-rosy-pink">
        <div className="wp100 pl6 pt10 pb10 flex align-center bb-light-grey">
          <div className="fs20 fw700">
            {formatMessage(messages.alert_header)}
          </div>
          <div className="fs20 fw500 warm-grey ml4">{`(${last_visit.length})`}</div>
        </div>
        {!areEvents ? getBlankState() : getEvents()}
      </div>
    );
  }
}

export default injectIntl(PatientAlerts);
