import React, { Component } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { injectIntl } from "react-intl";
import Routes from "./Containers/Routes";

// timezone update
import { setTimeZone } from "./Helper/moment";

class AppWrapper extends Component {
  componentDidMount() {
    setTimeZone();
  }

  render() {
    return (
      <Router>
        <Routes />
      </Router>
    );
  }
}

export default injectIntl(AppWrapper);
