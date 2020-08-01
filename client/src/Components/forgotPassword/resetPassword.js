import React, { Component } from "react";

import { Button, Input, Form, message } from "antd";
import CompanyIcon from '../../Assets/images/logo3x.png'
import { PATH } from "../../constant";

const { Item: FormItem } = Form;
const { Password } = Input;

const PASSWORD = "new_password";
const CONFIRM_PASSWORD = "confirm_password";

const FIELDS = [PASSWORD, CONFIRM_PASSWORD];

class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    async componentDidMount() {
        const { link = "" } = this.props.match.params;
        if (link) {
            const { verifyForgotPasswordLink } = this.props;
            let response = await verifyForgotPasswordLink(link);
            //   .then(response=>{
            const { status, statusCode, payload: { message: resMessage = '' } = {} } = response;
            if (!status) {
                if (statusCode == 422) {

                    message.error(resMessage, 4);
                    this.props.history.replace('/');
                } else {

                    message.error('Something went wrong, please try again.');
                    this.props.history.replace('/');
                }
            } else {
                message.success(resMessage, 4);
            }
        }
    }


    handleResetPassword = async e => {
        e.preventDefault();
        const {
            form: { validateFields },
            resetPassword,
            // match: { path } = {},
            history
        } = this.props;
        this.setState({ loading: true });
        validateFields(async (err, { new_password, confirm_password }) => {
            if (!err) {
                try {

                    const response = await resetPassword({ new_password, confirm_password });
                    const { status = false, statusCode, payload: { message: resMessage } = {} } = response;
                    if (status) {
                        message.success(resMessage, 4);
                        history.push(PATH.SIGN_IN);
                    } else {
                        if (statusCode === 422) {
                            message.error(resMessage, 4);
                        } else {
                            this.setState({ loading: false });
                            message.error(resMessage, 4);
                        }
                    }
                } catch (err) {
                    console.log("298293 err ----> ", err);
                    this.setState({ loading: false });
                    message.error("Something went wrong, Please try again", 4);
                }
            } else {
                this.setState({ loading: false });
                message.error("Something went wrong, Please try again", 4);
            }
        });
        // signIn();
    };

    compareToFirstPassword = ( value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue("new_password")) {
            callback("Two passwords that you enter are inconsistent!");
        } else {
            callback();
        }
    };

    render() {
        const {  form: { getFieldDecorator, isFieldTouched,
            getFieldError } } = this.props;
        let fieldsError = {};
        FIELDS.forEach(value => {
            const error = isFieldTouched(value) && getFieldError(value);
            fieldsError = { ...fieldsError, [value]: error };
        });
        const { handleResetPassword } = this;
        return (
            <div className="wp100 landing-background flex direction-column justify-center align-center">

                <div className='hp100 wp75'>
                    <div className="mt40 wp100 mt24 flex justify-space-between align-center direction-row ">

                        <div className="flex direction-row align-center">
                            <img alt="" src={CompanyIcon} className='company-logo' />
                            <div className='text-white fs28 medium italic'>Adhere.Live</div>
                        </div>

                        <div className="flex direction-row align-center">
                        </div>
                    </div>
                    <div className="center-container">

                        <div className="form-container-reset">
                            <div className="mb8 fs24 fw600 pt20 flex direction-column tal">
                                Forgot Password
                    </div>

                            <Form onSubmit={handleResetPassword} className="login-form">
                                <FormItem
                                    validateStatus={fieldsError[PASSWORD] ? "error" : ""}
                                    help={fieldsError[PASSWORD] || ""}>
                                    <div className='fs16 medium tal'>New Password</div>
                                    {getFieldDecorator(PASSWORD, {
                                        rules: [{ required: true, message: "Enter your password" }]
                                    })(<Password placeholder="Password" className="h40" />)}
                                </FormItem>

                                <FormItem
                                    validateStatus={fieldsError[CONFIRM_PASSWORD] ? "error" : ""}
                                    help={fieldsError[CONFIRM_PASSWORD] || ""}>
                                    <div className='fs16 medium tal'>Confirm Password</div>
                                    {getFieldDecorator(CONFIRM_PASSWORD, {
                                        rules: [{ required: true, message: "Enter your password" },
                                        {
                                            validator: this.compareToFirstPassword
                                        }]
                                    })(<Password placeholder="Confirm Password" className="h40" />)}
                                </FormItem>


                                {/* <div classname='fs12 medium dark-sky-blue mt4 tar'>Forgot Password?</div> */}
                                <FormItem >
                                    <Button
                                        type="primary"
                                        className="wp100 h40 mt28"
                                        htmlType="submit"
                                        size={"large"}
                                    // loading={loading}
                                    >
                                        Submit
                            </Button>
                                    <div className="flex justify-space-between direction-column mt10 align-end">

                                    </div>
                                </FormItem>
                            </Form>

                            <div className="flex direction-column justify-space-between align-center">


                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Form.create()(ResetPassword);
