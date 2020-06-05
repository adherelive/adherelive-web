import React, {Component, Fragment} from "react";
import {Drawer, Form, message} from "antd";
import {injectIntl} from "react-intl";

import messages from "./message";
import AddAppointmentForm from "./form";
import Footer from "../footer";

class AddAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true
        };

        this.FormWrapper = Form.create({})(AddAppointmentForm);
    }

    handleSubmit = e => {
        e.preventDefault();
        const { addAppointment } = this.props;
        const { formRef = {}, formatMessage } = this;
        const {
            props: {
                form: { validateFields }
            }
        } = formRef;

        validateFields(async (err, values) => {
            if (!err) {
                console.log("VALUES --> ", values);
                const {patient = {}, date, start_time, end_time, description = ""} = values;

                const data = {
                    // todo: change participant one with patient from store
                    participant_two: {
                        id: "2",
                        category:"patient"
                    },
                    date,
                    start_time,
                    end_time,
                };

                try {
                    const response = await addAppointment(data);
                    const {status} = response || {};

                    if(status === true) {
                        message.success(formatMessage(messages.add_appointment_success));
                    } else {
                        // TODO: add error message from response here
                        // message.error(formatMessage(message.add_appointment_error))
                    }


                    console.log("add appointment response -----> ", response);
                } catch(error) {
                    console.log("ADD APPOINTMENT UI ERROR ---> ", error);
                }
            }
        });
    };

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
        const {onClose, formatMessage, setFormRef, handleSubmit, FormWrapper} = this;
        return (
            <Fragment>
                <Drawer
                    placement="right"
                    // closable={false}
                    onClose={onClose}
                    visible={visible} // todo: change as per prop -> "visible", -- WIP --
                    width={'40%'}
                    title={formatMessage(messages.add_appointment)}
                    // headerStyle={{
                    //     display:"flex",
                    //     justifyContent:"space-between",
                    //     alignItems:"center"
                    // }}
                >
                    <FormWrapper
                        wrappedComponentRef={setFormRef}
                        {...this.props}
                    />
                    <Footer
                        onSubmit={handleSubmit}
                        onClose={onClose}
                        submitText={formatMessage(messages.submit_text)}
                        submitButtonProps={{}}
                        cancelComponent={null}
                    />
                </Drawer>
            </Fragment>
        );
    }
}

export default injectIntl(AddAppointment);