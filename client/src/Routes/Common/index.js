import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { PATH } from "../../constant";

import Consent from "../../Containers/Pages/userConsentPage";

export default class Global extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path={PATH.CONSENT} component={Consent} />
          <Route path={PATH.LANDING_PAGE} component={Consent} />
        </Switch>
      </BrowserRouter>
    );
  }
}
