import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import message from "antd/es/message";
import Button from "antd/es/button";

import AddConsultationFeeDrawer from "../../../Containers/Drawer/addConsultationFee";

import ConsultationFeeTable from "../doctorSettingsPage/consultationFeeTable/index";

import plus from "../../../Assets/images/plus.png";
import messages from "./messages";
import { ArrowLeftOutlined } from "@ant-design/icons";

class ProviderDoctorPaymentProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingDoctorPayments: false,
      defaultPaymentsProducts: {},
      doctorPaymentProducts: {},
      noDoctorPaymentProducts: true,
      isUpdated: false,
      // selectedKey: PAYMENT_DETAILS,
      noAccountDetails: true,
      account_details: {},
      editDetailsSelectedID: null
    };
  }

  componentDidMount() {
    const { match: { params: { id = null } = {} } = {} } = this.props;
    this.handleGetDoctorPaymentProduct(id);
    this.handleGetAdminPaymentProduct();
  }

  async handleGetDoctorPaymentProduct(id) {
    try {
      this.setState({ fetchingDoctorPayments: true });
      const { getDoctorPaymentProduct } = this.props;
      const response = await getDoctorPaymentProduct({ doctor_id: id });
      const {
        status,
        payload: { data: { payment_products = {} } = {} } = {},
        statusCode
      } = response || {};
      if (status && statusCode === 200) {
        this.setState({
          fetchingDoctorPayments: false,
          doctorPaymentProducts: payment_products,
          noDoctorPaymentProducts: false
        });
      } else if (!status && statusCode === 201) {
        this.setState({
          fetchingDoctorPayments: false,
          doctorPaymentProducts: {},
          noDoctorPaymentProducts: true
        });
      } else {
        this.setState({ fetchingDoctorPayments: false });
      }
    } catch (err) {
      console.log("err ", err);
      message.warn(this.formatMessage(messages.somethingWentWrong));
      this.setState({ fetchingDoctorPayments: false });
    }
  }

  async handleGetAdminPaymentProduct() {
    try {
      this.setState({ fetchingAdminPayments: true });
      const { getAdminPaymentProduct, getDoctorPaymentProduct } = this.props;
      const response = await getAdminPaymentProduct();
      const { status, payload: { data: { payment_products = {} } = {} } = {} } =
        response || {};
      if (status) {
        this.setState({
          fetchingAdminPayments: false,
          defaultPaymentsProducts: payment_products
        });
      } else {
        this.setState({ fetchingAdminPayments: false });
      }
    } catch (err) {
      console.log("err ", err);
      message.warn(this.formatMessage(messages.somethingWentWrong));
      this.setState({ fetchingAdminPayments: false });
    }
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  setIsUpdated = () => {
    this.setState({ isUpdated: true });
    const { match: { params: { id = null } = {} } = {} } = this.props;
    this.handleGetDoctorPaymentProduct(id);
  };

  noConsultationFeeDisplay = () => {
    return (
      <div className="wp100 mb20 flex direction-column align-center justify-center">
        <div className="br-lightgrey h200 w200 br4"></div>
        <div className="mt20 fs25 fw700 black-85">
          {this.formatMessage(messages.noConsultationFeeAdded)}
        </div>
        <div className="mt20 fs18 fw600 ">
          {this.formatMessage(messages.notAddedFeesYet)}
        </div>

        <div className=" mt20">
          <Button type="primary" onClick={this.displayAddDoctorPaymentProduct}>
            <span className="w200 fs20">
              {this.formatMessage(messages.addFee)}
            </span>
            {/* Add */}
          </Button>
        </div>
      </div>
    );
  };

  consultationFeeDisplay = () => {
    const {
      noDoctorPaymentProducts,
      //   selectedKey,
      doctorPaymentProducts
    } = this.state;

    return (
      <div className="wp100 flex direction-column justify-space-between">
        <div className="wp100">
          {noDoctorPaymentProducts ? (
            <div className="wp100 justify-center align-center">
              {this.noConsultationFeeDisplay()}
            </div>
          ) : (
            <div className="wp100 pl20 pr20 flex direction-column align-center justify-center">
              {/* {this.displayDoctorPaymentProducts()} */}

              <ConsultationFeeTable
                doctorPaymentProducts={doctorPaymentProducts}
                deleteDoctorProduct={this.deleteDoctorProduct}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  displayAddDoctorPaymentProduct = () => {
    const { openConsultationFeeDrawer } = this.props;
    openConsultationFeeDrawer();
  };

  deleteDoctorProduct = (id, name, type, amount) => () => {
    this.handleDeleteDoctorPaymentProduct(id, name, type, amount);
  };

  async handleDeleteDoctorPaymentProduct(id, name, type, amount) {
    try {
      const { deleteDoctorPaymentProduct } = this.props;
      const payload = { id, name, type, amount };
      const response = await deleteDoctorPaymentProduct(payload);
      const {
        status,
        payload: { data: { payment_products = {} } = {} } = {},
        statusCode
      } = response || {};

      if (status) {
        this.setIsUpdated();
        // this.updateAccountDetailsAdded();
        message.success(
          this.formatMessage(messages.deleteDoctorProductSuccess)
        );
      }
    } catch (err) {
      console.log("err ", err);
      message.warn(this.formatMessage(messages.somethingWentWrong));
    }
  }

  renderHeader = () => {
    const { noDoctorPaymentProducts } = this.state;
    return (
      <div className="wp100 ml20 mt20 mb20 fs28 fw700 pr50 flex justify-space-between align-center">
        <div className="flex flex-start align-center">
          <ArrowLeftOutlined onClick={this.handleBack} className="mr10" />
          {this.formatMessage(messages.consultation_fee_header_text)}
        </div>

        {!noDoctorPaymentProducts && (
          <div className="flex flex-end align-center">
            <Button
              type="primary"
              className="ml10 add-button "
              icon={"plus"}
              onClick={this.displayAddDoctorPaymentProduct}
            >
              <span className="fs16">
                {this.formatMessage(messages.addMore)}
              </span>
            </Button>
          </div>
        )}
      </div>
    );
  };

  handleBack = e => {
    e.preventDefault();
    const { history } = this.props;
    history.goBack();
  };

  render() {
    const { match: { params: { id = null } = {} } = {} } = this.props;

    return (
      <Fragment>
        {this.renderHeader()}
        {this.consultationFeeDisplay()}
        <AddConsultationFeeDrawer
          defaultPaymentsProducts={this.state.defaultPaymentsProducts}
          setIsUpdated={this.setIsUpdated}
          doctor_id={id}
        />
      </Fragment>
    );
  }
}

export default injectIntl(ProviderDoctorPaymentProduct);
