import React, { Component , Fragment } from "react";
import {injectIntl} from "react-intl";


class doctorCalender extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <div className="wp100 flex direction-column">
                    Doctor Calender
                </div>
            </Fragment>
        );
    }
}

export default injectIntl(doctorCalender);