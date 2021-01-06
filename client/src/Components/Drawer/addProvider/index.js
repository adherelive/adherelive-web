import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import Footer from "../footer";
import Form from "antd/es/form";
import messages from "./message";

import Drawer from "antd/es/drawer";
import message from "antd/es/message";

import AddProviderForm from  "./form";

class addProviderDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabledOk: true,
    };

    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
      AddProviderForm
    );
  }

  onFormFieldChanges = (props) => {
    const {
      form: { getFieldsError, isFieldsTouched },
    } = props;
    const { disabledOk } = this.state;

    if (isFieldsTouched()) {
      const isError = this.hasErrors(getFieldsError());

      if (disabledOk !== isError && isFieldsTouched()) {
        this.setState({ disabledOk: isError });
      }
    } else {
      this.setState({ disabledOk: true });
    }
  };

  hasErrors = (fieldsError) => {
    // let hasError = false;

    console.log("198273178 fieldsError --> ", {fieldsError});
    return Object.keys(fieldsError).some((field) => fieldsError[field]);
    // for (let err of Object.keys(fieldsError)) {
    //   if (err !== whenToTakeMedicineField.fieLd_name && fieldsError[err]) {
    //     hasError = true;
    //   } else if (err === whenToTakeMedicineField.fieLd_name) {
    //     hasError = Object.values(fieldsError[err]).some((field) => fieldsError[field]);
    //   }
    // }
    // return hasError;
  };



  setPassword = e => {
    e.preventDefault();
    const { value } = e.target;
      this.setState({password:value})
  }


  formatMessage = data => this.props.intl.formatMessage(data);

  onClose = () => {
    const { close } = this.props;
    close();
  };

  handleSubmit = (e) =>{
    e.preventDefault();
    const { formRef = {}, formatMessage } = this;

    const {
      props: {
        form: { validateFields },
      },
    } = formRef;

    validateFields(async (err, values) => {
      if (!err) {
        let {
          name='',
          prefix='91',
          mobile_number='',
          email='',
          address='',
          password='',
          confirm_password=''
        } = values;


        const data = {
          name,
          prefix,
          mobile_number,
          email,
          address,
          password,
          confirm_password
          };

       
          try {
            const {addProvider}=this.props;
            const response = await addProvider(data);
        
            const { status, payload: { message: msg } = {} } = response;
            if (status) {
              message.success(formatMessage(messages.addProviderSuccess));
              this.onClose();
            } else {
                message.warn(msg);
            }

          } catch (err) {
            console.log("err", err);
            message.warn(formatMessage(messages.somethingWentWrong));
          }
        
      }

    });
  }

  setFormRef = (formRef) => {
    this.formRef = formRef;
    if (formRef) {
      this.setState({ formRef: true });
    }
  };

  render() {
    const { visible, loading } = this.props;
    const {disabledOk} = this.state;
    const {
      onClose,
      formatMessage,
      setFormRef,
      handleSubmit,
      FormWrapper,
    } = this;

    const submitButtonProps = {
      disabled: disabledOk,
      loading
    };

    if (visible !== true) {
      return null;
    }

    return (
      <Fragment>
        <Drawer
          title={formatMessage(messages.addProvider)}
          placement="right"
          maskClosable={false}
          headerStyle={{
            position: "sticky",
            zIndex: "9999",
            top: "0px"
          }}
          destroyOnClose={true}
          onClose={onClose}
          visible={visible} 
          width={`30%`}
        >
          {/* {this.renderAddProviderForm()} */}
          <FormWrapper wrappedComponentRef={setFormRef} {...this.props} />

        
            <Footer
            onSubmit={handleSubmit}
            onClose={onClose}
            submitText={this.formatMessage(messages.submit)}
            submitButtonProps={submitButtonProps}
            cancelComponent={null}
          />
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(addProviderDrawer);
