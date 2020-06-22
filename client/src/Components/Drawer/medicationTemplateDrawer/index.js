import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, Icon, DatePicker, Select, Input, message, Button, TimePicker } from "antd";
import ChatComponent from "../../../Containers/Chat";
import { GENDER, PATIENT_BOX_CONTENT, MISSED_MEDICATION, MISSED_ACTIONS,MEDICATION_TIMING, EVENT_TYPE, MEDICINE_TYPE } from "../../../constant";
import messages from "./message";
import moment from "moment";
import AddMedicationReminder from "../../../Containers/Drawer/addMedicationReminder";
import AddAppointmentDrawer from "../../../Containers/Drawer/addAppointment";
import CloseIcon from "../../../Assets/images/close.svg";
import ChatIcon from "../../../Assets/images/chat.svg";
import ShareIcon from "../../../Assets/images/redirect3x.png";
import TabletIcon from "../../../Assets/images/tabletIcon3x.png";
import InjectionIcon from "../../../Assets/images/injectionIcon3x.png";
import uuid from 'react-uuid';
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
            innerFormType: ''
        };
    }



    componentDidMount() {
        const { medications: newMedications = {}, appointments: newAppointments = {} } = this.props;
        let newMedicsKeys = [];
        let newAppointsKeys = [];
        let newMedics = {};
        let newAppoints = {};

        if (Object.keys(newMedications).length) {
            for (let medication of newMedications) {
                let key = uuid();
                newMedics[key] = medication;
                newMedicsKeys.push(key);
            }
        }
        if (Object.keys(newAppointments).length) {
            for (let appointment of newAppointments) {
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
                <div className='form-headings-ap flex align-center justify-start'>Medicine</div>
                <Input
                    className={"form-inputs-ap"}
                    placeholder="Medicine"
                    value={medicine}
                // onChange={this.setTreatment}
                />

                <div className='form-headings-ap mt18 flex align-center justify-start'>Frequency</div>
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
                <div className='form-headings-ap mt18 flex align-center justify-start'>Reason</div>
                <Input
                    placeholder="Frequency"
                    value={reason}
                    className={"form-inputs-ap"}
                // onChange={this.setSeverity}
                />

                <div className='flex justify-space-between mb10'>
                    <div className='flex direction-column'>
                        <div className='form-headings'>Start Time</div>
                        <TimePicker use12Hours minuteStep={15} format="h:mm A"
                        // onChange={this.setAppointmentStartTime(key)}
                        />
                    </div>
                    <div className='flex direction-column'>
                        <div className='form-headings'>End Time</div>
                        <TimePicker use12Hours minuteStep={15} format="h:mm A"
                        // disabled={!Object.keys(startTime).length}  onChange={this.setAppointmentEndTime(key)}
                        />
                    </div>
                </div>


                <div className='form-headings-ap mt18 flex align-center justify-start'>Notes</div>

                <TextArea
                    autoFocus
                    value={notes}
                    // placeholder={formatMessage(message.description_text_placeholder)}
                    rows={4}
                />
            </div>
        );
    }


    renderTemplateDetails = () => {

        const { medications = {}, appointments = {}, medicationKeys = [], appointmentKeys = [] } = this.state;
        console.log('DATAAAA IN STATE OF DRAWER', medications, appointments, medicationKeys, appointmentKeys);
        return (
            <div className='template-block'>


                <div className=' wp100 form-category-headings-ap align-self-start'>Medications</div>
                {medicationKeys.map(key => {
                    const { medicine, medicineType, schedule_data: { frequency = '' } = {} } = medications[key];
                    return (
                        <div className='drawer-block' key={key}>
                            <div className='flex direction-row justify-space-between align-center'>
                                <div className='flex align-center'>
                                    <div className='form-headings-ap'>{medicine ? medicine : "MEDICINE"}</div>
                                    {medicineType && (<img src={medicineType == MEDICINE_TYPE.TABLET ? TabletIcon : InjectionIcon} className={'medication-image-tablet'} />)}
                                </div>
                                <Icon type="edit" style={{ color: '#4a90e2' }} theme="filled" onClick={this.showInnerForm(EVENT_TYPE.MEDICATION_REMINDER, key)} />
                            </div>
                            <div className='drawer-block-description'>{frequency}</div>
                            <div className='drawer-block-description'>{'Next due:'}</div>
                        </div>
                    );
                })}

                <div className='wp100 form-category-headings-ap align-self-start'>Appointments</div>
                {appointmentKeys.map(key => {
                    const { reason = '', schedule_data: { notes = '' } = {}, time_gap = '' } = appointments[key];
                    return (
                        <div className='drawer-block' key={key}>

                            <div className='flex direction-row justify-space-between align-center'>
                                <div className='form-headings-ap'>{reason}</div>
                                <Icon type="edit" style={{ color: '#4a90e2' }} theme="filled" onClick={this.showInnerForm(EVENT_TYPE.APPOINTMENT, key)} />
                            </div>
                            <div className='drawer-block-description'>{time_gap}</div>
                            <div className='drawer-block-description'>{`Notes:${notes}`}</div>
                        </div>
                    );
                })}
            </div>
        );

    }


    validateData = () => {
        const { mobile_number = '', name = '', gender = '', date_of_birth = '', treatment = '', severity = '', condition = '', prefix = '' } = this.state;
        if (!prefix) {
            message.error('Please select a prefix.')
            return false;
        } else if (mobile_number.length < 10 || !mobile_number) {
            message.error('Please enter valid mobile number.')
            return false;
        } else if (!date_of_birth) {
            message.error('Please select  Date of Birth .')
            return false;
        }
        else if (!treatment) {
            message.error('Please enter a treatment.')
            return false;
        }
        else if (!severity) {
            message.error('Please enter a severity.')
            return false;
        }
        else if (!condition) {
            message.error('Please enter a condition.')
            return false;
        }
        return true;
    }

    onSubmit = () => {
        // const { mobile_number = '', name = '', gender = '', date_of_birth = '', treatment = '', severity = '', condition = '', prefix = '' } = this.state;
        // const validate = this.validateData();
        // const { submit } = this.props;
        // if (validate) {
        //     submit({ mobile_number, name, gender, date_of_birth, treatment, severity, condition, prefix })
        // }
    }

    editMedication = (data) => {
        const { medications = {}, innerFormKey = '' } = this.state;
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
            const{basic_info:{name='',type=''}={}}=medicines[medicine_id];
            newMedication.medicine_id=medicine_id;
            newMedication.medicine=name;
            newMedication.medicineType=type;
            newMedication.schedule_data={end_date:end_date?moment(end_date).utc():moment.utc(),start_date:start_date?moment(start_date).utc():moment.utc(),
            unit,frequency:`${MEDICATION_TIMING[when_to_take].text} ${MEDICATION_TIMING[when_to_take].time}`,repeat,quantity,repeat_days,strength,start_time:start_time?moment(start_time).utc():moment.utc()};
        console.log("DATA OF EDITED MEDICATIONNNNN===>",newMedication);
        medications[innerFormKey]=newMedication;
        this.setState({medications},()=>{
            this.onCloseInner()
        });
    }


    editAppointment = (data) => {

        console.log("DATA OF EDITED Appointment===>", data);
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
        const { visible ,patientId,patients} = this.props;
        const { showInner, innerFormType, innerFormKey, medications, appointments } = this.state;
        const { onClose, renderTemplateDetails } = this;

        let medicationData = innerFormKey && innerFormType == EVENT_TYPE.MEDICATION_REMINDER ? medications[innerFormKey] : {};

        let appointmentData = innerFormKey && innerFormType == EVENT_TYPE.APPOINTMENT ? appointments[innerFormKey] : {};

        if (visible !== true) {
            return null;
        }
        return (
            <Fragment>
                <Drawer
                    title="Template"
                    placement="right"
                    // closable={false}
                    onClose={onClose}
                    width={350}
                    visible={visible}

                >
                    {renderTemplateDetails()}
                    {/* <Drawer
                        title={innerFormType == EVENT_TYPE.MEDICATION_REMINDER ?"Medication":"Appointment"}
                        width={350}
                        // closable={false}
                        onClose={this.onCloseInner}
                        visible={showInner}
                    >
                        {innerFormKey?innerFormType == EVENT_TYPE.MEDICATION_REMINDER ? this.renderEditMedicationForm() : this.renderEditAppointmentForm():null}
                        <div className='add-patient-footer'>
                            <Button onClick={this.onCloseInner} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button onClick={this.onSubmit} type="primary">
                                Submit
                            </Button>
                        </div>
                    </Drawer> */}

                    {innerFormKey && innerFormType == EVENT_TYPE.MEDICATION_REMINDER && <AddMedicationReminder medicationData={medicationData} medicationVisible={showInner} editMedication={this.editMedication} hideMedication={this.onCloseInner} />}
                    {innerFormKey && innerFormType == EVENT_TYPE.APPOINTMENT && <AddAppointmentDrawer appointmentData={appointmentData} appointmentVisible={showInner} editAppointment={this.editAppointment} hideAppointment={this.onCloseInner} patientId={patientId} patients={patients} />}
                    <div className='add-patient-footer'>
                        <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                            Cancel
                        </Button>
                        <Button onClick={this.onSubmit} type="primary">
                            Submit
                        </Button>
                    </div>
                </Drawer>

            </Fragment>
        );
    }
}

export default injectIntl(TemplateDrawer);
