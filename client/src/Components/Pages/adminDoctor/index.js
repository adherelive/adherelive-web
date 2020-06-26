import React, { Component , Fragment } from "react";
import {injectIntl} from "react-intl";

import DoctorTable from "../../../Containers/Doctor/table";

class AdminDoctorPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Fragment>
                <div className="wp100 flex direction-column">
                <div className="p18 fs30 fw700 mb20">Doctors</div>
                <DoctorTable />
                </div>
            </Fragment>
        );
    }
}

export default injectIntl(AdminDoctorPage);