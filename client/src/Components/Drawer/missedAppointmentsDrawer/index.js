import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, Icon, Select, Input, message, Button, Spin, Radio, DatePicker } from "antd";
import moment from "moment";
import {USER_CATEGORY} from "../../../constant";
import messages from "./message";
import {getName} from "../../../Helper/validation";



class MissedAppointmentsDrawer extends Component {
    constructor(props){
        super(props)
        this.state ={
          missed_appointments : {},
          criticalAppointmentIds:[],
          nonCriticalAppointmentIds:[]
        }
    }


    componentDidMount(){
      this.handleGetMissedAppointments();

    }



    componentDidUpdate(prevProps,prevState){
      const {visible : prev_visible} = prevProps;
      const {visible} = this.props;
      if(prev_visible !== visible){
        this.handleGetMissedAppointments();

      }
    }


    async handleGetMissedAppointments(){
      try {
          const {getMissedAppointmentsForDoc} = this.props;
          const response = await getMissedAppointmentsForDoc();
          const { status, payload: {  data : {missed_appointment_events = {}, critical_appointment_event_ids = [],non_critical_appointment_event_ids = []}  } = {} ,statusCode } =
          response || {};

              if (status && statusCode === 200 ) {
                          this.setState({
                              missed_appointments:missed_appointment_events,
                              criticalAppointmentIds:critical_appointment_event_ids,
                              nonCriticalAppointmentIds:non_critical_appointment_event_ids
                      })

                  } 
          
      } catch (err) {
          console.log("err", err);
          message.warn(this.formatMessage(messages.somethingWentWrong));
      }
      
  }



    formatMessage = data => this.props.intl.formatMessage(data);

    onClose = () => {
        const { close } = this.props;
        close();
    };


    handlePatientDetailsRedirect = patient_id => {
        const { history} = this.props;
        this.onClose();
        history.push(`/patients/${patient_id}`);
    
    };

    getAppointmentList = () => {

        const PatientCard = ({pId,pName,treatment_type,time,date
          }) => {
            return (
              <div  className=" br5 bg-white flex-shrink-0 mt20 mb20 p10  ml10 mr10 chart-box-shadow  flex direction-column">
            
            
                <div className="flex direction-row align-start mt10 mb10 ml10">
                  <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.patient_name)}</div>
                  <div className=" pointer fs14 fw700 black-85 ml20 tab-color" onClick={() => this.handlePatientDetailsRedirect(pId)}>{pName}</div>
                </div>

                <div className="flex direction-row align-start mt10 mb10 ml10">
                  <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.appointment_type)}</div>
                  <div className="fs14 fw700 black-85 ml20">{treatment_type}</div>
                </div>

                <div className="flex direction-row align-start mt10 mb10 ml10">
                  <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.appointment_time)}</div>
                  <div className="fs14 fw700 black-85 ml20">{time}</div>
                </div>

                <div className="flex direction-row align-start mt10 mb10 ml10">
                  <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.appointment_date)}</div>
                  <div className="fs14 fw700 black-85 ml20">{date}</div>
                </div>

              </div>
            );
          };
          

        // const { missed_appointments ,patients = {},criticalAppointmentIds,nonCriticalAppointmentIds} = this.props;
            const { missed_appointments =[] ,criticalAppointmentIds =[],nonCriticalAppointmentIds=[]} = this.state;
          const {patients ={}}=this.props;
        // const { appointments = {} } = this.props;
        const appointmentList = [];
        const criticalList = [];
        const nonCriticalList = [];

        for (let appointment in missed_appointments ){
            const {
                basic_info: {
                  // id : event_id , 
                  start_date,
                  start_time,
                  end_time,
                  details: { type_description = "" ,type = '' } = {}
                } = {},
                participant_one : {category : participant_one_category = '', id  : participant_one_id='' },
                participant_two : {category : participant_two_category = '', id : participant_two_id =''}
              } = missed_appointments[appointment];

              const event_id = parseInt(appointment);


              let patientId = '';
              if(participant_one_category === "patient"){
                patientId = participant_one_id;
              }else{
                patientId = participant_two_id;
              }

              const {basic_info : {id : pId = '', first_name = '',middle_name = '',last_name = ''}}=patients[patientId] || {};

              let pName =`${first_name} ${getName(middle_name)} ${getName(last_name)}` ;
              let treatment_type =type_description.length > 0 ? type_description : " ";
              let td = moment(start_time);
              let time =start_time ? td.utc().format('HH:mm') : '--';
              let date =  start_date ? moment( start_date).format("DD MMM") : "--";
              let isCritical = criticalAppointmentIds.includes(event_id) && !nonCriticalAppointmentIds.includes(event_id) ;
              let isNoCritical = !criticalAppointmentIds.includes(event_id) && nonCriticalAppointmentIds.includes(event_id) ;
              
              if(isCritical){
                  criticalList.push(PatientCard({pId,pName,treatment_type,time,date}))}
              else {
                  nonCriticalList.push(PatientCard({pId,pName,treatment_type,time,date}))}
        }


        appointmentList.push(
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

      
        return appointmentList;

    
       
      }

    render(){
        const {visible} = this.props;
        return (
        <Fragment>
            <Drawer
                title={this.formatMessage(messages.appointment_header)}
                placement="right"
                bodyStyle={{backgroundColor:"#f5f5f5"}}
                maskClosable={false}
                headerStyle={{
                    position: "sticky",
                    zIndex: "9999",
                    top: "0px"
                }}
                onClose={this.onClose}
                visible={this.props.visible} 
                width={'30%'}
            >
               <div className="mt20 black-85 wp100">
                 {/* {visible? this.getAppointmentList() : null} */}
                {this.getAppointmentList()}
               </div>
            </Drawer>

        </Fragment>)
    }
}


export default injectIntl(MissedAppointmentsDrawer);

