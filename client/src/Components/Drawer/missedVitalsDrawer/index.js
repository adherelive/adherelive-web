import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, Icon, Select, Input, message, Button, Spin, Radio, DatePicker } from "antd";
import {getName} from "../../../Helper/validation";
import moment from "moment";

import messages from "./message";

class MissedMedicationsDrawer extends Component {
    constructor(props){
        super(props)
        this.state = {
          vitalDrawerVisisble:false,
          missed_vitals:{},
          criticalVitalIds:[],
          nonCriticalVitalIds:[],
        }
    }


    componentDidMount(){
      this.handleGetMissedVitals();

    }
    
    componentDidUpdate(prevProps,prevState){
      const {visible : prev_visible} = prevProps;
      const {visible} = this.props;
      if(prev_visible !== visible){
        this.handleGetMissedVitals();
      }
    }
    formatMessage = data => this.props.intl.formatMessage(data);

    onClose = () => {
        const { close } = this.props;
        close();
    };

    async handleGetMissedVitals(){
      try {
          const {getMissedVitalsForDoc} = this.props;
          const response = await getMissedVitalsForDoc();
          const { status, payload: {  data : {missed_vital_events = {}, critical_vital_event_ids = [],non_critical_vital_event_ids = []}  } = {} ,statusCode } =
          response || {};
              if (status && statusCode === 200 ) {
                      this.setState({
                          missed_vitals:missed_vital_events,
                          criticalVitalIds:critical_vital_event_ids,
                          nonCriticalVitalIds:non_critical_vital_event_ids,
                  })

              } 
          
      } catch (err) {
          console.log("err", err);
          message.warn(this.formatMessage(messages.somethingWentWrong));
      }
  }


    handlePatientDetailsRedirect = patient_id => {
      const { history} = this.props;
      this.onClose();
      history.push(`/patients/${patient_id}`);
  
  };

  
    getVitalList = () => {



        const PatientCard = ({pId,pName,vital_name}) => {
          return (
            <div 
            className=" br5 bg-white flex-shrink-0 mt20 mb20 p10  ml10 mr10 chart-box-shadow  flex direction-column"
            // className="flex direction-column tac br10 bg-lighter-grey mt20 mb20 p10  ml10 mr10"
            >
          
          
              <div className="flex direction-row align-start mt10 mb10 ">
                <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.patient_name)}</div>
                <div className=" pointer fs14 fw700 black-85 ml20 tab-color" onClick={() => this.handlePatientDetailsRedirect(pId)}>{pName}</div>
              </div>

              <div className="flex direction-row align-start mt10 mb10 ">
                <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.vital_name)}</div>
                <div className="fs14 fw700 black-85 ml20">{vital_name}</div>
              </div>

          
            </div>
          );
        };
        


        // const { missed_vitals ,criticalVitalIds,nonCriticalVitalIds,care_plans} = this.props;
        const { missed_vitals ,criticalVitalIds,nonCriticalVitalIds} = this.state;

        const {patients = {},care_plans = {}}=this.props;
        const vitalList = [];
        const criticalList = [];
        const nonCriticalList = [];

        
        for (let vital in missed_vitals ){
       

     

        const event_id = parseInt(vital);




        const {vital_templates : {basic_info : {name :vital_name = '' } ={}} ={} } = 
        missed_vitals[vital]
        const {patient_id = ''}=missed_vitals[vital];

        const {basic_info : {id : pId = '', first_name = '',middle_name = '',last_name = ''} = {} }=patients[patient_id] || {};


       
        

        let pName =`${first_name} ${getName(middle_name)} ${getName(last_name)}` ;
        // console.log("pName =======>",patients);
        // let td = moment(start_time);
        // let time =start_time ? td.utc().format('HH:mm') : '--';

        let isCritical = criticalVitalIds.includes(event_id) && !nonCriticalVitalIds.includes(event_id) ;
        let isNoCritical = !criticalVitalIds.includes(event_id) && nonCriticalVitalIds.includes(event_id) ;
        
          if(isCritical){
            criticalList.push(PatientCard({pId,pName,vital_name}))}
          else {
            nonCriticalList.push(PatientCard({pId,pName,vital_name}))}
    
    }
    
    vitalList.push(
          <div >
              <div>
                  <span className="fs18 fw700 brown-grey tac mb20">{this.formatMessage(messages.critical)}</span>
                  {criticalList.length>0 ? criticalList : <div className="mt10 mb10">{"--"}</div> }
              </div>
              <div>
                  <span className="fs18 fw700 brown-grey tac" >{this.formatMessage(messages.non_critical)}</span>
                  {nonCriticalList.length>0 ? nonCriticalList : <div className="mt10 mb10">{"--"}</div> }
              </div>
          </div>
        );

        return vitalList;

    return null;

     
      };


    render(){
        return (
        <Fragment>
            <Drawer
                bodyStyle={{backgroundColor:"#f5f5f5"}}
                title={this.formatMessage(messages.vital_header)}
                placement="right"
                maskClosable={false}
                headerStyle={{
                    position: "sticky",
                    zIndex: "9999",
                    top: "0px"
                }}
                onClose={this.onClose}
                visible={this.props.visible} 
                width={`30%`}
            >
              <div className="mt20 black-85 wp100">
              {this.getVitalList()}
              </div>
               
            </Drawer>

        </Fragment>)
    }
}


export default injectIntl(MissedMedicationsDrawer);

