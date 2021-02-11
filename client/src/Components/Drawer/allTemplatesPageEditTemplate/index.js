import { Drawer } from "antd";
import React,{Component , Fragment} from "react";
import {injectIntl} from "react-intl";
import { DELETE_TEMPLATE_RELATED_TYPE,MEDICATION_TIMING,DAYS_TEXT_NUM_SHORT, EVENT_TYPE, MEDICATION_TIMING_HOURS, MEDICATION_TIMING_MINUTES, TABLET, SYRUP } from "../../../constant";
import moment from "moment";
import message from "antd/es/message";
import Icon from "antd/es/icon";
import Button from "antd/es/button";
import EditMedicationReminder from "../../../Containers/Drawer/editMedicationReminder";
import EditAppointmentDrawer from "../../../Containers/Drawer/editAppointment";
import EditVitalDrawer from "../../../Containers/Drawer/editVitals";
import confirm from "antd/es/modal/confirm";
import TabletIcon from "../../../Assets/images/tabletIcon3x.png";
import InjectionIcon from "../../../Assets/images/injectionIcon3x.png";
import SyrupIcon from "../../../Assets/images/pharmacy.png";
import uuid from 'react-uuid';
import messages from "./message";
import Input from "antd/es/input";

class TemplatePageCreateDrawer extends Component{
    constructor(props){
        super(props)
        this.state = {
            showInner: false,
            medications: {},
            appointments:{},
            vitals:{},
            medicationKeys: [],
            appointmentKeys:[],
            vitalKeys:[],
            innerFormKey: '',
            innerFormType: '',
            name: '',
            showAddMedicationInner: false,
            showAddAppointmentInner: false,
            showAddVitalInner: false,
            showAreYouSureModal: false,
            carePlanTemplateId:null,
            appointmentIds:{},
            medicationIds:{},
            vitalIds:{},
            deleteMedicationKeys:[],
            deleteAppointmentKeys:[],
            deleteVitalKeys:[],
            templateEdited:false

        };
    }

    componentDidMount(){
    }

    componentDidUpdate(prevProps,prevState){
        const {visible : prev_visible =false,payload:{id : prev_id =null} = {}} = prevProps || {};
        const {visible=false,payload:{id :careplanTemplateID =null} = {}}=this.props;
        
        if(visible && visible!== prev_visible ){
            console.log("3278562473254623 ==>",this.props);

            let templateAppointments = {};
            let templateMedications = {};
            let templateVitals = {};
            let templateAppointmentIDs = [];
            let templateMedicationIDs = [];
            let templateVitalIDs = [];
            let newMedicsKeys = [];
            let newAppointsKeys = [];
            let newVitalKeys = [];
            let newMedics = {};
            let newAppoints = {};
            let newVitals = {};
            let appointmentIdsTemp =[];
            let medicationIdsTemp =[];
            let vitalIdsTemp =[];
            let appointmentIds={};
            let medicationIds={};
            let vitalIds={};


            const {
            care_plan_templates={},
            template_appointments={},
            template_vitals={},
            template_medications={}} = this.props;

            const {
                basic_info :{
                    name : careplanTemplateName = '',
                    id=''
                } ={},
                template_appointment_ids=[],
                template_medication_ids=[],
                template_vital_ids=[]
            } = care_plan_templates[careplanTemplateID] || {};


            for (let aId of template_appointment_ids) {
                let newAppointment = {};
                let {
                    basic_info:{
                        id : appointmentId=''
                    } = {},
                    reason='',
                    time_gap=null,
                    details:{
                        date='',
                        critical,
                        description='',
                        appointment_type='',
                        type_description=''
                    }={},
                    provider_id='',
                    provider_name=''
                } = template_appointments[aId];


                if(time_gap !== null){
                     date = moment().add(parseInt(time_gap),'days');
                }else{
                    date=null;
                }

                newAppointment= {
                    id:appointmentId,
                    reason,
                    time_gap,
                    details: {
                        date,
                        critical,
                        description,
                        appointment_type,
                        type_description
                    },
                    provider_id,
                    provider_name
                } ;

                templateAppointments[aId] = newAppointment;
                appointmentIdsTemp[aId] = appointmentId;
            }


            for (let mId of template_medication_ids) {
                let newMedication = {};
                const {
                    basic_info:{
                        medicine_id='',
                        id:medicationId=''
                    }={},
                    schedule_data : {
                        unit='',
                        repeat='',
                        duration='',
                        quantity='',
                        strength='',
                        description='',
                        repeat_days=[],
                        when_to_take=[],
                        medicine_type=''
                    } = {},
                   
                } = template_medications[mId] || {};

                
                newMedication={
                    id:medicationId,
                    medicine_id,
                    schedule_data : {
                        unit,
                        repeat,
                        duration,
                        quantity,
                        strength,
                        repeat_days,
                        when_to_take,
                        medicine_type,
                        description
                    }
        
                }
                
                templateMedications[mId] = newMedication;
                medicationIdsTemp[mId] = medicationId;

            }

            for (let vId of template_vital_ids){
                let newVital = {};

                const {
                    basic_info : {
                        vital_template_id = '',
                        id:vitalId=''
                    } = {},
                    details :{
                        duration='',
                        description='',
                        repeat_days=[],
                        repeat_interval_id=''
                    }={},
                } = template_vitals[vId];
               
                newVital={
                    id:vitalId,
                    vital_template_id,
                    details:{
                        duration,
                        description,
                        repeat_days,
                        repeat_interval_id
                    }
                };

                templateVitals[vId]=newVital;
                vitalIdsTemp[vId] = vitalId;
               
            }

            if (Object.keys(templateMedications).length) {
                for (let mId of Object.keys(templateMedications)) {
                    let key = uuid();
                    newMedics[key] = templateMedications[mId];
                    newMedicsKeys.push(key);
                    medicationIds[key] = medicationIdsTemp[mId];
                }
            }
            if (Object.keys(templateAppointments).length) {
                for (let aId of Object.keys(templateAppointments)) {
                    let key = uuid();
                    newAppoints[key] = templateAppointments[aId];
                    newAppointsKeys.push(key);
                    appointmentIds[key] = appointmentIdsTemp[aId];
                }
            }

            if(Object.keys(templateVitals).length){
                for(let vId of Object.keys(templateVitals)){
                    let key = uuid();
                    newVitals[key] = templateVitals[vId];
                    newVitalKeys.push(key);
                    vitalIds[key] = vitalIdsTemp[vId];
                }
            }


            this.setState({
                name:careplanTemplateName,
                carePlanTemplateId:careplanTemplateID,
                medications: newMedics,
                appointments: newAppoints,
                vitals:newVitals,
                appointmentKeys: newAppointsKeys,
                medicationKeys: newMedicsKeys,
                vitalKeys:newVitalKeys,
                templateAppointmentIDs,
                templateMedicationIDs,
                templateVitalIDs,
                templateEdited: false,
                medicationIds,
                appointmentIds,
                vitalIds
            });
     
        }
      

    }
    

    formatMessage = data => this.props.intl.formatMessage(data);


    showInnerForm = (innerFormType, innerFormKey) => () => {
        this.setState({ innerFormType, innerFormKey, showInner: true });
    }

    onCloseInner = () => {
        this.setState({ showInner: false })
    };

    showAddMedication = () => {
        this.setState({ showAddMedicationInner: true });
    }

    closeAddMedication = () => {
        this.setState({ showAddMedicationInner: false });
    }

    showAddAppointment = () => {
        this.setState({ showAddAppointmentInner: true });
    }

    closeAddAppointment = () => {
        this.setState({ showAddAppointmentInner: false });
    }

    showAddVital = () => {
        this.setState({ showAddVitalInner: true });
    }

    closeAddVital = () => {
        this.setState({ showAddVitalInner: false });
    }

    async handleDeleteTemplateMed(key) {
        const {deleteCareplanTemplateRelated} = this.props;
        const {carePlanTemplateId = null,medicationIds={}}=this.state;
        try{
            const other_id = medicationIds[key] || null; 
            const response = await deleteCareplanTemplateRelated({
                careplan_template_id:carePlanTemplateId,
                other_id,
                other_type:DELETE_TEMPLATE_RELATED_TYPE.MEDICATION
            });
            const {status,statusCode,payload:{data={},message:msg=''} = {} } = response;
            if(status){
                let { deleteMedicationKeys=[] } = this.state;
                delete medicationIds[key];
                deleteMedicationKeys.splice(deleteMedicationKeys.indexOf(key),1);
                this.setState({ deleteMedicationKeys ,medicationIds});
                // message.success(msg);
            }else{
                message.warn(msg);
            }

        }catch(error){
            console.log("deleteMedicationError ===>",error);
            message.warn(error);
        }
    }

    async handleDeleteTemplateAppointment(key) {
        const {deleteCareplanTemplateRelated} = this.props;
        const {carePlanTemplateId = null,appointmentIds={}}=this.state;
        try{
            const other_id = appointmentIds[key] || null; 
            const response = await deleteCareplanTemplateRelated({
                careplan_template_id:carePlanTemplateId,
                other_id,
                other_type:DELETE_TEMPLATE_RELATED_TYPE.APPOINTMENT
            });

            const {status,statusCode,payload:{data={},message:msg=''} = {} } = response;
            if(status){
                let { deleteAppointmentKeys=[] } = this.state;
                delete appointmentIds[key];
                deleteAppointmentKeys.splice(deleteAppointmentKeys.indexOf(key),1);
                this.setState({ deleteAppointmentKeys ,appointmentIds});
                // message.success(msg);
            }else{
                message.warn(msg);
            }

        }catch(error){
            console.log("deleteAppointmentError ===>",error);
            message.warn(error);
        }
    }

    async handleDeleteTemplateVital(key){
        const {deleteCareplanTemplateRelated} = this.props;
        const {carePlanTemplateId = null,vitalIds={}}=this.state;
        try{
            const other_id = vitalIds[key] || null; 
            const response = await deleteCareplanTemplateRelated({
                careplan_template_id:carePlanTemplateId,
                other_id,
                other_type:DELETE_TEMPLATE_RELATED_TYPE.VITAL
            });

            const {status,statusCode,payload:{data={},message:msg=''} = {} } = response;
            if(status){
                let { deleteVitalKeys=[] } = this.state;
                delete vitalIds[key];
                deleteVitalKeys.splice(deleteVitalKeys.indexOf(key),1);
                this.setState({ deleteVitalKeys ,vitalIds});
                // message.success(msg);
            }else{
                message.warn(msg);
            }

        }catch(error){
            console.log("deleteVitalError ===>",error);
            message.warn(error);
        }
    }


    deleteEntry = () => {
        let { appointments = {}, appointmentKeys = [],
         medications = {}, medicationKeys = [],
         vitals = {},vitalKeys=[],
         innerFormType = '', innerFormKey = '',
         medicationIds={},appointmentIds={},vitalIds={},
         deleteMedicationKeys,deleteAppointmentKeys,deleteVitalKeys } = this.state;

        const key =innerFormKey;
        if(medicationIds[key]){
            deleteMedicationKeys.push(key);
        }else if( appointmentIds[key]){
            deleteAppointmentKeys.push(key);
        }else if (vitalIds[key]){
            deleteVitalKeys.push(key);
        }

        if (innerFormType == EVENT_TYPE.MEDICATION_REMINDER) {
            delete medications[innerFormKey];
            medicationKeys.splice(medicationKeys.indexOf(innerFormKey), 1);
        } else if (innerFormType == EVENT_TYPE.APPOINTMENT) {
            delete appointments[innerFormKey];
            appointmentKeys.splice(appointmentKeys.indexOf(innerFormKey), 1);
        }else if (innerFormType == EVENT_TYPE.VITALS){
            delete vitals[innerFormKey];
            vitalKeys.splice(vitalKeys.indexOf(innerFormKey), 1);
        }

        this.setState({ appointments, appointmentKeys,
             medications, medicationKeys,
             vitals,vitalKeys,
             templateEdited: true });
        this.onCloseInner();
    }


    



    setTemplateName = (event) => {
        this.setState({ name: event.target.value,templateEdited:true });
    }


    validateData = (medicationsData, appointmentsData, vitalsData,name) => {

        if(!name){
            return false;
        }

        for (let medication of medicationsData) {

            const {
                    medicine_id ='',
                    schedule_data : {
                        unit ='',
                        repeat ='',
                        duration =null,
                        quantity ='',
                        strength ='',
                        repeat_days =[],
                        when_to_take = [],
                        medicine_type ='',
                        description=''
                    } = {}
            } = medication || {};
           
            if (!medicine_id || !unit || !repeat || (unit !== 'ml' && !quantity) ||  !repeat_days.length ||
                !medicine_type || (!duration && duration !== null) || !strength  || !when_to_take.length) {
               
                message.error("Medication Error");
                return false;
            }
        }

        for (let appointment of appointmentsData) {
            const {
                reason ='',
                time_gap =null,
                details: {
                    date ='',
                    critical ='',
                    description ='',
                    appointment_type='',
                    type_description=''
                } = {},
                provider_id ='',
                provider_name =''
            } = appointment || {};

            if (!reason || (!time_gap && time_gap!==null) || !date || !appointment_type
                || !type_description || !provider_id  ) {
              
                 console.log("386428376483724632874",{
                        reason:!reason,
                        time_gap:(!time_gap && time_gap!==null),
                        date:!date,
                        appointment_type:!appointment_type,
                        type_description:!type_description,
                        provider_id:!provider_id,
                        appointment:appointment,
                        dateIsssss:date,
                        appointmentsData
                    });

                    
                message.error(this.formatMessage(messages.appointmentError));

                return false;
            }
        }

        for (let vital of vitalsData) {
    
                const {
                    vital_template_id,
                    details:{
                        duration,
                        description,
                        repeat_days,
                        repeat_interval_id
                    }={}
                }    = vital;

                

            if (!vital_template_id || (!duration && duration!==null)  || !vital_template_id || !repeat_days   || !repeat_interval_id) {

                message.error(this.formatMessage(messages.vitalError));

                return false;
            }
            
        }

        return true;
    }


   

    onSubmit = async () => {
    
        let { medications = {}, appointments = {},vitals={}, name = '' } = this.state;
        const {updateCareplanTemplate,close} = this.props;
        let medicationsData = Object.values(medications);
        let appointmentsData = Object.values(appointments);
        let vitalsData = Object.values(vitals);
        


        let validate = this.validateData(medicationsData, appointmentsData,vitalsData,name);
        if (validate) {
            try{
                const {deleteAppointmentKeys=[],deleteMedicationKeys=[],deleteVitalKeys=[] , carePlanTemplateId=null} = this.state;
                const deleteMedArr=deleteMedicationKeys;
                const deleteAppArr = deleteAppointmentKeys;
                const deleteVitalArr = deleteVitalKeys;
            
                const response  = await updateCareplanTemplate(carePlanTemplateId,{medicationsData, appointmentsData,vitalsData, name });

                const {payload : {data = {} , message : res_msg = ''} , status, statusCode } = response || {};
                if (status){
                    for(let key of deleteMedArr){
                        this.handleDeleteTemplateMed(key);
                    }
    
                    for (let key of deleteAppArr){
                        this.handleDeleteTemplateAppointment(key);
                    }
    
                    for (let key of deleteVitalArr){
                        this.handleDeleteTemplateVital(key);
                    }

                    message.success(res_msg);
                    this.setState ({
                        showInner: false,
                        medications: {},
                        appointments:{},
                        vitals:{},
                        medicationKeys: [],
                        appointmentKeys:[],
                        vitalKeys:[],
                        innerFormKey: '',
                        innerFormType: '',
                        name: '',
                        showAddMedicationInner: false,
                        showAddAppointmentInner: false,
                        showAddVitalInner: false,
                        showAreYouSureModal: false,
                        carePlanTemplateId:null,
                        appointmentIds:{},
                        medicationIds:{},
                        vitalIds:{},
                        deleteMedicationKeys:[],
                        deleteAppointmentKeys:[],
                        deleteVitalKeys:[],
                        templateEdited:false
                    })
                    close();
                }else{
                    message.error(res_msg);
                }

            }catch(error){
                console.log("error -->",error);
                message.warn(error);
            }
            
        }
    }

    warnNote = () => {
        return (
          <div className="pt16">
            <p className="red">
              <span className="fw600">{this.formatMessage(messages.note)}</span>
              {` : ${this.formatMessage(messages.warnMessage)}`}
            </p>
          </div>
        );
      };
    
    
      handleCloseWarning = () => {
        const { warnNote } = this;
        const {close}=this.props;
    
        confirm({
          title: `${this.formatMessage(messages.closeMessage)}`,
          content: (
            <div>
              {warnNote()}
            </div>
          ),
          onOk: async () => {
            this.setState ({
                showInner: false,
                medications: {},
                appointments:{},
                vitals:{},
                medicationKeys: [],
                appointmentKeys:[],
                vitalKeys:[],
                innerFormKey: '',
                innerFormType: '',
                name: '',
                showAddMedicationInner: false,
                showAddAppointmentInner: false,
                showAddVitalInner: false,
                showAreYouSureModal: false,
                carePlanTemplateId:null,
                appointmentIds:{},
                medicationIds:{},
                vitalIds:{},
                deleteMedicationKeys:[],
                deleteAppointmentKeys:[],
                deleteVitalKeys:[],
                templateEdited:false
            })
    
            close();
          },
          onCancel() { }
        });
    };

    onClose = ()=> {
        const{close}=this.props;
        const {name ='',medicationKeys=[],appointmentKeys=[],vitalKeys=[],templateEdited=false}=this.state;
        if(templateEdited){
            this.handleCloseWarning();
            return;
        }

        this.setState ({
            showInner: false,
            medications: {},
            appointments:{},
            vitals:{},
            medicationKeys: [],
            appointmentKeys:[],
            vitalKeys:[],
            innerFormKey: '',
            innerFormType: '',
            name: '',
            showAddMedicationInner: false,
            showAddAppointmentInner: false,
            showAddVitalInner: false,
            showAreYouSureModal: false,
            carePlanTemplateId:null,
            appointmentIds:{},
            medicationIds:{},
            vitalIds:{},
            deleteMedicationKeys:[],
            deleteAppointmentKeys:[],
            deleteVitalKeys:[],
            templateEdited:false
        })

        close();

    }


    renderTemplateDetails = () => {
        const { 
            medications = {}, appointments = {},vitals = {},
            medicationKeys = [], appointmentKeys = [],vitalKeys=[], 
            carePlanTemplateIds = [] ,name =''} = this.state;

        const { care_plan_templates = {}  , repeat_intervals = {} , vital_templates = {} , medicines ={}} = this.props;

        return (
            <div className='template-block'>
                <div className='wp100 flex direction-row align-center '>
                 <div className='form-category-headings-ap mr0-I'>{this.formatMessage(messages.name_text)}</div><div className="star-red fs22">*</div>      
                </div>

                <div className='wp100 flex align-center justify-space-between'>
                <Input
                        placeholder={this.formatMessage(messages.namePlaceholder)}
                        className={"form-inputs wp100 "}
                        onChange={this.setTemplateName}
                        style={{width:"100%",alignSelf:"flex-start"}}
                        value={name}
                        required={true}
                    />
                </div>
                    
                 
                <div className='wp100 flex align-center justify-space-between'>
                    <div className='form-category-headings-ap '>{"Medications"}</div>
                    {
                        medicationKeys.length>0
                        ?
                        <div className='add-more' onClick={this.showAddMedication}>{this.formatMessage(messages.addMore)}</div>
                        :
                        <div className='add-more' onClick={this.showAddMedication}>{this.formatMessage(messages.add)}</div>
                    }

                </div>


                {medicationKeys.map(key => {
               
                let {
                    medicine_id = '',
                        schedule_data : {
                            start_date = moment(),
                            unit ='',
                            repeat ='',
                            duration =null,
                            quantity ='',
                            strength ='',
                            repeat_days =[],
                            when_to_take =[],
                            medicine_type=''
                        } = {}
        
                    } = medications[key];

                    const {basic_info : { name : medicine =''} ={} } = medicines[medicine_id] || {};
                    console.log("3278562473254623 ===> when_to_take",{when_to_take,med:medications[key]});
                    when_to_take.sort();
                    let nextDueTime = moment().format('HH:MM A');
                    let closestWhenToTake = 0;
                    let minDiff = 0;

                    const date = moment(); 
                    const dow = date.day();
                    let dayNum = dow;

                    if(typeof(DAYS_TEXT_NUM_SHORT[dow]) !== 'undefined' && !repeat_days.includes(DAYS_TEXT_NUM_SHORT[dow])){
                        while( typeof(DAYS_TEXT_NUM_SHORT[dayNum]) !== 'undefined' && !(repeat_days.includes(DAYS_TEXT_NUM_SHORT[dayNum]))){
                            if(dayNum > 7){
                                dayNum =1
                            }
                            else{
                                dayNum ++;
                            }

                        }
                        start_date=moment().isoWeekday(dayNum);
                    }

                    if (moment(start_date).isSame(moment(), 'D')) {
                        for (let wtt of when_to_take) {
                            let newMinDiff = moment().set({ hour: MEDICATION_TIMING_HOURS[wtt], minute: MEDICATION_TIMING_MINUTES[wtt] }).diff(moment());
                            minDiff = minDiff === 0 && newMinDiff > 0 ? newMinDiff : newMinDiff > 0 && newMinDiff < minDiff ? newMinDiff : minDiff;
                            closestWhenToTake = minDiff === newMinDiff ? wtt : closestWhenToTake;
                        }
                    }
                    let medTimingsToShow = '';
                    for (let wtt in when_to_take) {
                        let timing_temp = MEDICATION_TIMING[when_to_take[wtt]];
                        let txt='';
                        let time_temp = '';
                        if (timing_temp){
                            txt=MEDICATION_TIMING[when_to_take[wtt]].text;
                            time_temp = MEDICATION_TIMING[when_to_take[wtt]].time;
                        }
                        medTimingsToShow += `${txt} `;
                        medTimingsToShow += `(${time_temp})${wtt < when_to_take.length - 1 ? ', ' : ''}`
                    }
                    nextDueTime = MEDICATION_TIMING[closestWhenToTake ? closestWhenToTake : '4'].time;
                    
                    let whenTotakeTime = when_to_take.length>0 ? MEDICATION_TIMING[when_to_take[0]].time : '';
                    let nextDue = moment(start_date).isSame(moment(), 'D') ? `Today at ${nextDueTime}` : `${moment(start_date).format('D MMM')} at ${whenTotakeTime}`;

                    return (
                        <div className='flex wp100 flex-grow-1 align-center' key={key}>
                            <div className='drawer-block' >
                                <div className='flex direction-row justify-space-between align-center'>
                                    <div className='flex align-center'>
                                        <div className='form-headings-ap'>{medicine ? medicine : "MEDICINE"}</div>
                                        {medicine_type && (<img src={medicine_type === TABLET ? TabletIcon : medicine_type === SYRUP ? SyrupIcon : InjectionIcon} className={'medication-image-tablet'} />)}
                                    </div>

                                    <Icon type="edit" className='ml20' style={{ color: '#4a90e2' }} theme="filled" onClick={this.showInnerForm(EVENT_TYPE.MEDICATION_REMINDER, key)} />

                                </div>

                                < div className='drawer-block-description'>{medTimingsToShow}</div>
                                <div className='drawer-block-description'>{`Next due: ${nextDue}`}</div>
                            </div>
                        </div>
                    );
                })
                }

                <div className='wp100 flex align-center justify-space-between'>
                    <div className='form-category-headings-ap align-self-start'>{this.formatMessage(messages.appointments)}</div>
                    {
                        appointmentKeys.length>0
                        ?
                        <div className='add-more' onClick={this.showAddAppointment}>{this.formatMessage(messages.addMore)}</div>
                        :
                        <div className='add-more' onClick={this.showAddAppointment}>{this.formatMessage(messages.add)}</div>
                    }
                </div>
                {
                    appointmentKeys.map(key => {

                        console.log("3278562473254623 ====> apptData",{appts:appointments[key],appointments});
                        let { reason = '', details : { description = '', date = '' } = {}, time_gap = '' } = appointments[key];
                       

                        return (

                            <div className='flex wp100 flex-grow-1 align-center' key={key}>
                                <div className='drawer-block' >

                                    <div className='flex direction-row justify-space-between align-center'>
                                        <div className='form-headings-ap'>{reason}</div>
                                        <Icon type="edit" className='ml20' style={{ color: '#4a90e2' }} theme="filled" onClick={this.showInnerForm(EVENT_TYPE.APPOINTMENT, key)} />
                                    </div>
                                    <div className='drawer-block-description'>{date ? `After ${ (moment(date).diff(moment(), 'days')) +1} days` : time_gap ? `After ${time_gap} days` : ''}</div>
                                    <div className='drawer-block-description'>{`Notes:${description}`}</div>
                                </div>
                            </div>
                        );
                    })
                }

                <div className='wp100 flex align-center justify-space-between'>
                    <div className='form-category-headings-ap align-self-start'>{this.formatMessage(messages.actions)}</div>
                    {
                        vitalKeys.length>0
                        ?
                        <div className='add-more' onClick={this.showAddVital}>{this.formatMessage(messages.addMore)}</div>
                        :
                        <div className='add-more' onClick={this.showAddVital}>{this.formatMessage(messages.add)}</div>
                    }
                </div>
                {

                    vitalKeys.map(key => {
                        const {
                            vital_template_id = '',
                            details:{
                                duration=null,
                                description='',
                                repeat_days=[],
                                repeat_interval_id=''
                            } = {}
                        } = vitals[key];
                        
                        const {basic_info : {name :vital_name = ''} ={}} = vital_templates[vital_template_id];
                        const repeatObj = repeat_intervals[repeat_interval_id];
                        const vital_repeat = repeatObj["text"];

                        return (

                            <div className='flex wp100 flex-grow-1 align-center' key={key}>
                                <div className='drawer-block' >

                                    <div className='flex direction-row justify-space-between align-center'>
                                        <div className='form-headings-ap'>{vital_name}</div>
                                        <Icon type="edit" className='ml20' style={{ color: '#4a90e2' }} theme="filled" onClick={this.showInnerForm(EVENT_TYPE.VITALS, key)} />
                                    </div>
                                    <div className='drawer-block-description'>{vital_repeat}</div>
                                    <div className='drawer-block-description'>{`Repeat: ${repeat_days}`}</div>
                                </div>
                              
                            </div>
                        );
                    })
                }
                    

                
            </div >
        );

    }

    editMedication = (data) => {
        let { medications = {}, innerFormKey = '' , medicationIds={}} = this.state;
        let { medicines } = this.props;
        let newMedication = medications[innerFormKey];
        const { end_date = "",
            medicine_id = "",
            quantity = 0,
            repeat = "",
            repeat_days = [],
            start_date = "",
            start_time = '',
            strength = '',
            unit = "",
            description = '',
            medicine_type = "",
            when_to_take = ["3"] } = data;

        const { basic_info: { name = '', type = '' } = {} } = medicines[medicine_id];

        let duration = moment(end_date).diff(moment(start_date),'days');
        if(!end_date){
            duration=null;
        }
        
        newMedication = {
            medicine_id,
            schedule_data : {
                unit,
                repeat,
                duration,
                quantity,
                strength,
                repeat_days,
                when_to_take,
                medicine_type,
                description
            }

        }

        if(medicationIds[innerFormKey]){
            const id = medicationIds[innerFormKey];
            newMedication["id"]=id;
        }

        medications[innerFormKey] = newMedication;
        this.setState({ medications, templateEdited: true }, () => {
            this.onCloseInner();
        });
    }

    editVital = (data) => {
        let { vitals = {}, innerFormKey = '' , vitalIds={} } = this.state;
        let { vital_templates={} } = this.props;
        let newVital = vitals[innerFormKey] || {};
        const {
            end_date = "",
            vital_template_id = "",
            repeat_days = [],
            start_date = "",
            repeat_interval_id = '',
            description = ''
        } = data;

        const { basic_info: { name = '' } = {} } = vital_templates[vital_template_id];
        let vitalExist = false;
        
        let duration = moment(end_date).diff(moment(start_date),'days');
        if(!end_date){
            duration=null;
        }

        for (let key of Object.keys(vitals)) {
            let { vital_template_id: vId = '' } = vitals[key];
            const vital = vitals[key];
            if (parseInt(vital_template_id) === parseInt(vId) && key.toString() !== innerFormKey.toString() ) {
                vitalExist = true;
            }
        }

        const s_date = moment(start_date);
        let e_date='';
        if(end_date === null){
            e_date=end_date;
        }else{
            e_date=moment(end_date);
        }
        if (vitalExist) {
            message.error(this.formatMessage(messages.vitalExist));
        } else {

            let newVital = {
                vital_template_id,
                details:{
                    duration,
                    description,
                    repeat_days,
                    repeat_interval_id
                }
                
            };

            if(vitalIds[innerFormKey]){
                const id = vitalIds[innerFormKey];
                newVital["id"]=id;
            }

            vitals[innerFormKey] = newVital;

            this.setState({ vitals, templateEdited: true }, () => {
                this.onCloseInner();
                // this.props.dispatchClose();
            });   
        }   

    }

    editAppointment = (data) => {
        const { appointments = {}, innerFormKey = '',appointmentIds={} } = this.state;

        let {
            date = {},
            description = "",
            end_time = {},
            id = '',
            critical,
            type = '',
            type_description = '',
            provider_id = 0,
            provider_name = '',
            participant_two = {},
            start_time = {},
            treatment_id = "",
            reason = '' } = data;

        let newAppointment = appointments[innerFormKey];

        const today =  moment();
        const selectedDate = date;
        let diff = selectedDate.diff(today,'days');
        const time_gap = typeof(diff) === 'number' ? diff+1 : 0;


        if (!date || !start_time  ) {
            message.error(this.formatMessage(messages.appointmentError));
            return;
        }

        newAppointment = {
            reason ,
            time_gap,
            details: {
                date,
                critical,
                description,
                appointment_type:type,
                type_description
            },
            provider_id,
            provider_name
        }

        if(appointmentIds[innerFormKey]){
            const id = appointmentIds[innerFormKey];
            newAppointment["id"]=id;
        }

        appointments[innerFormKey] = newAppointment;
        this.setState({ appointments, templateEdited: true }, () => {
            this.onCloseInner();
        });
    }

    addMedication = (data) => {

        const { 
            end_date = "",
            medicine_id = "", 
            medicine_type = "",
            quantity = 0,
            repeat = "",
            repeat_days = [],
            start_date = "",
            start_time = '',
            strength = '',
            unit = "", 
            description = '',
            when_to_take = ["3"] 
        } = data;

            
        let { medications = {}, medicationKeys = [] } = this.state;
        let { medicines } = this.props;
        let newMedication = {};
        const { basic_info: { name = '', type = '' } = {} } = medicines[medicine_id] || {};
        

        let duration = moment(end_date).diff(moment(start_date),'days');
        if(!end_date){
            duration=null;
        }

        newMedication = {
            medicine_id,
            schedule_data : {
                unit,
                repeat,
                duration,
                quantity,
                strength,
                repeat_days,
                when_to_take,
                medicine_type,
                description
            }

        }
        let key = uuid();
        let medicineExist = false;
        for (let medication of Object.values(medications)) {
            let { medicine_id: medId = 1 } = medication;
            if (parseInt(medicine_id) === parseInt(medId)) {
                medicineExist = true;
            }
        }

        if (medicineExist) {
            message.error(this.formatMessage(messages.medicationExist));
        } else {
            medicationKeys.push(key);
            medications[key] = newMedication;
            this.setState({ medications, medicationKeys, templateEdited: true }, () => {
                this.closeAddMedication();
            });
        }
    }

    addVital = (data) => {


        const {vital_templates={}}=this.props;
        let newVital = {};
        let { vitals = {}, vitalKeys = [] } = this.state;


        const {
            end_date = "",
            vital_template_id = "",
            repeat_days = [],
            start_date = "",
            repeat_interval_id = '',
            description = ''
        } = data;

        const { basic_info: { name = '' } = {} } = vital_templates[vital_template_id];


        let duration = moment(end_date).diff(moment(start_date),'days');
        if(!end_date){
            duration=null;
        }
       
        let key = uuid();
        let vitalExist = false;
        for (let vital of Object.values(vitals)) {
            let { vital_template_id: vId = '' } = vital;
            if (parseInt(vital_template_id) === parseInt(vId)) {
                vitalExist = true;
            }
        }

        if (vitalExist) {
            message.error(this.formatMessage(messages.vitalExist));
        } else {
            vitalKeys.push(key);
            vitals[key] = {
                vital_template_id,
                details:{
                    duration,
                    description,
                    repeat_days,
                    repeat_interval_id
                }
            };
            this.setState({ vitals, vitalKeys, templateEdited: true }, () => {
                this.closeAddVital();
            });
        }
    }




    addAppointment = (data) => {
        let { appointments = {}, appointmentKeys = [] } = this.state;
        let key = uuid();
        let { 
            date = {},
            description = "",
            end_time = {},
            critical,
            type = '',
            type_description = '',
            provider_id = 0,
            provider_name = '',
            start_time = {},
            reason = '' } = data;
        let newAppointment = {};



        const today =  moment();
        const selectedDate = date;
        let diff = selectedDate.diff(today,'days');
        const time_gap = typeof(diff) === 'number' ? diff+1 : 0;


        if (!date || !start_time  ) {
            message.error(this.formatMessage(messages.appointmentError));
            return;
        }

        newAppointment = {
            reason ,
            time_gap,
            details: {
                date,
                critical,
                description,
                appointment_type:type,
                type_description
            },
            provider_id,
            provider_name
        }

        
        appointments[key] = newAppointment;
        appointmentKeys.push(key);
        this.setState({ appointments, appointmentKeys, templateEdited: true }, () => {
            this.closeAddAppointment();
        });
    }

    warnNoteTemplateDelete = () => {
        return (
          <div className="pt16">
            <p className="red">
              <span className="fw600">{this.formatMessage(messages.note)}</span>
              {` : ${this.formatMessage(messages.deleteTemplateWarn)}`}
            </p>
          </div>
        );
      };


    handleTemplateDelete =(e)=>{
        e.preventDefault();
        const { warnNoteTemplateDelete } = this;
        const {close}=this.props;
    
        confirm({
          title: `${this.formatMessage(messages.deleteTemplateNote)}`,
          content: (
            <div>
              {warnNoteTemplateDelete()}
            </div>
          ),
          onOk: async () => {

                const {deleteCareplanTemplateRelated , getAllTemplatesForDoctor} = this.props;
                const {carePlanTemplateId = null}=this.state;
                try{
                    const response = await deleteCareplanTemplateRelated({
                        careplan_template_id:carePlanTemplateId,
                    });

                    const {payload :{data={},message : msg=''}={} , status,statusCode}=response || {};
                    if(status){
                        message.success(msg);
                        await getAllTemplatesForDoctor();
                    }else{
                        message.warn(msg);
                    }
                }catch(error){
                    console.log("Delete Template Error --->",error);
                    message.warn(error);
                }   
            

            this.setState ({
                showInner: false,
                medications: {},
                appointments:{},
                vitals:{},
                medicationKeys: [],
                appointmentKeys:[],
                vitalKeys:[],
                innerFormKey: '',
                innerFormType: '',
                name: '',
                showAddMedicationInner: false,
                showAddAppointmentInner: false,
                showAddVitalInner: false,
                showAreYouSureModal: false,
                carePlanTemplateId:null,
                appointmentIds:{},
                medicationIds:{},
                vitalIds:{},
                deleteMedicationKeys:[],
                deleteAppointmentKeys:[],
                deleteVitalKeys:[],
                templateEdited:false
            })
    
            close();
          },
          onCancel() { }
        });
    }

    render() {
        let { showInner, innerFormType, innerFormKey, medications, showAddMedicationInner,
            appointments, vitals ,showAddAppointmentInner  , showAddVitalInner ,name ,templateEdited=false } = this.state;
        const { onClose, renderTemplateDetails } = this;
        let medicationData = innerFormKey && innerFormType == EVENT_TYPE.MEDICATION_REMINDER ? medications[innerFormKey] : {};
   
        let appointmentData = innerFormKey && innerFormType == EVENT_TYPE.APPOINTMENT ? appointments[innerFormKey] : {};
        let vitalData = innerFormKey && innerFormType == EVENT_TYPE.VITALS ? vitals[innerFormKey] : {} ; 
        const {visible = false , close}=this.props;

        if(medicationData){
            medicationData.templatePage=true;

        }

        if (visible !== true) {
            return null;
        }
       
        return (
            <Fragment>
                <Drawer
                    title={this.formatMessage(messages.templateTitle)}
                    placement="right"
                    // closable={false}
                    maskClosable={false}
                    headerStyle={{
                        position: "sticky",
                        zIndex: "9999",
                        top: "0px"
                    }}
                    // onClose={onClose}
                    onClose={this.onClose}
                    width={'35%'}
                    visible={visible}

                >
                    {renderTemplateDetails()}

                    {/* edit */}

                    {innerFormKey && innerFormType == EVENT_TYPE.MEDICATION_REMINDER && 
                    <EditMedicationReminder 
                    medicationData={medicationData} 
                    medicationVisible={showInner} 
                    editMedication={this.editMedication} 
                    hideMedication={this.onCloseInner} 
                    deleteMedicationOfTemplate={this.deleteEntry} />}

                    {innerFormKey && innerFormType == EVENT_TYPE.APPOINTMENT &&
                     <EditAppointmentDrawer 
                     appointmentData={appointmentData} 
                     appointmentVisible={showInner} 
                     editAppointment={this.editAppointment}
                    
                    hideAppointment={this.onCloseInner}   deleteAppointmentOfTemplate={this.deleteEntry}
                    />}
               
                    {innerFormKey && innerFormType == EVENT_TYPE.VITALS && 
                    <EditVitalDrawer 
                    vitalData={vitalData} 
                    vitalVisible={showInner} 
                    editVital={this.editVital} 
                    hideVital={this.onCloseInner} 
                    deleteVitalOfTemplate={this.deleteEntry} />}

                
                    
                    {/* add */}
                    {showAddMedicationInner &&
                    <EditMedicationReminder 
                    medicationVisible={showAddMedicationInner} 
                    addMedication={this.addMedication} 
                    hideMedication={this.closeAddMedication} />}

                    {showAddAppointmentInner && 
                    <EditAppointmentDrawer 
                    appointmentVisible={showAddAppointmentInner} 
                    addAppointment={this.addAppointment} 
                    hideAppointment={this.closeAddAppointment}    />}
                  
                    {showAddVitalInner && <EditVitalDrawer vitalVisible={showAddVitalInner} addVital={this.addVital} hideVital={this.closeAddVital} />} 

                  
                  

                    <div className='add-patient-footer'>
                        <Button onClick={this.handleTemplateDelete} 
                        type={"danger"}
                        ghost
                        className="fs14 no-border style-delete"
                        >
                            {this.formatMessage(messages.delete)}
                        </Button>
                        <Button onClick={this.onSubmit} type="primary"
                        disabled={!name || !templateEdited}
                        >
                            {this.formatMessage(messages.submit)}
                        </Button>
                    </div>
                </Drawer>
            </Fragment>
        );
    }

}

export default injectIntl(TemplatePageCreateDrawer);
