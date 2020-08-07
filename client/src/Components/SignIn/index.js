import React, { Component, Fragment } from "react";
import { Button, Input, Form, Row, Col, message } from "antd";
import { Spring } from 'react-spring/renderprops';
import SignInForm from './signIn';
import SignUpForm from './signUp';

import rightArrow from '../../Assets/images/next.png';
import CompanyIcon from '../../Assets/images/logo3x.png';
import { PATH } from "../../constant";

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

    async componentDidMount() {

        const { link = "" } = this.props.match.params;
        if (link) {
            const { verifyUser } = this.props;
            let response = await verifyUser(link);
            console.log("97867896879686899999868", response);
            //   .then(response=>{
            const { status, statusCode } = response;
            if (!status) {
                message.error('This verification link has expired!');

            } else {
                this.props.history.push('/register-profile');
            }
        }
    }


    toggleLogin = () => {
        let { login } = this.state;
        let newLogin = !login;

        // this.props.form.resetFields();
        this.setState({ login: newLogin });
    }

    // handleSignUp = e => {
    //     e.preventDefault();
    //     const { signUp } = this.props;

    //     this.props.form.validateFields((err, values) => {
    //         if (!err) {
    //             signUp(values).then(response => {

    //                 const { status } = response;
    //                 if (status) {
    //                     let { payload = {} } = response;
    //                     this.props.form.resetFields();
    //                     message.success('Please go to your email to verify your account.')
    //                 } else {
    //                     let { payload: { error = {}, message: responseMessage = '' } = {}, statusCode = '' } = response;

    //                     console.log('RESPONSE OF SIGNUP REQUESTTT', error);
    //                     if (statusCode === 400 || statusCode === 422) {
    //                         const { message: errorMessage = '' } = error;
    //                         message.error(statusCode === 400 ? errorMessage : responseMessage);
    //                     } else {
    //                         message.error('Something went wrong.');
    //                     }
    //                 }
    //             });
    //         }
    //     });
    // };

    redirectToForgotPassword = () => {

        const { history } = this.props;
        history.push(PATH.FORGOT_PASSWORD);
    }

    // handleSignIn = async e => {
    //     e.preventDefault();
    //     const {
    //         form: { validateFields },
    //         signIn,
    //         match: { path } = {},
    //         history
    //     } = this.props;
    //     this.setState({ loading: true });
    //     validateFields(async (err, { email, password }) => {
    //         if (!err) {
    //             try {
    //                 console.log("email, password --> ", email, password);

    //                 const response = await signIn({ email, password });
    //                 const { status = false, statusCode } = response;
    //                 if (status) {
    //                     message.success("LoggedIn successfully", 4);

    //                 } else {
    //                     if (statusCode === 422) {
    //                         message.error("Email does not exist!", 4);
    //                     } else {
    //                         this.setState({ loading: false });
    //                         message.error("Username or Password incorrect", 4);
    //                     }
    //                 }
    //             } catch (err) {
    //                 console.log("298293 err ----> ", err);
    //                 this.setState({ loading: false });
    //                 message.error("Something went wrong, Please try again", 4);
    //             }
    //         } else {
    //             this.setState({ loading: false });
    //             message.error("Please fill both Username and Password", 4);
    //         }
    //     });
    //     // signIn();
    // };

    render() {
        const { signIn, signUp } = this.props;
        // let fieldsError = {};
        // FIELDS.forEach(value => {
        //     const error = isFieldTouched(value) && getFieldError(value);
        //     fieldsError = { ...fieldsError, [value]: error };
        // });
        const { handleSignIn, handleSignUp } = this;
        const { login } = this.state;
        return (
            <div className="wp100 landing-background flex direction-column justify-center align-center">

                <div className='hp100 wp75'>
                    <div className="mt40 wp100 mt24 flex justify-space-between align-center direction-row ">

                        <div className="flex direction-row align-center">
                            <img alt="" src={CompanyIcon} className='company-logo' />
                            <div className='text-white fs28 medium italic'>Adhere.Live</div>
                        </div>

                        <div className="flex direction-row align-center">
                            <div className='text-white fs16 mr16 '>{login ? 'New to Adhere?' : 'Already a user?'}</div>
                            <div className='signup-button medium pointer' onClick={this.toggleLogin}>{login ? 'Signup' : 'Login'}</div>
                        </div>
                    </div>
                    <div className="center-container">
                        <div className="form-background-box">
                            {login ? (<Spring
                                from={{ opacity: 0 }}
                                to={{ opacity: 1 }}
                                config={{ delay: 500, duration: 500 }}
                            >
                                {props => (
                                    <div className='flex direction-column flex1 wp100 hp100' style={props}>
                                        <div className='login-description' >
                                            <div className='now-available mb10'><div className='fs14 medium text-white'>NOW AVAILABLE</div></div>
                                            <div className='fs18 medium text-white ml10'>Custom Dashboard</div>

                                            <div className='fs12 text-white mt4 ml10'>Now see the metrics that really helps you</div>
                                        </div>
                                        <div className='login-text'><div className='fs16 medium'> Fusce vehicula dolor arcu, sit amet blandit dolor mollis nec. Donec viverra eleifend lacus, vitae ullamcorper metus. </div></div>
                                        <div className='learn-more-text'><div className='dark-sky-blue fs18 medium mr4'>Learn More</div><img src={rightArrow} height={14} width={14} /></div>
                                    </div>
                                )
                                }
                            </Spring>) : (<Spring
                                from={{ opacity: 0 }}
                                to={{ opacity: 1 }}
                                config={{ delay: 2000, duration: 1000 }}
                            >
                                {props => (
                                    <div className='flex direction-column justify-space-between mt32 pl20 flex1 wp100 hp100' style={props}>
                                        <div className='wp100 flex justify-end'> <div className='wp60 tac fs16 fw600 slate-grey'>Why choose Adhere.live?</div></div>
                                        <div className='wp100 flex mb40 justify-end'> <div className='wp60 tac fs14 fw600 brown-grey'>For any help or assistance, feel free to Contact Us</div></div>
                                    </div>
                                )
                                }
                            </Spring>)}
                        </div>
                        {login ? (
                            <Spring
                                from={{ right: "60%", opacity: 0 }}
                                to={{ right: '15%', opacity: 1 }}
                            >
                                {props => (
                                    // <div style={props}>
                                    <div className="form-container" style={props}>
                                        <div className="mb8 fs24 fw600 pt20 flex direction-column tal">
                                            Login to Dashboard
                    </div>
                                        <div className="mb12 fs14  flex direction-column tal">
                                            Enter Your Credentials
                    </div>

                                        <SignInForm signIn={signIn} redirectToForgotPassword={this.redirectToForgotPassword} />
                                        <div className="flex direction-column justify-space-between align-center">
                                            {/* <LoginByGoogle googleSignIn={googleSignIn}/> */}
                                            {/* <LoginByFacebook facebookSignIn={facebookSignIn}/> */}

                                        </div>

                                        <div className='flex mt12 wp100 justify-center'><div className='medium fs12'>Facing an issue?</div></div>
                                        <div className='flex wp100 justify-center'><div className='medium fs14 dark-sky-blue'>Contact Support</div></div>
                                    </div>

                                    // </div>

                                )
                                }
                            </Spring>) : (
                                <Spring
                                    from={{ right: "15%", opacity: 0 }}
                                    to={{ right: '60%', opacity: 1 }}
                                >
                                    {props => (
                                        // <div style={props}>
                                        <div className="form-container" style={props}>
                                            <div className="mb8 fs24 fw600 pt20 flex direction-column tal">
                                                Sign Up
                    </div>
                                            <div className="mb12 fs14  flex direction-column tal">
                                                Create a password to continue
                    </div>


                                            <SignUpForm signUp={signUp} />
                                            <div className="flex direction-column justify-space-between align-center">


                                            </div>
                                        </div>


                                    )
                                    }
                                </Spring>)}
                    </div>
                </div>
            </div>

        );
    }
}

export default SignIn;
