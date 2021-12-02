import React, { Component } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import fbLogo from "../../Assets/png/fb-logo.png";

class LoginByFacebook extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  responseFacebook = (response) => {
    const accessToken = response.accessToken;
    const data = {
      accessToken: accessToken,
    };

    this.props.facebookSignIn(data);
  };

  render() {
    return (
      <FacebookLogin
        appId="279463729603660"
        fields="name,email,picture"
        callback={this.responseFacebook}
        render={(renderProps) => (
          <button onClick={renderProps.onClick} className="facebook-button">
            <img alt="fb-logo" src={fbLogo} className="fb-logo" />
            Login with Facebook
          </button>
        )}
      />
    );
  }
}

export default LoginByFacebook;
