import React, { Component } from "react";
import { injectIntl } from "react-intl";
import Drawer from "antd/es/drawer";
import moment from "moment";
import messages from "./messages";
import Modal from "antd/es/modal";
import CheckCircleFilled from "@ant-design/icons/CheckCircleFilled";
import { VIDEO_TYPES } from "../../../constant";
import message from "antd/es/message";

class WorkoutReponseEventDetailsDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoModalVisible: false,
      videoToShow: "",
      content_type: VIDEO_TYPES.NONE,
      workout_responses: {},
    };
  }

  componentDidMount() {}

  formatMessage = (data) => this.props.intl.formatMessage(data);

  componentDidUpdate(prevProps, prevState) {
    const { visible: prev_visible = false } = prevProps;
    const { visible = false, schedule_event_id = null } = this.props;
    if (schedule_event_id && visible && visible !== prev_visible) {
      this.getScheduleEventData();
    }
  }

  getScheduleEventData = async () => {
    try {
      const { schedule_event_id = null, getWorkoutScheduleEventDetails } =
        this.props;
      const response = await getWorkoutScheduleEventDetails(schedule_event_id);

      const {
        status,
        statusCode,
        payload: { data: resp_data = {}, message: resp_msg = "" } = {},
      } = response;

      if (!status) {
        message.warn(resp_msg);
      } else {
        const { workout_responses = {} } = resp_data;
        this.setState({ workout_responses });
      }
    } catch (error) {
      console.log("error =>", { error });
    }
  };

  onClose = () => {
    const { closeWorkoutResponseDetails } = this.props;
    closeWorkoutResponseDetails();
  };

  getDetailsComponent = (data) => {
    const {
      name = "",
      response = {},
      notes = "",
      content_id = null,
    } = data || {};
    const { exercise_contents = {}, repetitions = {} } = this.props;
    let src = "",
      content_type = "none";
    if (content_id) {
      const {
        video: {
          content = "",
          content_type: video_content_type = VIDEO_TYPES.NONE,
        } = {},
      } = exercise_contents[content_id] || {};
      src = content;
      content_type = video_content_type;
    }

    const {
      repetition_id = null,
      repetition_value = 0,
      sets = 0,
      other_details: { calorific_value = 0 } = {},
    } = response || {};

    const { type = "" } = repetitions[repetition_id] || {};
    return (
      <div className="flex direction-column wp100 b-light-grey p10 br5 mt20">
        <div className=" fs16 fw800 flex ">
          <div className="flex direction-column align-center justify-center">
            {src.length > 0 && (
              <CheckCircleFilled
                title={this.formatMessage(messages.iconTitle)}
                style={{ color: "green" }}
                onClick={this.openModal({ src, content_type })}
              />
            )}
          </div>
          <div
            className={`${
              src.length > 0 ? "ml10" : "null"
            } flex direction-column align-center justify-center`}
          >
            {name}
          </div>
        </div>
        <div>
          {`${sets}x${" "}${repetition_value}${" "}${type}`}
          <span className="grey-dot">&bull;</span>
          {`${calorific_value ? calorific_value : "--"} Cal`}
        </div>
        <div>{notes.length ? `Note: ${notes}` : null}</div>
      </div>
    );
  };

  getWorkoutData = () => {
    let allDetails = [];
    const {
      exercise_groups = {},
      workout_exercise_groups = [],
      exercise_details = {},
      exercises = {},
    } = this.props;
    const { workout_responses = {} } = this.state;
    console.log("8732648264826846238742", {
      workout_responses,
      workout_exercise_groups,
    });
    for (let each in workout_responses) {
      let content_id = null;
      const response = workout_responses[each] || {};
      const { basic_info: { exercise_group_id = null } = {} } = response || {};
      const {
        basic_info: { exercise_detail_id = null } = {},
        details: { notes = "" } = {},
      } = exercise_groups[exercise_group_id] || {};
      const { basic_info: { exercise_id = null } = {} } =
        exercise_details[exercise_detail_id] || {};
      const { basic_info: { name = "" } = {} } = exercises[exercise_id] || {};
      for (let group of workout_exercise_groups) {
        const { exercise_group_id: grp_id = null, exercise_content_id = null } =
          group || {};
        if (grp_id.toString() === exercise_group_id.toString()) {
          content_id = exercise_content_id;
          break;
        }
      }

      allDetails.push(
        this.getDetailsComponent({ name, response, notes, content_id })
      );
    }

    return allDetails;
  };

  videoModal = () => {
    const { videoToShow = "", content_type = "none" } = this.state;
    let newsrc = "";
    if (content_type === VIDEO_TYPES.URL) {
      const url = videoToShow.split("v=")[1] || "";
      if (videoToShow.includes("youtube")) {
        newsrc = "https://www.youtube.com/embed/" + url;
      } else {
        newsrc = videoToShow;
      }
    }

    return (
      <Modal
        className={"chat-media-modal"}
        visible={this.state.videoModalVisible}
        title={" "}
        closable
        mask
        maskClosable
        onCancel={this.closeModal}
        wrapClassName={"chat-media-modal-dialog"}
        width={`50%`}
        footer={null}
      >
        {content_type === VIDEO_TYPES.UPLOAD ? (
          <video
            controls
            src={videoToShow}
            alt="exercise content"
            className="wp100"
          />
        ) : content_type === VIDEO_TYPES.URL ? (
          newsrc.includes("youtube") ? (
            <iframe width="100%" height="400px" src={newsrc}></iframe>
          ) : (
            <video
              controls
              src={newsrc}
              alt="exercise content"
              className="wp100"
            />
          )
        ) : null}
      </Modal>
    );
  };

  openModal =
    ({ src, content_type }) =>
    () => {
      this.setState({ videoToShow: src, content_type }, () =>
        this.setState({ videoModalVisible: true })
      );
    };

  closeModal = () => {
    this.setState({ videoModalVisible: false, content_type: VIDEO_TYPES.NONE });
  };

  render() {
    const {
      visible,
      intl: { formatMessage } = {},
      workout_name = "",
      date: props_date = null,
    } = this.props;
    const { onClose } = this;
    const date = moment(props_date).format("DD MMMM YYYY");

    return (
      <Drawer
        placement="right"
        maskClosable={false}
        onClose={onClose}
        visible={visible}
        width={"35%"}
        title={formatMessage({ ...messages.title }, { workout_name, date })}
        headerStyle={{
          position: "sticky",
          zIndex: "9999",
          top: "0px",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        {this.getWorkoutData()}
        {this.videoModal()}
      </Drawer>
    );
  }
}

export default injectIntl(WorkoutReponseEventDetailsDrawer);
