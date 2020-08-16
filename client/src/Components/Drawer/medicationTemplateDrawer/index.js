import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, Icon, DatePicker, Select, Input, message, Button, TimePicker, Modal } from "antd";

import { MEDICATION_TIMING, EVENT_TYPE, MEDICINE_TYPE, MEDICATION_TIMING_HOURS, MEDICATION_TIMING_MINUTES } from "../../../constant";
import moment from "moment";
import EditMedicationReminder from "../../../Containers/Drawer/editMedicationReminder";
import EditAppointmentDrawer from "../../../Containers/Drawer/editAppointment";

import confirm from "antd/es/modal/confirm";
import TabletIcon from "../../../Assets/images/tabletIcon3x.png";
import InjectionIcon from "../../../Assets/images/injectionIcon3x.png";
import uuid from 'react-uuid';
import messages from "./message";
const { Option } = Select;

const { TextArea } = Input;

const TemplateNameModal = ({ visible, hideModal, carePlanTemplateId, changeTemplateName, saveTemplate, skip, formatMessage }) => {
    return (
        <Modal
            title={formatMessage(messages.saveTempQues)}
            visible={visible}
            onCancel={hideModal}
            cancelButtonProps={{ style: { display: 'none' } }}

            okButtonProps={{ style: { display: 'none' } }}
        >
            <div className='template-name-modal-container'>
                <div className='template-name-modal-text'>{carePlanTemplateId ? formatMessage(messages.youModified) : formatMessage(messages.youCreated)}</div>
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
            medicationKeys: [],
            appointmentKeys: [],
            innerFormKey: '',
            innerFormType: '',
            name: '',
            createTemplate: '',
            carePlanTemplateId: 0,
            showAddMedicationInner: false,
            showAddAppointmentInner: false,
            showTemplateNameModal: false,
            showAreYouSureModal: false,
            templateEdited: false
        };
    }



    componentDidMount() {
        const { care_plan_template_ids: carePlanTemplateIds = [], care_plan_templates = {},
            template_medications = {}, template_appointments = {}, medicines } = this.props;
        let newMedicsKeys = [];
        let newAppointsKeys = [];
        let newMedics = {};
        let newAppoints = {};

        console.log('5987236487236487234 did Mount', carePlanTemplateIds, care_plan_templates);
        let carePlanTemplateId = Object.keys(carePlanTemplateIds).length ? parseInt(carePlanTemplateIds[0]) : 0;


        let templateAppointments = {};
        let templateMedications = {};
        let templateAppointmentIDs = [];
        let templateMedicationIDs = [];

        if (carePlanTemplateId) {

            let { template_appointment_ids = [], template_medication_ids = [] } = care_plan_templates[carePlanTemplateId] || {};
            templateAppointmentIDs = template_appointment_ids;
            templateMedicationIDs = template_medication_ids;
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
        }
        this.setState({
            carePlanTemplateIds,
            carePlanTemplateId,
            medications: newMedics,
            appointments: newAppoints,
            appointmentKeys: newAppointsKeys,
            medicationKeys: newMedicsKeys,
            templateAppointmentIDs,
            templateMedicationIDs

        })
    }


    componentDidUpdate(prevProps, prevState) {
        const { carePlanTemplateId: prevcarePlanTemplateId = 0 } = prevState;

        const { carePlanTemplateId = 0 } = this.state;
        if (prevcarePlanTemplateId !== carePlanTemplateId) {
            const { care_plan_templates = {},
                template_medications = {}, template_appointments = {}, medicines } = this.props;

            let templateAppointments = {};
            let templateMedications = {};
            let templateAppointmentIDs = [];
            let templateMedicationIDs = [];
            let newMedicsKeys = [];
            let newAppointsKeys = [];
            let newMedics = {};
            let newAppoints = {};

            let { template_appointment_ids = [], template_medication_ids = [] } = care_plan_templates[carePlanTemplateId] || {};
            templateAppointmentIDs = template_appointment_ids;
            templateMedicationIDs = template_medication_ids;
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

            this.setState({
                medications: newMedics,
                appointments: newAppoints,
                appointmentKeys: newAppointsKeys,
                medicationKeys: newMedicsKeys,
                templateAppointmentIDs,
                templateMedicationIDs,
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

    deleteMedication = key => () => {
        let { medications = {}, medicationKeys = [] } = this.state;
        delete medications[key];
        medicationKeys.splice(medicationKeys.indexOf(key), 1);
        this.setState({ medications, medicationKeys });
    }




    deleteAppointment = key => () => {
        let { appointments = {}, appointmentKeys = [] } = this.state;
        delete appointments[key];
        appointmentKeys.splice(appointmentKeys.indexOf(key), 1);
        this.setState({ appointments, appointmentKeys });
    }

    deleteEntry = () => {
        let { appointments = {}, appointmentKeys = [], medications = {}, medicationKeys = [], innerFormType = '', innerFormKey = '' } = this.state;

        if (innerFormType == EVENT_TYPE.MEDICATION_REMINDER) {
            delete medications[innerFormKey];
            medicationKeys.splice(medicationKeys.indexOf(innerFormKey), 1);
        } else if (innerFormType == EVENT_TYPE.APPOINTMENT) {
            delete appointments[innerFormKey];
            appointmentKeys.splice(appointmentKeys.indexOf(innerFormKey), 1);
        }

        this.setState({ appointments, appointmentKeys, medications, medicationKeys, templateEdited: true });
        this.onCloseInner();
    }

    renderTemplateDetails = () => {
        const { medications = {}, appointments = {}, medicationKeys = [], appointmentKeys = [], carePlanTemplateIds = [], carePlanTemplateId } = this.state;
        console.log('5987236487236487234', typeof (carePlanTemplateIds), carePlanTemplateIds, Object.keys(carePlanTemplateIds).length);
        return (
            <div className='template-block'>
                {Object.keys(carePlanTemplateIds).length ? (<Select value={carePlanTemplateId} className={'template-drawer-select wp100'} onChange={this.setTemplateId}>{this.getCarePlanTemplateOptions()}</Select>) : null}
                <div className='wp100 flex align-center justify-space-between'>
                    <div className='form-category-headings-ap '>{this.formatMessage(messages.medications)}</div>
                    <div className='add-more' onClick={this.showAddMedication}>{this.formatMessage(messages.addMore)}</div>

                </div>
                {medicationKeys.map(key => {
                    let { medicine, medicineType, schedule_data: { when_to_take = '', start_date = moment() } = {} } = medications[key];
                    when_to_take.sort();
                    let nextDueTime = moment().format('HH:MM A');
                    let closestWhenToTake = 0;
                    let minDiff = 0;
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
                                        {medicineType && (<img src={medicineType == MEDICINE_TYPE.TABLET ? TabletIcon : InjectionIcon} className={'medication-image-tablet'} />)}
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
                                {/* <DeleteTwoTone
                                className={"mr8"}
                                onClick={this.deleteAppointment(key)}
                                twoToneColor="#cc0000"
                            /> */}
                            </div>
                        );
                    })
                }
            </div >
        );

    }

    validateData = (medicationsData, appointmentsData) => {

        for (let medication of medicationsData) {
            const { medicine = "", medicineType = "", medicine_id = "",
                schedule_data: { quantity = 0, repeat = "", repeat_days = [], start_date = moment(),
                    start_time = moment(), strength = 0, unit = "", when_to_take = [] } = {} } = medication;

            // console.log('623627531273823', "medicine==>", medicine, "medicineType==>", medicineType,
            //     "medicine_id==>", medicine_id, "quantity==>", quantity, "repeat==>", repeat, "repeat_days==>", repeat_days.length,
            //     "start_date==>", start_date, "start_time==>", start_time, "strength==>", strength,
            //     "unit==>", unit, "when_to_take==>", when_to_take.length);

            // console.log('623627531273823 1111111=====>', "medicine==>", !medicine, "medicineType==>", !medicineType,
            //     "medicine_id==>", !medicine_id, "quantity==>", !quantity, "repeat==>", !repeat, "repeat_days==>", !repeat_days.length,
            //     "start_date==>", !start_date, "start_time==>", !start_time, "strength==>", !strength,
            //     "unit==>", !unit, "when_to_take==>", !when_to_take.length);
            if (!medicine, !medicineType || !medicine_id || (unit !== 'ml' && !quantity) || !repeat || !repeat_days.length || !start_date
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
        return true;
    }


    onPreSubmit = () => {
        let { medications = {}, appointments = {}, templateMedicationIDs, templateAppointmentIDs, templateEdited } = this.state;
        let templateDataExists = (Object.values(medications).length && Object.values(appointments).length) ? true : false;

        console.log('67812365124637128', templateDataExists, templateEdited,
            Object.values(medications).length, templateMedicationIDs, Object.values(appointments).length, templateAppointmentIDs);

        if (templateDataExists) {
            if (Object.values(medications).length === templateMedicationIDs.length && Object.values(appointments).length === templateAppointmentIDs.length) {

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
        if (!name) {
            message.error(this.formatMessage(messages.validNameError))
        } else {
            this.setState({ createTemplate: true }, () => { this.onSubmit() });
        }
    }


    submitWithOutName = () => {
        this.setState({ name: '', createTemplate: false }, () => { this.onSubmit() });
    }


    onSubmit = () => {
        const { submit, patientId, carePlan: { treatment_id = 1, severity_id = 1, condition_id = 1 } = {} } = this.props;
        console.log('86875768685767686', treatment_id, severity_id, condition_id);
        let { medications = {}, appointments = {}, name = '', createTemplate = false } = this.state;
        let medicationsData = Object.values(medications);
        let appointmentsData = Object.values(appointments);
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
            if (!date && !start_time && !end_time) {
                // let currMinutes=moment().minutes();
                let minutesToAdd = 30 - (moment().minutes()) % 30;
                appointmentsData[appointment].schedule_data.start_time = moment().add('days', parseInt(time_gap)).add('minutes', minutesToAdd);
                appointmentsData[appointment].schedule_data.end_time = moment(appointmentsData[appointment].schedule_data.start_time).add('days', parseInt(time_gap)).add('minutes', 30);
                appointmentsData[appointment].schedule_data.date = moment().add('days', 18);
                // appointmentsData[appointment].schedule_data.type = type;
                // appointmentsData[appointment].schedule_data.type_description =type_description ;
                // appointmentsData[appointment].schedule_data.critical = critical;

            }
            if (!date) {
                appointmentsData[appointment].schedule_data.date = reason == 'Checking of Vitals' ? moment().add('days', 14) : moment().add('days', 18);
            }
            if (!start_time) {
                let minutesToAdd = 30 - (moment().minutes()) % 30;
                appointmentsData[appointment].schedule_data.start_time = moment().add('days', parseInt(time_gap)).add('minutes', minutesToAdd);
            }
            if (!end_time) {
                appointmentsData[appointment].schedule_data.end_time = moment(appointmentsData[appointment].schedule_data.start_time).add('days', parseInt(time_gap)).add('minutes', 30);
            }
            if (!treatment_id) {
                const { carePlan: { treatment_id: cPtreat = 0 } = {} } = this.props;
                appointmentsData[appointment].schedule_data.treatment_id = cPtreat;
            }
        }
        let validate = this.validateData(medicationsData, appointmentsData);
        if (validate) {
            submit({ medicationsData, appointmentsData, name, createTemplate, treatment_id, severity_id, condition_id });
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
            when_to_take = ["3"] } = data;
        const { basic_info: { name = '', type = '' } = {} } = medicines[medicine_id];
        newMedication.medicine_id = medicine_id;
        newMedication.medicine = name;
        newMedication.medicineType = type;
        newMedication.schedule_data = {
            end_date: moment(end_date), start_date: moment(start_date),
            unit, when_to_take, repeat, quantity, repeat_days, strength, start_time: moment(start_time)
        };
        medications[innerFormKey] = newMedication;
        this.setState({ medications, templateEdited: true }, () => {
            this.onCloseInner();
            this.props.dispatchClose();
        });
    }

    addMedication = (data) => {
        const { end_date = "",
            medicine_id = "",
            quantity = 0,
            repeat = "",
            repeat_days = [],
            start_date = "",
            start_time = '',
            strength = '',
            unit = "",
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
            unit, when_to_take, repeat, quantity, repeat_days, strength, start_time: moment(start_time)
        };
        let key = uuid();
        medicationKeys.push(key);
        // let templateId = medications[medicationKeys[0]].care_plan_template_id;
        medications[key] = newMedication;
        this.setState({ medications, medicationKeys, templateEdited: true }, () => {
            this.closeAddMedication();
        });
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
        newAppointment.schedule_data = { description, end_time, participant_two, start_time, date, treatment_id, critical, type, type_description };
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
        const { visible, patientId, patients, carePlan, submit } = this.props;
        let { showInner, innerFormType, innerFormKey, medications, appointments, showAddAppointmentInner, showAddMedicationInner, carePlanTemplateId } = this.state;
        const { onClose, renderTemplateDetails } = this;
        let medicationData = innerFormKey && innerFormType == EVENT_TYPE.MEDICATION_REMINDER ? medications[innerFormKey] : {};

        console.log('5987236487236487234 render', this.props.carePlanTemplateIds, this.props.care_plan_templates);
        let appointmentData = innerFormKey && innerFormType == EVENT_TYPE.APPOINTMENT ? appointments[innerFormKey] : {};

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

                    {showAddMedicationInner && <EditMedicationReminder medicationVisible={showAddMedicationInner} addMedication={this.addMedication} hideMedication={this.closeAddMedication} />}
                    {showAddAppointmentInner && <EditAppointmentDrawer appointmentVisible={showAddAppointmentInner} addAppointment={this.addAppointment} hideAppointment={this.closeAddAppointment} patientId={patientId} patients={patients} carePlan={carePlan} />}
                    <div className='add-patient-footer'>
                        <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                            {this.formatMessage(messages.cancel)}
                        </Button>
                        <Button onClick={this.onPreSubmit} type="primary">
                            {this.formatMessage(messages.submit)}
                        </Button>
                    </div>
                </Drawer>
                <TemplateNameModal visible={this.state.showTemplateNameModal} hideModal={this.hideNameModal} carePlanTemplateId={carePlanTemplateId}
                    changeTemplateName={this.setTemplateName} saveTemplate={this.submitWithName} skip={this.submitWithOutName} formatMessage={this.formatMessage} />
            </Fragment>
        );
    }
}

export default injectIntl(TemplateDrawer);
