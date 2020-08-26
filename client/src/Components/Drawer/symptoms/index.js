import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Drawer, Icon, Select, Input, message, Button, Spin, Radio, DatePicker } from "antd";
import config from "../../../config";
import messages from './message';
import "react-datepicker/dist/react-datepicker.css";


class SymptomsDrawer extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {


    }



    formatMessage = data => this.props.intl.formatMessage(data);


    render() {
        const { visible, close } = this.props;
        if (visible !== true) {
            return null;
        }

        const { auth: { notificationToken = '', feedId = '' } = {} } = this.props;
        return (
            <Fragment>
                <Drawer
                    title={this.formatMessage(messages.symptoms)}
                    placement="right"
                    // closable={false}
                    // closeIcon={<img src={backArrow} />}
                    maskClosable={false}
                    headerStyle={{
                        position: "sticky",
                        zIndex: "9999",
                        top: "0px"
                    }}
                    onClose={close}
                    visible={visible} // todo: change as per state, -- WIP --
                    width={400}
                >
                    {/* <div className='add-patient-footer'>
                        <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                            {this.formatMessage(messages.cancel)}
                        </Button>
                        <Button onClick={this.onSubmit} type="primary">
                            {this.formatMessage(messages.submit)}
                        </Button>
                    </div> */}
                </Drawer>

            </Fragment>
        );
    }
}

export default injectIntl(SymptomsDrawer);



