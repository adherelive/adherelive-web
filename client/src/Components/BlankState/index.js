import React, { Component, Fragment } from "react";
// import AppHeader from "../../Containers/Header";
import "./style.less";

export default class BlankState extends Component {
  componentDidMount() {
    const {
      auth: { authenticated } = {},
      location: { pathname } = {}
    } = this.props;
    if (!authenticated) {
      this.props.history.push(pathname);
    }
  }

  goHome = e => {
    e.preventDefault();
    // this.props.resetUnauthorizedError();
    this.props.history.replace("/");
  };

  // componentWillUnmount() {
  //   this.props.resetUnauthorizedError();
  // }

  render() {
    return (
      <div className="eror-page-container">
        <div
          className="dark medium fontsize14 go-home-btn pointer"
          onClick={this.goHome}
        >
          Click Here to Go Home
        </div>
      </div>
    );
  }
}
