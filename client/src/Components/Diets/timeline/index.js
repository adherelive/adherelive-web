import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import moment from "moment";
import Loading from "../../Common/Loading";
import messages from "./messages";
import Timeline from "antd/es/timeline";
import ClockCircleOutlined from "@ant-design/icons/es/icons/ClockCircleOutlined";
import CheckCircleOutlined from "@ant-design/icons/es/icons/CheckCircleOutlined";
import StopOutlined from "@ant-design/icons/es/icons/StopOutlined";
import Modal from "antd/es/modal";

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

class DietTimeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      diet_timeline: {},
      diet_date_ids: [],
      imageModalVisible: false,
      imageToShow: "",
    };
  }

  componentDidMount() {
    this.getTimelineData();
  }

  componentDidUpdate(prevProps, prevState) {
    const { diet_id = null } = this.props;
    const { diet_id: prev_diet_id = null } = prevProps;

    if (diet_id && diet_id !== prev_diet_id) {
      this.getTimelineData();
    }
  }

  imageModal = () => {
    return (
      <Modal
        className={"chat-media-modal"}
        visible={this.state.imageModalVisible}
        title={" "}
        closable
        mask
        maskClosable
        onCancel={this.closeModal}
        wrapClassName={"chat-media-modal-dialog"}
        width={`50%`}
        footer={null}
      >
        <img
          src={this.state.imageToShow}
          alt="qualification document"
          className="wp100"
        />
      </Modal>
    );
  };

  closeModal = () => {
    this.setState({ imageModalVisible: false });
  };

  getTimelineData = async () => {
    const { getDietTimeline, diet_id = null } = this.props;
    try {
      this.setState({ loading: true });
      const response = await getDietTimeline(diet_id);
      const {
        status,
        payload: {
          data: { diet_timeline = {}, diet_date_ids = [] } = {},
          message: responseMessage,
        } = {},
      } = response || {};
      if (status === true) {
        this.setState({ diet_timeline, diet_date_ids, loading: false });
      } else {
        this.setState({ loading: false });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  getResponseData = ({
    upload_documents,
    upload_document_ids,
    resp_updated_at,
    response_text,
  }) => {
    let dataTorender = [];

    dataTorender.push(
      <div>
        <div className="mt20">{moment(resp_updated_at).format("hh:mm a")}</div>

        {response_text && response_text.length ? (
          <div className={"fs16 medium"}>{response_text}</div>
        ) : null}
      </div>
    );

    for (let documentId of upload_document_ids) {
      const { basic_info: { document: imageUrl = "" } = {} } =
        upload_documents[documentId] || {};

      dataTorender.push(
        // <Timeline.Item dot={<div className={'timelineDot'} />}>
        <div
          style={{
            flex: 1,
            backgroundColor: "#ffffff",
            marginBottom: 20,
            marginRight: 14,
            paddingLeft: imageUrl && imageUrl.length ? 0 : 10,
            paddingRight: imageUrl && imageUrl.length ? 0 : 10,
            paddingBottom: 5,
            paddingTop: imageUrl && imageUrl.length ? 0 : 5,
            borderRadius: 2,
            marginTop: 12,
            width: 300,
          }}
        >
          {imageUrl && imageUrl.length ? (
            <div className="pointer" onClick={this.openModal(imageUrl)}>
              <img
                src={imageUrl}
                style={{ width: 300, height: 200, borderRadius: 2 }}
              />
            </div>
          ) : null}
        </div>
        // </Timeline.Item>
      );
    }

    return dataTorender;
  };

  openModal = (url) => () => {
    this.setState({ imageToShow: url }, () =>
      this.setState({ imageModalVisible: true })
    );
  };

  getEventsForDay = (events) => {
    const { intl: { formatMessage } = {} } = this.props;

    return events.map((event) => {
      const { id, status, end_time } = event || {};
      const {
        details: { time_text = "" } = {},
        updated_at = "",
        diet_response_id = null,
        diet_responses = {},
        upload_documents = {},
      } = event;

      switch (status) {
        case COMPLETED:
          return (
            <TimelineItem
              key={id}
              dot={TIMELINE_STATUS[status].dot}
              color={TIMELINE_STATUS[status].color}
              className="pl10"
            >
              <div className="fs16 fw700">
                {/* {`${formatMessage(
                {...messages.completed},
                {time_text}
              )}`} */}
                {time_text}
              </div>

              {Object.keys(diet_responses).map((response_id, index) => {
                const {
                  response_text = "",
                  upload_document_ids = [],
                  updated_at: resp_updated_at = "",
                } = diet_responses[response_id] || {};
                return (
                  <div
                    key={`${id}-${response_id}-${index}`}
                    className="mb4 fs14 fw500"
                  >
                    {this.getResponseData({
                      upload_documents,
                      upload_document_ids,
                      resp_updated_at,
                      response_text,
                    })}
                  </div>
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
              <div className={"fs16 medium"}>{time_text}</div>
              {/* <div className="fs16 fw500">{moment(end_time).format("LT")}</div> */}
              <div className="fs12">{formatMessage(messages.expired)}</div>
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
    const { diet_timeline = {}, diet_date_ids = [] } = this.state;
    const { getEventsForDay } = this;

    return diet_date_ids.map((date) => {
      const eventsForDay = diet_timeline[date] || {};
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
        {this.imageModal()}
      </div>
    );
  }
}

export default injectIntl(DietTimeline);
