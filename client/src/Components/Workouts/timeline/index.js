import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import moment from "moment";
import Loading from "../../Common/Loading";
import messages from "./messages";
import Timeline from "antd/es/timeline";
import ClockCircleOutlined from "@ant-design/icons/es/icons/ClockCircleOutlined";
import CheckCircleOutlined from "@ant-design/icons/es/icons/CheckCircleOutlined";
import StopOutlined from "@ant-design/icons/es/icons/StopOutlined";

import edit_image from "../../../Assets/images/edit.svg";

const { Item: TimelineItem } = Timeline;

const COMPLETED = "completed";
const EXPIRED = "expired";
const CANCELLED = "cancelled";
const DATE = "date";

const TIMELINE_STATUS = {
  [DATE]: {
    key: DATE,
    dot: "",
    color: "blue",
  },
  [COMPLETED]: {
    key: COMPLETED,
    dot: <CheckCircleOutlined />,
    color: "green",
  },
  [EXPIRED]: {
    key: EXPIRED,
    dot: <ClockCircleOutlined />,
    color: "red",
  },
  [CANCELLED]: {
    key: CANCELLED,
    dot: <StopOutlined style={{ color: "#FFCC00" }} />,
    color: "yellow",
  },
};

class WorkoutTimeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      workout_timeline: {},
      workout_date_ids: [],
    };
  }

  componentDidMount() {
    this.getTimelineData();
  }

  componentDidUpdate(prevProps, prevState) {
    const { workout_id = null } = this.props;
    const { workout_id: prev_workout_id = null } = prevProps;

    if (workout_id && workout_id !== prev_workout_id) {
      this.getTimelineData();
    }
  }

  getTimelineData = async () => {
    const { getWorkoutTimeline, workout_id = null } = this.props;
    try {
      this.setState({ loading: true });
      const response = await getWorkoutTimeline(workout_id);
      const {
        status,
        payload: {
          data: { workout_timeline = {}, workout_date_ids = [] } = {},
          message: responseMessage,
        } = {},
      } = response || {};
      if (status === true) {
        this.setState({ workout_timeline, workout_date_ids, loading: false });
      } else {
        this.setState({ loading: false });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  handleOpenWorkoutDetailsDrawer = (schedule_event_id, date) => () => {
    const { openWorkoutResponseDetails } = this.props;
    openWorkoutResponseDetails({ schedule_event_id, date });
  };

  getEventsForDay = (events, date) => {
    const { intl: { formatMessage } = {}, workout_name = "" } = this.props;

    return events.map((event) => {
      const {
        id,
        status,
        start_time,
        details: { workouts = {}, workout_id = null } = {},
        updated_at = null,
        workout_responses = {},
        total = 0,
        complete = 0,
      } = event || {};
      const { time = null } = workouts[workout_id] || {};
      const schedule_event_id = id;
      const formattedTime = time ? moment(time).format("hh:mm A") : null;

      switch (status) {
        case COMPLETED:
          return (
            <TimelineItem
              key={id}
              dot={TIMELINE_STATUS[status].dot}
              color={TIMELINE_STATUS[status].color}
              className="pl10 wp100"
            >
              <div
                key={`${id}-${schedule_event_id}`}
                className="mb4 fs16 fw500 wp100 b-light-grey p10 br5 pointer"
                onClick={this.handleOpenWorkoutDetailsDrawer(
                  schedule_event_id,
                  date
                )}
              >
                <div className="flex align-center justify-space-between">
                  <div className="flex direction-column align-center justify-center fs16 fw800">
                    {workout_name}
                  </div>
                  <div className="flex direction-column align-center justify-center ml20">
                    <img
                      src={edit_image}
                      className="pointer edit-patient-icon"
                      onClick={this.handleOpenWorkoutDetailsDrawer(
                        schedule_event_id
                      )}
                    />
                  </div>
                </div>

                <div className="flex align-center justify-space-between mt10 ">
                  <div className="flex direction-column align-center justify-center">
                    {formatMessage(
                      { ...messages.exercisesDone },
                      { complete, total }
                    )}
                  </div>

                  <div className="flex direction-column align-center justify-center">
                    <div className="flex">
                      <div className="flex direction-column align-center justify-center">
                        {formatMessage(
                          { ...messages.timeText },
                          { time: formattedTime }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TimelineItem>
          );
        case EXPIRED:
          return (
            <TimelineItem
              key={id}
              dot={TIMELINE_STATUS[status].dot}
              color={TIMELINE_STATUS[status].color}
              className="pl10"
            >
              <div
                key={`${id}-${schedule_event_id}`}
                className="mb4 fs16 fw500 wp100 b-light-grey p10 br5 "
              >
                <div className="flex align-center justify-space-between">
                  <div className="flex direction-column align-center justify-center fs16 fw800">
                    {workout_name}
                  </div>
                </div>

                <div className="flex align-center justify-space-between mt10 ">
                  <div className="flex direction-column align-center justify-center">
                    {formatMessage(
                      { ...messages.exercisesDone },
                      { complete, total }
                    )}
                  </div>

                  <div className="flex direction-column align-center justify-center">
                    <div className="flex">
                      <div className="flex direction-column align-center justify-center">
                        {formatMessage(
                          { ...messages.timeText },
                          { time: formattedTime }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TimelineItem>
          );
        case CANCELLED:
          return (
            <TimelineItem
              key={id}
              dot={TIMELINE_STATUS[status].dot}
              color={TIMELINE_STATUS[status].color}
              className="pl10"
            >
              <div className="mb6 fs16 fw500">
                {moment(updated_at).format("LT")}
              </div>
              <div className="fs12">
                {formatMessage(messages.cancelled_reschedule)}
              </div>
            </TimelineItem>
          );
      }
    });
  };

  getTimeline = () => {
    const { workout_timeline = {}, workout_date_ids = [] } = this.state;
    const { getEventsForDay } = this;

    return workout_date_ids.map((date) => {
      const eventsForDay = workout_timeline[date] || {};
      return (
        <Fragment key={`${date}`}>
          <TimelineItem
            dot={TIMELINE_STATUS[DATE].dot}
            color={TIMELINE_STATUS[DATE].color}
            className="fs20 fw600"
          >
            {moment(date).format("DD/MM/YYYY")}
          </TimelineItem>
          {getEventsForDay(eventsForDay, date)}
        </Fragment>
      );
    });
  };

  render() {
    const { id } = this.props;
    const { loading } = this.state;
    const { getTimeline } = this;

    if (loading === true) {
      return <Loading />;
    }

    return (
      <div className="wp100 flex direction-column align-start ">
        <Timeline className="wp100">{getTimeline()}</Timeline>
      </div>
    );
  }
}

export default injectIntl(WorkoutTimeline);
