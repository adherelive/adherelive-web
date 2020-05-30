import React, {Component} from "react";
import {injectIntl} from "react-intl";
import {Form, Spin, Select, DatePicker, TimePicker} from "antd";
import message from "./message";
import {doRequest} from "../../../Helper/network";
import seperator from "../../../Assets/images/seperator.svg";
import moment from "moment";

const {Item: FormItem} = Form;
const {Option} = Select;
const PATIENT = "patient";
const DATE = "date";
const START_TIME = "start_time";
const END_TIME = "end_time";

class AddAppointmentForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchingPatients: false
        }
    }

    fetchPatients = async (data) => {
        try {

        } catch (err) {
            console.log("err", err);
        }
    }

    formatMessage = data => this.props.intl.formatMessage(data);

    getInitialValue = () => {
        const {payload} = this.props;
        const {patients : {id, first_name, last_name} = {}} = payload || {};
        return `${first_name} ${last_name}`;
    };

    getPatientOptions = () => {
        const {patients = []} = this.props;

        const patientOptions = patients.map(patient => {
            const {first_name, last_name, id} = patient || {};
            return (
                <Option key={`p-${id}`} value={id} name={id}>
                    {`${first_name} ${last_name}`}
                </Option>
            );
        });

        return patientOptions;
    };

    render() {
        const {
            form: {getFieldDecorator},
        } = this.props;
        const {fetchingPatients} = this.state;
        const {formatMessage, getInitialValue, getPatientOptions, fetchPatients} = this;


        console.log("appointment form props --> ", this.props);
        return (
            <Form className="fw700">
                <FormItem label={formatMessage(message.patient)}>
                    {getFieldDecorator(PATIENT, {
                        initialValue: getInitialValue()
                    })(
                        <Select
                            className="user-select"
                            // onSearch={fetchPatients}
                            placeholder={formatMessage(message.select_patient)}
                            notFoundContent={fetchingPatients ? <Spin size="small"/> : null}
                            showSearch={true}
                            filterOption={false}
                            suffixIcon={null}
                            removeIcon={null}
                            clearIcon={null}
                        >
                            {getPatientOptions()}
                        </Select>
                    )}
                </FormItem>

                <FormItem label={formatMessage(message.start_date)}>
                    {getFieldDecorator(DATE, {
                        initialValue: moment()
                    })(
                        <DatePicker className="wp100"/>
                    )}
                </FormItem>

                <div className="wp100 flex justify-space-evenly align-center flex-1">
                    <FormItem label={formatMessage(message.start_time)} className="wp100">
                        {getFieldDecorator(START_TIME, {
                            initialValue: moment()
                        })(
                            <TimePicker use12Hours format="h:mm a" className="wp100"/>
                        )}
                    </FormItem>

                    <div className="w200 text-center mt8">
                        <img src={seperator} alt="between seperator" className="mr16 ml16 "/>
                    </div>

                    <FormItem label={formatMessage(message.end_time)} className="wp100">
                        {getFieldDecorator(END_TIME, {
                            initialValue: moment().add(1, 'h')
                        })(
                            <TimePicker use12Hours format="h:mm a" className="wp100"/>
                        )}
                    </FormItem>
                </div>
            </Form>
        );
    }
}

export default injectIntl(AddAppointmentForm);