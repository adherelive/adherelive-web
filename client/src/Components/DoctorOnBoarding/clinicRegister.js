import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
// import messages from "./message";
// import {formatMessage} from "react-intl/src/format";
import { DeleteTwoTone } from "@ant-design/icons";
import uuid from 'react-uuid';
import { Tabs, Button, Steps, Col, Select, Input, Upload, Modal, TimePicker, Icon, message } from "antd";
import SideMenu from "./sidebar";
import { REQUEST_TYPE, PATH } from '../../constant';
import UploadSteps from './steps';
import { getUploadURL } from '../../Helper/urls/user';
import { doRequest } from '../../Helper/network';
import plus from '../../Assets/images/plus.png';
import LocationModal from './locationmodal';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { withRouter } from "react-router-dom";
import moment from 'moment';



const { Option } = Select;



class ClinicRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clinics: {},
            clinicsKeys: [],
            visible: false
        };
    }

    componentDidMount() {
        let key = uuid();
        let key1 = uuid();


        let clinics = {};
        let timings = {};
        timings[key] = { startTime: "", endTime: '' };
        let timingsKeys = [key];
        clinics[key1] = { name: "", location: "", timings, timingsKeys };
        let clinicsKeys = [key1];
        this.setState({ clinics, clinicsKeys });

    }



    setClinicName = (key, e) => {
        let { clinics = {} } = this.state;
        let newClinics = clinics;
        newClinics[key].name = e.target.value;
        this.setState({ clinics: newClinics });
    }

    setClinicLocation = (key, e) => {
        let { clinics = {} } = this.state;
        let newClinics = clinics;
        newClinics[key].location = e.target.value;
        this.setState({ clinics: newClinics });
    }

    setClinicStartTime = (key1, key2) => (time, timeString) => {
        // console.log('TIMEEEEEEEEEEEEEEEEEEE', key, time, timeString)
        let { clinics = {} } = this.state;
        let newClinics = clinics;
        newClinics[key1].timings[key2].startTime = time;

        newClinics[key1].timings[key2].endTime = moment(time).add('minutes',30);
        this.setState({ clinics: newClinics });
    }

    setClinicEndTime = (key1, key2) => (time, timeString) => {
        // console.log('TIMEEEEEEEEEEEEEEEEEEEENDDDDD', key, time, timeString)
        let { clinics = {} } = this.state;
        let newClinics = clinics;
        // console.log('TIMEEEEEEEEEEEEEEEEEEEENDDDDD22222', clinics, newClinics[key]);
        let validEndTime = moment(time).isAfter(newClinics[key1].timings[key2].startTime);
        if (validEndTime) {
            newClinics[key1].timings[key2].endTime = time;
            this.setState({ clinics: newClinics });
        } else {
            message.error('Please select a valid End Time.')
        }
    }

    addClinic = () => {
        let key = uuid();
        let key1 = uuid();
        let { clinics = {}, clinicsKeys = [] } = this.state;

        let timings = {};
        timings[key1] = { startTime: "", endTime: '' };
        let timingsKeys = [key1];

        let newClinics = clinics;
        let newclinicsKeys = clinicsKeys;
        newClinics[key] = { name: "", location: "", timings, timingsKeys };
        newclinicsKeys.push(key);
        // console.log("NEWWWWWWWWWW AFTER ADDDDD",key,newClinics[key],newclinicsKeys);
        this.setState({ clinics: newClinics, clinicsKeys: newclinicsKeys });
    }

    addClinicTimings = (key) => () => {
        let key1 = uuid();
        let { clinics = {}, clinicsKeys = [] } = this.state;
        // console.log("CLINIC TIMINGSSSSSSS",clin)
        let newClinics = clinics;

        let newTimings = newClinics[key].timings;
        newClinics[key].timingsKeys.push(key1);
        newTimings[key1] = { startTime: "", endTime: '' };
        newClinics[key].timings = newTimings;
        this.setState({ clinics: newClinics });
    }

    deleteClinicTimings = (key1, key2) => () => {

        let { clinics = {}, clinicsKeys = [] } = this.state;

        let newClinics = clinics;
        let newTimings = newClinics[key1].timings;
        delete newTimings[key2];
        newClinics[key1].timings = newTimings;
        newClinics[key1].timingsKeys.splice(newClinics[key1].timingsKeys.indexOf(key2), 1);
        this.setState({ clinics: newClinics });
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

    renderClinics = () => {
        console.log("Render Education is ==============> 23829823 ===========>  ", this.state);
        let { clinics = {}, clinicsKeys = [] } = this.state;
        console.log(" 23829823  ------------------>  ", JSON.stringify(clinics, null, 4));
        console.log(" 23829823 Keys  ------------------>  ", clinicsKeys);

        const uploadButton = (
            <div>
                Upload
            </div>
        );
        return (
            <div className='flex direction-column'>
                {clinicsKeys.map(key => {
                    let { location = '', name = '', timingsKeys = [], timings = {} } = clinics[key];
                    let locationToDisplay = location && location.length >= 45 ? `${location.substring(0, 45)}...` : location;
                    return (

                        <div key={key}>

                            <div className='flex justify-space-between align-center direction-row'>

                                <div className='form-headings'>Name</div>
                                {clinicsKeys.indexOf(key) > 0 ? (
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
                                placeholder="Clinic name"
                                className={"form-inputs"}
                                // value={name}
                                onChange={e => this.setClinicName(key, e)}
                            />
                            <div className='form-headings'>Location</div>
                            <div className={`form-input-border ${locationToDisplay ? 'active-grey' : 'default-grey'} pointer`} onClick={this.setModalVisible(key)}>
                                <div className={locationToDisplay ? 'active-grey' : 'default-grey'}>{locationToDisplay ? locationToDisplay : 'Location'}</div><Icon type="environment" theme="filled" /></div>

                            <div className='flex justify-space-between align-center direction-row'>
                                <div className='form-headings'>Timings</div>
                                <div className='pointer fs16 medium ' onClick={this.addClinicTimings(key)}>Add More</div>
                            </div>
                            {timingsKeys.map((tKey, index) => {
                                return (
                                    <div key={tKey} className='flex justify-space-between mb10'>
                                        <div className='flex direction-column'>
                                            <div className='fs14 mt8 mb8'>Start Time</div>
                                            <TimePicker use12Hours minuteStep={15} format="HH:mm a" onChange={this.setClinicStartTime(key, tKey)} />
                                        </div>
                                        <div className='flex direction-row align-center'>
                                            <div className='flex direction-column'>
                                                <div className='flex wp100 align-center justify-space-between fs14 mt8 mb8'>End Time   {index > 0 &&
                                                (<Icon
                                                    className="ml10"
                                                    type="minus-circle-o"
                                                    onClick={this.deleteClinicTimings(key, tKey)}
                                                />)
                                            }</div>
                                                <TimePicker use12Hours minuteStep={15} format="HH:mm a" onChange={this.setClinicEndTime(key, tKey)} />
                                            </div>
                                          
                                        </div>
                                    </div>
                                );
                            })}

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
                    <div className='form-category-headings'>Clinic</div>
                    <div className='pointer fs16 medium ' onClick={this.addClinic}>Add More</div>
                </div>
                {this.renderClinics()}
            </div>
        );
    }

    validateClinics = newClinics => {
        for (let edu of newClinics) {

            console.log('NEW CLINICSSSS============>222222', edu);
            let { name = '', location = '', timings = {} } = edu;

            for (let timeSlot of Object.values(timings)) {
                let { startTime = '', endTime = '' } = timeSlot;
                if (!startTime || !endTime) {
                    return false;
                }
            }

            console.log('NEW CLINICSSSS============>3333333', name, location);
            if (!name || !location) {
                return false;
            }
        }
        return true;
    }

    validateData = () => {
        let { clinics = {} } = this.state;
        let newClinics = Object.values(clinics);
        console.log('NEW CLINICSSSS============>1111111', newClinics);
        if (!newClinics.length) {
            message.error('Please enter your Clinic details.')
            return false;
        } else if (!this.validateClinics(newClinics)) {
            message.error('Please enter all Clinic details.')
            return false;
        }
        return true;
    }

    onNextClick = () => {
        const { history, authenticated_user } = this.props;
        console.log('ONCLICKKKKKK');
        const validate = this.validateData();
        if (validate) {
            const { basic_info: { id = 1 } = {} } = authenticated_user || {};
            const { clinics = {} } = this.state;
            let newClinics = Object.values(clinics);
            for (let clinic of newClinics) {
                clinic.time_slots = Object.values(clinic.timings);
                delete clinic.timings;
                delete clinic.timingsKeys;
            }
            const data = { clinics: newClinics };
            const { doctorClinicRegister } = this.props;
            doctorClinicRegister(data, id).then(response => {
                const { status } = response;
                if (status) {
                    history.replace(PATH.DASHBOARD);
                } else {
                    message.error('Something went wrong');
                };
            });
        }
    }

    onBackClick = () => {
        const { history } = this.props;
        history.replace(PATH.REGISTER_QUALIFICATIONS);
    }


    handleCancel = () => this.setState({ visible: false });

    handleOk = (location) => {
        const { clinicKeyOfModal = "", clinics } = this.state
        let newClinics = clinics;
        newClinics[clinicKeyOfModal].location = location

        this.setState({ visible: false, clinics: newClinics });
    };

    render() {
        const { visible = false, clinics, clinicKeyOfModal } = this.state;
        console.log("STATEEEEEEEEEEE", this.state);
        return (
            <Fragment>
                {/* <SideMenu {...this.props} /> */}
                <div className='registration-container'>
                    <div className='header'>Create your Profile</div>
                    <div className='registration-body'>
                        <div className='flex mt36'>
                            <UploadSteps current={2} />
                        </div>
                        <div className='flex'>
                            {this.renderClinicForm()}
                        </div>

                    </div>
                    <div className='footer'>
                        <div className={'footer-text-active'} onClick={this.onBackClick}>
                            Back
                      </div>
                        <div className={'footer-text-active'} onClick={this.onNextClick}>Finish</div></div>
                </div>

                <LocationModal visible={visible} handleCancel={this.handleCancel} handleOk={this.handleOk} location={clinicKeyOfModal && clinics[clinicKeyOfModal] ? clinics[clinicKeyOfModal].location : ''} />

            </Fragment>
        );
    }
}
export default withRouter(injectIntl(ClinicRegister));