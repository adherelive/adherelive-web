import edit_image from "../../../../Assets/images/edit.svg"
import {getName} from "../../../../Helper/validation";
import React, { Component } from "react";
import { injectIntl } from "react-intl";
// import Icon from "antd/es/rate";
import message from "antd/es/message";
import {getFullName} from "../../../../Helper/common";
import { Icon } from 'antd';

class editPatientColumn extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   isAdded: false
    // };
  }

  componentDidMount(){}

  handleEditPatientDrawer = (e) => {
      e.preventDefault();
      
      const {openEditPatientDrawer,patientData,carePlanData} = this.props;
      openEditPatientDrawer({patientData,carePlanData});
  }

  render(){
      return (
        <div className="edit-patient" onClick={this.handleEditPatientDrawer}>
        <img src={edit_image} className="edit-patient-icon" />
      </div>
      )
  }

}

export default injectIntl(editPatientColumn);
