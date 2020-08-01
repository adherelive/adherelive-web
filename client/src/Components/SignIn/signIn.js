import React, { Component } from "react";
// import { injectIntl, FormattedMessage } from "react-intl";
import { Button, Input, Form, message } from "antd";


const { Item: FormItem } = Form;
const { Password } = Input;

const EMAIL = "email";
const PASSWORD = "password";

const FIELDS = [EMAIL, PASSWORD];

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: true
        };
    }

    componentDidMount() {

    }




    handleSignIn = async e => {
        e.preventDefault();
        const {
            form: { validateFields },
            signIn,
            getInitialData
        } = this.props;
        this.setState({ loading: true });
        validateFields(async (err, { email, password }) => {
            if (!err) {
                try {

                    const response = await signIn({ email, password });
                    const { status = false, statusCode } = response;
                    if (status) {

                        message.success("LoggedIn successfully", 4);
                        getInitialData();
                    } else {
                        if (statusCode === 422) {
                            message.error("Email does not exist!", 4);
                        } else {
                            this.setState({ loading: false });
                            message.error("Invalid Credentials", 4);
                        }
                    }
                } catch (err) {
                    console.log("298293 err ----> ", err);
                    this.setState({ loading: false });
                    message.error("Something went wrong, Please try again", 4);
                }
            } else {
                this.setState({ loading: false });
                message.error("Please fill both Username and Password", 4);
            }
        });
    };

    render() {
        const { form: { getFieldDecorator, isFieldTouched,
            getFieldError }, redirectToForgotPassword } = this.props;
        let fieldsError = {};
        FIELDS.forEach(value => {
            const error = isFieldTouched(value) && getFieldError(value);
            fieldsError = { ...fieldsError, [value]: error };
        }); const { handleSignIn } = this;
        return (


            <Form onSubmit={handleSignIn} className="login-form">
                <FormItem

                    validateStatus={fieldsError[EMAIL] ? "error" : ""}
                    help={fieldsError[EMAIL] || ""}
                >
                    <div className='fs16 medium tal mt8'>Email</div>
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
                    help={fieldsError[PASSWORD] || ""}>
                    <div className='fs16 medium tal'>Password</div>
                    {getFieldDecorator(PASSWORD, {
                        rules: [{ required: true, message: "Enter your password" }]
                    })(<Password placeholder="Password" className="h40" />)}
                </FormItem>
                <div className='flex wp100 justify-end mt-20 mb16'><div className='Forgot-Password medium pointer ' onClick={redirectToForgotPassword}>Forgot Password?</div></div>

                <FormItem className="mb53">
                    <Button
                        type="primary"
                        className="wp100 h40"
                        htmlType="submit"
                        size={"large"}
                    // loading={loading}
                    >
                        Log in
</Button>
                    <div className="flex justify-space-between direction-column align-end">
                        {/* <span className="login-form-forgot inline-flex">
<Link to="/forgot-password">Forgot password?</Link>
</span> */}
                        {/*              <p>*/}
                        {/*                  Or{" "}*/}
                        {/*                  <span>*/}
                        {/*  <Link to="/register">Sign Up</Link>*/}
                        {/*</span>*/}
                        {/*              </p>*/}
                    </div>
                </FormItem>
            </Form>


        );
    }
}

export default Form.create({ name: "signin_form" })(SignIn);