import React, {Component} from "react";
import { injectIntl } from "react-intl";

class PatientDetails extends Component {
    render() {
        const {id = 0} = this.props;
        return (
          <div>{id}</div>
        );
    }
}

export default injectIntl(PatientDetails);