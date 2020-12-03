import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import Button from "antd/es/button";

import AddConsultationFeeDrawer from "../../../Containers/Drawer/addConsultationFee";

import ConsultationFeeTable from "../doctorSettingsPage/consultationFeeTable/index";

import plus from "../../../Assets/images/plus.png";

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
    // const { history } = this.props;
    const { match: { params: { id = null } = {} } = {} } = this.props;
    console.log("Id got in the provider doctor payment product is: ", id);
    // history.push(PATH.CONSULTATION_FEE);
    this.handleGetDoctorPaymentProduct(id);
    this.handleGetAdminPaymentProduct();
    // this.handleGetAccountDetails();
  }

  async handleGetDoctorPaymentProduct(id) {
    try {
      this.setState({ fetchingDoctorPayments: true });
      const { getDoctorPaymentProduct } = this.props;
      console.log("sending the doctor payment product id is: ", id);
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
      //   message.warn(this.formatMessage(messages.somethingWentWrong));
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
      //   message.warn(this.formatMessage(messages.somethingWentWrong));
      this.setState({ fetchingAdminPayments: false });
    }
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  setIsUpdated = () => {
    this.setState({ isUpdated: true });
    this.handleGetDoctorPaymentProduct();
  };

  noConsultationFeeDisplay = () => {
    return (
      <div className="w700 mb20 flex direction-column align-center justify-center">
        <div className="br-lightgrey h200 w200 br4"></div>
        <div className="mt20 fs25 fw700 black-85">
          {/* {this.formatMessage(messages.noConsultationFeeAdded)} */}
          No Consultation fee added
        </div>
        <div className="mt20 fs18 fw600 ">
          {/* {this.formatMessage(messages.notAddedFeesYet)} */}
          second line
        </div>

        <div className=" mt20">
          <Button type="primary" onClick={this.displayAddDoctorPaymentProduct}>
            <span className="w200 fs20">
              {/* {this.formatMessage(messages.addFee)} */}
              Add Fee
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
      <div className="wp70 flex direction-column justify-space-between">
        <div>
          {noDoctorPaymentProducts ? (
            <div>{this.noConsultationFeeDisplay()}</div>
          ) : (
            <div className="flex direction-column align-center justify-center">
              {/* {this.displayDoctorPaymentProducts()} */}

              <ConsultationFeeTable
                doctorPaymentProducts={doctorPaymentProducts}
                deleteDoctorProduct={this.deleteDoctorProduct}
              />

              <div className=" mt20 mr300 wp100 flex  justify-end">
                <Button
                  type="ghost"
                  className=" p10 w200 hauto flex  align-center justify-center"
                  onClick={this.displayAddDoctorPaymentProduct}
                >
                  <div className="flex direction-column align-center justify-center hp100">
                    <img src={plus} className={"w22 h22 mr10 "} />
                  </div>
                  <div className="flex direction-column align-center justify-center hp100">
                    <span className="fs22 fw700">
                      {" "}
                      {/* {this.formatMessage(messages.addMore)} */}
                      Add More
                    </span>
                  </div>
                </Button>
              </div>
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
        // message.success(
        //   this.formatMessage(messages.deleteDoctorProductSuccess)
        // );
      }
    } catch (err) {
      console.log("err ", err);
      //   message.warn(this.formatMessage(messages.somethingWentWrong));
    }
  }

  render() {
    // const { id, doctors, users } = this.props;
    // const {basic_info: {user_id} = {}} = doctors[id] || {};

    return (
      <Fragment>
        <AddConsultationFeeDrawer
          defaultPaymentsProducts={this.state.defaultPaymentsProducts}
          setIsUpdated={this.setIsUpdated}
        />
      </Fragment>
    );
  }
}

export default injectIntl(ProviderDoctorPaymentProduct);
