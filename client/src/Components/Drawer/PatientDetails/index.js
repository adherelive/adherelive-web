import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer } from "antd";
import {
  GENDER,
  PATIENT_BOX_CONTENT,
  MISSED_MEDICATION,
  MISSED_ACTIONS,
  DIAGNOSIS_TYPE,
  MISSED_MEDICATION_TEXT,
  MISSED_ACTION_TEXT,
  MISSED_APPOINTMENT_TEXT,
  MISSED_SYMPTOM_TEXT,
  USER_PERMISSIONS,
  MISSED_APPOINTMENTS,
} from "../../../constant";
import messages from "./message";
import moment from "moment";
import message from "antd/es/message";
import ShareIcon from "../../../Assets/images/redirect3x.png";
import MsgIcon from "../../../Assets/images/chat.png";
import { getName } from "../../../Helper/validation";
// import config from "../../../config/config";

// const { WEB_URL } = config;

class PatientDetailsDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      carePlanId: 1,
      carePlanMedicationIds: [],
      appointmentsListIds: [],
      missed_appointment: {},
      missed_vitals: {},
      missed_medications: {},
      missed_symptoms: {},
      // AKSHAY NEW CODE IMPLEMENTATIONS
      patientDetailsData: {},
      patientUserDetails: {},
    };
  }

  componentDidMount() {
    const {
      getMedications,
      payload: { patient_id } = {},
      care_plans = {},
      getAppointments,
      appointments = {},
      patients = {},
      getPatientDetailsById,
    } = this.props;
    let carePlanId = 1;
    let carePlanMedicationIds = [];
    let appointmentsListIds = [];

    // for (let appointment of Object.values(appointments)){

    //   let {basic_info:{id} ,participant_one : {id : participant_one_Id = 1} , participant_two : {id: participant_two_Id = 1}} = appointment;

    //   if (parseInt(patient_id) === parseInt(participant_two_Id)) {
    //     appointmentsListIds.push(id);
    //   }

    // }

    for (let carePlan of Object.values(care_plans)) {
      let {
        basic_info: { id = 1, patient_id: patientId = 1 },
        medication_ids = [],
        appointment_ids = [],
      } = carePlan;
      if (parseInt(patient_id) === parseInt(patientId)) {
        carePlanId = id;
        carePlanMedicationIds = medication_ids;
        appointmentsListIds = appointment_ids;
      }
    }
    this.setState({ carePlanId, carePlanMedicationIds, appointmentsListIds });

    if (patient_id) {
      this.handleGetPatientDetails(patient_id);
      getMedications(patient_id);
      getAppointments(patient_id);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      payload: { patient_id } = {},
      getMedications,
      care_plans = {},
      getAppointments,
      appointments = {},
      getPatientMissedEvents,
      auth: { authenticated_user = null } = {},
      doctors = {},
      getPatientDetailsById,
    } = this.props;
    // console.log("67182736812368761283761287",{props:this.props});
    const { payload: { patient_id: prev_patient_id } = {} } = prevProps;
    let carePlanId = 1;
    let carePlanMedicationIds = [];
    let appointmentsListIds = [];
    let currentDocId = null;

    for (let each in doctors) {
      const doc = doctors[each] || {};
      const { basic_info: { user_id = null } = {} } = doc || {};
      if (authenticated_user.toString() === user_id.toString()) {
        currentDocId = each;
        break;
      }
    }

    for (let carePlan of Object.values(care_plans)) {
      let {
        basic_info: { id = 1, patient_id: patientId = 1, doctor_id = null },
        medication_ids = [],
        appointment_ids = [],
      } = carePlan;
      if (
        parseInt(patient_id) === parseInt(patientId) &&
        parseInt(doctor_id) === parseInt(currentDocId)
      ) {
        carePlanId = id;
        carePlanMedicationIds = medication_ids;
        appointmentsListIds = appointment_ids;
      }
    }

    if (patient_id !== prev_patient_id) {
      this.handleGetPatientDetails(patient_id);
      this.handleGetMissedEvents(patient_id);
      getMedications(patient_id);
      getAppointments(patient_id);

      this.setState({ carePlanId, carePlanMedicationIds, appointmentsListIds });
    }
  }

  async handleGetMissedEvents(patient_id) {
    try {
      const { getPatientMissedEvents } = this.props;
      const response = await getPatientMissedEvents(patient_id);

      const { payload: { data = {} } = {}, status } = response || {};
      const {
        missed_appointment = {},
        missed_vitals = {},
        missed_medications = {},
        missed_symptoms = {},
      } = data || {};

      if (status) {
        this.setState({
          missed_appointment,
          missed_vitals,
          missed_medications,
          missed_symptoms,
        });
      }
    } catch (error) {
      console.log("error -->", error);
      message.warn(this.formatMessage(messages.somethingWentWrong));
    }
  }
  //AKSHAY NEW CODE IMPLEMENTATIONS START
  async handleGetPatientDetails(patient_id) {
    try {
      const { getPatientDetailsById } = this.props;
      const response = await getPatientDetailsById(patient_id);

      const { payload: { data = {} } = {}, status } = response || {};
      const { patients = {}, users = {} } = data || {};

      if (status) {
        this.setState({
          patientDetailsData: patients,
          patientUserDetails: users,
        });
      }
    } catch (error) {
      console.log("error -->", error);
      message.warn(this.formatMessage(messages.somethingWentWrong));
    }
  }
  //AKSHAY NEW CODE IMPLEMENTATIONS END

  getFormattedDays = (dates) => {
    let dayString = [];
    dates.forEach((date) => {
      const { day, time } = date || {};
      dayString.push(`${day} at ${time}`);
    });

    return dayString.join(",");
  };

  getMedicationList = () => {
    const { carePlanMedicationIds } = this.state;
    const { medications = {}, medicines = {} } = this.props;

    // const { medications: medication_ids = [] } = patients[id] || {};
    const medicationList = carePlanMedicationIds.map((id) => {
      const {
        basic_info: {
          start_date,
          end_date,
          details: { medicine_id, repeat_days } = {},
        } = {},
      } = medications[id] || {};

      const { basic_info: { type, name = "" } = {} } =
        medicines[medicine_id] || {};
      // const { repeat_type, doses, date = [] } = schedule || {};
      return (
        <div key={id} className="flex justify-space-between align-center mb10">
          <div className="pointer tab-color fw600 wp35 tooltip">
            {name.length > 20 ? name.substring(0, 21) + "..." : name}

            <span className="tooltiptext">{name}</span>
          </div>
          <div className="wp35 tal">
            {repeat_days ? `${repeat_days.join(", ")}` : "--"}
          </div>

          <div className="wp20 tar">
            {end_date ? moment(end_date).format("DD MMM") : "--"}
          </div>
        </div>
      );
    });

    return medicationList;
  };

  getAppointmentList = () => {
    const { appointmentsListIds } = this.state;

    const { appointments = {}, doctors = {} } = this.props;
    const { formatMessage } = this;
    const appointmentList = appointmentsListIds.map((id) => {
      const {
        basic_info: {
          start_date,
          start_time,
          end_time,
          details: { type_description = "" } = {},
        } = {},
        organizer,
        organizer: { id: organizer_id } = {},
      } = appointments[id] || {};

      let docName = "";

      // for(const doctorId in doctors) {
      //   const {basic_info: {full_name, user_id} = {}} = doctors[doctorId] || {};
      //   if(user_id === organizer_id) {
      //     docName = full_name;
      //   }

      // }

      const { basic_info: { full_name, user_id } = {} } =
        doctors[organizer_id] || {};
      docName = full_name;

      let td = moment(start_time);
      return (
        <div key={id} className="flex justify-space-between align-center mb10">
          <div className="pointer tab-color fw600 wp35 tooltip">
            {type_description.length > 0 ? type_description : " "}

            <span className="tooltiptext">{start_date}</span>
          </div>

          <div className="wp40 tal">
            {formatMessage(
              { ...messages.appointmentDocName },
              { name: docName }
            )}
          </div>
          <div className="wp30 tar">
            {start_time ? td.format("hh:mm A") : "--"}
          </div>

          <div className="wp20 tar">
            {start_date ? moment(start_date).format("DD MMM") : "--"}
          </div>
        </div>
      );
    });
    return appointmentList;
  };

  openChatTab = () => {
    const {
      // payload: { patient_id } = {},
      setCareplanForChat,
      openPopUp,
    } = this.props;
    const { carePlanId } = this.state;

    setCareplanForChat(carePlanId).then(() => {
      openPopUp();
    });
    // window.open(`http://localhost:3000${getPatientConsultingUrl(patient_id)}`, '_blank');
  };

  handlePatientDetailsRedirect = (e) => {
    e.preventDefault();
    const { history, payload: { patient_id } = {} } = this.props;
    this.onClose();
    history.push(`/patients/${patient_id}`);
  };

  getPatientDetailContent = () => {
    const {
      auth = {},
      treatments = {},
      doctors = {},
      conditions = {},
      severity: severities = {},
      providers,
      patients,
      payload,
      care_plans,
      users = {},
    } = this.props;
    const { patientDetailsData, patientUserDetails } = this.state;

    const {
      formatMessage,
      getMedicationList,
      handlePatientDetailsRedirect,
      openChatTab,
      getAppointmentList,
    } = this;

    const { authenticated_user, authPermissions = [] } = auth || {};

    let doctorId = null;

    Object.keys(doctors).forEach((id) => {
      const { basic_info: { user_id } = {} } = doctors[id] || {};

      if (user_id === authenticated_user) {
        doctorId = id;
      }
    });

    let { patient_id: id = "" } = payload || {};

    if (id) {
      let carePlanId = null;

      for (let carePlan of Object.values(care_plans)) {
        let {
          basic_info: { id: cpId = 1, doctor_id = null, patient_id = null },
          carePlanAppointmentIds = [],
          carePlanMedicationIds = [],
        } = carePlan;
        // AKSHAY NEW CODE IMPLEMENTTATIONS
        // if (`${doctorId}` === `${doctor_id}`) {
        if (`${patient_id}` === `${id}`) {
          carePlanId = cpId;
        }
        // }
      }

      const {
        basic_info: { doctor_id = 1 } = {},
        details: {
          treatment_id = "",
          severity_id = "",
          condition_id = "",
          clinical_notes = "",
          diagnosis: { type = "1", description = "" } = {},
          symptoms = "",
        } = {},
        activated_on: start_date,
      } = care_plans[carePlanId] || {};
      const { basic_info: { name: treatment = "" } = {} } =
        treatments[treatment_id] || {};
      const { basic_info: { name: condition = "" } = {} } =
        conditions[condition_id] || {};
      const { basic_info: { name: severity = "" } = {} } =
        severities[severity_id] || {};
      const {
        basic_info: {
          user_id = null,
          first_name,
          middle_name,
          last_name,
          age = "--",
          gender,
          uid = "123456",
        } = {},
        reports = [],
        provider_id,
      } = patientDetailsData[id] || {};
      const { basic_info: { prefix = "91", mobile_number = "" } = {} } =
        patientUserDetails[user_id] || {};

      const {
        basic_info: {
          first_name: doctor_first_name,
          middle_name: doctor_middle_name,
          last_name: doctor_last_name,
        } = {},
      } = doctors[doctor_id] || {};
      const { basic_info: { name: providerName = "--" } = {} } =
        providers[provider_id] || {};
      const diagnosis_type = DIAGNOSIS_TYPE[type];
      const diagnosis = diagnosis_type["value"];
      const {
        missed_appointment = {},
        missed_vitals = {},
        missed_medications = {},
        missed_symptoms = {},
      } = this.state;

      return (
        <Fragment>
          {/*<img src={CloseIcon} alt="close icon" onClick={}/>*/}

          {/*header*/}

          <div className="wp100 flex justify-space-between align-center mt20">
            <div className="flex justify-space-around align-center">
              <div className="pr10 fs24 fw600">{`${getName(
                first_name
              )}  ${getName(middle_name)} ${getName(last_name)}`}</div>
              <div className="pr10 fs20 fw500">{`(${
                gender ? `${GENDER[gender].view} ` : ""
              }${age ? age : "--"})`}</div>
              {/* <Icon type="wechat" width={20} /> */}
              <img
                src={MsgIcon}
                alt="share icon"
                className="pointer w25"
                onClick={openChatTab}
              />
            </div>
            <img
              title={formatMessage(messages.gotoprofile)}
              src={ShareIcon}
              alt="share icon"
              className="pointer w25"
              onClick={handlePatientDetailsRedirect}
            />
          </div>
          <div className="fw700 wp100">{`PID: ${uid}`}</div>
          <div className="fw700 wp100">{`${formatMessage(
            messages.mobile
          )}: +${prefix} ${mobile_number}`}</div>

          {/*boxes*/}

          <div className=" mt20 flex flex-wrap wp100">
            {Object.keys(PATIENT_BOX_CONTENT).map((id) => {
              let critical = 0;
              let non_critical = 0;
              let total = 0;
              if (PATIENT_BOX_CONTENT[id]["text"] === MISSED_SYMPTOM_TEXT) {
                const {
                  critical: symptom_critical = 0,
                  non_critical: symptom_non_critical = 0,
                } = missed_symptoms;
                critical = symptom_critical;
                non_critical = symptom_non_critical;
                total = symptom_critical + symptom_non_critical;
              } else if (
                PATIENT_BOX_CONTENT[id]["text"] === MISSED_APPOINTMENT_TEXT
              ) {
                const {
                  critical: appointment_critical = 0,
                  non_critical: appointment_non_critical = 0,
                } = missed_appointment;
                critical = appointment_critical;
                non_critical = appointment_non_critical;
                total = appointment_critical + appointment_non_critical;
              } else if (
                PATIENT_BOX_CONTENT[id]["text"] === MISSED_ACTION_TEXT
              ) {
                const {
                  critical: vital_critical = 0,
                  non_critical: vital_non_critical = 0,
                } = missed_vitals;
                critical = vital_critical;
                non_critical = vital_non_critical;
                total = vital_critical + vital_non_critical;
              } else if (
                PATIENT_BOX_CONTENT[id]["text"] === MISSED_MEDICATION_TEXT
              ) {
                const {
                  critical: medication_critical = 0,
                  non_critical: medication_non_critical = 0,
                } = missed_medications;
                critical = medication_critical;
                non_critical = medication_non_critical;
                total = medication_critical + medication_non_critical;
              }

              return (
                <div
                  key={id}
                  className={`mt10 ${
                    id === MISSED_MEDICATION || id === MISSED_ACTIONS
                      ? "ml16"
                      : ""
                  } mwp45 maxwp48  h100 br5 bg-${
                    PATIENT_BOX_CONTENT[id]["background_color"]
                  } br-${
                    PATIENT_BOX_CONTENT[id]["border_color"]
                  } float-l flex flex-1 direction-column justify-space-between`}

                  // className={`mt10 ${id === MISSED_MEDICATION ||
                  //   id === MISSED_ACTIONS
                  //   ?
                  //   authPermissions.includes(USER_PERMISSIONS.MEDICATIONS.ADD) ?   "ml16" : null
                  //   : null
                  //   }
                  //    mwp45 maxwp48 h100 br5 bg-${PATIENT_BOX_CONTENT[id]["background_color"]} br-${PATIENT_BOX_CONTENT[id]["border_color"]} float-l flex flex-1 direction-column justify-space-between`}
                >
                  <div className="ml10 mt10 fs16 fw600">
                    {PATIENT_BOX_CONTENT[id]["text"]}
                  </div>
                  <div className="wp90 mauto pb10">
                    <div className="flex justify-space-between align-center">
                      <div className="fs14 fw400">
                        {formatMessage(messages.critical)}
                      </div>
                      <div>{critical}</div>
                    </div>
                    <div className="flex justify-space-between align-center">
                      <div>{formatMessage(messages.no_critical)}</div>
                      <div>{total - critical}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/*details*/}

          <div className="clearfix"></div>

          <div className="mt20 wp100">
            <div className="mt10 mb10 fs18 fw600">
              {formatMessage(messages.patient_details)}
            </div>
            <div className="fw500 black-85">
              <div className="flex justify-space-between align-center">
                <div className="flex-1">
                  {formatMessage(messages.treatment)}
                </div>
                <div className="flex-2">{treatment}</div>
              </div>
              <div className="flex justify-space-between align-center">
                <div className="flex-1">{formatMessage(messages.severity)}</div>
                <div className="flex-2">{severity}</div>
              </div>
              <div className="flex justify-space-between align-center">
                <div className="flex-1">
                  {formatMessage(messages.condition)}
                </div>
                <div className="flex-2">{condition}</div>
              </div>
              <div className="flex justify-space-between align-center">
                <div className="flex-1">{formatMessage(messages.provider)}</div>
                <div className="flex-2">
                  {doctor_first_name
                    ? `${doctor_first_name} ${
                        doctor_middle_name ? `${doctor_middle_name} ` : ""
                      }${doctor_last_name ? `${doctor_last_name} ` : ""}`
                    : "--"}
                </div>
              </div>
              <div className="flex justify-space-between align-center">
                <div className="flex-1">
                  {formatMessage(messages.clinicalNotes)}
                </div>
                <div className="flex-2">
                  {clinical_notes ? clinical_notes : "--"}
                </div>
              </div>

              <div className="flex justify-space-between align-center">
                <div className="flex-1">
                  {formatMessage(messages.diagnosisDesc)}
                </div>

                <div className="flex-2">
                  {description
                    ? `${description} (${diagnosis})`
                    : `${"--"} (${diagnosis})`}
                </div>
              </div>
              <div className="flex justify-space-between align-center">
                <div className="flex-1">{formatMessage(messages.symptoms)}</div>
                <div className="flex-2">{symptoms ? symptoms : "--"}</div>
              </div>
              <div className="flex justify-space-between align-center">
                <div className="flex-1">
                  {formatMessage(messages.start_date)}
                </div>
                <div className="flex-2">
                  {start_date ? moment(start_date).format("Do MMM YYYY") : "--"}
                </div>
              </div>
              <div className="flex justify-space-between align-center">
                <div className="flex-1">{formatMessage(messages.provider)}</div>
                <div className="flex-2">{providerName}</div>
              </div>
            </div>
          </div>

          {/*medications*/}

          <div className="mt20 black-85 wp100">
            <div className="mt10 mb10 fs18 fw600">
              {formatMessage(messages.medications)}
            </div>

            {getMedicationList()}
          </div>

          {/*appointments*/}

          <div className="mt20 black-85 wp100">
            <div className="mt10 mb10 fs18 fw600">
              {formatMessage(messages.appointments)}
            </div>

            {getAppointmentList()}
          </div>
        </Fragment>
      );
    }
  };

  formatMessage = (data, other = {}) =>
    this.props.intl.formatMessage(data, other);

  onClose = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { visible } = this.props;
    const { onClose, getPatientDetailContent } = this;

    if (visible !== true) {
      return null;
    }
    return (
      <Fragment>
        <Drawer
          mask={true}
          title="   "
          placement="right"
          // closable={false}
          maskClosable={false}
          headerStyle={{
            position: "sticky",
            zIndex: "9999",
            top: "0px",
          }}
          onClose={onClose}
          visible={visible} // todo: change as per state, -- WIP --
          width={600}
          className={"patient-detail-drawer"}
        >
          {getPatientDetailContent()}
        </Drawer>
        {/*<ChatComponent {...this.props}/>*/}
        {/*<div className="chat-container">*/}

        {/*</div>*/}
      </Fragment>
    );
  }
}

export default injectIntl(PatientDetailsDrawer);
