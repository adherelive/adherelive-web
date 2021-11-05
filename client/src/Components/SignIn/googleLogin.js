import React, { Component } from "react";
import GoogleLogin from "react-google-login";

class LoginByGoogle extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  responseGoogle = (response) => {
    console.log(response);
    // var res = response.profileObj;
    const tokenId = response.code;
    let data = {
      accessToken: response.accessToken,
      tokenId: tokenId,
    };
    this.props.googleSignIn(data);
  };

  render() {
    return (
      <GoogleLogin
        clientId="398277517704-eqh1lvm3872s2a5t916kua18gp60steu.apps.googleusercontent.com"
        render={(renderProps) => (
          <div
            className="customGPlusSignIn"
            onClick={renderProps.onClick}
            disabled={renderProps.disabled}
          >
            <span className="icon"></span>
            <span className="buttonText">Login With Google</span>
          </div>
        )}
        buttonText="Login with Google"
        onSuccess={this.responseGoogle}
        onFailure={this.responseGoogle}
        prompt="consent"
        accessType="offline"
        responseType="code"
      ></GoogleLogin>
    );
  }
}

export default LoginByGoogle;
