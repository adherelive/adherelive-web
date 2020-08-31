import React, { Component } from "react";
import { injectIntl } from "react-intl";
// import messages from "./message";
// import {formatMessage} from "react-intl/src/format";
import moment from 'moment';
import uuid from 'react-uuid';
import { Button, Modal, TimePicker, Icon, message, Checkbox } from "antd";
import { FULL_DAYS } from '../../constant';
import messages from './messages';

// const Initial_State = {
//     daySelected: {
//         [FULL_DAYS.MON]: false,
//         [FULL_DAYS.TUE]: false,
//         [FULL_DAYS.WED]: false,
//         [FULL_DAYS.THU]: false,
//         [FULL_DAYS.FRI]: false,
//         [FULL_DAYS.SAT]: false,
//         [FULL_DAYS.SUN]: false,

//     },
//     dayTimings: {
//         [FULL_DAYS.MON]: {},
//         [FULL_DAYS.TUE]: {},
//         [FULL_DAYS.WED]: {},
//         [FULL_DAYS.THU]: {},
//         [FULL_DAYS.FRI]: {},
//         [FULL_DAYS.SAT]: {},
//         [FULL_DAYS.SUN]: {},
//     }
// };




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
        this.setState({ dayTimings: newTimings, daySelected: activeDays });

    }

    formatMessage = data => this.props.intl.formatMessage(data);

    toggleDaySelected = (day) => () => {

        let { daySelected, dayTimings = {} } = this.state;
        let newDaySelected = daySelected;
        let isDaySelected = newDaySelected[day];
        if (isDaySelected) {
            newDaySelected[day] = !isDaySelected;
            let key = uuid();
            let dayTiming = {};
            dayTiming[key] = { startTime: "", endTime: '' };
            let dayTimingKeys = [key];
            dayTimings[day].timings = dayTiming;
            dayTimings[day].timingsKeys = dayTimingKeys;
        } else {
            newDaySelected[day] = !isDaySelected;
        }

        this.setState({ daySelected: newDaySelected });
    }

    addDayTimings = (day) => () => {
        let key1 = uuid();
        let { dayTimings = {} } = this.state;
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
                        return (
                            <div className='flex direction-column wp100 pt8 pb8'>
                                <div className='flex justify-space-between wp100 mb8 mt4'>
                                    <div className='flex'>
                                        <Checkbox checked={daySelected[day]} onChange={this.toggleDaySelected(day)} />
                                        <div className='ml10 fs16 fw700'>{day}</div>
                                    </div>
                                    {daySelected[day] && (<div className='pointer fs14 medium theme-green' onClick={this.addDayTimings(day)}>{this.formatMessage(messages.addMore)}</div>)}
                                </div>
                                {daySelected[day] && (
                                    <div className='flex direction-column wp100'>
                                        {timingsKeys.map((tKey, index) => {

                                            // let minutesToAdd = 30 - (moment().minutes()) % 30;
                                            return (
                                                <div key={tKey} className='flex mb10'>
                                                    <div className='flex direction-column flex-grow-1 mr24'>
                                                        <div className='fs14 mt8 mb8 '>{this.formatMessage(messages.startTime)}</div>
                                                        <TimePicker
                                                            className='wp100'
                                                            value={timings[tKey].startTime ? timings[tKey].startTime : null}
                                                            use12Hours minuteStep={15} format="hh:mm a"
                                                            onChange={this.setDayStartTime(day, tKey)}
                                                        />
                                                    </div>
                                                    <div className='flex direction-row align-center flex-grow-1'>
                                                        <div className='flex direction-column wp100'>
                                                            <div className='flex wp100 align-center justify-space-between fs14 mt8 mb8'>{this.formatMessage(messages.endTime)}   {index > 0 &&
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

    setDayStartTime = (day, key) => (time) => {
        let { dayTimings = {} } = this.state;
        let newDayTimings = dayTimings;
        let { timings = {} } = newDayTimings[day];
        let wrongHours = false;


        if (time) {

            for (let tkey in timings) {

                if (tkey.localeCompare(key)) {
                    let { startTime = '', endTime = '' } = timings[tkey];
                    if (startTime && endTime) {

                        let newEndTime = moment(time).add('minutes', 30);

                        if ((time.isAfter(moment(startTime)) && time.isBefore(moment(endTime)))
                            || (newEndTime.isAfter(moment(startTime)) && newEndTime.isBefore(moment(endTime)))
                            || moment(time).isSame(moment(startTime)) || moment(time).isSame(moment(endTime))
                            || moment(newEndTime).isSame(moment(startTime)) || moment(newEndTime).isSame(moment(endTime)
                            || (time.isBefore(moment(startTime)) && newEndTime.isBefore(moment(endTime)) && newEndTime.isBefore(moment(startTime)))
                            || (time.isAfter(moment(startTime)) && time.isBefore(moment(endTime)) && newEndTime.isAfter(moment(endTime))))
                        ) {
                            wrongHours = true;
                        }
                    }
                }
            }
        }
        if (!wrongHours) {

            timings[key].startTime = time;
            timings[key].endTime = time ? moment(time).add('minutes', 30) : '';
            newDayTimings[day].timings = timings;
            this.setState({ clinics: newDayTimings });
        } else {
            message.error(this.formatMessage(messages.timeClashing))
        }
    }

    setDayEndTime = (day, key) => (time) => {
        let { dayTimings = {} } = this.state;
        let newDayTimings = dayTimings;
        let { timings = {} } = newDayTimings[day];
        let { startTime = '' } = timings[key];
        let validEndTime = true;


        let wrongHours = false;
        if (time) {
            validEndTime = moment(time).isAfter(startTime);
            for (let tkey in timings) {
                if (tkey.localeCompare(key)) {
                    let { startTime = '', endTime = '' } = timings[tkey];
                    if (startTime && endTime) {
                        if ((time.isAfter(moment(startTime)) && time.isBefore(moment(endTime)))
                            || moment(time).isSame(moment(startTime)) || moment(time).isSame(moment(endTime))
                            || (time.isBefore(moment(startTime)) && time.isAfter(moment(endTime)))) {
                            wrongHours = true;
                        }
                    }
                }
            }
        }
        if (validEndTime && !wrongHours) {
            timings[key].endTime = time;
            newDayTimings[day].timings = timings;
            this.setState({ dayTimings: newDayTimings });
        } else {
            message.error(this.formatMessage(messages.timeClashing))
        }
    }


    handleSave = () => {
        let { dayTimings = {}, daySelected = {} } = this.state;

        for (let day of Object.keys(dayTimings)) {
            let { timings: newTimings = {} } = dayTimings[day];
            for(let time of Object.keys(newTimings)){
                if(newTimings[time].startTime == null){
                    message.error(this.formatMessage(messages.startTimingEmpty));
                    return;
                }else if(newTimings[time].endTime == null){
                    message.error(this.formatMessage(messages.endTimingEmpty));
                    return;
                }
            }
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
        const { visible } = this.props;
        return (
            <Modal
                visible={visible}
                title={this.formatMessage(messages.clinicTimings)}
                onCancel={this.handleClose}
                destroyOnClose={true}
                onOk={this.handleSave}
                footer={[
                    <Button key="back" onClick={this.handleClose}>
                        {this.formatMessage(messages.return)}
                    </Button>,
                    <Button key="submit" type="primary" onClick={this.handleSave}>
                        {this.formatMessage(messages.submit)}
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
