import React, { Component } from "react";
import { injectIntl } from "react-intl";

class PatientDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const { id = 0 } = this.props;
    return <div>{id}</div>;
  }
}

export default injectIntl(PatientDetails);
