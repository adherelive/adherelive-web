import React, { Component , Fragment } from "react";
import {injectIntl} from "react-intl";
import {Button} from 'antd';
import messages from "./messages";


// import DoctorTable from "../../../Containers/Doctor/table";

class ProviderDoctorPage extends Component {
    constructor(props) {
        super(props);
        console.log("234567543213456432",props);
    }

    addDoctor = () => {
        this.props.history.push('/register-profile');
    }
    formatMessage = data => this.props.intl.formatMessage(data);
    
    render() {
        return (
            <Fragment>
                <div className="wp100 flex direction-column">

                <div className="p18 fs30 fw700 mb20">{this.formatMessage(messages.provider)}</div>
                <Button onClick={this.addDoctor} >{this.formatMessage(messages.addDoctor)} </Button>
                <div className="wp100 pl14 pr14 flex align-center justify-center">
                    {/* <DoctorTable /> */}
                </div>
                </div>
            </Fragment>
        );
    }
}

export default injectIntl(ProviderDoctorPage);