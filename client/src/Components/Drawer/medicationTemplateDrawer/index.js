import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, Icon, Select, Input, message, Button, TimePicker, Modal } from "antd";

import { MEDICATION_TIMING,DAYS,DAYS_TEXT_NUM_SHORT, EVENT_TYPE, MEDICATION_TIMING_HOURS, MEDICATION_TIMING_MINUTES, TABLET, SYRUP } from "../../../constant";
import moment from "moment";
import EditMedicationReminder from "../../../Containers/Drawer/editMedicationReminder";
import EditAppointmentDrawer from "../../../Containers/Drawer/editAppointment";
import EditVitalDrawer from "../../../Containers/Drawer/editVitals";

import confirm from "antd/es/modal/confirm";
import TabletIcon from "../../../Assets/images/tabletIcon3x.png";
import InjectionIcon from "../../../Assets/images/injectionIcon3x.png";
import SyrupIcon from "../../../Assets/images/pharmacy.png";
import uuid from 'react-uuid';
import messages from "./message";

const { Option } = Select;
const BLANK_TEMPLATE = 'Blank Template'

const { TextArea } = Input;

const TemplateNameModal = ({ visible, hideModal, carePlanTemplateId, carePlanName, changeTemplateName, saveTemplate, skip, formatMessage }) => {
    return (
        <Modal
            title={formatMessage(messages.saveTempQues)}
            visible={visible}
            onCancel={hideModal}
            cancelButtonProps={{ style: { display: 'none' } }}

            okButtonProps={{ style: { display: 'none' } }}
        >
            <div className='template-name-modal-container'>
                <div className='template-name-modal-text'>{(carePlanTemplateId && (carePlanName !== BLANK_TEMPLATE)) ? formatMessage(messages.youModified) : formatMessage(messages.youCreated)}</div>
                <Input
                    placeholder={formatMessage(messages.giveName)}
                    onChange={changeTemplateName}
                    className='template-name-modal-input'
                />
                <div className='template-name-modal-name-button' onClick={saveTemplate}><div className='template-name-modal-name-text'>{formatMessage(messages.saveTemplate)} </div></div>
                <div className='template-name-modal-skip-button' onClick={skip}><div className='template-name-modal-skip-text'>{formatMessage(messages.skip)} </div></div>
            </div>

        </Modal>
    );
}


class TemplateDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showInner: false,
            medications: {},
            appointments: {},
            vitals:{},
            medicationKeys: [],
            appointmentKeys: [],
            vitalKeys:[],
            innerFormKey: '',
            innerFormType: '',
            name: '',
            createTemplate: false,
            carePlanTemplateId: 0,
            showAddMedicationInner: false,
            showAddAppointmentInner: false,
            showAddVitalInner:false,
            showTemplateNameModal: false,
            showAreYouSureModal: false,
            templateEdited: false
        };
    }



    componentDidMount() {
        const { care_plan_template_ids: carePlanTemplateIds = [], care_plan_templates = {},
            template_medications = {}, template_appointments = {}, medicines , template_vitals = {} } = this.props;
        let newMedicsKeys = [];
        let newAppointsKeys = [];
        let newVitalKeys = [];
        let newMedics = {};
        let newAppoints = {};
        let newVitals = {};


        let carePlanTemplateId = Object.keys(carePlanTemplateIds).length ? parseInt(carePlanTemplateIds[0]) : 0;


        let templateAppointments = {};
        let templateMedications = {};
        let templateVitals = {};
        let templateAppointmentIDs = [];
        let templateMedicationIDs = [];
        let templateVitalIDs = [];

        if (carePlanTemplateId) {

            let { template_appointment_ids = [], template_medication_ids = [] , template_vital_ids=[]} = care_plan_templates[carePlanTemplateId] || {};
            templateAppointmentIDs = template_appointment_ids;
            templateMedicationIDs = template_medication_ids;
            templateVitalIDs = template_vital_ids;

            for (let aId of template_appointment_ids) {
                let newAppointment = {};
                let { basic_info: { id = 0, care_plan_template_id = 0 } = {}, reason = '', time_gap = 0, details = {}, provider_id, provider_name = '' } = template_appointments[aId];
                newAppointment.id = id;
                newAppointment.schedule_data = details;
                newAppointment.reason = reason;
                newAppointment.time_gap = time_gap;
                newAppointment.provider_id = provider_id;
                newAppointment.provider_name = provider_name;
                newAppointment.care_plan_template_id = care_plan_template_id;
                templateAppointments[aId] = newAppointment;
            }

            for (let mId of template_medication_ids) {
                let newMedication = {};
                let { basic_info: { id = 0, care_plan_template_id = 0, medicine_id = 0 } = {}, schedule_data = {} } = template_medications[mId];
                newMedication.id = id;
                newMedication.schedule_data = schedule_data;
                newMedication.care_plan_template_id = care_plan_template_id;
                newMedication.medicine_id = medicine_id;
                const { basic_info: { name: medName = '', type: medType = '' } = {} } = medicines[medicine_id] || {};


                newMedication.medicine = medName;
                newMedication.medicineType = medType;
                templateMedications[mId] = newMedication;
            }

            for (let vId of template_vital_ids){
                let newVital = {};
                const {basic_info : {care_plan_template_id = 0,id = 0,vital_template_id = 0} = {},
                    details : {
                        description = '',duration = 0,repeat_days=[],repeat_interval_id=''
                } = {} } = template_vitals[vId];

            
                const s_date=moment().toISOString();
                const e_date=moment().add(parseInt(duration), 'days').toISOString();

                if(duration === null){
                    e_date = null;
                }
                
                templateVitals[vId] = {
                    id,
                    vital_template_id,
                    repeat_days,
                    repeat_interval_id,
                    description,
                    start_date:s_date,
                    end_date:e_date
                };
            }

            if (Object.keys(templateMedications).length) {
                for (let medication of Object.values(templateMedications)) {
                    let key = uuid();
                    newMedics[key] = medication;
                    newMedicsKeys.push(key);
                }
            }
            if (Object.keys(templateAppointments).length) {
                for (let appointment of Object.values(templateAppointments)) {
                    let key = uuid();
                    newAppoints[key] = appointment;
                    newAppointsKeys.push(key);
                }
            }

            if(Object.keys(templateVitals).length){
                for(let vital of Object.values(templateVitals)){
                    let key = uuid();
                    newVitals[key] = vital;
                    newVitalKeys.push(key);
                }
            }
        }
        this.setState({
            carePlanTemplateIds,
            carePlanTemplateId,
            medications: newMedics,
            appointments: newAppoints,
            vitals:newVitals,
            appointmentKeys: newAppointsKeys,
            medicationKeys: newMedicsKeys,
            vitalKeys:newVitalKeys,
            templateAppointmentIDs,
            templateMedicationIDs,
            templateVitalIDs,
        })
    }



    componentDidUpdate(prevProps, prevState) {
        const { carePlanTemplateId: prevcarePlanTemplateId = 0 } = prevState;

        const { carePlanTemplateId = 0 } = this.state;
        if (prevcarePlanTemplateId !== carePlanTemplateId) {
            const { care_plan_templates = {},
                template_medications = {}, template_appointments = {},
                template_vitals={}, medicines } = this.props;

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

            let { template_appointment_ids = [], template_medication_ids = [],template_vital_ids = [] } = care_plan_templates[carePlanTemplateId] || {};
            templateAppointmentIDs = template_appointment_ids;
            templateMedicationIDs = template_medication_ids;
            templateVitalIDs = template_vital_ids;

            for (let aId of template_appointment_ids) {
                let newAppointment = {};
                let { basic_info: { id = 0, care_plan_template_id = 0 } = {}, reason = '', time_gap = 0, details = {}, provider_id, provider_name = '' } = template_appointments[aId];
                newAppointment.id = id;
                newAppointment.schedule_data = details;
                newAppointment.reason = reason;
                newAppointment.time_gap = time_gap;
                newAppointment.provider_id = provider_id;
                newAppointment.provider_name = provider_name;
                newAppointment.care_plan_template_id = care_plan_template_id;
                templateAppointments[aId] = newAppointment;
            }

            for (let mId of template_medication_ids) {
                let newMedication = {};
                let { basic_info: { id = 0, care_plan_template_id = 0, medicine_id = 0 } = {}, schedule_data = {} } = template_medications[mId];
                newMedication.id = id;
                newMedication.schedule_data = schedule_data;
                newMedication.care_plan_template_id = care_plan_template_id;
                newMedication.medicine_id = medicine_id;
                const { basic_info: { name: medName = '', type: medType = '' } = {} } = medicines[medicine_id] || {};


                newMedication.medicine = medName;
                newMedication.medicineType = medType;
                templateMedications[mId] = newMedication;
            }

            for (let vId of template_vital_ids){
                let newVital = {};
                const {basic_info : {care_plan_template_id = 0,id = 0,vital_template_id = 0} = {},
                    details : {
                        description = '',duration = '',repeat_days=[],repeat_interval_id=''
                } = {} } = template_vitals[vId];

                const s_date=moment().toISOString();
                let e_date=moment().add(parseInt(duration), 'days').toISOString();

                if(duration === null){
                    e_date = null;
                }

                templateVitals[vId] = {
                    id,
                    vital_template_id,
                    repeat_days,
                    repeat_interval_id,
                    description,
                    start_date:s_date,
                    end_date:e_date
                };
            }

            if (Object.keys(templateMedications).length) {
                for (let medication of Object.values(templateMedications)) {
                    let key = uuid();
                    newMedics[key] = medication;
                    newMedicsKeys.push(key);
                }
            }
            if (Object.keys(templateAppointments).length) {
                for (let appointment of Object.values(templateAppointments)) {
                    let key = uuid();
                    newAppoints[key] = appointment;
                    newAppointsKeys.push(key);
                }
            }

            if(Object.keys(templateVitals).length){
                for(let vital of Object.values(templateVitals)){
                    let key = uuid();
                    newVitals[key] = vital;
                    newVitalKeys.push(key);
                }
            }

            this.setState({
                medications: newMedics,
                appointments: newAppoints,
                vitals:newVitals,
                appointmentKeys: newAppointsKeys,
                medicationKeys: newMedicsKeys,
                vitalKeys:newVitalKeys,
                templateAppointmentIDs,
                templateMedicationIDs,
                templateVitalIDs,
                templateEdited: false
            });
        }

    }

    getCarePlanTemplateOptions = () => {
        const { carePlanTemplateIds = [] } = this.state;
        const { care_plan_templates = {} } = this.props;
        const templates = Object.values(carePlanTemplateIds).map(templateId => {
            const { basic_info: { name = '' } = {} } = care_plan_templates[templateId];
            return (
                <Option id={templateId} value={parseInt(templateId)}>{name}</Option>
            );
        });
        return templates;
    }
    warnNote = () => {
        return (
            <div className="pt16">
                <p className="red">
                    <span className="fw600">{this.formatMessage(messages.note)}</span>
                    {this.formatMessage(messages.changesLost)}
                </p>
            </div>
        );
    };
    setTemplateId = (value) => {
        const { templateEdited = false } = this.state;
        if (templateEdited) {
            confirm({
                title: this.formatMessage(messages.changesMade),
                content: (
                    <div>
                        {this.warnNote()}
                    </div>
                ),
                onOk: async () => {
                    this.setState({ carePlanTemplateId: parseInt(value) });
                },
                onCancel() { }
            });
        } else {
            this.setState({ carePlanTemplateId: parseInt(value) });
        }
    }

    showInnerForm = (innerFormType, innerFormKey) => () => {
        this.setState({ innerFormType, innerFormKey, showInner: true });
    }


    renderEditMedicationForm = () => {
        let { innerFormKey, medications } = this.state;
        let { medicine = '', frequency = '' } = medications[innerFormKey];
        return (

            <div className='form-block-ap'>
                <div className='form-headings-ap flex align-center justify-start'>{this.formatMessage(messages.medicine)}</div>
                <Input
                    className={"form-inputs-ap"}
                    placeholder="Medicine"
                    value={medicine}
                // onChange={this.setTreatment}
                />

                <div className='form-headings-ap mt18 flex align-center justify-start'>{this.formatMessage(messages.frequency)}</div>
                <Input
                    placeholder="Frequency"
                    value={frequency}
                    className={"form-inputs-ap"}
                // onChange={this.setSeverity}
                />

            </div>
        );
    }


    renderEditAppointmentForm = () => {
        let { innerFormKey, appointments } = this.state;
        let { reason = '', notes = '' } = appointments[innerFormKey];
        return (

            <div className='form-block-ap'>
                <div className='form-headings-ap mt18 flex align-center justify-start'>{this.formatMessage(messages.reason)}</div>
                <Input
                    placeholder="Frequency"
                    value={reason}
                    className={"form-inputs-ap"}
                // onChange={this.setSeverity}
                />

                <div className='flex justify-space-between mb10'>
                    <div className='flex direction-column'>
                        <div className='form-headings'>{this.formatMessage(messages.startTime)}</div>
                        <TimePicker use12Hours minuteStep={15} format="h:mm A"
                        // onChange={this.setAppointmentStartTime(key)}
                        />
                    </div>
                    <div className='flex direction-column'>
                        <div className='form-headings'>{this.formatMessage(messages.endTime)}</div>
                        <TimePicker use12Hours minuteStep={15} format="h:mm A"
                        // disabled={!Object.keys(startTime).length}  onChange={this.setAppointmentEndTime(key)}
                        />
                    </div>
                </div>


                <div className='form-headings-ap mt18 flex align-center justify-start'>{this.formatMessage(messages.notes)}</div>

                <TextArea
                    autoFocus
                    value={notes}
                    // placeholder={formatMessage(message.description_text_placeholder)}
                    rows={4}
                />
            </div>
        );
    }


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
        this.setState({showAddVitalInner:true});
    }
    closeAddVital = () => {
        this.setState({showAddVitalInner:false});
    }

    deleteMedication = key => () => {
        let { medications = {}, medicationKeys = [] } = this.state;
        delete medications[key];
        medicationKeys.splice(medicationKeys.indexOf(key), 1);
        this.setState({ medications, medicationKeys });
    }
    
    deleteVital = key => {
        let {vitals = {},vitalKeys=[]} = this.state;
        delete vitals[key];
        vitalKeys.splice(vitalKeys.indexOf(key), 1);
        this.setState({vitals,vitalKeys});
    }

    deleteAppointment = key => () => {
        let { appointments = {}, appointmentKeys = [] } = this.state;
        delete appointments[key];
        appointmentKeys.splice(appointmentKeys.indexOf(key), 1);
        this.setState({ appointments, appointmentKeys });
    }

    deleteEntry = () => {
        let { appointments = {}, appointmentKeys = [],
         medications = {}, medicationKeys = [],
         vitals = {},vitalKeys=[],
         innerFormType = '', innerFormKey = '' } = this.state;

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

    renderTemplateDetails = () => {
        const { medications = {}, appointments = {},vitals = {},
         medicationKeys = [], appointmentKeys = [],vitalKeys=[],
         carePlanTemplateIds = [], carePlanTemplateId } = this.state;

        const { care_plan_templates = {}  , repeat_intervals = {} , vital_templates = {}} = this.props;

        let firstTemplateId = carePlanTemplateIds[0];
        let { basic_info: { name = '' } = {} } = care_plan_templates[firstTemplateId] || {};
        let showDropDown = name === BLANK_TEMPLATE ? false : true;
        return (
            <div className='template-block'>
                {Object.keys(carePlanTemplateIds).length && showDropDown ? (<Select value={carePlanTemplateId} className={'template-drawer-select wp100'} onChange={this.setTemplateId}>{this.getCarePlanTemplateOptions()}</Select>) : null}
                <div className='wp100 flex align-center justify-space-between'>
                    <div className='form-category-headings-ap '>{this.formatMessage(messages.medications)}</div>
                    <div className='add-more' onClick={this.showAddMedication}>{this.formatMessage(messages.addMore)}</div>

                </div>
                {medicationKeys.map(key => {
                    let { medicine, medicineType, schedule_data: { when_to_take = '', start_date = moment(), medicine_type = '1' ,repeat_days=[]} = {}, } = medications[key];
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
                    // else{
                    //     console.log("Today is ",DAYS_TEXT_NUM_SHORT[dow],"and is included in ",repeat_days);
                    // }

                    if (moment(start_date).isSame(moment(), 'D')) {
                        for (let wtt of when_to_take) {
                            let newMinDiff = moment().set({ hour: MEDICATION_TIMING_HOURS[wtt], minute: MEDICATION_TIMING_MINUTES[wtt] }).diff(moment());
                            minDiff = minDiff === 0 && newMinDiff > 0 ? newMinDiff : newMinDiff > 0 && newMinDiff < minDiff ? newMinDiff : minDiff;
                            closestWhenToTake = minDiff === newMinDiff ? wtt : closestWhenToTake;
                        }
                    }
                    let medTimingsToShow = '';
                    for (let wtt in when_to_take) {
                        medTimingsToShow += `${MEDICATION_TIMING[when_to_take[wtt]].text} `;
                        medTimingsToShow += `(${MEDICATION_TIMING[when_to_take[wtt]].time})${wtt < when_to_take.length - 1 ? ', ' : ''}`
                    }
                    nextDueTime = MEDICATION_TIMING[closestWhenToTake ? closestWhenToTake : '4'].time;
                    

                    let nextDue = moment(start_date).isSame(moment(), 'D') ? `Today at ${nextDueTime}` : `${moment(start_date).format('D MMM')} at ${MEDICATION_TIMING[when_to_take[0]].time}`;

                    return (
                        <div className='flex wp100 flex-grow-1 align-center' key={key}>
                            <div className='drawer-block' >
                                <div className='flex direction-row justify-space-between align-center'>
                                    <div className='flex align-center'>
                                        <div className='form-headings-ap'>{medicine ? medicine : "MEDICINE"}</div>
                                        {medicineType && (<img src={medicine_type === TABLET ? TabletIcon : medicine_type === SYRUP ? SyrupIcon : InjectionIcon} className={'medication-image-tablet'} />)}
                                    </div>

                                    <Icon type="edit" className='ml20' style={{ color: '#4a90e2' }} theme="filled" onClick={this.showInnerForm(EVENT_TYPE.MEDICATION_REMINDER, key)} />

                                </div>
                                {/* {when_to_take.map((timing, index) => {
                                    return ( */}

                                < div className='drawer-block-description'>{medTimingsToShow}</div>
                                {/* );
                                }) */}
                                {/* } */}
                                <div className='drawer-block-description'>{`Next due: ${nextDue}`}</div>
                            </div>
                            {/* <DeleteTwoTone
                                className={"mr8"}
                                onClick={this.deleteMedication(key)}
                                twoToneColor="#cc0000"
                            /> */}
                        </div>
                    );
                })
                }


                <div className='wp100 flex align-center justify-space-between'>
                    <div className='form-category-headings-ap align-self-start'>{this.formatMessage(messages.appointments)}</div>
                    <div className='add-more' onClick={this.showAddAppointment}>{this.formatMessage(messages.addMore)}</div>
                </div>
                {
                    appointmentKeys.map(key => {

                        const { reason = '', schedule_data: { description = '', date = '', start_time = '' } = {}, time_gap = '' } = appointments[key];
                        // let timeToShow = date && start_time ? `${moment(date).format('ll')} ${moment(date).format('hh:mm')}` : date ? moment(date).format('ll') : '';
                        return (

                            <div className='flex wp100 flex-grow-1 align-center' key={key}>
                                <div className='drawer-block' >

                                    <div className='flex direction-row justify-space-between align-center'>
                                        <div className='form-headings-ap'>{reason}</div>
                                        <Icon type="edit" className='ml20' style={{ color: '#4a90e2' }} theme="filled" onClick={this.showInnerForm(EVENT_TYPE.APPOINTMENT, key)} />
                                    </div>
                                    <div className='drawer-block-description'>{date ? `After ${moment(date).diff(moment(), 'days')} days` : time_gap ? `After ${time_gap - 1} days` : ''}</div>
                                    <div className='drawer-block-description'>{`Notes:${description}`}</div>
                                </div>
                            </div>
                        );
                    })
                }

                <div className='wp100 flex align-center justify-space-between'>
                    <div className='form-category-headings-ap align-self-start'>{this.formatMessage(messages.actions)}</div>
                    <div className='add-more' onClick={this.showAddVital}>{this.formatMessage(messages.addMore)}</div>
                </div>
                {

                    vitalKeys.map(key => {
                        const {
                            description= "",
                            end_date= "",
                            id= '',
                            repeat_days= [],
                            repeat_interval_id= "",
                            start_date= "",
                            vital_template_id= '',
                            vital = ""
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

    validateData = (medicationsData, appointmentsData, vitalData) => {

        for (let medication of medicationsData) {
            const { medicine = "", medicineType = "", medicine_id = "",
                schedule_data: { quantity = 0, repeat = "", repeat_days = [], start_date = moment(),
                    start_time = moment(), strength = 0, unit = "", when_to_take = [] } = {} } = medication;

            if (!medicine || !medicineType || !medicine_id || (unit !== 'ml' && !quantity) || !repeat || !repeat_days.length || !start_date
                || !start_time || !strength || !unit || !when_to_take.length) {
                message.error(this.formatMessage(messages.medicationError));
                return false;
            }
        }

        for (let appointment of appointmentsData) {
            let { reason = '', schedule_data: { date = '',
                end_time = '', start_time = '', treatment_id = '' } = {} } = appointment;

            if (!reason || !date || !end_time || !start_time || !treatment_id) {

                message.error(this.formatMessage(messages.appointmentError));

                return false;
            }
        }

        for (let vital of vitalData) {
    
                const {
                    description= "",
                    vital_template_id= '',
                    end_date='', start_date='',
                    repeat_interval_id='',repeat_days=[]
                } = vital;

            if (!start_date || !repeat_interval_id || !vital_template_id || !repeat_days || !vital_template_id ) {

                message.error(this.formatMessage(messages.vitalError));

                return false;
            }
            
        }


        return true;
    }


    onPreSubmit = () => {
        let { medications = {}, appointments = {},vitals={}, templateMedicationIDs, templateAppointmentIDs,templateVitalIDs, templateEdited } = this.state;
        let templateDataExists = (Object.values(medications).length || Object.values(appointments).length) || Object.value(vitals).length ? true : false;

        if (templateDataExists) {
            if (Object.values(medications).length === templateMedicationIDs.length ||
            Object.values(appointments).length === templateAppointmentIDs.length || 
            Object.values(vitals).length === templateVitalIDs.length
            ) {

                if (templateEdited) {
                    this.setState({ showTemplateNameModal: true });
                } else {
                    this.onSubmit()
                }
            } else {
                this.setState({ showTemplateNameModal: true });
            }
        } else {
            message.error(this.formatMessage(messages.emptyTemplate))
        }
    }

    hideNameModal = () => {
        this.setState({ showTemplateNameModal: false });
    }

    setTemplateName = (event) => {
        this.setState({ name: event.target.value });
    }


    submitWithName = () => {
        const { name } = this.state;
        if (!name || !name.trim()) {
            message.error(this.formatMessage(messages.validNameError))
        } else {
            this.setState({ createTemplate: true }, () => { this.onSubmit() });
        }
    }


    submitWithOutName = () => {
        this.setState({ name: '', createTemplate: false }, () => { this.onSubmit() });
    }


    onSubmit = () => {
    
        const { submit, patientId, carePlan: { basic_info: {id: carePlanId} = {}, treatment_id = 1, severity_id = 1, condition_id = 1 } = {} } = this.props;
        let { medications = {}, appointments = {},vitals={}, name = '', createTemplate = false } = this.state;
        let medicationsData = Object.values(medications);
        let appointmentsData = Object.values(appointments);
        let vitalData = Object.values(vitals);
        
        for (let medication in medicationsData) {
            let newMed = medicationsData[medication];
            let {
                schedule_data: { end_date = '', start_date = '',
                    start_time = '', duration } = {} } = newMed;
            if (!start_time && !start_date && !end_date) {
                medicationsData[medication].schedule_data.start_time = moment();
                medicationsData[medication].schedule_data.start_date = moment();
                medicationsData[medication].schedule_data.end_date = moment().add('days', duration);
            }
            if (!start_time) {
                medicationsData[medication].schedule_data.start_time = moment();
            }
            if (!start_date) {
                medicationsData[medication].schedule_data.start_date = moment();
            }
            if (!end_date) {
                medicationsData[medication].schedule_data.end_date = moment(medicationsData[medication].schedule_data.start_date).add('days', duration);
            }
        }

        for (let appointment in appointmentsData) {

            let newAppointment = appointmentsData[appointment];
            let { reason = '', schedule_data: { date = '',
                end_time = '', start_time = '', treatment_id = '', type = '', appointment_type = '' } = {}, time_gap = '' } = newAppointment;
            appointmentsData[appointment].schedule_data.type = appointment_type ? appointment_type : type;
            appointmentsData[appointment].schedule_data.participant_two = {
                id: patientId,
                category: "patient",
            }

            let updatedDate = null;
            let minutesToAdd = 30 - (moment().minutes()) % 30;

            if(!date) {
                updatedDate = moment().add('days', time_gap);
                appointmentsData[appointment].schedule_data.date = updatedDate;
            }

            if(!start_time) {
                if(!date) {
                    appointmentsData[appointment].schedule_data.start_time = moment(updatedDate).add("minutes", minutesToAdd);
                } else {
                    appointmentsData[appointment].schedule_data.start_time = moment(date).add("minutes", minutesToAdd);
                }
            }

            if(!end_time) {
                if(!date) {
                    appointmentsData[appointment].schedule_data.end_time = moment(updatedDate).add("minutes", minutesToAdd + 30);
                } else {
                    appointmentsData[appointment].schedule_data.end_time = moment(date).add("minutes", minutesToAdd + 30);
                }
            }

         
            if (!treatment_id) {
                const { carePlan: { treatment_id: cPtreat = 0 } = {} } = this.props;
                appointmentsData[appointment].schedule_data.treatment_id = cPtreat;
            }
        }

        /////

        let validate = this.validateData(medicationsData, appointmentsData,vitalData);
        if (validate) {
            submit({ carePlanId, medicationsData, appointmentsData,vitalData, name, createTemplate, treatment_id, severity_id, condition_id });
        }
    }

    editMedication = (data) => {
        let { medications = {}, innerFormKey = '' } = this.state;
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

        newMedication.medicine_id = medicine_id;
        newMedication.medicine = name;
        newMedication.medicineType = type;
        newMedication.schedule_data = {
            end_date: moment(end_date), start_date: moment(start_date),
            unit, when_to_take, repeat, quantity, repeat_days, strength, start_time: moment(start_time),
            medicine_type, description
        };
        medications[innerFormKey] = newMedication;
        this.setState({ medications, templateEdited: true }, () => {
            this.onCloseInner();
            this.props.dispatchClose();
        });
    }

    editVital = (data) => {
        let { vitals = {}, innerFormKey = '' } = this.state;
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

            vitals[innerFormKey] = {
                vital_template_id,
                repeat_days,
                vital:name,
                repeat_interval_id,
                description,
                start_date:s_date,
                end_date:e_date
            };

            this.setState({ vitals, templateEdited: true }, () => {
                this.onCloseInner();
                this.props.dispatchClose();
            });   
        }   

    }


 

    addMedication = (data) => {
        const { end_date = "",
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
            when_to_take = ["3"] } = data;
        let { medications = {}, medicationKeys = [] } = this.state;
        let { medicines } = this.props;
        let newMedication = {};
        const { basic_info: { name = '', type = '' } = {} } = medicines[medicine_id];
        newMedication.medicine_id = medicine_id;
        newMedication.medicine = name;
        newMedication.medicineType = type;
        newMedication.schedule_data = {
            end_date: moment(end_date), start_date: moment(start_date),
            unit, when_to_take, repeat, quantity, repeat_days, strength, start_time: moment(start_time),
            medicine_type, description
        };
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
                repeat_days,
                vital:name,
                repeat_interval_id,
                description,
                start_date:moment(start_date),
                end_date:moment(end_date)

            };
            this.setState({ vitals, vitalKeys, templateEdited: true }, () => {
                this.closeAddVital();
            });
        }
    }


    editAppointment = (data) => {
        const { appointments = {}, innerFormKey = '' } = this.state;

        let { date = {},
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
        newAppointment.reason = reason;
        if (provider_id) {
            newAppointment.provider_id = provider_id;
        }
        newAppointment.provider_name = provider_name;
        newAppointment.schedule_data = { description, end_time, participant_two, start_time, date, treatment_id, critical, appointment_type: type, type_description };
        appointments[innerFormKey] = newAppointment;
        this.setState({ appointments, templateEdited: true }, () => {
            this.onCloseInner();
            // this.props.dispatchClose();
        });
    }

    addAppointment = (data) => {
        let { appointments = {}, appointmentKeys = [] } = this.state;
        let key = uuid();
        let { date = {},
            description = "",
            end_time = {},
            critical,
            type = '',
            type_description = '',
            provider_id = 0,
            provider_name = '',
            participant_two = {},
            start_time = {},
            treatment_id = "",
            reason = '' } = data;
        let newAppointment = {};


        if (!date || !start_time || !end_time || !treatment_id) {
            message.error(this.formatMessage(messages.appointmentError));
            return;
        }

        newAppointment.reason = reason;
        if (provider_id) {
            newAppointment.provider_id = provider_id;
        }
        newAppointment.provider_name = provider_name;
        newAppointment.schedule_data = { description, end_time, participant_two, start_time, date, treatment_id, critical, type, type_description };
        appointments[key] = newAppointment;
        appointmentKeys.push(key);
        this.setState({ appointments, appointmentKeys, templateEdited: true }, () => {
            this.closeAddAppointment();
        });
    }


    formatMessage = data => this.props.intl.formatMessage(data);

    onClose = () => {
        const { closeTemplateDrawer } = this.props;
        closeTemplateDrawer();
    };

    onCloseInner = () => {
        this.setState({ showInner: false })
    };

    render() {
        const { visible, patientId, patients, carePlan, submit, care_plan_templates } = this.props;
        let { showInner, innerFormType, innerFormKey, medications, appointments, vitals={},showAddAppointmentInner, showAddMedicationInner,showAddVitalInner, carePlanTemplateId } = this.state;
        let { basic_info: { name: carePlanName = '' } = {} } = care_plan_templates[carePlanTemplateId] || {};
        const { onClose, renderTemplateDetails } = this;
        let medicationData = innerFormKey && innerFormType == EVENT_TYPE.MEDICATION_REMINDER ? medications[innerFormKey] : {};

        let appointmentData = innerFormKey && innerFormType == EVENT_TYPE.APPOINTMENT ? appointments[innerFormKey] : {};

        let vitalData = innerFormKey && innerFormType == EVENT_TYPE.VITALS ? vitals[innerFormKey] : {} ; 

        if (visible !== true) {
            return null;
        }

       
        return (
            <Fragment>
                <Drawer
                    title={this.formatMessage(messages.template)}
                    placement="right"
                    // closable={false}
                    maskClosable={false}
                    headerStyle={{
                        position: "sticky",
                        zIndex: "9999",
                        top: "0px"
                    }}
                    onClose={onClose}
                    width={'35%'}
                    visible={visible}

                >
                    {renderTemplateDetails()}

                    {innerFormKey && innerFormType == EVENT_TYPE.MEDICATION_REMINDER && <EditMedicationReminder medicationData={medicationData} medicationVisible={showInner} editMedication={this.editMedication} hideMedication={this.onCloseInner} deleteMedicationOfTemplate={this.deleteEntry} />}
                    {innerFormKey && innerFormType == EVENT_TYPE.APPOINTMENT && <EditAppointmentDrawer appointmentData={appointmentData} appointmentVisible={showInner} editAppointment={this.editAppointment}
                    
                        hideAppointment={this.onCloseInner} patientId={patientId} patients={patients} deleteAppointmentOfTemplate={this.deleteEntry}
                        carePlan={carePlan} />}
                   
                    {innerFormKey && innerFormType == EVENT_TYPE.VITALS && <EditVitalDrawer vitalData={vitalData} vitalVisible={showInner} editVital={this.editVital} hideVital={this.onCloseInner} deleteVitalOfTemplate={this.deleteEntry} />}

                    {showAddMedicationInner && <EditMedicationReminder medicationVisible={showAddMedicationInner} addMedication={this.addMedication} hideMedication={this.closeAddMedication} />}
                    {showAddAppointmentInner && <EditAppointmentDrawer appointmentVisible={showAddAppointmentInner} addAppointment={this.addAppointment} hideAppointment={this.closeAddAppointment} patientId={patientId} patients={patients} carePlan={carePlan} />}
                  
                    {showAddVitalInner && <EditVitalDrawer vitalVisible={showAddVitalInner} addVital={this.addVital} hideVital={this.closeAddVital} />} 

                    <div className='add-patient-footer'>
                        <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                            {this.formatMessage(messages.cancel)}
                        </Button>
                        <Button onClick={this.onPreSubmit} type="primary">
                            {this.formatMessage(messages.submit)}
                        </Button>
                    </div>
                </Drawer>
                <TemplateNameModal visible={this.state.showTemplateNameModal} hideModal={this.hideNameModal} carePlanTemplateId={carePlanTemplateId} carePlanName={carePlanName}
                    changeTemplateName={this.setTemplateName} saveTemplate={this.submitWithName} skip={this.submitWithOutName} formatMessage={this.formatMessage} />
            </Fragment>
        );
    }
}

export default injectIntl(TemplateDrawer);
