import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, message, Spin } from "antd";
import MissedMedicationCard from "../../Cards/patient/missedMedication";
import { USER_CATEGORY } from "../../../constant";

import messages from "./message";

class MissedMedicationsDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      missed_medications: {},
      criticalMedicationIds: [],
      nonCriticalMedicationIds: [],
      fetching: false,
    };
  }

  componentDidMount() {
    // this.getMissedMedication();
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onClose = () => {
    const { close } = this.props;
    close();
  };

  // getMissedMedication = async () => {
  //   try {
  //     const { getAllMissedScheduleEvents, missed_medications, medication_ids: {critical, non_critical} = {} } = this.props;
  //     // this.setState({fetching:true});
  //     // const response = await getAllMissedScheduleEvents();
  //     // const {
  //     //   status,
  //     //   payload: {
  //     //     data: {
  //     //       missed_medications = {},
  //     //       medication_ids : {critical=[],non_critical=[]} =  {}
  //     //     }
  //     //   } = {},
  //     //   statusCode
  //     // } = response || {};
  //     //
  //     //
  //     // if (status && statusCode === 200) {
  //       this.setState({
  //         missed_medications: missed_medications,
  //         criticalMedicationIds: critical,
  //         nonCriticalMedicationIds: non_critical,
  //         // fetching:false
  //       });
  //     // }else{
  //     //   this.setState({fetching:false})
  //     // }
  //   } catch (err) {
  //     console.log("err", err);
  //     message.warn(this.formatMessage(messages.somethingWentWrong));
  //     this.setState({fetching:false});
  //   }
  // };

  handlePatientDetailsRedirect = (patient_id) => (e) => {
    const { authenticated_category } = this.props;

    if (authenticated_category === USER_CATEGORY.PROVIDER) {
      return;
    }

    const { history } = this.props;
    this.onClose();
    history.push(`/patients/${patient_id}`);
  };

  getMedicationList = () => {
    const { patients = {}, missed_medications = {} } = this.props;
    const { handlePatientDetailsRedirect, formatMessage } = this;

    const medicationList = [];
    const criticalList = [];
    const nonCriticalList = [];

    Object.keys(missed_medications).forEach((id) => {
      const {
        critical,
        participant_id,
        medicines: { basic_info: { name: medicineName } = {} } = {},
        timings,
      } = missed_medications[id] || {};

      const { basic_info: { id: patientId, full_name } = {} } =
        patients[participant_id] || {};

      if (critical) {
        criticalList.push(
          <MissedMedicationCard
            formatMessage={formatMessage}
            name={full_name}
            time={timings}
            medicineName={medicineName}
            onClick={handlePatientDetailsRedirect(patientId)}
          />
        );
      } else {
        nonCriticalList.push(
          <MissedMedicationCard
            formatMessage={this.formatMessage}
            name={full_name}
            time={timings}
            medicineName={medicineName}
            onClick={handlePatientDetailsRedirect(patientId)}
          />
        );
      }
    });

    // for (let medication in missed_medications) {
    //   const eachMedicationEventArray = missed_medications[medication];
    //   for(let eachMedicationEvent of eachMedicationEventArray){
    //
    //   const {
    //     critical:Critical,
    //     start_time,
    //     details:{
    //         medications: {
    //             participant_id : participantId= ""
    //         } = {},
    //         medicines: {
    //             basic_info: {
    //                 name: medicineName = "",
    //                 type: medicineType = ""
    //             } = {}
    //         } = {}
    //
    //     } = {},
    //
    //   } = eachMedicationEvent || {};
    //
    //   if(timings.indexOf(start_time) === -1) {
    //     timings.push(start_time);
    //   }
    //   participant_id=participantId;
    //   medicine_name=medicineName;
    //   medicine_type=medicineType;
    //   critical=Critical;
    //   }
    //
    //
    //   const {
    //     basic_info: {
    //       id: pId = "",
    //       first_name = "",
    //       middle_name = "",
    //       last_name = "",
    //         full_name = "",
    //     } = {}
    //   } = patients[participant_id] || {};
    //
    //   let pName = `${first_name} ${getName(middle_name)} ${getName(last_name)}`;
    //
    //   const isCritical=critical;
    //
    // }

    medicationList.push(
      <div>
        <div>
          <span className="fs18 fw700 brown-grey tac mb20">
            {this.formatMessage(messages.critical)}
          </span>
          {criticalList.length > 0 ? (
            criticalList
          ) : (
            <div className="mt10 mb10">
              {this.formatMessage(messages.no_critical_missed)}
            </div>
          )}
        </div>
        <div>
          <span className="fs18 fw700 brown-grey tac">
            {this.formatMessage(messages.non_critical)}
          </span>
          {nonCriticalList.length > 0 ? (
            nonCriticalList
          ) : (
            <div className="mt10 mb10">
              {this.formatMessage(messages.no_non_critical_missed)}
            </div>
          )}
        </div>
      </div>
    );
    return medicationList;
  };

  render() {
    const { visible = false } = this.props;
    const { fetching } = this.state;

    if (visible !== true) {
      return null;
    }
    return (
      <Fragment>
        <Drawer
          title={this.formatMessage(messages.medication_header)}
          placement="right"
          maskClosable={false}
          onClose={this.onClose}
          visible={visible}
          width={`30%`}
        >
          <div className="mt20 black-85 wp100">
            {fetching ? (
              <Spin size="small" className="flex align-center justify-center" />
            ) : (
              this.getMedicationList()
            )}
          </div>
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(MissedMedicationsDrawer);
