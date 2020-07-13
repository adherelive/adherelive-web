import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
// import messages from "./message";
// import {formatMessage} from "react-intl/src/format";
import moment from 'moment';
import { DeleteTwoTone } from "@ant-design/icons";
import uuid from 'react-uuid';
import { Tabs, Button, Steps, Col, Select, Input, Upload, Modal, TimePicker, Icon, message, Checkbox } from "antd";
import SideMenu from "./sidebar";
import { REQUEST_TYPE, PATH, DAYS, DAYS_KEYS, DAYS_LIST, FULL_DAYS } from '../../constant';
import throttle from "lodash-es/throttle";
import { withRouter } from "react-router-dom";
import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng
} from "react-places-autocomplete";
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const Initial_State = {
    daySelected: {
        [FULL_DAYS.MON]: false,
        [FULL_DAYS.TUE]: false,
        [FULL_DAYS.WED]: false,
        [FULL_DAYS.THU]: false,
        [FULL_DAYS.FRI]: false,
        [FULL_DAYS.SAT]: false,
        [FULL_DAYS.SUN]: false,

    },
    dayTimings: {
        [FULL_DAYS.MON]: {},
        [FULL_DAYS.TUE]: {},
        [FULL_DAYS.WED]: {},
        [FULL_DAYS.THU]: {},
        [FULL_DAYS.FRI]: {},
        [FULL_DAYS.SAT]: {},
        [FULL_DAYS.SUN]: {},
    }
};




class ClinicRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            daySelected: {
                [FULL_DAYS.MON]: false,
                [FULL_DAYS.TUE]: false,
                [FULL_DAYS.WED]: false,
                [FULL_DAYS.THU]: false,
                [FULL_DAYS.FRI]: false,
                [FULL_DAYS.SAT]: false,
                [FULL_DAYS.SUN]: false,

            },
            dayTimings: {
                [FULL_DAYS.MON]: {},
                [FULL_DAYS.TUE]: {},
                [FULL_DAYS.WED]: {},
                [FULL_DAYS.THU]: {},
                [FULL_DAYS.FRI]: {},
                [FULL_DAYS.SAT]: {},
                [FULL_DAYS.SUN]: {},
            }
        };
    }

    componentDidMount() {
        const { timings = {}, daySelected: activeDays = {} } = this.props;
        let newTimings = {};

        console.log("DID MOUNT OF TIMING MODAL CALLED 234324234324234", timings, activeDays)
        for (let day in timings) {
            let dayTiming = {};
            let dayTimingKeys = [];
            for (let timing of timings[day]) {
                let key = uuid();
                dayTimingKeys.push(key);
                dayTiming[key] = { startTime: timing.startTime ? timing.startTime : "", endTime: timing.endTime ? timing.endTime : '' };
            }
            newTimings[day] = {};
            newTimings[day].timings = dayTiming;
            newTimings[day].timingsKeys = dayTimingKeys;
        }
        console.log("DID MOUNT OF TIMING MODAL AFTER CALLED 234324234324234", newTimings, activeDays)
        this.setState({ dayTimings: newTimings, daySelected: activeDays });

    }

    toggleDaySelected = (day) => () => {

        let { daySelected } = this.state;
        let newDaySelected = daySelected;
        let isDaySelected = newDaySelected[day];
        newDaySelected[day] = !isDaySelected;

        this.setState({ daySelected: newDaySelected });
    }

    addDayTimings = (day) => () => {
        let key1 = uuid();
        let { dayTimings = {} } = this.state;
        // console.log("CLINIC TIMINGSSSSSSS",clin)
        let newDayTimings = dayTimings;

        let newTimings = newDayTimings[day].timings;
        newDayTimings[day].timingsKeys.push(key1);
        newTimings[key1] = { startTime: "", endTime: '' };
        newDayTimings[day].timings = newTimings;
        this.setState({ dayTimings: newDayTimings });
    }

    deleteDayTimings = (day, key) => () => {

        let { dayTimings = {} } = this.state;
        let newDayTimings = dayTimings;
        let newTimings = newDayTimings[day].timings;
        delete newTimings[key];
        newDayTimings[day].timings = newTimings;
        newDayTimings[day].timingsKeys.splice(newDayTimings[day].timingsKeys.indexOf(key), 1);
        this.setState({ dayTimings: newDayTimings });
    }


    renderTiming = () => {
        let { daySelected = {}, dayTimings = {} } = this.state;
        return (
            <div className='flex direction-column wp100'>
                {
                    Object.keys(daySelected).map((day) => {
                        const { timingsKeys = [], timings = {} } = dayTimings[day];
                        console.log("TIMINGS KEYSSS OF DAY TIMINGSS", timingsKeys, dayTimings, day, dayTimings[day]);
                        return (
                            <div className='flex direction-column wp100 pt8 pb8'>
                                <div className='flex justify-space-between wp100 mb8 mt4'>
                                    <div className='flex'>
                                        <Checkbox checked={daySelected[day]} onChange={this.toggleDaySelected(day)} />
                                        <div className='ml10 fs16 fw700'>{day}</div>
                                    </div>
                                    {daySelected[day] && (<div className='pointer fs14 medium' onClick={this.addDayTimings(day)}>Add More</div>)}
                                </div>
                                {daySelected[day] && (
                                    <div className='flex direction-column wp100'>
                                        {timingsKeys.map((tKey, index) => {

                                            let minutesToAdd = 30 - (moment().minutes()) % 30;
                                            return (
                                                <div key={tKey} className='flex justify-space-between mb10'>
                                                    <div className='flex direction-column'>
                                                        <div className='fs14 mt8 mb8'>Start Time</div>
                                                        <TimePicker
                                                            className='wp100'
                                                            value={timings[tKey].startTime ? timings[tKey].startTime : null}
                                                            use12Hours minuteStep={15} format="hh:mm a"
                                                            onChange={this.setDayStartTime(day, tKey)}
                                                        />
                                                    </div>
                                                    <div className='flex direction-row align-center'>
                                                        <div className='flex direction-column'>
                                                            <div className='flex wp100 align-center justify-space-between fs14 mt8 mb8'>End Time   {index > 0 &&
                                                                (<Icon
                                                                    className="ml10"
                                                                    type="minus-circle-o"
                                                                    onClick={this.deleteDayTimings(day, tKey)}
                                                                />)
                                                            }</div>
                                                            <TimePicker
                                                                className='wp100'
                                                                value={timings[tKey].endTime ? timings[tKey].endTime : null}
                                                                use12Hours minuteStep={15} format="hh:mm a"
                                                                onChange={this.setDayEndTime(day, tKey)}
                                                            />
                                                        </div>

                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )
                                }
                            </div>
                        );


                    })
                }
            </div>
        );
    }

    setDayStartTime = (day, key) => (time, timeString) => {
        console.log('TIMEEEEEEEEEEEEEEEEEEE', time, moment(time).add('minutes', 30));
        let { dayTimings = {} } = this.state;
        let newDayTimings = dayTimings;
        newDayTimings[day].timings[key].startTime = time;

        newDayTimings[day].timings[key].endTime = moment(time).add('minutes', 30);
        this.setState({ clinics: newDayTimings });
    }

    setDayEndTime = (day, key) => (time, timeString) => {
        // console.log('TIMEEEEEEEEEEEEEEEEEEEENDDDDD', key, time, timeString)
        let { dayTimings = {} } = this.state;
        let newDayTimings = dayTimings;
        // console.log('TIMEEEEEEEEEEEEEEEEEEEENDDDDD22222', clinics, newClinics[key]);
        let { timings = {} } = newDayTimings[day];
        let { startTime = '' } = timings[key];
        let validEndTime = moment(time).isAfter(startTime);

        if (validEndTime) {
            timings[key].endTime = time;
            newDayTimings[day].timings = timings;
            this.setState({ dayTimings: newDayTimings });
        } else {
            message.error('Please select a valid End Time.')
        }
    }


    handleSave = () => {
        let { dayTimings = {}, daySelected = {} } = this.state;

        for (let day of Object.keys(dayTimings)) {
            let { timings: newTimings = {} } = dayTimings[day];
            dayTimings[day] = Object.values(newTimings);
            delete dayTimings[day].timingsKeys;
        }
        let { handleOk } = this.props;
        handleOk(dayTimings, daySelected);
        // this.setState({ ...Initial_State });
    }


    handleChange = address => {
        this.setState({ address });
    };

    handleClose = () => {

        const { handleCancel } = this.props;

        handleCancel();
        // this.setState({ ...Initial_State });

    }


    handleChangeAddress = address => {
        this.setState({ address });
    };

    handleSelect = address => {

        this.setState({ address });
    };


    render() {
        console.log("STATEEEEEEEEEEE OF MODAL", this.state);
        const { address = '', addressManual = '', pincode = '', landmark = '' } = this.state;

        const { visible, handleCancel, handleOk, location } = this.props;
        return (
            <Modal
                visible={visible}
                title={'Clinic Timings'}
                onCancel={this.handleClose}
                destroyOnClose={true}
                onOk={this.handleSave}
                footer={[
                    <Button key="back" onClick={this.handleClose}>
                        Return
                    </Button>,
                    <Button key="submit" type="primary" onClick={this.handleSave}>
                        Submit
                    </Button>,
                ]}
            >
                <div className='location-container'>
                    {this.renderTiming()}
                </div>
            </Modal>
        );
    }
}
export default injectIntl(ClinicRegister);
