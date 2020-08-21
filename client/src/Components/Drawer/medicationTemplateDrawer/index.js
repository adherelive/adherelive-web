import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, Icon, DatePicker, Select, Input, message, Button, TimePicker } from "antd";

import { MEDICATION_TIMING, EVENT_TYPE, MEDICINE_TYPE, MEDICATION_TIMING_HOURS, MEDICATION_TIMING_MINUTES, TABLET, SYRINGE, SYRUP } from "../../../constant";
import moment from "moment";
import EditMedicationReminder from "../../../Containers/Drawer/editMedicationReminder";
import EditAppointmentDrawer from "../../../Containers/Drawer/editAppointment";

import TabletIcon from "../../../Assets/images/tabletIcon3x.png";
import InjectionIcon from "../../../Assets/images/injectionIcon3x.png";
import SyrupIcon from "../../../Assets/images/pharmacy.png";
import uuid from 'react-uuid';
import messages from "./message";
const { Option } = Select;

const { TextArea } = Input;

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
            showAddMedicationInner: false,
            showAddAppointmentInner: false,
        };
    }



    componentDidMount() {
        const { medications: newMedications = {}, appointments: newAppointments = {} } = this.props;
        let newMedicsKeys = [];
        let newAppointsKeys = [];
        let newMedics = {};
        let newAppoints = {};

        if (Object.keys(newMedications).length) {
            for (let medication of Object.values(newMedications)) {
                let key = uuid();
                newMedics[key] = medication;
                newMedicsKeys.push(key);
            }
        }
        if (Object.keys(newAppointments).length) {
            for (let appointment of Object.values(newAppointments)) {
                let key = uuid();
                newAppoints[key] = appointment;
                newAppointsKeys.push(key);
            }
        }
        this.setState({ medications: newMedics, appointments: newAppoints, appointmentKeys: newAppointsKeys, medicationKeys: newMedicsKeys })
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

        this.setState({ appointments, appointmentKeys, medications, medicationKeys });
        this.onCloseInner();
    }

    renderTemplateDetails = () => {
        const { medications = {}, appointments = {}, medicationKeys = [], appointmentKeys = [] } = this.state;
        return (
            <div className='template-block'>
                <div className='wp100 flex align-center justify-space-between'>
                    <div className='form-category-headings-ap '>{this.formatMessage(messages.medications)}</div>
                    <div className='add-more' onClick={this.showAddMedication}>{this.formatMessage(messages.addMore)}</div>

                </div>
                {medicationKeys.map(key => {
                    let { medicine, medicineType, schedule_data: { when_to_take = '', start_date = moment(), medicine_type = '1' } = {}, } = medications[key];
                    console.log('64576574765758758', medicine_type, medications[key]);
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
                        <div className='flex wp100 flex-grow-1 align-center'>
                            <div className='drawer-block' key={key}>
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

                            <div className='flex wp100 flex-grow-1 align-center'>
                                <div className='drawer-block' key={key}>

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
        return true;
    }



    onSubmit = () => {
        const { submit, patientId } = this.props;
        let { medications = {}, appointments = {} } = this.state;
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
            submit({ medicationsData, appointmentsData });
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
        this.setState({ medications }, () => {
            this.onCloseInner();
            this.props.dispatchClose();
        });
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
        medicationKeys.push(key);
        // let templateId = medications[medicationKeys[0]].care_plan_template_id;
        medications[key] = newMedication;
        this.setState({ medications, medicationKeys }, () => {
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
        this.setState({ appointments }, () => {
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
        this.setState({ appointments, appointmentKeys }, () => {
            this.closeAddAppointment();
        });
    }


    formatMessage = data => this.props.intl.formatMessage(data);

    onClose = () => {
        const { close } = this.props;
        close();
    };

    onCloseInner = () => {
        this.setState({ showInner: false })
    };

    render() {
        const { visible, patientId, patients, carePlan, submit } = this.props;
        let { showInner, innerFormType, innerFormKey, medications, appointments, showAddAppointmentInner, showAddMedicationInner } = this.state;
        const { onClose, renderTemplateDetails } = this;
        let medicationData = innerFormKey && innerFormType == EVENT_TYPE.MEDICATION_REMINDER ? medications[innerFormKey] : {};

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
                        <Button onClick={this.onSubmit} type="primary">
                            {this.formatMessage(messages.submit)}
                        </Button>
                    </div>
                </Drawer>

            </Fragment>
        );
    }
}

export default injectIntl(TemplateDrawer);
