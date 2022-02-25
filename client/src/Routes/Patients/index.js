import React, { Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import PatientDetails from "../../Containers/Patient/details";
import { PATH } from "../../constant";

const PatientDetailsComp = (props) => {
  const { match: { params: { patient_id } = {} } = {} } = props;
  return <PatientDetails patient_id={patient_id} />;
};

export default class Patients extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Fragment>
        {/*<MedicationReminder />*/}
        <Router>
          <Switch>
            <Route
              exact
              path={PATH.PATIENT.DETAILS}
              component={PatientDetailsComp}
            />
            {/*<Route exact path={PATH.PATIENT.PA} component={Patient} />*/}
          </Switch>
        </Router>
      </Fragment>
    );
  }
}
