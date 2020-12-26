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
          medicationDrawerVisible:false,
          missed_medications : {} , 
          criticalMedicationIds:[],
          nonCriticalMedicationIds:[],       
        }
    }


    componentDidMount(){
      this.handleGetMissedMedications();

    }
    
    componentDidUpdate(prevProps,prevState){
      const {visible : prev_visible} = prevProps;
      const {visible} = this.props;
      if(prev_visible !== visible){
        this.handleGetMissedMedications();
      }
    }

    formatMessage = data => this.props.intl.formatMessage(data);

    onClose = () => {
        const { close } = this.props;
        close();
    };

    async handleGetMissedMedications(){
      try {
          const {getMissedMedicationsForDoc} = this.props;
          const response = await getMissedMedicationsForDoc();
          const { status, payload: {  data : {missed_medication_events = {}, critical_medication_event_ids = [],non_critical_medication_event_ids = []}  } = {} ,statusCode } =
          response || {};

              if (status && statusCode === 200 ) {
                          this.setState({
                              missed_medications:missed_medication_events,
                              criticalMedicationIds:critical_medication_event_ids,
                              nonCriticalMedicationIds:non_critical_medication_event_ids
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

  
    getMedicationList = () => {



        const PatientCard = ({pId,pName,time,medicine_name}) => {
          return (
            <div
            className=" br5 bg-white flex-shrink-0 mt20 mb20 p10  ml10 mr10 chart-box-shadow  flex direction-column"
             >
          
          
              <div className="flex direction-row align-start mt10 mb10">
                <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.patient_name)}</div>
                <div className=" pointer fs14 fw700 black-85 ml20 tab-color" onClick={() => this.handlePatientDetailsRedirect(pId)}>{pName}</div>
              </div>

              <div className="flex direction-row align-start mt10 mb10">
                <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.medicine_time)}</div>
                <div className="fs14 fw700 black-85 ml20">{time}</div>
              </div>

              <div className="flex direction-row align-start mt10 mb10">
                <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.medicine_name)}</div>
                <div className="fs14 fw700 black-85 ml20">{medicine_name}</div>
              </div>
            </div>
          );
        };
        


        // const { missed_medications ,criticalMedicationIds,nonCriticalMedicationIds} = this.props;
        const { missed_medications ,criticalMedicationIds,nonCriticalMedicationIds} = this.state;

        const {patients = {}} = this.props;
        const medicationList = [];
        const criticalList = [];
        const nonCriticalList = [];

        
        for (let medication in missed_medications ){
       

          const {medications : { details : { start_time,end_time, medicine_id, repeat_days, } ={} ,
          medicine : {name : medicine_name ='',type : mediine_type =''} ={} ,
          participant_id = '' } ={} 
          } = missed_medications[medication] || {};


        const event_id = parseInt(medication);




        const {basic_info : {id : pId = '', first_name = '',middle_name = '',last_name = ''} = {} }=patients[participant_id] || {};


        let pName =`${first_name} ${getName(middle_name)} ${getName(last_name)}` ;
        let td = moment(start_time);
        let time =start_time ? td.utc().format('HH:mm') : '--';

        let isCritical = criticalMedicationIds.includes(event_id) && !nonCriticalMedicationIds.includes(event_id) ;
        let isNoCritical = !criticalMedicationIds.includes(event_id) && nonCriticalMedicationIds.includes(event_id) ;
        
          if(isCritical){
            criticalList.push(PatientCard({pId,pName,time,medicine_name}))}
          else {
            nonCriticalList.push(PatientCard({pId,pName,time,medicine_name}))}
    
    }
    
        medicationList.push(
          <div>
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
        return medicationList;
     
      };


    render(){
        return (
        <Fragment>
            <Drawer
                bodyStyle={{backgroundColor:"#f5f5f5"}}
                title={this.formatMessage(messages.medication_header)}
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
                {this.getMedicationList()}
              </div>
               
            </Drawer>

        </Fragment>)
    }
}


export default injectIntl(MissedMedicationsDrawer);

