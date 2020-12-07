import React, { Component , Fragment } from "react";
import {injectIntl} from "react-intl";
import { Calendar,Badge,message,Drawer } from "antd";
import moment from "moment";




class doctorCalender extends Component {
    constructor(props) {
        super(props);
        this.state = {
             monthWiseData : {},
             selectedDayAppointments : {},
             isDateDataVisible:false
             
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
            message.warn("Something went wrong");
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
            return (<span >
                {dayAppointmentsNum} Appointment
            </span>)
           }else{
            return (<div>
                <span >
                    {dayAppointmentsNum} Appointments
                </span>
            </div>)
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
        <div>
        <span>{num} Appointments</span>
        </div>
    ) : null;
    }

    onSelect = (value) => {
        // console.log("ONSELECT ==========>",value)
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

                    this.setState({selectedDayAppointments:appointments});
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
        for(let each in selectedDayAppointments){
            const {basic_info : {
                details : {
                    critical=false,
                    reason = '',
                    type = '1',
                    type_description = ''
                },
                start_time  = '' 
            } = {},
        participant_one : {id : p1_id = '',category :p1_category = ''} = {},
        participant_two : {id : p2_id = '',category :p2_category = ''}  } = selectedDayAppointments[each] || {};
        } 


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
                onSelect={this.onSelect}/>
            
                </div>
                <Drawer
                    title={"Appointment Details"}
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