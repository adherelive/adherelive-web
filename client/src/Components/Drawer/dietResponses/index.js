import React, { Component } from "react";
import { injectIntl } from "react-intl";
import Drawer from "antd/es/drawer";

import DietTimeline from "../../../Containers/Diets/timeline";
import messages from "./messages";

class dietResponseDrawer extends Component {
  constructor(props) {
    super(props);
  }

  onClose = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const {
      visible,
      intl: { formatMessage } = {},
      diet_name = "",
    } = this.props;
    const { onClose } = this;

    return (
      <Drawer
        placement="right"
        maskClosable={false}
        onClose={onClose}
        visible={visible}
        width={"35%"}
        title={formatMessage({ ...messages.title }, { diet_name })}
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
        <DietTimeline {...this.props} />
      </Drawer>
    );
  }
}

export default injectIntl(dietResponseDrawer);
