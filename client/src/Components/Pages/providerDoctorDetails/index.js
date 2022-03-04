import React, { Component } from "react";
import { injectIntl } from "react-intl";
// import DoctorDetailsPage from "../../../Containers/Pages/doctorDetails";
import DoctorEditDetailsPage from "../../../Containers/Pages/doctorProfilePage";

class ProviderDoctorDetails extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { id, doctors, users } = this.props;
    const { basic_info: { user_id } = {} } = doctors[id] || {};

    // todo: to be used for verified check to toggle between edit and view pages for doctor
    // const {activated_on} = users[user_id] || {};

    return (
      // activated_on ? <DoctorDetailsPage id={id} /> : <DoctorEditDetailsPage />
      // <DoctorDetailsPage id={id} />
      <DoctorEditDetailsPage id={id} />
    );
  }
}

export default injectIntl(ProviderDoctorDetails);
