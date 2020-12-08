import React, { Component , Fragment } from "react";
import {injectIntl} from "react-intl";
import { Calendar,Badge,message,Drawer } from "antd";
import moment from "moment";
import {APPOINTMENT_TYPE_TITLE} from "../../../constant";
import messages from "./message";
import {InfoCircleOutlined} from "@ant-design/icons";


const DAY="d";
const MONTH="m";
const YEAR="year";

class doctorCalender extends Component {
    constructor(props) {
        super(props);
        this.state = {
             monthWiseData : {},
             selectedDayAppointments : {},
             isDateDataVisible:false,
             panelSelected:DAY
             
        }
    }

    componentDidMount(){
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
                console.log("response =========>",response);
                
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
                    <div className="br15 tac white fs14 fw700 pt5 pb5   bg-blue">{dayAppointmentsNum} {this.formatMessage(messages.appointment)}</div>   
            )         
           }else{
            return (<div className="br15 tac white fs14 fw700 pt5 pb5   bg-blue">{dayAppointmentsNum} {this.formatMessage(messages.appointments)}</div>)
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
        <div className=" br15 tac fs14 fw700 bg-blue pt5 pb5 white">{num} {this.formatMessage(messages.appointments)}</div>
    ) : null;
    }

    onSelect = (value) => {
        // console.log("ONSELECT ==========>",moment(value))
        const {panelSelected} = this.state;
        let ISOdate=moment(value).toISOString();
        let type=DAY;
        if(panelSelected === MONTH){
            type=MONTH;
        }
        this.handleGetDayData(ISOdate,type);
        this.setState({isDateDataVisible:true})
    }

    

    handleGetDayData = (ISOdate,type=DAY) => {
        try{
            const {getCalenderDataForDay} = this.props;
            
            getCalenderDataForDay(ISOdate,type).then((response) => {
                
                const { status, payload: { data,  message } = {} } = response;
                console.log('6543567753546578',response);
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


    onPanelChange = (value,mode) => {
        let ISOdateMonth=moment(value).month();
        if(mode === YEAR){
            this.handleGetDayData(ISOdateMonth,MONTH);
            this.setState({panelSelected:MONTH})

        }else{ //month
            this.setState({panelSelected:DAY})
        }
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
        this.setState({isDateDataVisible:false,
            selectedDayAppointments:{}})
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

              let time =start_time ? moment(start_time).format('hh:mm A'): '--';
              let date =  start_date ? moment( start_date).format("DD MMM") : "--";
             
              const appointment_type = APPOINTMENT_TYPE_TITLE[type];
              const title = appointment_type["title"];
              
        details.push(
            (
                <div key={`${each}-appointment`} className="relative wp90 br5 bg-white flex-shrink-0 mt20 mb20 p10  ml10 mr10 chart-box-shadow  flex direction-column">
              
                <div className="flex direction-row align-start justify-space-between mt10 mb10 ml10 mr20">
                    <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.doctor_name)}</div>
                    <div className=" fs14 fw700 black-85 ml20 wp50 tac">{`Dr ${doctor_name}`}</div>
                  </div>

                  <div className="flex direction-row align-start justify-space-between mt10 mb10 ml10 mr20">
                    <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.patient_name)}</div>
                    <div className=" fs14 fw700 black-85 ml20 wp50 tac">{patient_name}</div>
                  </div>
  
                  <div className="flex direction-row align-start justify-space-between mt10 mb10 ml10 mr20">
                    <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.appointment_desc)}</div>
            <div className="fs14 fw700 black-85 ml20 wp50 tac">{type_description} {`(${title})`}</div>
                  </div>

                  <div className="flex direction-row align-start justify-space-between mt10 mb10 ml10 mr20">
                    <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.reason)}</div>
                    <div className="fs14 fw700 black-85 ml20 wp50 tac">{reason}</div>
                  </div>
  
                  <div className="flex direction-row align-start justify-space-between mt10 mb10 ml10 mr20">
                    <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.appointment_time)}</div>
                    <div className="fs14 fw700 black-85 ml20 wp50 tac">{time}</div>
                  </div>
  
                  <div className="flex direction-row align-start  justify-space-between mt10 mb10 ml10 mr20">
                    <div className="fs14 fw700 brown-grey">{this.formatMessage(messages.appointment_date)}</div>
                    <div className="fs14 fw700 black-85 ml20 wp50 tac">{date}</div>
                  </div>

                    <div className="flex absolute t10 r10 hp20" >
                    {/* <span className="fs18 fw700 brown-grey tac mb20">{this.formatMessage(messages.critical)}</span> */}
                    {critical ? 
                        <div className="flex direction-column align-center justify-center" >
                        <InfoCircleOutlined    className="red fs18 "/>
                        <div className="red mt5 fs14 fw700 brown-grey">{this.formatMessage(messages.critical)}</div>
                    </div> 
                    : 
                   null
                    }
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