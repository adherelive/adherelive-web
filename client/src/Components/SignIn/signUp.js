import React, { Component, Fragment } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Button, Input, Form, Row, Col, message } from "antd";
import { Spring } from 'react-spring/renderprops'
import LoginByGoogle from "./googleLogin";
import LoginByFacebook from "./facebookLogin";
import rightArrow from '../../Assets/images/next.png';


const { Item: FormItem } = Form;
const { Password } = Input;

const EMAIL = "email";
const PASSWORD = "password";

const FIELDS = [EMAIL, PASSWORD];

class SignUp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: true
        };
    }

    componentDidMount() {

    }



    handleSignUp = e => {
        e.preventDefault();
        const { signUp } = this.props;

        this.props.form.validateFields((err, values) => {
            if (!err) {
                signUp(values).then(response => {

                    const { status } = response;
                    if (status) {
                        let { payload = {} } = response;
                        this.props.form.resetFields();
                        message.success('Please go to your email to verify your account.')
                    } else {
                        let { payload: { error = {}, message: responseMessage = '' } = {}, statusCode = '' } = response;

                        console.log('RESPONSE OF SIGNUP REQUESTTT', error);
                        if (statusCode === 400 || statusCode === 422) {
                            const { message: errorMessage = '' } = error;
                            message.error(statusCode === 400 ? errorMessage : responseMessage);
                        } else {
                            message.error('Something went wrong.');
                        }
                    }
                });
            }
        });
    };

    render() {
        const { form: { getFieldDecorator, isFieldTouched,
            getFieldError,
            getFieldsError } } = this.props;
        let fieldsError = {};
        FIELDS.forEach(value => {
            const error = isFieldTouched(value) && getFieldError(value);
            fieldsError = { ...fieldsError, [value]: error };
        }); const { handleSignUp } = this;
        const { login } = this.state;
        return (


            <Form onSubmit={handleSignUp} className="login-form">
                <FormItem

                    validateStatus={fieldsError[EMAIL] ? "error" : ""}
                    help={fieldsError[EMAIL] || ""}
                >
                    <div className='fs16 medium tal mt8'>Your Work Email</div>
                    {getFieldDecorator(EMAIL, {
                        rules: [
                            {
                                required: true,
                                message: "Please enter email"
                            },
                            {
                                type: "email",
                                message: "Please enter a valid email!"
                            }
                        ]
                    })(
                        <Input
                            type="text"
                            placeholder="Email"
                            className="h40"
                        />
                    )}
                </FormItem>

                <FormItem

                    validateStatus={fieldsError[PASSWORD] ? "error" : ""}
                    help={fieldsError[PASSWORD] || ""}
                >
                    <div className='fs16 medium tal'>Create a Password</div>
                    {getFieldDecorator(PASSWORD, {
                        rules: [{ required: true, message: "Enter your password" }]
                    })(<Password placeholder="Password" className="h40" />)}
                </FormItem>

                {/* <div classname='fs12 medium dark-sky-blue mt4 tar'>Forgot Password?</div> */}
                <div className='slate-grey mt-10 mb8 fs12 medium'> By signing up you agree to our privacy policy and terms of use.</div>
                <FormItem >
                    <Button
                        type="primary"
                        className="wp100 h40"
                        htmlType="submit"
                        size={"large"}
                    // loading={loading}
                    >
                        Create Account
</Button>
                    <div className="flex justify-space-between direction-column mt10 align-end">

                    </div>
                </FormItem>
            </Form>


        );
    }
}

export default Form.create({ name: "signup_form" })(SignUp);