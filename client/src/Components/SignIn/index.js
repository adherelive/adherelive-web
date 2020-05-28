import React, {Component, Fragment} from "react";
import {injectIntl, FormattedMessage} from "react-intl";
import {Button, Input, Form, Row, Col, message} from "antd";
import LoginByGoogle from "./googleLogin";
import LoginByFacebook from "./facebookLogin";

const {Item: FormItem} = Form;
const {Password} = Input;

const EMAIL = "email";
const PASSWORD = "password";

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }

    handleSignIn = async e => {
        e.preventDefault();
        const {
            form: { validateFields },
            signIn,
            match: { path } = {},
            history
        } = this.props;
        this.setState({ loading: true });
        validateFields(async (err, { email, password }) => {
            if (!err) {
                try {
                    console.log("email, password --> ", email, password);

                    const response = await signIn({ email, password });
                    const { status = false } = response;
                    if (status) {
                        message.success("LoggedIn successfully", 4);
                    } else {
                        this.setState({ loading: false });
                        message.error("Username or Password incorrect", 4);
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
        // signIn();
    };

    render() {
        const {googleSignIn, facebookSignIn, form: {getFieldDecorator}} = this.props;
        const {handleSignIn} = this;
        return (
            <div className="wp100 flex justify-center align-center">
                <div style={{
                    minWidth: "30%"
                }}>
                    {/*<div className="mt40 flex justify-space-between align-center direction-column">*/}
                    {/*    <img alt="" src={CompanyIcon} className="w200 pt80"/>*/}
                    {/*</div>*/}
                    <div className="mb20 fs24 bold pt50 flex direction-column align-center">
                        Log In
                    </div>
                    <Form onSubmit={handleSignIn} className="login-form">
                        <FormItem>
                            {getFieldDecorator(EMAIL, {
                                rules: [
                                    {
                                        required: true,
                                        message: "Please enter email or mobile number"
                                    }
                                ]
                            })(
                                <Input
                                    type="text"
                                    placeholder="Mobile number or Email"
                                    className="h40"
                                />
                            )}
                        </FormItem>

                        <FormItem>
                            {getFieldDecorator(PASSWORD, {
                                rules: [{required: true, message: "Enter your password"}]
                            })(<Password placeholder="Password" className="h40"/>)}
                        </FormItem>

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
                            <div className="flex justify-space-between direction-column mt10 align-end">
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

                    <div className="flex direction-column justify-space-between align-center">
                        <LoginByGoogle googleSignIn={googleSignIn}/>
                        <LoginByFacebook facebookSignIn={facebookSignIn}/>
                    </div>
                </div>
            </div>

        );
    }
}

export default Form.create({name: "login_form"})(SignIn);

// export default SignIn;
