import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import moment from "moment";
import Loading from "../../Common/Loading";
import messages from "./messages";
import Timeline from "antd/es/timeline";
import ClockCircleOutlined from "@ant-design/icons/es/icons/ClockCircleOutlined";
import CheckCircleOutlined from "@ant-design/icons/es/icons/CheckCircleOutlined";
import StopOutlined from "@ant-design/icons/es/icons/StopOutlined";
import RightCircleFilled from "@ant-design/icons/es/icons/RightCircleFilled";

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

class MedicationTimeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.getTimelineData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { id: prevId } = prevProps;
    const { id } = this.props;

    if (id && id !== prevId) {
      this.getTimelineData();
    }
  }

  getTimelineData = async () => {
    const { getMedicationTimeline } = this.props;
    try {
      this.setState({ loading: true });
      const response = await getMedicationTimeline();
      const {
        status,
        payload: {
          data: { medication_timeline = {}, medication_date_ids = [] } = {},
          message: responseMessage,
        } = {},
      } = response || {};
      if (status === true) {
        this.setState({
          medication_timeline,
          medication_date_ids,
          loading: false,
        });
      } else {
        this.setState({ loading: false });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  getMedicationTemplate = (responseId, event) => {
    const { id, status, end_time, details = {} } = event || {};
    const {
      response: { values, currentTime } = {},
      medication_templates: { details: { template } = {} } = {},
    } = details;

    let currentTemplate = {};

    template.forEach((data) => {
      const { id } = data || {};
      if (id === responseId) {
        currentTemplate = data;
      }
    });
    return currentTemplate;
  };

  getEventsForDay = (events) => {
    const { intl: { formatMessage } = {} } = this.props;
    const { getMedicationTemplate } = this;

    return events.map((event) => {
      const { id, status, end_time, details = {} } = event || {};
      // console.log("76546789765435678",event);
      const { updated_at = "" } = event;
      const { details: { unit = "mg", strength = "", quantity = "" } = {} } =
        event;

      const {
        response: { value = {}, currentTime } = {},
        medicines: { basic_info: { name: medicine_name = "" } = {} } = {},
      } = details;

      switch (status) {
        case COMPLETED:
          return (
            <TimelineItem
              key={id}
              dot={TIMELINE_STATUS[status].dot}
              color={TIMELINE_STATUS[status].color}
              className="pl10"
            >
              <div className="mb6 fs16 fw500">
                {moment(currentTime).format("LT")}
              </div>
              <div className="fs12">{`${medicine_name} ${formatMessage(
                messages.taken
              )} ( ${strength} ${unit} ${
                quantity ? `x ${quantity}` : ""
              }  )`}</div>

              {Object.keys(value).map((fieldId, index) => {
                const { label, placeholder } = getMedicationTemplate(
                  fieldId,
                  event
                );

                return (
                  <div
                    key={`${id}-${fieldId}-${index}`}
                    className="mb4 fs14 fw500"
                  >{`${label}: ${value[fieldId]} ${placeholder}`}</div>
                );
              })}
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
              <div className="fs16 fw500">{moment(end_time).format("LT")}</div>
              <div className="fs12">{formatMessage(messages.not_recorded)}</div>
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
    const { medication_timeline, medication_date_ids } = this.state;
    const { getEventsForDay } = this;

    return medication_date_ids.map((date) => {
      const eventsForDay = medication_timeline[date] || {};
      return (
        <Fragment key={`${date}`}>
          <TimelineItem
            dot={TIMELINE_STATUS[DATE].dot}
            color={TIMELINE_STATUS[DATE].color}
            className="fs20 fw600"
          >
            {moment(date).format("DD/MM/YYYY")}
          </TimelineItem>
          {getEventsForDay(eventsForDay)}
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
      <div className="wp100 flex direction-column align-start">
        <Timeline>{getTimeline()}</Timeline>
      </div>
    );
  }
}

export default injectIntl(MedicationTimeline);
