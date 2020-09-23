import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer } from "antd";
import { GENDER, PATIENT_BOX_CONTENT, MISSED_MEDICATION, MISSED_ACTIONS } from "../../../constant";
import messages from "./message";
import moment from "moment";
import ShareIcon from "../../../Assets/images/redirect3x.png";
import MsgIcon from "../../../Assets/images/chat.png";
// import config from "../../../config/config";


// const { WEB_URL } = config;

class PatientDetailsDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      carePlanId: 1,
      carePlanMedicationIds: [],
      appointmentsListIds:[]
    };
  }

  componentDidMount() {
    const { getMedications, payload: { patient_id } = {}, care_plans = {},getAppointments, appointments={}  } = this.props;
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
      let { basic_info: { id = 1, patient_id: patientId = 1 }, medication_ids = [] , appointment_ids=[] } = carePlan;
      if (parseInt(patient_id) === parseInt(patientId)) {
        carePlanId = id;
        carePlanMedicationIds = medication_ids;
        appointmentsListIds = appointment_ids; 
      }
    }
    this.setState({ carePlanId, carePlanMedicationIds,appointmentsListIds});

    
    if (patient_id) {
      getMedications(patient_id);
      getAppointments(patient_id);
    }
    
  }

  componentDidUpdate(prevProps) {
   
    const { payload: { patient_id } = {}, getMedications, care_plans = {} ,getAppointments, appointments={} } = this.props;
    const { payload: { patient_id: prev_patient_id } = {} } = prevProps;
    let carePlanId = 1;
    let carePlanMedicationIds = [];
    let appointmentsListIds = []; 
    
    for (let carePlan of Object.values(care_plans)) {
      // console.log("careplan id for loop");
      let { basic_info: { id = 1, patient_id : patientId = 1 }, medication_ids = [], appointment_ids = [] } = carePlan;
      if (parseInt(patient_id) === parseInt(patientId)) {
        carePlanId = id;
        carePlanMedicationIds = medication_ids;
        appointmentsListIds = appointment_ids;
      }
    }
    
    
    if (patient_id !== prev_patient_id) {
      getMedications(patient_id);
      getAppointments(patient_id);
      this.setState({ carePlanId, carePlanMedicationIds,appointmentsListIds});

    }
    
  }
  
  

  getFormattedDays = dates => {
    let dayString = [];
    dates.forEach(date => {
      const { day, time } = date || {};
      dayString.push(`${day} at ${time}`);
    });

    return dayString.join(",");
  };

  getMedicationList = () => {
    const { carePlanMedicationIds } = this.state;
    const { medications = {}, medicines = {} } = this.props;
    
    // const { medications: medication_ids = [] } = patients[id] || {};
    const medicationList = carePlanMedicationIds.map(id => {
      const {
        basic_info: {
          start_date,
          end_date,
          details: { medicine_id, repeat_days } = {}
        } = {}
      } = medications[id] || {};

      const { basic_info: { type, name = '' } = {} } = medicines[medicine_id] || {};
      // const { repeat_type, doses, date = [] } = schedule || {};
      return (
        <div key={id} className="flex justify-space-between align-center mb10">
          <div className="pointer tab-color fw600 wp35 tooltip">{name.length > 20 ? name.substring(0, 21) + '...' : name}

            <span className="tooltiptext">{name}</span></div>
          <div className="wp35 tal">{repeat_days ? `${repeat_days.join(", ")}` : '--'}</div>

          <div className="wp20 tar">{end_date ? moment(end_date).format("DD MMM") : "--"}</div>
        </div>
      );
    });


    return medicationList;
  };
  
  getAppointmentList = () => {

    const { appointmentsListIds } = this.state;

    const { appointments = {} } = this.props;
    const appointmentList = appointmentsListIds.map(id => {
      const {
        basic_info: {
          start_date,
          start_time,
          end_time,
          details: { type_description = ""  } = {}
        } = {}
      } = appointments[id] || {};
      let td = moment(start_time);
       return (
        <div key={id} className="flex justify-space-between align-center mb10">
          <div className="pointer tab-color fw600 wp35 tooltip">{type_description.length > 0 ? type_description : " "}

            <span className="tooltiptext">{start_date}</span></div>
          <div className="wp35 tal">{start_time ? td.utc().format('HH:mm') : '--' }</div>

          <div className="wp20 tar">{ start_date ? moment( start_date).format("DD MMM") : "--"}</div>
        </div>
      );
      
    });
    return appointmentList;
   
  }

  openChatTab = () => {

    const { payload: { patient_id } = {}, setPatientForChat, openPopUp } = this.props;
    setPatientForChat(patient_id).then(() => {
      openPopUp()
    }
    );
    // window.open(`http://localhost:3000${getPatientConsultingUrl(patient_id)}`, '_blank');
  }

  handlePatientDetailsRedirect = e => {
    e.preventDefault();
    const { history, payload: { patient_id } = {} } = this.props;
    this.onClose();
    history.push(`/patients/${patient_id}`);

  };

  getPatientDetailContent = () => {
    const { treatments = {}, doctors = {}, conditions = {}, severity: severities = {}, providers, patients, payload, care_plans, } = this.props;
    const {
      formatMessage,
      getMedicationList,
      handlePatientDetailsRedirect,
      openChatTab,
      getAppointmentList
    } = this;

    let { patient_id: id = "" } = payload || {};

    if (id) {

      let carePlanId = 1;
      for (let carePlan of Object.values(care_plans)) {

        let { basic_info: { id: cpId = 1, patient_id: patientId = 1 }, carePlanAppointmentIds = [], carePlanMedicationIds = [] } = carePlan;

        if (parseInt(id) === parseInt(patientId)) {
          carePlanId = cpId;
        }
      }


      const { basic_info: { doctor_id = 1 } = {}, activated_on: start_date, treatment_id = '', severity_id = '', condition_id = '' } = care_plans[carePlanId] || {};
      const { basic_info: { name: treatment = '' } = {} } = treatments[treatment_id] || {};
      const { basic_info: { name: condition = '' } = {} } = conditions[condition_id] || {};
      const { basic_info: { name: severity = '' } = {} } = severities[severity_id] || {};
      const {
        basic_info: { first_name, middle_name, last_name, age = "--", gender, uid = '123456' } = {},
        reports = [],
        provider_id,
      } = patients[id] || {};


      const { basic_info: { first_name: doctor_first_name, middle_name: doctor_middle_name, last_name: doctor_last_name } = {} } = doctors[doctor_id] || {};
      const { basic_info: { name: providerName = "--" } = {} } =
        providers[provider_id] || {};

      return (
        <Fragment>
          {/*<img src={CloseIcon} alt="close icon" onClick={}/>*/}

          {/*header*/}

          <div className="wp100 flex justify-space-between align-center mt20">
            <div className="flex justify-space-around align-center">
              <div className="pr10 fs24 fw600">{`${first_name} ${middle_name ? `${middle_name} ` : ""}${last_name}`}</div>
              <div className="pr10 fs20 fw500">{`(${gender ? `${GENDER[gender].view} ` : ''}${age ? age : '--'})`}</div>
              {/* <Icon type="wechat" width={20} /> */}
              <img
                src={MsgIcon}
                alt="share icon"
                className="pointer w25"
                onClick={openChatTab}
              />
            </div>
            <img
              src={ShareIcon}
              alt="share icon"
              className="pointer w25"
              onClick={handlePatientDetailsRedirect}
            />
          </div>
          <div className="fw700 wp100">{`PID: ${uid}`}</div>

          {/*boxes*/}

          <div className="mt20">
            {Object.keys(PATIENT_BOX_CONTENT).map(id => {
              const { total = "1", critical = "0" } = reports[id] || {};
              return (
                <div
                  key={id}
                  className={`mt10 ${id === MISSED_MEDICATION || id === MISSED_ACTIONS ? "ml16" : ""} mwp45 maxwp48 h100 br5 bg-${PATIENT_BOX_CONTENT[id]["background_color"]} br-${PATIENT_BOX_CONTENT[id]["border_color"]} float-l flex flex-1 direction-column justify-space-between`}
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
                <div className="flex-1">{formatMessage(messages.treatment)}</div>
                <div className="flex-2">{treatment}</div>
              </div>
              <div className="flex justify-space-between align-center">
                <div className="flex-1">{formatMessage(messages.severity)}</div>
                <div className="flex-2">{severity}</div>
              </div>
              <div className="flex justify-space-between align-center">
                <div className="flex-1">{formatMessage(messages.condition)}</div>
                <div className="flex-2">{condition}</div>
              </div>
              <div className="flex justify-space-between align-center">
                <div className="flex-1">{formatMessage(messages.doctor)}</div>
                <div className="flex-2">{doctor_first_name ? `${doctor_first_name} ${doctor_middle_name ? `${doctor_middle_name} ` : ""}${doctor_last_name ? `${doctor_last_name} ` : ""}` : "--"}</div>
              </div>
              <div className="flex justify-space-between align-center">
                <div className="flex-1">{formatMessage(messages.start_date)}</div>
                <div className="flex-2">{start_date ? moment(start_date).format("Do MMM YYYY") : '--'}</div>
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

  formatMessage = data => this.props.intl.formatMessage(data);

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
          mask={false}
          title="   "
          placement="right"
          // closable={false}
          maskClosable={false}
          headerStyle={{
            position: "sticky",
            zIndex: "9999",
            top: "0px"
          }}
          onClose={onClose}
          visible={visible} // todo: change as per state, -- WIP --
          width={600}
          className={'patient-detail-drawer'}
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
