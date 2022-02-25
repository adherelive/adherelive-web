import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import {
  Drawer,
  Icon,
  Select,
  Input,
  message,
  Button,
  Spin,
  Radio,
  DatePicker,
} from "antd";
import { CONSULTATION_FEE_TYPE_TEXT } from "../../../constant";

import moment from "moment";
import throttle from "lodash-es/throttle";

import messages from "./message";
import Footer from "../footer";

const { Option } = Select;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class addNewConsultationDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newConsultationName: "",
      newConsultationType: "",
      newConsultationTypeText: "",
      newConsultationFee: "",
      fetchingAdminPayments: false,
      consultationFeeId: null,
      consultation: "",
      payload: null,
      submitting: false,
      razorpay_link: "",
    };
  }

  componentDidMount() {
    const { payload = {} } = this.props;
  }

  componentDidUpdate(prevProps, prevState) {
    // const { consultation } = this.state;
    // const { consultation: prev_consultation } = prevState;
    // if (consultation !== prev_consultation) {
    //   this.setFieldValues();
    // }
    // this.updateConsultationFeeData();

    const { visible: prev_visible = false } = prevProps || {};
    const { visible = false } = this.props || {};

    if (visible && visible !== prev_visible) {
      const {
        payload: { basic_info = {} },
      } = this.props;
      const { payload: updatedPayload = {} } = this.props;
      if (basic_info) {
        let {
          payload: {
            razorpay_link: provider_doc_razorpay_link = "",
            basic_info: {
              razorpay_link = "",
              name = "",
              amount = "",
              type = "",
              id = null,
            } = {},
          } = {},
        } = this.props;

        razorpay_link = razorpay_link
          ? razorpay_link
          : provider_doc_razorpay_link;

        if (id) {
          this.setState({
            newConsultationName: name,
            newConsultationFee: amount,
            newConsultationType: type,
            payload: updatedPayload,
            consultationFeeId: id,
            razorpay_link,
          });

          if (type) {
            const newConsultationTypeText = CONSULTATION_FEE_TYPE_TEXT[type];
            this.setState({
              consultation: parseInt(type),
              newConsultationTypeText,
            });
          }
        }
      } else {
        this.setFieldValues();
      }
    }
  }

  setFee = (e) => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === "") {
      this.setState({ newConsultationFee: e.target.value });
    }
  };

  setRazorpayLink = (e) => {
    const { value } = e.target;
    this.setState({ razorpay_link: e.target.value });
  };

  setFieldValues = () => {
    const { consultation } = this.state;
    if (consultation === 1) {
      this.setState({
        newConsultationName: "Tele-Medicine",
        newConsultationType: "1",
        newConsultationTypeText: CONSULTATION_FEE_TYPE_TEXT["1"],
        // newConsultationFee: ""
      });
    } else if (consultation === 2) {
      this.setState({
        newConsultationName: "Offline Consultation",
        newConsultationType: "1",
        newConsultationTypeText: CONSULTATION_FEE_TYPE_TEXT["1"],
        // newConsultationFee: ""
      });
    } else if (consultation === 3) {
      this.setState({
        newConsultationName: "Adherence Monitoring",
        newConsultationType: "2",
        newConsultationTypeText: CONSULTATION_FEE_TYPE_TEXT["2"],
        // newConsultationFee: ""
      });
    }
  };

  setConsultationName = (e) => {
    e.preventDefault();
    const { value } = e.target;
    const reg = /^[a-zA-Z][a-zA-Z\s-]*$/;
    if (reg.test(value) || value === "") {
      this.setState({ newConsultationName: e.target.value });
    }
  };

  getConsultationOption = () => {
    const { defaultPaymentsProducts } = this.props;
    let options = [];

    for (let each in defaultPaymentsProducts) {
      const { basic_info: { id = null, name = "", type = "" } = {} } =
        defaultPaymentsProducts[each] || {};
      options.push(
        <Option key={id} value={id}>
          {name}
        </Option>
      );
    }

    return options;
  };

  setConsultation = (value) => {
    this.setState({ consultation: value });

    if (value === 1) {
      this.setState({
        newConsultationName: "Tele-Medicine",
        newConsultationType: "1",
        newConsultationTypeText: CONSULTATION_FEE_TYPE_TEXT["1"],
        // newConsultationFee: ""
      });
    } else if (value === 2) {
      this.setState({
        newConsultationName: "Offline Consultation",
        newConsultationType: "1",
        newConsultationTypeText: CONSULTATION_FEE_TYPE_TEXT["1"],
        // newConsultationFee: ""
      });
    } else if (value === 3) {
      this.setState({
        newConsultationName: "Adherence Monitoring",
        newConsultationType: "2",
        newConsultationTypeText: CONSULTATION_FEE_TYPE_TEXT["2"],
        // newConsultationFee: ""
      });
    }
  };

  isDoctorRoleAssociatedWithProvider = () => {
    const { auth_role, user_roles } = this.props;
    const { basic_info: { linked_with, linked_id } = {} } =
      user_roles[auth_role] || {};

    if (linked_id) {
      return linked_id;
    }
    return false;
  };

  renderAddNewConsultationFee = () => {
    const provider_id = this.isDoctorRoleAssociatedWithProvider();
    const {
      newConsultationName = "",
      newConsultationType = "",
      newConsultationTypeText = "",
      newConsultationFee = "",
      consultationFeeId = null,
      consultation = "",
      razorpay_link = "",
    } = this.state;

    return (
      <div className="form-block-ap">
        <div
          className="form-headings
                //    flex align-center justify-start
                   tac"
        >
          <span className="fwbolder fs18 ">
            {this.formatMessage(messages.defaultConsultationOptions)}
          </span>
        </div>

        <Select
          className="form-inputs-ap drawer-select"
          placeholder="Select Consultation Type"
          value={consultation}
          onChange={this.setConsultation}
          autoComplete="off"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {this.getConsultationOption()}
        </Select>

        <div>
          {consultation !== "" ? (
            <div>
              <div className="form-headings flex align-center justify-start">
                {this.formatMessage(messages.consultationFeeName)}
                <div className="star-red">*</div>
              </div>

              <Input
                className={"form-inputs-ap"}
                value={newConsultationName}
                onChange={this.setConsultationName}
              />

              <div className="form-headings flex align-center justify-start">
                {this.formatMessage(messages.consultationFeeType)}
                <div className="star-red">*</div>
              </div>

              <Input
                disabled={true}
                className={"form-inputs-ap"}
                value={newConsultationTypeText}
              />

              <div className="form-headings flex align-center justify-start">
                {this.formatMessage(messages.consultationFee)}
                <div className="star-red">*</div>
              </div>

              <Input
                className={"form-inputs-ap"}
                value={newConsultationFee}
                onChange={this.setFee}
                disabled={provider_id}
              />

              <div className="form-headings flex align-center justify-start">
                {this.formatMessage(messages.razorpayLink)}
              </div>

              <Input
                className={"form-inputs-ap"}
                value={razorpay_link}
                onChange={this.setRazorpayLink}
                disabled={provider_id}
                type="string"
              />
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  validateData = () => {
    const {
      newConsultationName = "",
      newConsultationType = "",
      newConsultationFee = "",
    } = this.state;

    if (!newConsultationName) {
      message.error(this.formatMessage(messages.ConsultationFeeNameError));
      return false;
    } else if (!newConsultationType) {
      message.error(this.formatMessage(messages.ConsultationFeeTypeError));
      return false;
    } else if (!newConsultationFee) {
      message.error(this.formatMessage(messages.ConsultationFeeAmountError));
      return false;
    }

    return true;
  };

  onSubmit = () => {
    const {
      newConsultationName = "",
      newConsultationType = "",
      newConsultationFee = "",
      consultationFeeId = null,
      razorpay_link = "",
    } = this.state;
    const validate = this.validateData();
    const { submit } = this.props;

    const { doctor_id = null } = this.props;
    if (validate) {
      let toSubmitData = {
        name: newConsultationName,
        type: newConsultationType,
        amount: newConsultationFee,
        razorpay_link,
      };

      if (doctor_id) {
        toSubmitData = { ...toSubmitData, doctor_id };
      }
      if (consultationFeeId) {
        toSubmitData = { ...toSubmitData, ...{ id: consultationFeeId } };
      }

      this.handleSubmit(toSubmitData);
    }
  };

  async handleSubmit(data) {
    try {
      const {
        addDoctorPaymentProduct,
        setIsUpdated,
        doctors = {},
        users = {},
        user_roles = {},
        auth_role = null,
      } = this.props;
      const { close } = this.props;

      this.setState({ submitting: true });
      const { doctor_id = null } = data;
      const { basic_info: { user_id } = {} } = doctors[doctor_id] || {};
      const { category = null } = users[user_id] || {};
      data["for_user_type"] = category;
      const response = await addDoctorPaymentProduct(data);
      const { consultationFeeId = null } = this.state;
      const {
        status,
        payload: {
          data: { payment_products = {}, message: payload_message = "" } = {},
        } = {},
      } = response || {};
      if (status) {
        const successMessage = consultationFeeId
          ? this.formatMessage(messages.ConsultationFeeEditSuccess)
          : this.formatMessage(messages.ConsultationFeeAddSuccess);
        message.success(successMessage);
        setIsUpdated();
        this.onClose();
      } else {
        message.warn(payload_message);
      }
      this.setState({ submitting: false });
    } catch (err) {
      console.log("err ", err);
      this.setState({ submitting: false });
      message.warn(this.formatMessage(messages.somethingWentWrong));
    }
  }

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onClose = () => {
    const { close } = this.props;
    this.setState({
      newConsultationName: "",
      newConsultationType: "",
      newConsultationTypeText: "",
      newConsultationFee: "",
      fetchingAdminPayments: false,
      consultation: "",
      consultationFeeId: null,
      razorpay_link: "",
    });
    close();
  };

  render() {
    const { visible } = this.props;
    const { onClose, renderAddNewConsultationFee } = this;
    const { consultationFeeId, consultation, submitting = false } = this.state;
    const title = consultationFeeId
      ? this.formatMessage(messages.editConsultationFee)
      : this.formatMessage(messages.addConsultationFee);

    if (visible !== true) {
      return null;
    }
    return (
      <Fragment>
        <Drawer
          title={title}
          placement="right"
          maskClosable={false}
          headerStyle={{
            position: "sticky",
            zIndex: "9999",
            top: "0px",
          }}
          destroyOnClose={true}
          onClose={onClose}
          visible={visible} // todo: change as per state, -- WIP --
          width={400}
        >
          {renderAddNewConsultationFee()}

          {consultation !== "" ? (
            <Footer
              onSubmit={this.onSubmit}
              onClose={this.onClose}
              submitText={this.formatMessage(messages.submit)}
              submitButtonProps={{}}
              cancelComponent={null}
              submitting={submitting}
            />
          ) : // <div className="add-patient-footer">
          //   <Button onClick={this.onClose} style={{ marginRight: 8 }}>
          //     {this.formatMessage(messages.cancel)}
          //   </Button>
          //   <Button onClick={this.onSubmit} type="primary">
          //     {this.formatMessage(messages.submit)}
          //   </Button>
          // </div>
          null}
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(addNewConsultationDrawer);
