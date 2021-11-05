import React, { Component } from "react";
import { injectIntl } from "react-intl";
import Drawer from "antd/es/drawer";

import WorkoutTimeline from "../../../Containers/Workouts/timeline";
import messages from "./messages";
import ResponseDetailsDrawer from "../../../Containers/Drawer/workoutResponseEventDetails";

class WorkoutResponseDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailsDrawerVisible: false,
      schedule_event_id: null,
      date: null,
    };
  }

  onClose = () => {
    const { close } = this.props;
    close();
  };

  openWorkoutResponseDetails = ({ schedule_event_id, date }) => {
    this.setState({
      detailsDrawerVisible: true,
      schedule_event_id,
      date,
    });
  };

  closeWorkoutResponseDetails = () => {
    this.setState({
      detailsDrawerVisible: false,
      schedule_event_id: null,
    });
  };

  render() {
    const {
      visible,
      intl: { formatMessage } = {},
      workout_name = "",
    } = this.props;
    const { onClose } = this;
    const {
      schedule_event_id = null,
      detailsDrawerVisible = false,
      date = null,
    } = this.state;

    return (
      <Drawer
        placement="right"
        maskClosable={false}
        onClose={onClose}
        visible={visible}
        width={"35%"}
        title={formatMessage({ ...messages.title }, { workout_name })}
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
        <WorkoutTimeline
          {...this.props}
          workout_name={workout_name}
          openWorkoutResponseDetails={this.openWorkoutResponseDetails}
        />
        <ResponseDetailsDrawer
          workout_name={workout_name}
          date={date}
          schedule_event_id={schedule_event_id}
          visible={detailsDrawerVisible}
          closeWorkoutResponseDetails={this.closeWorkoutResponseDetails}
        />
      </Drawer>
    );
  }
}

export default injectIntl(WorkoutResponseDrawer);
