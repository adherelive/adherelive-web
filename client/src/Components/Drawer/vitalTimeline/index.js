import React, { Component } from "react";
import { injectIntl } from "react-intl";
import Drawer from "antd/es/drawer";

import VitalTimeline from "../../../Containers/Vitals/timeline";
import messages from "./messages";

class VitalTimelineDrawer extends Component {
  constructor(props) {
    super(props);
  }

  onClose = () => {
    const { close } = this.props;
    close();
  };

  drawerTitle = () => {
    const { vitals, vital_templates, id } = this.props;
    const { basic_info: { vital_template_id } = {} } = vitals[id] || {};
    const { basic_info: { name } = {} } =
      vital_templates[vital_template_id] || {};

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
            ...messages.vital_timeline,
          },
          { name: drawerTitle() }
        )}
      >
        <VitalTimeline {...this.props} />
      </Drawer>
    );
  }
}

export default injectIntl(VitalTimelineDrawer);
