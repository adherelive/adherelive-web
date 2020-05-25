import React, {Component} from "react";
import {injectIntl} from "react-intl";
import {Form, Spin, Select} from "antd";
import message from "./message";
import {doRequest} from "../../../Helper/network";

const {Item: FormItem} = Form;
const {Option} = Select;
const PATIENT = "patient";

class AddAppointmentForm extends Component {
    constructor(props) {
        super(props);
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
        // TODO: payload -> patient details
    };

    getPatientOptions = () => {
        const {patients} = this.props;

        const patientOptions = patients.map(patient => {
            const {first_name, last_name, id} = patient || {};
            return (
                <Option key={`p-${id}`} value={id} name={}>
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
            <Form>
                <FormItem label={formatMessage(message.patient)}>
                    {getFieldDecorator(PATIENT, {
                        initialValue: getInitialValue()
                    })(
                        <Select
                            className="user-select"
                            onSearch={fetchPatients}
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
            </Form>
        );
    }
}

export default injectIntl(AddAppointmentForm);