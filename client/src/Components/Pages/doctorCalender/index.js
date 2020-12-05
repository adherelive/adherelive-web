import React, { Component , Fragment } from "react";
import {injectIntl} from "react-intl";
import { Calendar } from "antd";



class doctorCalender extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){
        console.log("PROPSSSSSSSSSS",this.props);
    }

    render() {
        return (
            <Fragment>
                <div className="wp100 flex direction-column">
                <Calendar
                    // dateCellRender={dateCellRender}
                    // monthCellRender={monthCellRender}
                    // onPanelChange={onPanelChange}
                    // onSelect={onSelect}
                />
                </div>
            </Fragment>
        );
    }
}

export default injectIntl(doctorCalender);