import React, { Component, Fragment } from "react";
import { Select, Form, Radio } from "antd";
import { injectIntl } from "react-intl";
import { SYRINGE, SYRUP, TABLET, MEDICINE_UNITS } from '../../../../constant';
import messages from "../message";
import unitField from "./medicationStrengthUnit";

import chooseMedicationField from "./medicationStage";

const FIELD_NAME = "formulation";


const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

const units = [
    { key: "mg", value: "mg" },
    { key: "ml", value: "ml" }
];
const { Option } = Select;
const { Item: FormItem } = Form;

class Formulation extends Component {
    componentDidMount() {
        const {
            form: { validateFields }
        } = this.props;
        validateFields();
    }
    componentWillUnmount() {
        const {
            form: { validateFields }
        } = this.props;
        validateFields();
    }

    getParentNode = t => t.parentNode;

    formatMessage = data => this.props.intl.formatMessage(data);

    setUnitMg = () => {
        const {
            form: { setFieldsValue }
        } = this.props;
        setFieldsValue({ [unitField.field_name]: MEDICINE_UNITS.MG });
    }

    setUnitMl = () => {
        const {
            form: { setFieldsValue }
        } = this.props;
        setFieldsValue({ [unitField.field_name]: MEDICINE_UNITS.ML });
    }

    render() {
        const { form } = this.props;
        const {
            getFieldDecorator,
            getFieldError,
            getFieldValue,
            isFieldTouched
        } = form;
        const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);


        return (
            <div className="mb20 select-days-form-content">
                <div className="flex row">
                    <span className="form-label">{this.formatMessage(messages.formulation)}</span>
                    <div className="star-red">*</div>
                </div>
                <FormItem
                    validateStatus={error ? "error" : ""}
                    help={error || ""}
                >
                    {getFieldDecorator(FIELD_NAME, {})(
                        <RadioGroup
                            className="flex justify-content-end radio-formulation"
                            buttonStyle="solid"
                            disabled={!getFieldValue(chooseMedicationField.field_name)}
                        >
                            <RadioButton value={SYRUP} onClick={this.setUnitMl}>{this.formatMessage(messages.syrup)}</RadioButton>
                            <RadioButton value={TABLET} onClick={this.setUnitMg}>{this.formatMessage(messages.tablet)}</RadioButton>
                            <RadioButton value={SYRINGE} onClick={this.setUnitMl}>{this.formatMessage(messages.syringe)}</RadioButton>
                        </RadioGroup>
                    )}
                </FormItem>
            </div>
        );
    }
}

const Field = injectIntl(Formulation);

export default {
    field_name: FIELD_NAME,
    render: props => <Field {...props} />
};
