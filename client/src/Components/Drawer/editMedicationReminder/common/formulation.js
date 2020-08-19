import React, { Component, Fragment } from "react";
import { Select, Form, Radio } from "antd";
import { injectIntl } from "react-intl";
import { MEDICINE_TYPE } from '../../../../constant';
import messages from "../message";

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


    render() {
        const { form } = this.props;
        const {
            getFieldDecorator,
            getFieldError,
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
                        >
                            <RadioButton value={MEDICINE_TYPE.SYRUP} >{this.formatMessage(messages.syrup)}</RadioButton>
                            <RadioButton value={MEDICINE_TYPE.TABLET} >{this.formatMessage(messages.tablet)}</RadioButton>
                            <RadioButton value={MEDICINE_TYPE.INJECTION} >{this.formatMessage(messages.syringe)}</RadioButton>
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
