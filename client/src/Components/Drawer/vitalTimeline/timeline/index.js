import React, {Component} from "react";
import {injectIntl} from "react-intl";
import messages from "../messages";

class VitalTimelineDrawer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            id,
            intl: {formatMessage} = {}
        } = this.props;


        return (
            <div>{`Timeline here ${id}`}</div>
        );
    }
}

export default injectIntl(VitalTimelineDrawer);