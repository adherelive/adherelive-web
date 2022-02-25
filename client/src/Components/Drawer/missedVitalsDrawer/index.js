import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, message, Spin } from "antd";
import MissedVitalCard from "../../Cards/patient/missedVital";
import { USER_CATEGORY } from "../../../constant";

import messages from "./message";

class MissedMedicationsDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vitalDrawerVisisble: false,
      missed_vitals: {},
      criticalVitalIds: [],
      nonCriticalVitalIds: [],
      fetching: false,
    };
  }

  componentDidMount() {
    // this.handleGetMissedVitals();
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onClose = () => {
    const { close } = this.props;
    close();
  };

  //   async handleGetMissedVitals(){
  //     try {
  //         const {getAllMissedScheduleEvents} = this.props;
  //         this.setState({fetching:true});
  //         const response = await getAllMissedScheduleEvents();
  //         const { status, payload: {  data : {missed_vitals = {},
  //           vital_ids : {critical=[],non_critical=[]} =  {}}  } = {} ,statusCode } =
  //         response || {};
  //             if (status && statusCode === 200 ) {
  //                 this.setState({
  //                     missed_vitals:missed_vitals,
  //                     criticalVitalIds:critical,
  //                     nonCriticalVitalIds:non_critical,
  //                     fetching:false
  //               })
  //
  //             } else{
  //               this.setState({fetching:false});
  //
  //             }
  //
  //     } catch (err) {
  //         console.log("err", err);
  //         message.warn(this.formatMessage(messages.somethingWentWrong));
  //         this.setState({fetching:false});
  //
  //     }
  // }

  handlePatientDetailsRedirect = (patient_id) => (e) => {
    const { authenticated_category } = this.props;

    if (authenticated_category === USER_CATEGORY.PROVIDER) {
      return;
    }

    const { history } = this.props;
    this.onClose();
    history.push(`/patients/${patient_id}`);
  };

  getVitalList = () => {
    const { patients = {}, missed_vitals = {} } = this.props;
    const vitalList = [];
    const criticalList = [];
    const nonCriticalList = [];

    const { handlePatientDetailsRedirect, formatMessage } = this;

    Object.keys(missed_vitals).forEach((id) => {
      console.log("182371923 vitals", { vitals: missed_vitals[id] });
      const { critical, patient_id, vital_name, timings } =
        missed_vitals[id] || {};

      const { basic_info: { id: patientId, full_name } = {} } =
        patients[patient_id] || {};

      if (critical) {
        criticalList.push(
          <MissedVitalCard
            formatMessage={formatMessage}
            name={full_name}
            time={timings}
            vital={vital_name}
            onClick={handlePatientDetailsRedirect(patientId)}
          />
        );
      } else {
        nonCriticalList.push(
          <MissedVitalCard
            formatMessage={formatMessage}
            name={full_name}
            time={timings}
            vital={vital_name}
            onClick={handlePatientDetailsRedirect(patientId)}
          />
        );
      }
    });
    //     for (let vital in missed_vitals ){
    //       const eachVitalEventArray = missed_vitals[vital];
    //       for(let eachVitalEvent of eachVitalEventArray){
    //
    //         const event_id = parseInt(vital);
    //
    //         const {
    //           critical,
    //           start_time,
    //           details:{
    //             vital_templates : {basic_info : {name :vitalName = '' } ={}} ={} ,
    //             patient_id:patientId=''
    //           }={},
    //         } = eachVitalEvent;
    //
    //         timings.push(start_time);
    //         patient_id=patientId;
    //         vital_name=vitalName;
    //         isCritical=critical;
    //
    //       }
    //
    //       const {basic_info : {id : pId = '', first_name = '',middle_name = '',last_name = ''} = {} }=patients[patient_id] || {};
    //
    //       let pName =`${first_name} ${getName(middle_name)} ${getName(last_name)}` ;
    //
    //
    //
    // }

    vitalList.push(
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

    return vitalList;
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
          title={this.formatMessage(messages.vital_header)}
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
              this.getVitalList()
            )}
          </div>
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(MissedMedicationsDrawer);
