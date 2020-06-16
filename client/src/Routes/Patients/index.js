import React, { Component, Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import Patient from "../../Containers/Patient/table";
import PatientDetails from "../../Containers/Patient/details";
import { PATH } from "../../constant";

const PatientDetailsComp = props => {
  const { match: { params: { patient_id } = {} } = {} } = props;
  console.log("2187120312 props", props.match);
  return <PatientDetails patient_id={patient_id} />;
};

export default class Patients extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    console.log("19273 here --> patients route");
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
