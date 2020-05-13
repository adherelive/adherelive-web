import React, { Component } from 'react';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import fbLogo from "../../Assets/png/fb-logo.png";

class LoginByFacebook extends Component{
    constructor(props){
	super(props);
	this.state={};
    }

    responseFacebook = (response) => {
	console.log(response);
    }
    
    render(){
	return(
	    <FacebookLogin
	    appId="1088597931155576"
	    callback={this.responseFacebook}
	    render={renderProps => (
		    <button onClick={renderProps.onClick} className="facebook-button"><img src={fbLogo} className="fb-logo"/>Login with Facebook</button>
	    )}
		/>
	);
    }
}


export default LoginByFacebook;
