import React, { Component } from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Button, Input } from "antd";
import LoginByGoogle from "./googleLogin";

class SignIn extends Component{
    constructor(props){
	super(props);
	this.state={};
    }

    render(){
	return(
		<div className="sign-in">
		<span className="bolder block">Log In</span>
		<div className="input-form">
		<Input placeholder="Mobile Number or Email"/>
		<br />
		<br />
		<Input placeholder="Password"/>
		<br />
		<br />
		<Button type="primary" block>Log In</Button>
		</div>
		<LoginByGoogle />
	    </div>
	);
    }
}

export default SignIn;
