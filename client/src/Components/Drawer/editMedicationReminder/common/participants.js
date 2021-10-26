import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Select, Radio, Form, Checkbox, Input } from "antd";
import moment from "moment";
import {
  USER_CATEGORY,
  EVENT_TYPE,
  USER_STATUS,
  ACTIVITY_TYPE,
  APPOINTMENT_TYPE,
} from "../../../../constant";
import messages from "../message";
// import dropDownIcon from "../../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import userPlaceHolder from "../../../../Assets/images/ico-placeholder-userdp.svg";
import searchIcon from "../../../../Assets/images/ico-search.svg";
import activityTypeField from "./appointmentType";
import activityModeField from "./activityMode";

// const DropDownIcon = <img src={dropDownIcon} alt="d" className="w24 h24" />;
const SearchIcon = <img src={searchIcon} alt="s" className="w18 h18" />;

const { Group: RadioGroup, Button: RadioButton } = Radio;
const { Option, OptGroup } = Select;
const { Item: FormItem } = Form;

const FIELD_NAME = "participantTwo";

// class RemindMyCareCoach extends Component {
//   constructor(props) {
//     super(props);
//     const { purpose, otherUser: { basicInfo: { _id } = {} } = {} } = this.props;
//     this.state = {
//       remindCareCoach: purpose && _id ? true : false
//     };
//   }

//   setRemindCareCoachAlso = () => {
//     const {
//       currentUser: { programIds = [] } = {},
//       form: { setFieldsValue }
//     } = this.props;

//     const { careCoach } = programIds[0] || {};

//     const { remindCareCoach, random } = this.state;

//     if (remindCareCoach) {
//       setFieldsValue({ [FIELD_NAME]: careCoach });
//     } else {
//       setFieldsValue({ [FIELD_NAME]: random });
//     }
//   };

//   onChangeRemindCareCoach = e => {
//     this.setState(
//       { remindCareCoach: e.target.checked },
//       this.setRemindCareCoachAlso
//     );
//   };

//   formatMessage = data => this.props.intl.formatMessage(data);

//   render() {
//     const { remindCareCoach } = this.state;
//     const {
//       form: { getFieldDecorator },
//       purpose
//     } = this.props;
//     const { onChangeRemindCareCoach, formatMessage } = this;
//     return (
//       <Fragment>
//         <FormItem style={{ display: "none" }}>
//           {getFieldDecorator(FIELD_NAME, {})(<Input />)}
//         </FormItem>

//         <div className="flex justify-content-space-between mb24">
//           <div className="fontsize14 black">
//             {formatMessage(messages.remindMyCareCoach)}
//           </div>
//           <Checkbox
//             defaultChecked={remindCareCoach}
//             disabled={!!purpose}
//             onChange={onChangeRemindCareCoach}
//           />
//         </div>
//       </Fragment>
//     );
//   }
// }

class Participants extends Component {
  componentDidMount() {
    const {
      form: { validateFields },
    } = this.props;
    validateFields();
  }

  getParentNode = (t) => t.parentNode;

  getInitialValue = () => {
    const {
      currentUser: { basicInfo: { category }, programIds = [] } = {},
      purpose,
      otherUser: { basicInfo: { _id } = {} } = {},
    } = this.props;

    if (purpose) {
      return _id;
    }

    const { careCoach } = programIds[0] || {};

    if (category === USER_CATEGORY.PATIENT) {
      return careCoach;
    }
  };

  insertUserEntry = (users) => {
    const userOptions = [];
    users.forEach((user) => {
      const {
        basicInfo: { _id, name, profilePicLink = userPlaceHolder },
        personalInfo: { dob, gender } = {},
      } = user;
      const years = dob && moment().diff(dob, "years", false);
      userOptions.push(
        <Option key={_id} value={_id} name={name}>
          <div className="flex justify-content-start align-items-center">
            <img alt={"user"} src={profilePicLink} />
            <div className="deep-sea-blue fontsize12 mr8">{`${name}${
              years ? ` (${years} ${gender})` : ""
            }`}</div>
          </div>
        </Option>
      );
    });
    return userOptions;
  };

  getParticipantOption = () => {
    const { members = [] } = this.props;
    let options = [];
    const doctors = members.filter((member) => {
      const { basicInfo: { category } = {} } = member || {};
      return (
        category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP
      );
    });
    const patients = members.filter((member) => {
      const { basicInfo: { category } = {}, status } = member || {};

      return (
        category === USER_CATEGORY.PATIENT && status === USER_STATUS.ENROLLED
      );
    });
    const careCoach = members.filter((member) => {
      const { basicInfo: { category } = {} } = member || {};

      return category === USER_CATEGORY.CARE_COACH;
    });
    if (doctors.length > 0) {
      options.push(
        <OptGroup key={"doctor"} label={`Doctors (${doctors.length})`}>
          {this.insertUserEntry(doctors)}
        </OptGroup>
      );
    }
    if (patients.length > 0) {
      options.push(
        <OptGroup key={"patient"} label={`Patients (${patients.length})`}>
          {this.insertUserEntry(patients)}
        </OptGroup>
      );
    }

    if (careCoach.length > 0) {
      options.push(
        <OptGroup key={"careCoach"} label={`Carecoaches (${careCoach.length})`}>
          {this.insertUserEntry(careCoach)}
        </OptGroup>
      );
    }
    return options;
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onChangeParticpantRadioGroup = (e) => {
    e.preventDefault();
    const {
      members = [],
      form: { setFieldsValue },
    } = this.props;
    const value = e.target.value;
    let category;
    members.forEach((member) => {
      const { basicInfo: { _id, category: memberCategory } = {} } = member;
      if (_id === value) {
        category = memberCategory;
      }
    });
    if (category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP) {
      setFieldsValue({
        [activityTypeField.field_name]: APPOINTMENT_TYPE.FOLLOWUP,
        [activityModeField.field_name]: ACTIVITY_TYPE.CHAT,
      });
    }
  };

  onChangeParticipant = () => {
    const { onPatientChange } = this.props;
    if (onPatientChange) {
      onPatientChange();
    }
  };

  render() {
    const {
      form: { getFieldDecorator, isFieldTouched, getFieldError },
      currentUser: { basicInfo: { category }, programIds = [] } = {},
      eventMode = "appointment",
      purpose,
      setParticipantTwo,
    } = this.props;
    const {
      getParticipantOption,
      formatMessage,
      onChangeParticpantRadioGroup,
      getInitialValue,
      onChangeParticipant,
    } = this;

    const participantError =
      isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);

    const { careCoach, doctor } = programIds[0] || {};

    // if (
    //   eventMode === EVENT_TYPE.REMINDER &&
    //   category === USER_CATEGORY.PATIENT
    // ) {
    //   return <RemindMyCareCoach {...this.props} />;
    // }

    // if (
    //   eventMode === EVENT_TYPE.MEDICATION_REMINDER &&
    //   category === USER_CATEGORY.PATIENT
    // ) {
    //   return null;
    // }

    return (
      <Fragment>
        <div>
          {(USER_CATEGORY.CARE_COACH === "PATIENT" ||
            USER_CATEGORY.DOCTOR === category) && (
            <FormItem
              label={`${
                eventMode === EVENT_TYPE.APPOINTMENT
                  ? formatMessage(messages.alongWithLabelAppointment)
                  : formatMessage(messages.alongWithLabelReminder)
              }`}
              validateStatus={participantError ? "error" : ""}
              help={participantError || ""}
            >
              {getFieldDecorator(FIELD_NAME, {
                rules: [
                  {
                    required: true,
                    message: "Enter participant",
                  },
                ],
                initialValue: getInitialValue(),
              })(
                <Select
                  className="user-select"
                  placeholder={
                    eventMode === EVENT_TYPE.MEDICATION_REMINDER
                      ? formatMessage(
                          messages.medicationReminderAlongWithPlaceHolder
                        )
                      : formatMessage(messages.alongWithPlaceHolder)
                  }
                  showSearch
                  disabled={!!purpose}
                  autoComplete="off"
                  optionFilterProp="name"
                  suffixIcon={SearchIcon}
                  onChange={setParticipantTwo}
                  onBlur={onChangeParticipant}
                  getPopupContainer={this.getParentNode}
                >
                  {getParticipantOption()}
                </Select>
              )}
            </FormItem>
          )}
        </div>
        {USER_CATEGORY.PATIENT === category && (
          <Fragment>
            <div className="label-color pb5 fontsize12">
              {formatMessage(messages.alongWithLabelAppointment)}
            </div>
            <FormItem>
              {getFieldDecorator(FIELD_NAME, {
                rules: [
                  {
                    required: true,
                    message: "Enter participant",
                  },
                ],
                initialValue: getInitialValue(),
              })(
                <RadioGroup
                  className="radio-group-tab"
                  buttonStyle="solid"
                  disabled={!!purpose}
                  onChange={onChangeParticpantRadioGroup}
                >
                  <RadioButton
                    key={"careCoach"}
                    className="full-width"
                    value={careCoach}
                  >
                    My Care Coach
                  </RadioButton>
                  <RadioButton
                    key={"doctor"}
                    className="full-width"
                    value={doctor}
                  >
                    My Doctor
                  </RadioButton>
                </RadioGroup>
              )}
            </FormItem>
          </Fragment>
        )}
      </Fragment>
    );
  }
}

const Field = injectIntl(Participants);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
