import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import moment from "moment";
import Loading from "../../Common/Loading";
import messages from "./messages";
import Timeline from "antd/es/timeline";
import message from "antd/es/message";
import ClockCircleOutlined from "@ant-design/icons/es/icons/ClockCircleOutlined";
import CheckCircleOutlined from "@ant-design/icons/es/icons/CheckCircleOutlined";
import DeleteOutlined from "@ant-design/icons/es/icons/DeleteOutlined";
import editIcon from "../../../Assets/images/edit.svg";
import Modal from "antd/es/modal";
import Button from "antd/es/button";
import Form from "antd/es/form";
import Input from "antd/es/input";

const { Item: TimelineItem } = Timeline;

const COMPLETED = "completed";
const EXPIRED = "expired";
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
};

class VitalTimeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.getTimelineData();
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { id: prevId } = prevProps;
    const { id } = this.props;
    if (id && id !== prevId) {
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
          message: responseMessage,
        } = {},
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
      vital_templates: { details: { template } = {} } = {},
    } = details;

    let currentTemplate = {};

    console.log("819287213 ", { details, template });

    template.forEach((data) => {
      const { id } = data || {};
      if (id === responseId) {
        currentTemplate = data;
      }
    });
    return currentTemplate;
  };

  openEditVitalResponseModal = (data) => (e) => {
    e.preventDefault();
    const { response: { value = {} } = {} } = data || {};
    this.setState({
      vitalResponseData: data,
      updateValue: { ...value },
      modalVisible: true,
    });
  };

  handleEditVitalResponse = (data) => async (e) => {
    e.preventDefault();
    const { editVitalResponse } = this.props;
    const { updateValue } = this.state;
    console.log("018238129 updateValue --> ", { updateValue });
    // editVitalResponse(data);
    try {
      this.setState({ responseLoading: true });
      const response = await editVitalResponse({ ...data, value: updateValue });
      const {
        status,
        payload: {
          data: { vital_date_ids, vital_timeline } = {},
          message: responseMessage = "",
        } = {},
      } = response;
      if (status === true) {
        this.setState({
          vital_date_ids,
          vital_timeline,
          modalVisible: false,
          responseLoading: false,
        });
        message.success(responseMessage);
      } else {
        this.setState({ responseLoading: false });
        message.warn(responseMessage);
      }
    } catch (error) {
      this.setState({ responseLoading: false });
      console.log("handleEditVitalResponse catch error", error);
    }
  };

  handleDeleteVitalResponse = (data) => async (e) => {
    e.preventDefault();
    const { deleteVitalResponse } = this.props;
    try {
      const response = await deleteVitalResponse(data);
      const {
        status,
        payload: {
          data: { vital_date_ids, vital_timeline } = {},
          message: responseMessage = "",
        } = {},
      } = response;
      if (status === true) {
        this.setState({ vital_date_ids, vital_timeline });
        message.success(responseMessage);
      } else {
        message.warn(responseMessage);
      }
    } catch (error) {
      console.log("handleDeleteVitalResponse catch error", error);
    }
  };

  getEventsForDay = (events) => {
    const { intl: { formatMessage } = {}, canViewDetails = false } = this.props;
    const {
      getVitalTemplate,
      openEditVitalResponseModal,
      handleDeleteVitalResponse,
    } = this;

    return events.map((event) => {
      const {
        id,
        status,
        end_time,
        details = {},
        updated_at = "",
      } = event || {};
      // const { response: { value = {}, currentTime } = {} } = details;
      const { response = [] } = details;

      if (response.length > 0) {
        return response.map((res, responseIndex) => {
          const { value = {}, createdTime } = res || {};
          switch (status) {
            case COMPLETED:
              return (
                <Fragment>
                  {Object.keys(value).length > 0 && (
                    <TimelineItem
                      key={id}
                      dot={TIMELINE_STATUS[status].dot}
                      color={TIMELINE_STATUS[status].color}
                      className="pl10 timeline-hover wp100"
                    >
                      <div className="mb6 fs16 fw500">
                        {moment(createdTime).format("LT")}
                      </div>
                      {/*<div className="">*/}
                      {Object.keys(value).map((fieldId, index) => {
                        const { label, placeholder } = getVitalTemplate(
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
                      {!canViewDetails && (
                        <div className="edit-delete-vitals flex align-center">
                          {" "}
                          {/*edit-delete-vitals*/}
                          {/*  EDIT  */}
                          {/*<div onClick={openEditVitalResponseModal({response: res,event, id, index: responseIndex})}>*/}
                          <Button
                            type={"secondary"}
                            onClick={openEditVitalResponseModal({
                              response: res,
                              event,
                              id,
                              index: responseIndex,
                            })}
                          >
                            {this.formatMessage(messages.edit_response_btn)}
                          </Button>
                          {/*</div>*/}
                          {/*  DELETE  */}
                          {/*<div onClick={handleDeleteVitalResponse({id, index: responseIndex})}>*/}
                          <Button
                            type={"danger"}
                            ghost
                            className="ml10 fs14 no-border"
                            onClick={handleDeleteVitalResponse({
                              id,
                              index: responseIndex,
                            })}
                          >
                            {this.formatMessage(messages.delete_response_btn)}
                          </Button>
                          {/*</div>*/}
                        </div>
                      )}

                      {/*</div>*/}
                    </TimelineItem>
                  )}
                </Fragment>
              );
            case EXPIRED:
              return (
                <TimelineItem
                  key={id}
                  dot={TIMELINE_STATUS[status].dot}
                  color={TIMELINE_STATUS[status].color}
                  className="pl10"
                >
                  <div className="fs16 fw500">
                    {moment(end_time).format("LT")}
                  </div>
                  <div className="fs12">
                    {formatMessage(messages.not_recorded)}
                  </div>
                </TimelineItem>
              );
          }
        });
      } else {
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
      }
    });
  };

  getTimeline = () => {
    const { vital_timeline, vital_date_ids } = this.state;
    const { getEventsForDay } = this;

    return vital_date_ids.map((date) => {
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

  closeModal = (e) => {
    this.setState({ modalVisible: false });
  };

  handleResponseUpdate = (fieldId) => (e) => {
    e.preventDefault();
    console.log("1908381293 fieldId, value", {
      fieldId,
      value: e.target.value,
    });
    let { updateValue = {} } = this.state;

    updateValue[fieldId] = e.target.value;
    this.setState({ updateValue });
  };

  getVitalResponseModal = () => {
    const {
      modalVisible = false,
      vitalResponseData = {},
      responseLoading,
    } = this.state;
    const { closeModal, getVitalTemplate, handleResponseUpdate } = this;

    console.log("18737129 vitalResponseData", { vitalResponseData });

    const { response, event, id, index } = vitalResponseData || {};
    const { value } = response || {};

    return (
      <Modal
        visible={modalVisible}
        onCancel={closeModal}
        onOk={this.handleEditVitalResponse({ id, index })}
        closable
        title={this.formatMessage(messages.edit_response_title_text)}
        okButtonProps={{
          loading: responseLoading,
        }}
      >
        {Object.keys(value).map((fieldId, index) => {
          const { label, placeholder } = getVitalTemplate(fieldId, event);

          return (
            <Fragment>
              <div
                key={`${id}-${fieldId}-${index}`}
                className="mb4 fs14 fw500"
              >{`${label}:`}</div>

              <Input
                defaultValue={value[fieldId]}
                suffix={placeholder}
                onChange={handleResponseUpdate(fieldId)}
                className="mb20"
              />
            </Fragment>
          );
        })}
      </Modal>
    );
  };

  render() {
    // const {id} = this.props;
    const { loading, modalVisible } = this.state;
    const { getTimeline, getVitalResponseModal } = this;

    if (loading === true) {
      return <Loading />;
    }

    return (
      <Fragment>
        <div className="wp100 flex direction-column align-start">
          <Timeline className="wp100">{getTimeline()}</Timeline>
        </div>
        {modalVisible && getVitalResponseModal()}
      </Fragment>
    );
  }
}

export default injectIntl(VitalTimeline);
