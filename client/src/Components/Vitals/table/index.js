import React, {Component} from "react";
import {injectIntl} from "react-intl";

class VitalTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>vitals table</div>
    }
}

export default injectIntl(VitalTable);