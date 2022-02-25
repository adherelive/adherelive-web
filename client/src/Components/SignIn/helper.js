import React, { Component, Fragment } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Button, Input, Form, Row, Col, message } from "antd";
import { Spring } from "react-spring/renderprops";
import LoginByGoogle from "./googleLogin";
import LoginByFacebook from "./facebookLogin";

const { Item: FormItem } = Form;
const { Password } = Input;

const EMAIL = "email";
const PASSWORD = "password";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: true,
    };
  }

  componentDidMount() {}

  toggleLogin = () => {
    let { login } = this.state;
    let newLogin = !login;
    this.setState({ login: newLogin });
  };

  handleSignIn = async (e) => {
    e.preventDefault();
    const {
      form: { validateFields },
      signIn,
      match: { path } = {},
      history,
    } = this.props;
    this.setState({ loading: true });
    validateFields(async (err, { email, password }) => {
      if (!err) {
        try {
          const response = await signIn({ email, password });
          const { status = false } = response;
          if (status) {
            message.success("Logged in successfully", 4);
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
    const {
      googleSignIn,
      facebookSignIn,
      form: { getFieldDecorator },
    } = this.props;
    const { handleSignIn } = this;
    const { login } = this.state;
    return (
      <div className="wp100 landing-background flex direction-column justify-center align-center">
        <div className="hp100 wp75">
          <div className="mt40 wp100 mt24 flex justify-space-between align-center direction-row ">
            {/* <img alt="" src={CompanyIcon} className="w200 pt80"/> */}
            <div className="text-white fs28 medium italic">Adhere.Live</div>

            <div className="flex direction-row align-center">
              <div className="text-white fs16 mr16 ">New to AdhereLive?</div>
              <div
                className="signup-button medium pointer"
                onClick={this.toggleLogin}
              >
                {login ? "Signup" : "Login"}
              </div>
            </div>
          </div>
          <div className="center-container">
            <div className="form-background-box"></div>
            {login ? (
              <Spring from={{ right: "55%" }} to={{ right: "15%" }}>
                {(props) => (
                  // <div style={props}>
                  <div className="form-container" style={props}>
                    <div className="mb8 fs24 fw600 pt30 flex direction-column tal">
                      Login to Dashboard
                    </div>
                    <div className="mb20 fs14  flex direction-column tal">
                      Enter Your Credentials
                    </div>

                    <Form onSubmit={handleSignIn} className="login-form">
                      <FormItem>
                        <div className="fs16 medium tal mt16 mb8">Email</div>
                        {getFieldDecorator(EMAIL, {
                          rules: [
                            {
                              required: true,
                              message: "Please enter email or mobile number",
                            },
                          ],
                        })(
                          <Input
                            type="text"
                            placeholder="Mobile number or Email"
                            className="h40"
                          />
                        )}
                      </FormItem>

                      <FormItem>
                        <div className="fs16 medium tal mt4 mb8">Password</div>
                        {getFieldDecorator(PASSWORD, {
                          rules: [
                            { required: true, message: "Enter your password" },
                          ],
                        })(<Password placeholder="Password" className="h40" />)}
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
                      <LoginByGoogle googleSignIn={googleSignIn} />
                      <LoginByFacebook facebookSignIn={facebookSignIn} />
                    </div>
                  </div>

                  // </div>
                )}
              </Spring>
            ) : (
              <Spring from={{ right: "15%" }} to={{ right: "55%" }}>
                {(props) => (
                  // <div style={props}>
                  <div className="form-container" style={props}>
                    <div className="mb8 fs24 fw600 pt30 flex direction-column tal">
                      Login to Dashboard
                    </div>
                    <div className="mb20 fs14  flex direction-column tal">
                      Enter Your Credentials
                    </div>

                    <Form onSubmit={handleSignIn} className="login-form">
                      <FormItem>
                        <div className="fs16 medium tal mt16 mb8">Email</div>
                        {getFieldDecorator(EMAIL, {
                          rules: [
                            {
                              required: true,
                              message: "Please enter email or mobile number",
                            },
                          ],
                        })(
                          <Input
                            type="text"
                            placeholder="Mobile number or Email"
                            className="h40"
                          />
                        )}
                      </FormItem>

                      <FormItem>
                        <div className="fs16 medium tal mt4 mb8">Password</div>
                        {getFieldDecorator(PASSWORD, {
                          rules: [
                            { required: true, message: "Enter your password" },
                          ],
                        })(<Password placeholder="Password" className="h40" />)}
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
                      <LoginByGoogle googleSignIn={googleSignIn} />
                      <LoginByFacebook facebookSignIn={facebookSignIn} />
                    </div>
                  </div>
                )}
              </Spring>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create({ name: "login_form" })(SignIn);
