import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import messages from "./message";
import message from "antd/es/message";
import { getName } from "../../Helper/validation";
import { withRouter } from "react-router-dom";
import throttle from "lodash-es/throttle";
import debounce from "lodash-es/debounce";
import { SearchOutlined } from "@ant-design/icons";

import {
  Drawer,
  Icon,
  Select,
  Input,
  Button,
  Spin,
  Radio,
  DatePicker,
  Menu,
  Dropdown,
  Tooltip,
  Avatar,
} from "antd";

const { Option } = Select;

class SearchPatient extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInput: "",
      fetchingPatients: false,
      patient_ids: [],
      users: {},
    };

    this.handlePatientSearch = debounce(
      this.handlePatientSearch.bind(this),
      2000
    );
  }

  componentDidMount() {}

  formatMessage = (data) => this.props.intl.formatMessage(data);

  handlePatientDetailsRedirect = (patient_id) => {
    // e.preventDefault();
    const { patients, isPatientAvailable } = this.state;
    let isPatientAvailableForDoctor = isPatientAvailable[patient_id];

    if (isPatientAvailableForDoctor === true) {
      const { history } = this.props;
      history.push(`/patients/${patient_id}`);
    } else {
      let patientSearchAllData = this.state;
      this.props.setAddPatientAfterSearch(patient_id, patientSearchAllData);
      this.setState({
        patient_ids: [],
        users: {},
        patients: {},
        isPatientAvailable: {},
      });
    }
  };

  setInput = (value) => {
    const { searchPatientForDoctor } = this.props;

    this.setState({ searchInput: value });

    if (value.length === 10) {
      {
        // this.handlePatientSearch(value);
        this.handlePatientSearch(value);
      }
    } else {
      this.setState({
        patient_ids: [],
      });
    }
  };

  getMenuItem = (
    first_name,
    middle_name,
    last_name,
    // email,
    profile_pic,
    patient_id,
    user_mobile_numer
    // user_prefix
  ) => {
    let initials = `${first_name ? first_name[0] : ""}${
      last_name ? last_name[0] : ""
    }`;

    const { isPatientAvailable } = this.state;

    // AKSHAY NEW CODE IMPLEMENTATIONS
    let isPatientAvailableForDoctor = isPatientAvailable[patient_id];

    return (
      <div
        className="flex direction-row  justify-space-between"
        onClick={() => this.handlePatientDetailsRedirect(patient_id)}
      >
        <div className=" wp10 flex direction-column align-center justify-center">
          <Tooltip placement="right">
            {initials ? (
              <Avatar src={profile_pic}>{initials}</Avatar>
            ) : (
              <Avatar icon="user" />
            )}
          </Tooltip>
        </div>
        <div className="flex direction-column ha wp85">
          <span className="fs16 fw700 ellipsis ">
            {" "}
            {`${first_name}  ${getName(middle_name)} ${getName(last_name)}`}
          </span>
          {isPatientAvailableForDoctor !== true && (
            <span className="flex direction-row justify-space-between">
              {/* <span>
             +{user_prefix}-{user_mobile_numer}
           </span> */}
              <span
                style={{ color: "red", textAlign: "justify" }}
                className="mr16 text-center "
              >
                This is not your patient , please add this patient <br /> to
                your profile
              </span>
            </span>
          )}

          {/* <span className="flex direction-row justify-space-between">
            <span>
              +{user_prefix}-{user_mobile_numer}
            </span>
            <span className="mr16 text-center ">{email ? email : "--"}</span>
          </span> */}
        </div>
      </div>
    );
  };

  getPatientOptions = () => {
    // const { patients } = this.props;
    // AKSHAY NEW CODE IMPLEMENTATIONS
    const { patients } = this.state;
    const { patient_ids, users, searchInput = "" } = this.state;
    let options = [];
    const { fetchingPatients } = this.state;

    // for (let id of patient_ids) {
    //   const {
    //     basic_info: { first_name, middle_name, last_name, user_id = null } = {},
    //     details: { profile_pic = null } = {},
    //   } = patients[id] || {};
    //   const {
    //     basic_info: {
    //       email = "",
    //       mobile_number: user_mobile_numer = "",
    //       prefix: user_prefix = "",
    //     } = {},
    //   } = users[user_id] || {};
    //   options.push(
    //     <Option
    //       key={id}
    //       value={id}
    //       name={`${first_name}  ${getName(middle_name)} ${getName(last_name)}`}
    //       className="w400"
    //     >
    //       {this.getMenuItem(
    //         first_name,
    //         middle_name,
    //         last_name,
    //         email,
    //         profile_pic,
    //         id,
    //         user_mobile_numer,
    //         user_prefix
    //       )}
    //     </Option>
    //   );
    // }

    // AKSHAY NEW CODE IMPLEMENTATIONS

    for (let id of patient_ids) {
      const {
        basic_info: {
          first_name,
          middle_name,
          last_name,
          full_name: patient_full_name,
          user_id = null,
        } = {},

        details: { profile_pic = null } = {},
      } = patients[id] || {};
      const {
        basic_info: {
          email = "",
          mobile_number: user_mobile_numer = "",
          prefix: user_prefix = "",
        } = {},
      } = users[user_id] || {};

      let full_name = patient_full_name;
      if (
        !patient_full_name ||
        patient_full_name === "" ||
        patient_full_name === null
      ) {
        full_name = `AdhereLive Patient: ${id}`;
      }
      options.push(
        <Option
          key={id}
          value={id}
          name={full_name}
          className={`${
            !patient_full_name ||
            patient_full_name === "" ||
            patient_full_name === null
              ? "italic fw600"
              : ""
          }`}
        >
          {this.getMenuItem(
            first_name,
            middle_name,
            last_name,
            // email,
            profile_pic,
            id,
            user_mobile_numer
            // user_prefix
          )}
        </Option>
      );
    }

    if (
      options.length === 0 &&
      searchInput !== "" &&
      fetchingPatients === false
    ) {
      options.push(
        <Option key={"no-match-found"} className="w400">
          {this.formatMessage(messages.noMatch)}
        </Option>
      );
    }

    return options;
  };

  // async handlePatientSearch(data) {
  //   try {
  //     if (data) {
  //       this.setState({ fetchingPatients: true });

  //       const { searchPatientForDoctor, patients } = this.props;
  //       const response = await searchPatientForDoctor(data);
  //       const {
  //         status,
  //         payload: {
  //           data: {
  //             patient_ids: response_patient_ids = [],
  //             users = {},
  //             patients: response_patients = {},
  //           },
  //         } = {},
  //       } = response || {};

  //       if (status) {
  //         if (response_patient_ids.length > 0) {
  //           this.setState({
  //             patient_ids: response_patient_ids,
  //             users,
  //             fetchingPatients: false,
  //           });
  //         } else {
  //           this.setState({
  //             patient_ids: [],
  //             fetchingPatients: false,
  //           });
  //         }
  //       } else {
  //         this.setState({
  //           patient_ids: [],
  //           fetchingPatients: false,
  //         });
  //       }
  //     } else {
  //       this.setState({
  //         patient_ids: [],
  //         fetchingPatients: false,
  //       });
  //     }
  //   } catch (err) {
  //     console.log("err23423423423423432432432", err);
  //     this.setState({ patient_ids: [], fetchingPatients: false });
  //     message.warn(this.formatMessage(messages.somethingWentWrongError));
  //   }
  // }

  // AKSHAY NEW CODE IMPLEMENTATIONS

  async handlePatientSearch(data) {
    try {
      if (data) {
        this.setState({ fetchingPatients: true });
        const { searchPatientFromNum } = this.props;
        const response = await searchPatientFromNum(data);
        const {
          status,
          payload: {
            data: {
              patient_ids: response_patient_ids = [],
              patients,
              users = {},
              isPatientAvailable = {},
            },
          } = {},
        } = response || {};
        // console.log("Patient search Response =====>",response);
        if (status) {
          if (response_patient_ids.length > 0) {
            this.setState({
              patient_ids: response_patient_ids,
              fetchingPatients: false,
              patients,
              users,
              isPatientAvailable,
            });
          } else {
            this.setState({
              patient_ids: [],
              fetchingPatients: false,
            });
          }
        } else {
          this.setState({ fetchingPatients: false });
        }
      } else {
        this.setState({ fetchingPatients: false });
      }
    } catch (err) {
      console.log("err", err);
      message.warn(this.formatMessage(messages.somethingWentWrong));
      this.setState({ fetchingPatients: false });
    }
  }

  // patientChanged = (patient_id) => {
  //   this.handlePatientDetailsRedirect(patient_id);
  // };

  render() {
    const { searchInput = "" } = this.state;
    const { formatMessage } = this;
    return (
      <div className="flex direction-row justify-space-between align-center w400 ">
        <Select
          placeholder={this.formatMessage(messages.searchPatient)}
          value={this.formatMessage(messages.searchPatient)}
          className=" w400  patient-search "
          notFoundContent={
            this.state.fetchingPatients ? <Spin size="small" /> : ""
          }
          showSearch
          onSearch={this.setInput}
          // onChange={this.patientChanged}
          autoComplete="off"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children
              .toString()
              .toLowerCase()
              .indexOf(option.props.children.toString().toLowerCase()) > -1
          }
          suffixIcon={<SearchOutlined className="patient-search-icon" />}
        >
          {this.getPatientOptions()}
        </Select>
      </div>
    );
  }
}

export default withRouter(injectIntl(SearchPatient));
