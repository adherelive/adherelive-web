import React, {Component, Fragment} from "react";
import {Drawer, Form} from "antd";
import {injectIntl} from "react-intl";

import message from "./message";
import AddAppointmentForm from "./form";

class AddAppointment extends Component {
    constructor(props) {
        super(props);
        this.FormWrapper = Form.create({})(AddAppointmentForm);
    }

    formatMessage = data => this.props.intl.formatMessage(data);

    onClose = () => {
        const {close} = this.props;
        close();
    };

    setFormRef = formRef => {
        this.formRef = formRef;
        if (formRef) {
            this.setState({ formRef: true });
        }
    };

    render() {
        const {visible = true} = this.props;
        const {onClose, formatMessage, setFormRef, FormWrapper} = this;
        return (
            <Fragment>
                <Drawer
                    placement="right"
                    closable={false}
                    onClose={onClose}
                    visible={visible} // todo: change as per prop -> "visible", -- WIP --
                    width={600}
                    title={formatMessage(message.add_appointment)}
                >
                    <FormWrapper
                        wrappedComponentRef={setFormRef}
                        {...this.props}
                    />
                </Drawer>
            </Fragment>
        );
    }
}

export default injectIntl(AddAppointment);