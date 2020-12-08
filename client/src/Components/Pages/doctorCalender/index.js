import React, { Component , Fragment } from "react";
import {injectIntl} from "react-intl";
import { Calendar,message,Drawer,Icon } from "antd";
import moment from "moment";
import {APPOINTMENT_TYPE_TITLE,TABLE_DEFAULT_BLANK_FIELD} from "../../../constant";
import messages from "./message";
import {InfoCircleOutlined } from "@ant-design/icons";


const DAY="d";
const MONTH="m";
const YEAR_MODE="year";
const MONTH_MODE="month";

class doctorCalender extends Component {
    constructor(props) {
        super(props);
        this.state = {
             monthWiseData : {},
             isDateDataVisible:false,
             panelSelected:DAY,
             mode:MONTH_MODE,
             monthlyData:{},
             selectedMonthAppointments : {},
             currentDateSelected:''
             
        }
    }

    componentDidMount(){
        const resultList = [];
        const startOfYear = moment().startOf('year').format('YYYY-MM-DD hh:mm');
        const tempMonthWiseData = {};
        for(let i = 0;i<12;i++){
            let ISOdate=moment(startOfYear).add(i, 'M').toISOString();
            this.handleGetDayData(ISOdate,MONTH);
        }    
        
    }

    formatMessage = data => this.props.intl.formatMessage(data);



     handleGetMonthlydata = (i,ISOdate) => {
        try{
            const {getCalenderDataCountForDay} = this.props;
     
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
    
     getListData = (appointmentIds =[]) => {
         const {selectedMonthAppointments} = this.state;
         const {appointments = {}} =selectedMonthAppointments ||{};
         let listData =[];

         const {
            doctors = {},
            patients = {},
        } = selectedMonthAppointments || {};
        let count=0;

         for(let id of appointmentIds){


            const {basic_info : {
                details : {
                    critical=false,
                    reason = '',
                    type = '1',
                    type_description = ''
                } = {},
                start_date = '',
                start_time  = '' ,
                end_date ='',
                end_time=''
            } = {},
        participant_one : {id : p1_id = '',category :p1_category = ''} = {},
        participant_two : {id : p2_id = '',category :p2_category = ''}  } = appointments[id] || {};

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



        let time = `${start_time ? moment(start_time).format("LT") : TABLE_DEFAULT_BLANK_FIELD} - ${end_time ? moment(end_time).format(
            "LT"
          ) : TABLE_DEFAULT_BLANK_FIELD}`;

            if(count === 2 ){
                listData.push(
                    <div key={`${id}-record`}  className="wp50  tac fs12 fw700  pt4 pb4 tab-color mt5">
                    <span>+ {appointmentIds.length-count}</span>
                    &nbsp;
                    <span>More</span>
                </div>
                )
                break;
            }

            count+=1;

            listData.push(
                <div key={`${id}-record`} className={`br15 tac fs12 fw700 bg-blue pt4 pb4 white ${count === 1 ? null : `mt5`}`}>
                    <span>{time}</span>
                    &nbsp;
                    <span>{patient_name}</span>
                </div>
            
            )
                
               
         }

         
        return listData
       
      }
    
   

    dateCellRender  = (value) => {
        const {selectedMonthAppointments = {}} = this.state;
        const {date_wise_appointments = {}} = selectedMonthAppointments || {};
        const currentDate = moment(value).utcOffset(0).startOf('day').toISOString();
        if(date_wise_appointments[currentDate]){
        
        let listData = this.getListData(date_wise_appointments[currentDate]);
        return (
            listData
          );
        }else{
            return null;
        }
     
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
    // return num ? (
    //     <div className=" br15 tac fs14 fw700 bg-blue pt4 pb4 white">{num} {this.formatMessage(messages.appointments)}</div>
    // ) : null;
    return null;
    }

    onSelect = (value) => {
        const {panelSelected,mode} = this.state;
        let ISOdate=moment(value).toISOString();
        let type=DAY;
        if(panelSelected === MONTH){
            type=MONTH;
        }

        if(mode === YEAR_MODE){
            this.handleGetDayData(ISOdate,MONTH);
            this.setState({
                mode:MONTH_MODE,
                panelSelected:DAY
            })
            return;
        }

        const currentDate = moment(value).utcOffset(0).startOf('day').toISOString();

        this.setState({
            currentDateSelected:currentDate,
            isDateDataVisible:true,

        })

    }

    

    handleGetDayData = (ISOdate,type=MONTH) => {
        try{
            const {getCalenderDataForDay} = this.props;
            
            getCalenderDataForDay(ISOdate,type).then((response) => {
                
                const { status, payload: { data,  message } = {} } = response;
                if(status){
                    const {
                        appointments = {},
                        date_wise_appointments = {},
                        doctors = {},
                        patients = {},
                        users = {}
                    } = data || {};

                    this.setState({
                        selectedMonthAppointments:data});
                }
            })

            
        }catch(error){
            console.log("err --->",error);
            message.warn("Something went wrong");
        }
    }


    onPanelChange = (value,mode) => {
        let ISOdate = moment(value).toISOString();

        if(mode === YEAR_MODE){
            this.setState({panelSelected:MONTH,
            })
        }else{ //month
            this.setState({panelSelected:DAY})
        }

        this.setState({mode});

        if(mode === MONTH_MODE){
            this.handleGetDayData(ISOdate,MONTH);
            return;
        }

        let startOfYear = moment().startOf('year').format('YYYY-MM-DD hh:mm');
        if(value){
            startOfYear = moment(value).startOf('year').format('YYYY-MM-DD hh:mm');
        }

        for(let i = 0;i<12;i++){
            let ISOdate=moment(startOfYear).add(i, 'M').toISOString();
            this.handleGetDayData(ISOdate,MONTH);

        }   
    }


    close = () =>{
        this.setState({isDateDataVisible:false })
    }


    renderDateDetails = () => {
        const {selectedMonthAppointments = {}} = this.state;

        const {currentDateSelected = ''} = this.state;
        
        let details = [];
        const {
            appointments ={},
            date_wise_appointments = {},
            doctors = {},
            patients = {},
            users = {}
        } = selectedMonthAppointments || {};


        const thisDaysAppointments = date_wise_appointments[currentDateSelected] || [];
        

        for(let each of thisDaysAppointments){
            const {basic_info : {
                details : {
                    critical=false,
                    reason = '',
                    type = '1',
                    type_description = ''
                } = {},
                start_date = '',
                start_time  = '' ,
                end_date ='',
                end_time=''
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

            //   let time =start_time ? moment(start_time).format('hh:mm A'): '--';
            let time = `${start_time ? moment(start_time).format("LT") : TABLE_DEFAULT_BLANK_FIELD} - ${end_time ? moment(end_time).format(
                "LT"
              ) : TABLE_DEFAULT_BLANK_FIELD}`;

              let date =  start_date ? moment( start_date).format("Do MMM YYYY") : "--";
             
              const appointment_type = APPOINTMENT_TYPE_TITLE[type];
              const title = appointment_type["title"];
              
        details.push(
            (
                <div key={`${each}-appointment`} className="pt20 relative wp90 br5 bg-white flex-shrink-0 mt20 mb20 p10  ml10 mr10 chart-box-shadow  flex direction-column">
              
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

                    <div className="flex hp20 " >
                    {critical ? 
                        <div className="flex direction-column absolute t10 r10" >
                        <InfoCircleOutlined  label={this.formatMessage(messages.critical)}  className="pointer red fs18 "/>
                        <span  className="pointer red fs18 " >{this.formatMessage(messages.critical)}</span>
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
        const {isDateDataVisible=false,mode=MONTH_MODE} = this.state;
        return (
            <Fragment>
                <div className="p18 fs30 fw700 ">Schedules</div>
                <div className="wp100 flex direction-column">
                <Calendar 
                dateCellRender={this.dateCellRender} 
                monthCellRender={this.monthCellRender} 
                onPanelChange={this.onPanelChange}
                onSelect={this.onSelect}
                mode={mode}
                
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