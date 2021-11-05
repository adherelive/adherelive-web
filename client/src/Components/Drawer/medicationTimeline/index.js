import React, { Component } from "react";
import { injectIntl } from "react-intl";
import Drawer from "antd/es/drawer";

import MedicationTimeline from "../../../Containers/Medications/timeline";
import messages from "./messages";

class MedicationTimelineDrawer extends Component {
  constructor(props) {
    super(props);
  }

  onClose = () => {
    const { close } = this.props;
    close();
  };

  drawerTitle = () => {
    const { medications, id, medicines } = this.props;
    const { basic_info: { details: { medicine_id = "" } = {} } = {} } =
      medications[id] || {};
    const { basic_info: { name = "" } = {} } = medicines[medicine_id] || {};
    return name;
  };

  render() {
    const { visible, intl: { formatMessage } = {} } = this.props;
    const { onClose, drawerTitle } = this;

    return (
      <Drawer
        placement="right"
        maskClosable={false}
        onClose={onClose}
        visible={visible}
        width={"35%"}
        title={formatMessage(
          {
            ...messages.medication_timeline,
          },
          { name: drawerTitle() }
        )}
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
        <MedicationTimeline {...this.props} />
      </Drawer>
    );
  }
}

export default injectIntl(MedicationTimelineDrawer);
