import React, {Component} from "react";
import {injectIntl} from "react-intl";

class VitalTable extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {vital_ids, getPatientVitals} = this.props;
        if(vital_ids.length === 0) {
            getPatientVitals();
        }
    }

    render() {
        return <div>vitals table</div>
    }
}

export default injectIntl(VitalTable);