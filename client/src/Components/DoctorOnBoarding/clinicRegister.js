import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { DeleteTwoTone } from "@ant-design/icons";
import uuid from 'react-uuid';
import { Input, Icon, message } from "antd";
import { PATH, FULL_DAYS, FULL_DAYS_NUMBER ,USER_CATEGORY} from '../../constant';
import UploadSteps from './steps';
import LocationModal from './locationmodal';
import TimingModal from './timingModal';
import { withRouter } from "react-router-dom";
import moment from 'moment';
import messages from './messages';



const dayTimings = {
    [FULL_DAYS.MON]: [{ startTime: "", endTime: '' }],
    [FULL_DAYS.TUE]: [{ startTime: "", endTime: '' }],
    [FULL_DAYS.WED]: [{ startTime: "", endTime: '' }],
    [FULL_DAYS.THU]: [{ startTime: "", endTime: '' }],
    [FULL_DAYS.FRI]: [{ startTime: "", endTime: '' }],
    [FULL_DAYS.SAT]: [{ startTime: "", endTime: '' }],
    [FULL_DAYS.SUN]: [{ startTime: "", endTime: '' }],
};

const daySelected = {
    [FULL_DAYS.MON]: false,
    [FULL_DAYS.TUE]: false,
    [FULL_DAYS.WED]: false,
    [FULL_DAYS.THU]: false,
    [FULL_DAYS.FRI]: false,
    [FULL_DAYS.SAT]: false,
    [FULL_DAYS.SUN]: false,

}



class ClinicRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clinics: {},
            clinicsKeys: [],
            visible: false,
            timingsVisible: false
        };
    }

    componentDidMount() {
        let key = uuid();
        let key1 = uuid();


        let clinics = {};
        clinics[key1] = { name: "", location: "", timings: [], daySelected };
        let clinicsKeys = [key1];
        this.setState({ clinics, clinicsKeys });

    }



    setClinicName = (key, e) => {
        let { clinics = {} } = this.state;
        let newClinics = clinics;

        const { value } = e.target;
        const reg = /^[a-zA-Z][a-zA-Z\s]*$/;
        if (reg.test(value) || value === '') {
            newClinics[key].name = e.target.value;
            this.setState({ clinics: newClinics });
        }
    }

    setClinicLocation = (key, e) => {
        let { clinics = {} } = this.state;
        let newClinics = clinics;
        newClinics[key].location = e.target.value;
        this.setState({ clinics: newClinics });
    }


    formatMessage = data => this.props.intl.formatMessage(data);


    addClinic = () => {
        let key = uuid();
        // let key1 = uuid();
        let { clinics = {}, clinicsKeys = [] } = this.state;

        // let timings = [];

        let newClinics = clinics;
        let newclinicsKeys = clinicsKeys;
        newClinics[key] = {
            name: "", location: "", timings: [], daySelected: {
                [FULL_DAYS.MON]: false,
                [FULL_DAYS.TUE]: false,
                [FULL_DAYS.WED]: false,
                [FULL_DAYS.THU]: false,
                [FULL_DAYS.FRI]: false,
                [FULL_DAYS.SAT]: false,
                [FULL_DAYS.SUN]: false,

            }
        };
        newclinicsKeys.unshift(key);
        this.setState({ clinics: newClinics, clinicsKeys: newclinicsKeys });
    }



    deleteClinic = (key) => () => {
        let { clinics = {}, clinicsKeys = [] } = this.state;
        let newClinics = clinics;
        let newclinicsKeys = clinicsKeys;
        delete newClinics[key];
        newclinicsKeys.splice(newclinicsKeys.indexOf(key), 1);
        this.setState({ clinics: newClinics, clinicsKeys: newclinicsKeys });
    }

    setModalVisible = key => () => {
        this.setState({ visible: true, clinicKeyOfModal: key });
    }

    setModalTimingVisible = key => () => {
        this.setState({ timingsVisible: true, clinicKeyOfModalTiming: key });
    }

    renderTimings = (timings) => {
        return (
            (Object.keys(timings).map((day) => {
                return (
                    <div className='wp100 flex flex-start'>
                        <div className='fs14 medium wp15'>{`${day} :`}</div>
                        <div className='flex wp80 flex-start flex-wrap'>{
                            timings[day].length && timings[day][0].startTime != '' && timings[day][0].endTime != '' ? timings[day].map((time, index) => {
                                return (
                                    <div className='flex justify-start'>
                                        <div>{`${time.startTime ? moment(time.startTime).format('hh:mm a') : ''}-`}</div>
                                        <div>{time.endTime ? `${moment(time.endTime).format('hh:mm a')}${index < timings[day].length - 1 ? ', ' : ' '} ` : ''}</div>
                                    </div>)
                            }) : this.formatMessage(messages.closed)}</div>
                    </div>
                )
            }))
        );

    }

    renderClinics = () => {
        let { clinics = {}, clinicsKeys = [] } = this.state;

        return (
            <div className='flex direction-column'>
                {
                    clinicsKeys.map(key => {
                        let { location = '', name = '', timings = {}, daySelected = {} } = clinics[key];
                        let isClinicOpen = false;
                        for (let day in daySelected) {
                            if (daySelected[day]) {
                                isClinicOpen = true;
                            }
                        }
                        let locationToDisplay = location && location.length >= 45 ? `${location.substring(0, 45)}...` : location;
                        return (

                            <div key={key}>

                                <div className='flex justify-space-between align-center direction-row'>

                                    <div className='form-headings'>{this.formatMessage(messages.name)}</div>
                                    {clinicsKeys.length > 1 ? (
                                        <div className='wp100 flex justify-end'>
                                            <DeleteTwoTone
                                                className={"pointer align-self-end"}
                                                onClick={this.deleteClinic(key)}
                                                twoToneColor="#cc0000"
                                            />
                                        </div>
                                    ) : <div />}
                                </div>
                                <Input
                                    placeholder={this.formatMessage(messages.clinicName)}
                                    className={"form-inputs"}
                                    value={name}
                                    onChange={e => this.setClinicName(key, e)}
                                />
                                <div className='form-headings'>{this.formatMessage(messages.location)}</div>
                                <div className={`form-input-border ${locationToDisplay ? 'active-grey-location' : 'default-grey'} pointer`} onClick={this.setModalVisible(key)}>
                                    <div className={locationToDisplay ? 'active-grey-location' : 'default-grey'}>{locationToDisplay ? locationToDisplay : 'Location'}</div>
                                    <Icon type="environment" theme="filled" />
                                </div>

                                <div className='flex justify-space-between align-center direction-row'>
                                    <div className='form-headings'>{this.formatMessage(messages.timings)}</div>
                                    {/* <div className='pointer fs16 medium ' onClick={this.addClinicTimings(key)}>Add More</div> */}
                                </div>

                                {Object.keys(timings).length && isClinicOpen ? (
                                    <div className={`form-input-timing active-grey `} >
                                        <div className={'active-grey'}>
                                            <div className='flex justify-end wp100'>
                                                <Icon type="edit" style={{ color: '#4a90e2' }} theme="filled" onClick={this.setModalTimingVisible(key)} />
                                            </div>
                                            {this.renderTimings(timings)}
                                        </div>
                                    </div>) :
                                    (
                                        <div className={`form-input-timing default-grey pointer`} onClick={this.setModalTimingVisible(key)}>
                                            <div className={'default-grey'}>
                                                {this.formatMessage(messages.timings)}</div>
                                            {<Icon type="clock-circle" />}
                                        </div>)}
                                {/* <div className={`form-input-timing ${Object.keys(timings).length ? 'active-grey' : 'default-grey'} pointer`} onClick={this.setModalTimingVisible(key)}>
                                    <div className={Object.keys(timings).length ? 'active-grey' : 'default-grey'}>
                                        {Object.keys(timings).length ?
                                            // Object.keys(timings).length :
                                            this.renderTimings(timings) :
                                            'Timings'}</div>{!(Object.keys(timings).length) && (<Icon type="clock-circle" />)}</div> */}

                            </div>
                        );
                    })
                }
            </div>
        );

    }

    renderClinicForm = () => {
        return (
            <div className='form-block'>
                <div className='flex justify-space-between align-center direction-row'>
                    <div className='form-category-headings'>{this.formatMessage(messages.clinic)}</div>
                    <div className='pointer fs16 medium theme-green' onClick={this.addClinic}>{this.formatMessage(messages.addMore)}</div>
                </div>
                {this.renderClinics()}
            </div>
        );
    }

    validateClinics = newClinics => {
        for (let edu of newClinics) {

            let { name = '', location = '', timings = [] } = edu;

            if (!Object.keys(timings).length) {
                return false;
            }

            if (!name || !location) {
                return false;
            }
        }
        return true;
    }

    duplicateClinics = newClinics => {
        for (let edu in newClinics) {

            let { name = '' } = newClinics[edu];


            for (let nEdu in newClinics) {


                if (edu !== nEdu) {
                    let { name: newname = '' } = newClinics[nEdu];
                    if (!newname.localeCompare(name)) {
                        return false;
                    }
                }
            }
            return true;
        }
    }
    validateData = () => {
        let { clinics = {} } = this.state;
        let newClinics = Object.values(clinics);
        if (!newClinics.length) {
            message.error(this.formatMessage(messages.clinicDetails))
            return false;
        } else if (!this.validateClinics(newClinics)) {
            message.error(this.formatMessage(messages.allClinicDetails))
            return false;
        } else if (!this.duplicateClinics(newClinics)) {

            message.error(this.formatMessage(messages.duplicateClinics))
            return false;
        }
        return true;
    }

    onNextClick = () => {
        const { history, showVerifyModal } = this.props;
        const validate = this.validateData();
        if (validate) {
            const { clinics = {} } = this.state;
            let newClinics = Object.values(clinics);
            for (let clinic of newClinics) {
                let { timings = {} } = clinic;
                let time_slots = {
                    [FULL_DAYS_NUMBER.MON]: timings[FULL_DAYS.MON],
                    [FULL_DAYS_NUMBER.TUE]: timings[FULL_DAYS.TUE],
                    [FULL_DAYS_NUMBER.WED]: timings[FULL_DAYS.WED],
                    [FULL_DAYS_NUMBER.THU]: timings[FULL_DAYS.THU],
                    [FULL_DAYS_NUMBER.FRI]: timings[FULL_DAYS.FRI],
                    [FULL_DAYS_NUMBER.SAT]: timings[FULL_DAYS.SAT],
                    [FULL_DAYS_NUMBER.SUN]: timings[FULL_DAYS.SUN],
                }
                clinic.time_slots = time_slots;
                delete clinic.timings;
                delete clinic.timingsKeys;
                delete clinic.daySelected;
            }
            const data = { clinics: newClinics };
            const { doctorClinicRegister } = this.props;
            doctorClinicRegister(data).then(response => {
                const { status, message: errorMessage } = response;
                if (status) {
                    showVerifyModal(true);
                    // message.success(this.formatMessage(messages.successgetAdminVerified))
                    history.replace(PATH.DASHBOARD);
                } else {
                    message.error(errorMessage);
                };
            });
        }
    }

    onBackClick = () => {
        const { history } = this.props;
        history.replace(PATH.REGISTER_QUALIFICATIONS);
    }


    handleCancel = () => this.setState({ visible: false });

    handleCancelTiming = () => this.setState({ timingsVisible: false });

    handleOk = (location) => {
        const { clinicKeyOfModal = "", clinics } = this.state
        let newClinics = clinics;
        newClinics[clinicKeyOfModal].location = location

        this.setState({ visible: false, clinics: newClinics });
    };

    handleOkTiming = (timing, selectedDays) => {

        const { clinicKeyOfModalTiming = "", clinics } = this.state
        let newClinics = clinics;
        newClinics[clinicKeyOfModalTiming].timings = timing;

        newClinics[clinicKeyOfModalTiming].daySelected = selectedDays;

        this.setState({ timingsVisible: false, clinics: newClinics });
    };

    render() {
        const { visible = false, clinics, clinicKeyOfModal, timingsVisible = false, clinicKeyOfModalTiming } = this.state;
        const { authenticated_user = '',authenticated_category = '', users, getDoctorQualificationRegisterData } = this.props;

        let currClinicTimings = {};
        let currClinicDaySelect = {};
        if (clinicKeyOfModalTiming) {
            const { timings = {}, daySelected = {} } = clinics[clinicKeyOfModalTiming] || {};
            currClinicTimings = timings;
            currClinicDaySelect = daySelected;
        }
        let timingForModal = clinicKeyOfModalTiming && Object.keys(currClinicTimings).length ? currClinicTimings : dayTimings;
        let daySelectForModal = clinicKeyOfModalTiming && Object.keys(currClinicDaySelect).length ? currClinicDaySelect : daySelected;
        return (
            <Fragment>
                {/* <SideMenu {...this.props} /> */}
                <div className='registration-container'>
                {
                        authenticated_category === USER_CATEGORY.PROVIDER ? 
                        <div className='header'>{this.formatMessage(messages.createDoctorProfile)}</div>
                        :
                        <div className='header'>{this.formatMessage(messages.createProfile)}</div>

                    }                    <div className='registration-body'>
                        <div className='flex mt36'>
                            <UploadSteps current={2} />
                        </div>
                        <div className='flex mb100'>
                            {this.renderClinicForm()}
                        </div>

                    </div>
                    <div className='footer'>
                        <div className={'footer-text-active'} onClick={this.onBackClick}>
                            
                        {this.formatMessage(messages.back)}
                      </div>
                        <div className={'footer-text-active'} onClick={this.onNextClick}>
                            {this.formatMessage(messages.finish)}</div></div>
                </div>

                <LocationModal visible={visible} handleCancel={this.handleCancel} handleOk={this.handleOk} location={clinicKeyOfModal && clinics[clinicKeyOfModal] ? clinics[clinicKeyOfModal].location : ''} />
                {timingsVisible && <TimingModal visible={timingsVisible} handleCancel={this.handleCancelTiming} handleOk={this.handleOkTiming}
                    timings={timingForModal}
                    daySelected={daySelectForModal}
                />}

            </Fragment>
        );
    }
}
export default withRouter(injectIntl(ClinicRegister));