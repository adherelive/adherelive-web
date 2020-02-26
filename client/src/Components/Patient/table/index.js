import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Table } from "antd";

class PatientTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return <div>Table</div>;
  }
}

export default injectIntl(PatientTable);
