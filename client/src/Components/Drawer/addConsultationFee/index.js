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
  DatePicker
} from "antd";
import { CONSULTATION_FEE_TYPE_TEXT } from "../../../constant";

import moment from "moment";
import throttle from "lodash-es/throttle";

import messages from "./message";

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
      selectedFeeRadio: ""
    };
  }

  componentDidMount() {
    // console.log("Drawer Props",this.props);
    // this.handleGetAdminPaymentProduct();
  }

  componentDidUpdate(prevProps, prevState) {
    const { selectedFeeRadio } = this.state;
    const { selectedFeeRadio: prev_selectedFeeRadio } = prevState;
    // console.log("current selectedFeeRadio =====================>",selectedFeeRadio);
    // console.log("prev selectedFeeRadio ------------------------->",prev_selectedFeeRadio);
    if (selectedFeeRadio !== prev_selectedFeeRadio) {
      this.setFieldValues();
    }
  }

  setFee = e => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === "") {
      this.setState({ newConsultationFee: e.target.value });
    }
  };

  setselectedFeeRadio = e => {
    e.preventDefault();
    let val = "1";
    val = e.target.value;
    console.log(typeof val);
    this.setState({ selectedFeeRadio: val });
  };

  setFieldValues = () => {
    const { selectedFeeRadio } = this.state;
    if (selectedFeeRadio === "1") {
      this.setState({
        newConsultationName: "Tele-Medicine",
        newConsultationType: "1",
        newConsultationTypeText: CONSULTATION_FEE_TYPE_TEXT["1"],
        newConsultationFee: ""
      });
    } else if (selectedFeeRadio === "2") {
      this.setState({
        newConsultationName: "Offline Consultation",
        newConsultationType: "1",
        newConsultationTypeText: CONSULTATION_FEE_TYPE_TEXT["1"],
        newConsultationFee: ""
      });
    } else if (selectedFeeRadio === "3") {
      this.setState({
        newConsultationName: "Adherence Monitoring",
        newConsultationType: "2",
        newConsultationTypeText: CONSULTATION_FEE_TYPE_TEXT["2"],
        newConsultationFee: ""
      });
    }
  };

  getConsultationOptions = () => {
    const { defaultPaymentsProducts } = this.props;
    let options = [];

    for (let each in defaultPaymentsProducts) {
      const { basic_info: { id = null, name = "", type = "" } = {} } =
        defaultPaymentsProducts[each] || {};
      options.push(
        <RadioButton
          key={id}
          value={id}
          onClick={this.setselectedFeeRadio}
          className="mt10 mb10 flex direction-column ant-radio-settings-page tac"
        >
          <div>
            <span className="fs20 fw600"> {name}</span>
            <br></br>
            {CONSULTATION_FEE_TYPE_TEXT[type]}
          </div>
        </RadioButton>
      );
    }

    return options;
  };

  setConsultationName = e => {
    e.preventDefault();
    const { value } = e.target;
    const reg = /^[a-zA-Z][a-zA-Z\s-]*$/;
    if (reg.test(value) || value === "") {
      this.setState({ newConsultationName: e.target.value });
    }
  };

  renderAddNewConsultationFee = () => {
    const {
      selectedFeeRadio = "",
      newConsultationName = "",
      newConsultationType = "",
      newConsultationTypeText = "",
      newConsultationFee = ""
    } = this.state;
    return (
      <div className="form-block-ap">
        <div
          className="form-headings
                //    flex align-center justify-start
                   tac"
        >
          <span className="fwbolder fs22 ">
            {this.formatMessage(messages.defaultConsultationOptions)}
          </span>
        </div>

        <div>
          <RadioGroup
            className="flex direction-column justify-content-end radio-formulation mt10 mb24"
            buttonStyle="solid"
            size="large"
          >
            {this.getConsultationOptions()}
          </RadioGroup>
        </div>

        <div>
          {selectedFeeRadio !== "" ? (
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
      newConsultationFee = ""
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
      newConsultationFee = ""
    } = this.state;
    const validate = this.validateData();
    const { submit } = this.props;

    const { doctor_id = null } = this.props;
    if (validate) {
      let toSubmitData = {
        name: newConsultationName,
        type: newConsultationType,
        amount: newConsultationFee
      };

      if (doctor_id) {
        toSubmitData = { ...toSubmitData, doctor_id };
      }

      this.handleSubmit(toSubmitData);
    }
  };

  async handleSubmit(data) {
    try {
      const { addDoctorPaymentProduct, setIsUpdated } = this.props;
      const { close } = this.props;
      const response = await addDoctorPaymentProduct(data);
      const {
        status,
        payload: {
          data: { payment_products = {}, message: payload_message = "" } = {}
        } = {}
      } = response || {};
      if (status) {
        message.success(this.formatMessage(messages.ConsultationFeeAddSuccess));
        setIsUpdated();
        this.onClose();
      } else {
        message.warn(payload_message);
      }
    } catch (err) {
      console.log("err ", err);
      message.warn(this.formatMessage(messages.somethingWentWrong));
    }
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  onClose = () => {
    const { close } = this.props;
    this.setState({
      newConsultationName: "",
      newConsultationType: "",
      newConsultationTypeText: "",
      newConsultationFee: "",
      fetchingAdminPayments: false,
      selectedFeeRadio: ""
    });
    close();
  };

  render() {
    console.log();
    const { visible } = this.props;
    const { onClose, renderAddNewConsultationFee } = this;

    if (visible !== true) {
      return null;
    }
    return (
      <Fragment>
        <Drawer
          title={this.formatMessage(messages.addConsultationFee)}
          placement="right"
          maskClosable={false}
          headerStyle={{
            position: "sticky",
            zIndex: "9999",
            top: "0px"
          }}
          destroyOnClose={true}
          onClose={onClose}
          visible={visible} // todo: change as per state, -- WIP --
          width={400}
        >
          {renderAddNewConsultationFee()}

          {this.state.selectedFeeRadio !== "" ? (
            <div className="add-patient-footer">
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                {this.formatMessage(messages.cancel)}
              </Button>
              <Button onClick={this.onSubmit} type="primary">
                {this.formatMessage(messages.submit)}
              </Button>
            </div>
          ) : null}
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(addNewConsultationDrawer);
