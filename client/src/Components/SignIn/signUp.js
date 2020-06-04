import React, {Component, Fragment} from "react";
import {injectIntl, FormattedMessage} from "react-intl";
import {Button, Input, Form, Row, Col, message} from "antd";
import { Spring } from 'react-spring/renderprops'
import LoginByGoogle from "./googleLogin";
import LoginByFacebook from "./facebookLogin";
import rightArrow from '../../Assets/images/next.png';


const {Item: FormItem} = Form;
const {Password} = Input;

const EMAIL = "email";
const PASSWORD = "password";

class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login:true
        };
    }

    componentDidMount() {

    }

    toggleLogin=()=>{
        let{login}=this.state;
        let newLogin=!login;
        this.setState({login:newLogin});
    }

    handleSubmit = e => {
        e.preventDefault();
        const { signUp } = this.props;
    
        this.props.form.validateFields((err, values) => {
          if (!err) {
            signUp(values);
          }
        });
      };

    render() {
        const {googleSignIn, facebookSignIn, form: {getFieldDecorator}} = this.props;
        const {handleSubmit} = this;
        const {login} =this.state;
        return (
     
                   
                    <Form onSubmit={handleSubmit} className="login-form">
                        <FormItem >
                            <div className='fs16 medium tal mt8'>Your Work Email</div>
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

                        <FormItem >
                        <div className='fs16 medium tal'>Create a Password</div>
                            {getFieldDecorator(PASSWORD, {
                                rules: [{required: true, message: "Enter your password"}]
                            })(<Password placeholder="Password" className="h40"/>)}
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

export default Form.create({name: "signup_form"})(SignUp);