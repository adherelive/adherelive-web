import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { Avatar, Input, message } from "antd";
import messages from "./messages";

const Header = ({ handleSearch, formatMessage }) => {
  return (
    <div className="chat-patientListheader">
      <Input
        className="patientSearch"
        placeholder={formatMessage(messages.searchPatient)}
        onChange={handleSearch}
      />
    </div>
  );
};

const PatientCard = ({
  setPatientId,
  patientId,
  patientName = "",
  patientDp = "",
}) => {
  let pic = patientName ? (
    <Avatar src={patientDp}>{patientName[0]}</Avatar>
  ) : (
    <Avatar src={patientDp} icon="user" />
  );
  return (
    <div className="chat-patient-card" onClick={setPatientId(patientId)}>
      {pic}
      <div className="patient-name-chat">{patientName}</div>
    </div>
  );
};

class PatientListSideBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctorName: "",
      docDp: "",
      allPatientIds: [],
      searchPatientIds: [],
      searchText: "",
    };
    // this.handlePatientSearch = throttle(this.handlePatientSearch.bind(this), 2000);
  }

  handlePatientSearch = (e) => {
    let { patients = {} } = this.props;
    let { allPatientIds } = this.state;
    let newsearchPatientIds = [];
    let textToSearch = "";
    // if (e) {
    //     if (e.target && e.target.value) {
    textToSearch = e.target.value;
    newsearchPatientIds = allPatientIds.filter((patId) => {
      const {
        basic_info: {
          id = 0,
          first_name = "",
          middle_name = "",
          last_name = "",
        } = {},
      } = patients[patId];
      let firstName = first_name ? first_name : "";
      let middleName = middle_name ? middle_name : "";
      let lastName = last_name ? last_name : "";
      console.log("67598587659769", first_name, middle_name, last_name);
      return (
        firstName.includes(textToSearch) ||
        middleName.includes(textToSearch) ||
        lastName.includes(textToSearch)
      );
    });
    //     }
    // }
    // if (textToSearch && newsearchPatientIds.length) {
    this.setState({
      searchText: textToSearch,
      searchPatientIds: newsearchPatientIds,
    });
    // } else if (textToSearch) {
    //     this.setState({ searchText: textToSearch });
    // }
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  componentDidMount() {
    let { doctors = {}, authenticated_user = 1, patients = {} } = this.props;
    let doctorName = "";
    let doctorDp = "";
    for (let doc of Object.values(doctors)) {
      let {
        basic_info: {
          user_id,
          first_name = "",
          middle_name = "",
          last_name = "",
          profile_pic = "",
        },
      } = doc;
      if (parseInt(user_id) === parseInt(authenticated_user)) {
        doctorName = first_name
          ? `${first_name} ${middle_name ? `${middle_name} ` : ""}${
              last_name ? `${last_name}` : ""
            }`
          : "";
        doctorDp = profile_pic;
      }
    }
    this.setState({
      doctorName,
      doctorDp,
      allPatientIds: Object.keys(patients),
      searchPatientIds: Object.keys(patients),
    });
  }

  renderPatients = () => {
    const { patients = {}, setPatientId, patientId = 1 } = this.props;
    const { searchPatientIds } = this.state;
    let allPatients = Object.values(searchPatientIds).map((patient) => {
      const {
        basic_info: {
          id = 0,
          first_name = "",
          middle_name = "",
          last_name = "",
        } = {},
        details: { profile_pic: patientDp = "" } = {},
      } = patients[patient];
      return (
        <div
          key={id}
          className={
            parseInt(id) === parseInt(patientId)
              ? "chat-patient-card-parent-selected"
              : "chat-patient-card-parent"
          }
        >
          <PatientCard
            setPatientId={setPatientId}
            patientId={id}
            patientName={
              first_name
                ? `${first_name} ${middle_name ? `${middle_name} ` : ""}${
                    last_name ? `${last_name}` : ""
                  }`
                : ""
            }
            patientDp={patientDp}
          />
        </div>
      );
    });
    return allPatients;
  };

  render() {
    // let { doctorName = '', doctorDp = '' } = this.state;

    return (
      <div className="patientList-component-container">
        <Header
          handleSearch={this.handlePatientSearch}
          formatMessage={this.formatMessage}
        />
        <div className="patientList-list-component-container">
          {this.renderPatients()}
        </div>
      </div>
    );
  }
}

export default injectIntl(PatientListSideBar);
