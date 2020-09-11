import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import moment from "moment";
import Loading from "../../Common/Loading";
import messages from "./messages";
import Timeline from "antd/es/timeline";
import ClockCircleOutlined from "@ant-design/icons/es/icons/ClockCircleOutlined";
import CheckCircleOutlined from "@ant-design/icons/es/icons/CheckCircleOutlined";
import RightCircleFilled from "@ant-design/icons/es/icons/RightCircleFilled";

const { Item: TimelineItem } = Timeline;

const COMPLETED = "completed";
const EXPIRED = "expired";
const DATE = "date";

const TIMELINE_STATUS = {
  [DATE]: {
    key: DATE,
    dot: "",
    color: "blue"
  },
  [COMPLETED]: {
    key: COMPLETED,
    dot: <CheckCircleOutlined />,
    color: "green"
  },
  [EXPIRED]: {
    key: EXPIRED,
    dot: <ClockCircleOutlined />,
    color: "red"
  }
};

class VitalTimeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.getTimelineData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {id: prevId} = prevProps;
    const {id} = this.props;
    if(id && id !== prevId) {
      this.getTimelineData();
    }
  }

  getTimelineData = async () => {
    const { getVitalTimeline } = this.props;
    try {
      this.setState({ loading: true });
      const response = await getVitalTimeline();
      const {
        status,
        payload: {
          data: { vital_timeline = {}, vital_date_ids = [] } = {},
          message: responseMessage
        } = {}
      } = response || {};
      if (status === true) {
        this.setState({ vital_timeline, vital_date_ids, loading: false });
      } else {
        this.setState({ loading: false });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  getVitalTemplate = (responseId, event) => {
    const { id, status, end_time, details = {} } = event || {};
    const {
      response: { values, currentTime } = {},
      vital_templates: { details: { template } = {} } = {}
    } = details;

    let currentTemplate = {};

    template.forEach(data => {
      const { id } = data || {};
      if (id === responseId) {
        currentTemplate = data;
      }
    });

    return currentTemplate;
  };

  getEventsForDay = events => {
    const { intl: { formatMessage } = {} } = this.props;
    const { getVitalTemplate } = this;

    return events.map(event => {
      const { id, status, end_time, details = {} } = event || {};
      const { response: { value, currentTime } = {} } = details;

      switch (status) {
        case COMPLETED:
          return (
            <TimelineItem
              key={id}
              dot={TIMELINE_STATUS[status].dot}
              color={TIMELINE_STATUS[status].color}
            >
              <div className="mb6 fs16 fw500">{formatMessage(messages.completed)}</div>
              {Object.keys(value).map((fieldId, index) => {
                const { label, placeholder } = getVitalTemplate(fieldId, event);

                return (
                  <div
                    key={`${id}-${fieldId}-${index}`}
                    className="pl8 mb4 fs14 fw500"
                  >{`${label}: ${value[fieldId]} ${placeholder}`}</div>
                );
              })}
              <div className="pl8 mb4 fs12">{`updated at: ${moment(currentTime).format("LT")}`}</div>
            </TimelineItem>
          );
        case EXPIRED:
          return (
            <TimelineItem
              key={id}
              dot={TIMELINE_STATUS[status].dot}
              color={TIMELINE_STATUS[status].color}
            >
              <div className="mb6 fs16 fw500">{formatMessage(messages.expired)}</div>
              <div className="pl8 mb4 fs12">{moment(end_time).format("LT")}</div>
            </TimelineItem>
          );
      }
    });
  };

  getTimeline = () => {
    const { vital_timeline, vital_date_ids } = this.state;
    const { getEventsForDay } = this;

    return vital_date_ids.map(date => {
      const eventsForDay = vital_timeline[date] || {};
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
    const {id} = this.props;
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

export default injectIntl(VitalTimeline);
