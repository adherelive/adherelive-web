import React, { Component } from "react";
import { message } from "antd";
import { Spring } from "react-spring/renderprops";
import SignInForm from "./signIn";
import SignUpForm from "./signUp";

import rightArrow from "../../Assets/images/next.png";
import CompanyIcon from "../../Assets/images/logo3x.png";
import { PATH } from "../../constant";
import loginLogo from "../../Assets/images/login-subharti-logo.png";

import config from "../../config";
import { injectIntl } from "react-intl";
import messages from "./message";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login: true
    };
  }

  async componentDidMount() {
    const { link = "" } = this.props.match.params;
    if (link) {
      const { verifyUser } = this.props;
      let response = await verifyUser(link);
      //   .then(response=>{
      const { status } = response;
      if (!status) {
        message.error(this.formatMessage(messages.linkExpired));
      } else {
        this.props.history.push("/register-profile");
      }
    }
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  toggleLogin = () => {
    let { login } = this.state;
    let newLogin = !login;

    // this.props.form.resetFields();
    this.setState({ login: newLogin });
  };

  redirectToForgotPassword = () => {
    const { history } = this.props;
    history.push(PATH.FORGOT_PASSWORD);
  };

  render() {
    const { signIn, signUp, getInitialData, getUserRoles } = this.props;
    const { login } = this.state;
    return (
      <div className="wp100 landing-background flex direction-column justify-center align-center">
        <div className="hp100 wp75">
          <div className="mt40 wp100 mt24 flex justify-space-between align-center direction-row ">
            <div className="flex direction-row align-center">
              <img
                alt="adhere-logo"
                src={CompanyIcon}
                className="company-logo"
              />
              <div className="text-white fs28 medium italic">
                {this.formatMessage(messages.appName)}
              </div>
            </div>

            <div className="flex direction-row align-center">
              <div className="text-white fs16 mr16 ">
                {login ? "New to Adhere?" : "Already a user?"}
              </div>
              <div
                className="signup-button medium pointer"
                onClick={this.toggleLogin}
              >
                {login ? "Signup" : "Login"}
              </div>
            </div>
          </div>
          <div className="center-container">

            <div className="form-background-box">
              {login ? (
                <Spring
                  from={{ opacity: 0 }}
                  to={{ opacity: 1 }}
                  config={{ delay: 500, duration: 500 }}
                >
                  {props => (
                    <div
                      className=" flex direction-column flex1 wp100 hp100"
                      style={props}
                    >
                      <div className=" login-description ml22 relative">
                        <div className="flex direction-column align-center justify-center hp100">
                          
                         <div className=" h100 wp60 relative minw150" > 
                            <div className="absolute t-50 h50 wp100 tac lighter-gray fs14 " >{this.formatMessage(messages.adhereAssociation)}</div>
                            <div>
                              <img src={loginLogo} style={{width:'100%',height:"100%"}} alt="subharti-logo" ></img>
                            </div>
                          </div>
                         
                            <div className="login-small-div" >
                              <div className="login-line"></div>
                              <div className="tac mt14 light-brown-gray fs14" >
                                {this.formatMessage(messages.contactUsStart)}{` `}<a href={`mailto:${config.ADHERE_LIVE_CONTACT_LINK}?subject=${config.mail.LOGIN_CONTACT_MESSAGE}`} target={"_blank"}  className="light-brown-gray"  >{this.formatMessage(messages.contactUs)}</a>
                              </div>
                            </div>
                          
                        </div>
                      </div>
                     
                      
                    </div>
                  )}
                </Spring>
              ) : (
                <Spring
                  from={{ opacity: 0 }}
                  to={{ opacity: 1 }}
                  config={{ delay: 2000, duration: 1000 }}
                >
                  {props => (
                       <div
                       className=" flex align-end direction-column flex1 wp100 hp100"
                       style={props}
                     >
                       <div className=" login-description mr22 relative">
                         <div className="flex direction-column align-center justify-center hp100">
                           
                          <div className=" h100 wp60 relative  minw150" > 
                          <div className="absolute t-50 h50 wp100 tac lighter-gray fs14 " >{this.formatMessage(messages.adhereAssociation)}</div>
                            <div>
                              <img src={loginLogo} style={{width:'100%',height:"100%"}} alt="subharti-logo" ></img>
                            </div>
                           </div>
                          
                             <div className="login-small-div" >
                               <div className="login-line"></div>
                               <div className="tac mt14 light-brown-gray fs14" >
                                {this.formatMessage(messages.contactUsStart)}{` `}<a href={`mailto:${config.ADHERE_LIVE_CONTACT_LINK}?subject=${config.mail.LOGIN_CONTACT_MESSAGE}`} target={"_blank"}  className="light-brown-gray"  >{this.formatMessage(messages.contactUs)}</a>
                              </div>
                             </div>
                           
                         </div>
                       </div>
                      
                       
                     </div>
                  )}
                </Spring>
              )}
            </div>
            {login ? (
              <Spring
                from={{ right: "60%", opacity: 0 }}
                to={{ right: "15%", opacity: 1 }}
              >
                {props => (
                  // <div style={props}>
                  <div className="form-container" style={props}>
                    <div className="mb8 fs24 fw600 pt20 flex direction-column tal">
                      {this.formatMessage(messages.loginToDashboard)}
                    </div>
                    <div className="mb12 fs14  flex direction-column tal">
                      {this.formatMessage(messages.enterCredentials)}
                    </div>

                    <SignInForm
                      signIn={signIn}
                      getInitialData={getInitialData}
                      getUserRoles={getUserRoles}
                      redirectToForgotPassword={this.redirectToForgotPassword}
                    />
                    <div className="flex direction-column justify-space-between align-center">
                      {/* <LoginByGoogle googleSignIn={googleSignIn}/> */}
                      {/* <LoginByFacebook facebookSignIn={facebookSignIn}/> */}
                    </div>

                    <div className="flex mt12 wp100 justify-center">
                      <div className="medium fs12">
                        {this.formatMessage(messages.issue)}
                      </div>
                    </div>
                    <div className="flex wp100 justify-center">
                      <a href={`mailto:${config.ADHERE_LIVE_CONTACT_LINK}?subject=${config.mail.LOGIN_CONTACT_MESSAGE}`} target={"_blank"} className="medium fs14 dark-sky-blue pointer">
                        {this.formatMessage(messages.contactSupport)}
                      </a>
                    </div>
                  </div>

                  // </div>
                )}
              </Spring>
            ) : (
              <Spring
                from={{ right: "15%", opacity: 0 }}
                to={{ right: "60%", opacity: 1 }}
              >
                {props => (
                  // <div style={props}>
                  <div className="form-container" style={props}>
                    <div className="mb8 fs24 fw600 pt20 flex direction-column tal">
                      {this.formatMessage(messages.signUp)}
                    </div>
                    <div className="mb12 fs14  flex direction-column tal">
                      {this.formatMessage(messages.continue)}
                    </div>

                    <SignUpForm signUp={signUp} />
                    <div className="flex direction-column justify-space-between align-center"></div>
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

export default injectIntl(SignIn);
