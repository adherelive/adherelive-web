import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";

import DoctorTable from "../../../Containers/Doctor/table";
import messages from "./messages";

class AdminDoctorPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Fragment>
        <div className="wp100 flex direction-column">
          <div className="p18 fs30 fw700 ">
            {this.props.intl.formatMessage(messages.profiles)}
          </div>
          <div className="wp100 pl14 pr14 flex align-center justify-center">
            <DoctorTable />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default injectIntl(AdminDoctorPage);
