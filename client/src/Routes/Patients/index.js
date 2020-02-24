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
  const { match: { params: { id } = {} } = {} } = props;
  return <PatientDetails id={id} />;
};

export default class Patients extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }


    render() {
        return (
                <Router>
                    <Switch>
                        <Route exact path={PATH.PATIENT.DETAILS} component={PatientDetailsComp}/>
                    </Switch>
                </Router>
        );
    }
}
