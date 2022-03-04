import edit_image from "../../../../Assets/images/edit.svg";
import React, { Component } from "react";
import { injectIntl } from "react-intl";

class editPatientColumn extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  handleEditPatientDrawer = (e) => {
    e.preventDefault();

    const { openEditPatientDrawer, patientData, carePlanData } = this.props;
    openEditPatientDrawer({ patientData, carePlanData });
  };

  render() {
    return (
      <div className="edit-patient" onClick={this.handleEditPatientDrawer}>
        <img src={edit_image} className="edit-patient-icon" />
      </div>
    );
  }
}

export default injectIntl(editPatientColumn);
