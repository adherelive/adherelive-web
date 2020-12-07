import React, { Component , Fragment } from "react";
import {injectIntl} from "react-intl";
import { Calendar,Badge,message,Drawer } from "antd";
import moment from "moment";

import messages from "./message";



class doctorCalender extends Component {
    constructor(props) {
        super(props);
        this.state = {
             monthWiseData : {},
             selectedDayAppointments : {},
             isDateDataVisible:false,
             
        }
    }

    componentDidMount(){
        const {getCalenderDataCountForDay , getCalenderDataForDay} = this.props;
        const resultList = [];
        const startOfYear = moment().startOf('year').format('YYYY-MM-DD hh:mm');
        const tempMonthWiseData = {};
        for(let i = 0;i<12;i++){
            let ISOdate=moment(startOfYear).add(i, 'M').toISOString();
            this.handleGetMonthlydata(i,ISOdate);
        }    
        
    }

    formatMessage = data => this.props.intl.formatMessage(data);



     handleGetMonthlydata = (i,ISOdate) => {
        try{
            const {getCalenderDataCountForDay} = this.props;
            // console.log("6754567890 handleGetMonthlydata Called");
            getCalenderDataCountForDay(ISOdate).then((response) => {
                
                const { status, payload: { data,  message } = {} } = response || {};
                const {monthWiseData = {}} = this.state;
                monthWiseData[i] = data || {};
                if(status){
                    this.setState(monthWiseData);
                }else {
                    this.setState(monthWiseData);
                    
                }
            })

            
        }catch(error){
            console.log("err --->",error);
            message.warn(this.formatMessage(messages.somethingWentWrong));
        }
    }
    
    
   

    dateCellRender  = (value) => {
        const {monthWiseData = {}} = this.state;
        const m=value.month();
        const {date_wise_appointments = {}}=monthWiseData[m] || {};
        let thisMonthsAppointments = date_wise_appointments;
        let date = value.format('YYYY-MM-DD');
        let dayAppointmentsNum = thisMonthsAppointments[date] || 0;
        if(dayAppointmentsNum !== 0){
           if(dayAppointmentsNum === 1){
            return (
                    <div className="fs14 fw700 brown-grey bg-grey">{dayAppointmentsNum} {this.formatMessage(messages.appointment)}</div>   
            )         
           }else{
            return (<div className="fs14 fw700 brown-grey">{dayAppointmentsNum} {this.formatMessage(messages.appointments)}</div>)
           }
        }

        return null;
     
    }

    getMonthData = (value) => {
        const {monthWiseData = {}} = this.state;
        const m=value.month();
        const {date_wise_appointments = {}}=monthWiseData[m] || {};
        let n = 0;
        for(let key in date_wise_appointments){
            let keyDate = moment(key);
            if(keyDate.year() === value.year() && keyDate.month() === value.month()){
                n = n + date_wise_appointments[key];
            }
        }
        return n;
    }

    monthCellRender = (value) => {
    const num = this.getMonthData(value);
    return num ? (
        <div className="fs14 fw700 brown-grey">{num} {this.formatMessage(messages.appointments)}</div>
    ) : null;
    }

    onSelect = (value) => {
        console.log("ONSELECT ==========>",moment(value))
        
        let ISOdate=moment(value).toISOString();
        this.handleGetDayData(ISOdate);
        this.setState({isDateDataVisible:true})
    }

    handleGetDayData = (ISOdate) => {
        try{
            const {getCalenderDataForDay} = this.props;
           
            getCalenderDataForDay(ISOdate).then((response) => {
                
                const { status, payload: { data,  message } = {} } = response;
                if(status){
                    const {
                        appointments = {},
                        date_wise_appointments = {},
                        doctors = {},
                        patients = {},
                        users = {}
                    } = data || {};

                    this.setState({selectedDayAppointments:data});


                    
                }
            })

            
        }catch(error){
            console.log("err --->",error);
            message.warn("Something went wrong");
        }
    }


    onPanelChange = (value) => {
        const {getCalenderDataCountForDay , getCalenderDataForDay} = this.props;
        const resultList = [];
        let startOfYear = moment().startOf('year').format('YYYY-MM-DD hh:mm');
        if(value){
            startOfYear = moment(value).startOf('year').format('YYYY-MM-DD hh:mm');
        }
        const tempMonthWiseData = {};
        for(let i = 0;i<12;i++){
            let ISOdate=moment(startOfYear).add(i, 'M').toISOString();
            this.handleGetMonthlydata(i,ISOdate);
        }   
    }


    close = () =>{
        this.setState({isDateDataVisible:false})
    }


    renderDateDetails = () => {
        const {selectedDayAppointments = {}} = this.state;
        let details = [];
        const {
            appointments = {},
            date_wise_appointments = {},
            doctors = {},
            patients = {},
            users = {}
        } = selectedDayAppointments || {};
        

        for(let each in appointments){
            const {basic_info : {
                details : {
                    critical=false,
                    reason = '',
                    type = '1',
                    type_description = ''
                } = {},
                start_date = '',
                start_time  = '' 
            } = {},
        participant_one : {id : p1_id = '',category :p1_category = ''} = {},
        participant_two : {id : p2_id = '',category :p2_category = ''}  } = appointments[each] || {};
        let doctor_name ='';
        let patient_name ='';
        if(p1_category === 'doctor'){
            let {basic_info : {first_name : doctor_first_name ='',middle_name : doctor_middle_name ='',last_name : doctor_last_name = ''} = {} } = doctors[p1_id] || {};
            let {basic_info : {first_name :patient_first_name ='',middle_name:patient_middle_name ='',last_name:patient_last_name = ''} = {} } = patients[p2_id] || {};
            doctor_name = doctor_first_name ? `${doctor_first_name} ${doctor_middle_name ? `${doctor_middle_name} ` : ""}${doctor_last_name ? `${doctor_last_name} ` : ""}` : '';
            patient_name = patient_first_name ? `${patient_first_name} ${patient_middle_name ? `${patient_middle_name} ` : ""}${patient_last_name ? `${patient_last_name} ` : ""}` : '';

        }else{
            let {basic_info : {first_name : doctor_first_name ='',middle_name : doctor_middle_name ='',last_name : doctor_last_name = ''} = {} } = doctors[p2_id] || {}; 
            let {basic_info : {first_name :patient_first_name ='',middle_name:patient_middle_name ='',last_name:patient_last_name = ''} = {} } = patients[p1_id] || {};
            doctor_name = doctor_first_name ? `${doctor_first_name} ${doctor_middle_name ? `${doctor_middle_name} ` : ""}${doctor_last_name ? `${doctor_last_name} ` : ""}` : '';
            patient_name = patient_first_name ? `${patient_first_name} ${patient_middle_name ? `${patient_middle_name} ` : ""}${patient_last_name ? `${patient_last_name} ` : ""}` : '';
        }

              let time =start_time ? moment(start_time).format('HH:mm') : '--';
              let date =  start_date ? moment( start_date).format("DD MMM") : "--";
            
              
        details.push(
            (
                <div key={`${each}-appoitment`} className="wp90 br5 bg-white flex-shrink-0 mt20 mb20 p10  ml10 mr10 chart-box-shadow  flex direction-column">
              
                <div className="flex direction-row align-start mt10 mb10 ml10">
                    <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.doctor_name)}</div>
                    <div className=" pointer fs14 fw700 black-85 ml20 tab-color">{doctor_name}</div>
                  </div>

                  <div className="flex direction-row align-start mt10 mb10 ml10">
                    <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.patient_name)}</div>
                    <div className=" pointer fs14 fw700 black-85 ml20 tab-color">{patient_name}</div>
                  </div>
  
                  <div className="flex direction-row align-start mt10 mb10 ml10">
                    <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.appointment_desc)}</div>
                    <div className="fs14 fw700 black-85 ml20">{type_description}</div>
                  </div>

                  <div className="flex direction-row align-start mt10 mb10 ml10">
                    <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.appointment_desc)}</div>
                    <div className="fs14 fw700 black-85 ml20">{reason}</div>
                  </div>
  
                  <div className="flex direction-row align-start mt10 mb10 ml10">
                    <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.appointment_time)}</div>
                    <div className="fs14 fw700 black-85 ml20">{time}</div>
                  </div>
  
                  <div className="flex direction-row align-start mt10 mb10 ml10">
                    <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.appointment_date)}</div>
                    <div className="fs14 fw700 black-85 ml20">{date}</div>
                  </div>

                  <div>
                    {/* <span className="fs18 fw700 brown-grey tac mb20">{this.formatMessage(messages.critical)}</span> */}
                    {critical ? <div className="ml10 fs14 fw700 brown-grey">{this.formatMessage(messages.critical)}</div> : 
                    <div className="ml10 mt10 fs14 fw700 brown-grey">{this.formatMessage(messages.non_critical)}</div>  }
                </div>
  
                </div>
              )

           
        )
        

    } 

    return details;


    }

    render() {
        // console.log("STate =====>",this.state);
        const {isDateDataVisible} = this.state;
        return (
            <Fragment>
                <div className="p18 fs30 fw700 ">Schedules</div>
                <div className="wp100 flex direction-column">
                <Calendar 
                dateCellRender={this.dateCellRender} 
                monthCellRender={this.monthCellRender} 
                onPanelChange={this.onPanelChange}
                onSelect={this.onSelect}
                 />
                
            
                </div>
                <Drawer
                    title={this.formatMessage(messages.appointment_header)}
                    placement="right"
                    maskClosable={true}
                    headerStyle={{
                        position: "sticky",
                        zIndex: "9999",
                        top: "0px"
                    }}
                    onClose={this.close}
                    visible={isDateDataVisible}
                    width={'35%'}
                >
                    {this.renderDateDetails()}
                   
                </Drawer>
                {/* <Drawer visible={isDateDataVisible} onClose={this.close} /> */}
            </Fragment>
        );
    }
}

export default injectIntl(doctorCalender);