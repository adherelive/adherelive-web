import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";

import ProviderTable from "../../../Containers/Provider/table";
import AddProviderDrawer from "../../../Containers/Drawer/addProvider";
import UpdateProviderDrawer from "../../../Containers/Drawer/updateProvider";
import messages from "./messages";

import Button from "antd/es/button";

class AdminProviderViewPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  addProvider = () => {
    const { openAddProviderDrawer } = this.props;
    openAddProviderDrawer();
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  hideUpdateProviderVisible = () => {
    this.setState({
      updateProviderVisible: false,
    });
  };

  render() {
    const { addProvider } = this;

    const { updateProviderVisible = false, provider_id = null } = this.state;

    return (
      <Fragment>
        <div className="wp100 flex direction-column">
          <div className="flex align-center justify-space-between p18 fs30 fw700 ">
            {this.formatMessage(messages.providers)}

            <Button type="primary" onClick={addProvider}>
              {" "}
              {this.formatMessage(messages.add)}{" "}
            </Button>
          </div>
          <div className="wp100 pl14 pr14 flex align-center justify-center">
            <ProviderTable />
          </div>
        </div>

        <AddProviderDrawer />

        <UpdateProviderDrawer />
      </Fragment>
    );
  }
}

export default injectIntl(AdminProviderViewPage);
