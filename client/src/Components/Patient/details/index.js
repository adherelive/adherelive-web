import React, { Component } from "react";
import { injectIntl } from "react-intl";

class PatientDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  

  componentDidMount() {}

  render() {
    const gender ="M";
    const patientAge ="62";
    const patientName="John Doe";
    const patientID="12990912";
    const patientContactNumber="+91-6298649934";
    const patientEmailID="doe.john@gmail.com";
    const patientDpLink="https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50";
    // const { id = 0 } = this.props;
    return  (<div className="patientCard tac" >
              <img alt="" className="patientDp" src={patientDpLink}/>
              <div className="patientName">
                {patientName} ({gender} {patientAge}) 
              </div>
              <div className="fontsize20">{patientID}</div>
              <div className="fontsize18">{patientContactNumber}</div>
              <div className="fontsize18">{patientEmailID}</div>
              <div></div>
            </div>);
    
  }
}

export default injectIntl(PatientDetails);
