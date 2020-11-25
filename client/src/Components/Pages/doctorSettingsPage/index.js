import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import message from "antd/es/message";
import Button from "antd/es/button";
import Modal from "antd/es/modal";
import uuid from "react-uuid";
import { Avatar, Upload, Input, Select, Spin, DatePicker, Icon } from "antd";
import throttle from "lodash-es/throttle";
import { doRequest } from "../../../Helper/network";
import plus from "../../../Assets/images/plus.png";
import edit_image from "../../../Assets/images/edit.svg";
import { DeleteTwoTone, PlusOutlined } from "@ant-design/icons";
import confirm from "antd/es/modal/confirm";

// todo: import any component from antd using this format
import Tooltip from "antd/es/tooltip";

import {CONSULTATION_FEE, BILLING, PAYMENT_DETAILS, TABLE_DEFAULT_BLANK_FIELD} from "../../../constant";

import AddConsultationFeeDrawer from "../../../Containers/Drawer/addConsultationFee";
import AddAccountDetailsDrawer from "../../../Containers/Drawer/addAccountDetailsDrawer";
import EditAccountDetailsDrawer from "../../../Containers/Drawer/editAccountDetailsDrawer";

import ConsultationFeeTable from "./consultationFeeTable/index";

import {
  BarChartOutlined,
  CreditCardOutlined,
  WalletOutlined
} from "@ant-design/icons";

import moment from "moment";
import messages from "./messages";
import { PATH, CONSULTATION_FEE_TYPE_TEXT } from "../../../constant";
import { PageLoading } from "../../../Helper/loading/pageLoading";
import { withRouter } from "react-router-dom";

const { Option } = Select;

class DoctorSettingsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingDoctorPayments: false,
      defaultPaymentsProducts: {},
      doctorPaymentProducts: {},
      noDoctorPaymentProducts: true,
      isUpdated: false,
      selectedKey: PAYMENT_DETAILS,
      noAccountDetails: true,
      account_details: {},
      editDetailsSelectedID: null
    };
  }

  componentDidMount() {
    const { history } = this.props;
    history.push(PATH.CONSULTATION_FEE);
    this.handleGetDoctorPaymentProduct();
    this.handleGetAdminPaymentProduct();
    this.handleGetAccountDetails();
  }

  componentDidUpdate(prevProps, prevState) {
    const { noAccountDetails: prev_noAccountDetails } = prevState;
    const { noAccountDetails } = this.state;
    if (prev_noAccountDetails !== noAccountDetails) {
      this.handleGetAccountDetails();
    }
  }

  updateAccountDetailsAdded = () => {
    // this.setState({
    //     noAccountDetails : false,
    //     // isUpdated:true
    // })
    this.handleGetAccountDetails();
  };

  formatMessage = data => this.props.intl.formatMessage(data);

  setIsUpdated = () => {
    this.setState({ isUpdated: true });
    this.handleGetDoctorPaymentProduct();
  };

  async handleGetDoctorPaymentProduct() {
    try {
      this.setState({ fetchingDoctorPayments: true });
      const { getDoctorPaymentProduct } = this.props;
      const response = await getDoctorPaymentProduct();
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

  displayAddDoctorPaymentProduct = () => {
    const { openConsultationFeeDrawer } = this.props;
    openConsultationFeeDrawer();
  };

  displayRazorpayAccountDetails = () => {
    const { openRazorpayAccountDetailsDrawer } = this.props;
    openRazorpayAccountDetailsDrawer();
  };

  displayEditRazorpayAccountDetails = fetchedAccountDetails_id => () => {
    const { openEditRazorpayAccountDetailsDrawer } = this.props;
    this.setState({ editDetailsSelectedID: fetchedAccountDetails_id });
    openEditRazorpayAccountDetailsDrawer();
  };

  getConsultationFeesHeader = () => {
    // const { id, doctors, users } = this.props;
    const { formatMessage, handleBack } = this;

    return (
      <div className="wp100 mb20 fs25 fw700 flex justify-start align-center">
        <BarChartOutlined className="mr10" />

        <div>{formatMessage(messages.doctorConsultationFeesHeader)}</div>
      </div>
    );
  };

  getBillingHeader = () => {
    // const { id, doctors, users } = this.props;
    const { formatMessage, handleBack } = this;

    return (
      <div className="wp100 mb20 fs25 fw700 flex justify-start align-center">
        <CreditCardOutlined className="mr10" />

        <div>{formatMessage(messages.doctorBillingHeader)}</div>
      </div>
    );
  };

  getPaymentDetailsHeader = () => {
    const { formatMessage, handleBack } = this;

    return (
      <div className="wp100 mb20 fs25 fw700 flex justify-start align-center">
        <WalletOutlined className="mr10" />

        <div>{formatMessage(messages.paymentDetailsHeader)}</div>
      </div>
    );
  };

  noConsultationFeeDisplay = () => {
    return (
      <div className="w700 mb20 flex direction-column align-center justify-center">
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

  getAddAccountDetailsDisplay = () => {

    return (
      <Button
        type="dashed"
        className="p10 hauto w400 flex  align-center justify-center"
        onClick={this.displayRazorpayAccountDetails}
        icon={"plus"}
        value={this.formatMessage(messages.addAccountDetails)}
      >
        {/* <div className="flex direction-column align-center justify-center hp100">
          <img src={plus} className={"w20 h20 mr10 "} />
        </div> */}
        <div className="mr10 flex direction-column align-center justify-center hp100">
          <span className="fs20 fw700">
            {this.formatMessage(messages.addAccountDetails)}
          </span>
        </div>
      </Button>
    );
  };

  async handleGetAccountDetails() {
    try {
      const { getAccountDetails } = this.props;
      const response = await getAccountDetails();
      const {
        status,
        payload: { data: { users = {}, account_details = {} } = {} } = {},
        statusCode
      } = response || {};

      if (status && Object.keys(account_details).length > 0) {
        this.setState({
          account_details,
          noAccountDetails: false
        });

        // const {basic_info : {id='',customer_name='',account_number='',ifsc_code='',account_type='',account_mobile_number='',in_use=false,prefix='',upi_id=null} = {} } = Object.values(account_details)[0] || {};
      }
    } catch (err) {
      console.log("err ", err);
      message.warn(this.formatMessage(messages.somethingWentWrong));
    }
  }

  getAddUPIDetailsDisplay = () => {
    return (
      <Button
        type="ghost"
        className=" p10 w400 hauto flex  align-center justify-center"
        onClick={this.displayRazorpayAccountDetails}
      >
        <div className="flex direction-column align-center justify-center hp100">
          <img src={plus} className={"w22 h22 mr10 "} />
        </div>
        <div className="flex direction-column align-center justify-center hp100">
          <span className="fs22 fw700">
            {" "}
            {this.formatMessage(messages.addUPIDetails)}
          </span>
        </div>
      </Button>
    );
  };

  displayDoctorPaymentProducts = () => {
    const { doctorPaymentProducts } = this.state;
    let options = [];

    for (let each in doctorPaymentProducts) {
      const {
        basic_info: { id = null, name = "", type = "", amount = "" } = {}
      } = doctorPaymentProducts[each] || {};
      options.push(
        <div
          key={id}
          //  value={id}
          // onClick={this.setselectedFeeRadio}
          className="p20 br3 mt10 mb10 br-lightpink w500  flex direction-column ant-radio-settings-page tal bg-white"
        >
          <div>
            <span className="fs20 fw600 mt5 mb5"> {name}</span>
            <div className="wp100 flex justify-end">
              <DeleteTwoTone
                className={"pointer align-self-end"}
                onClick={this.deleteDoctorProduct(id, name, type, amount)}
                twoToneColor="#cc0000"
                style={{ fontSize: "24px" }}
              />
            </div>
          </div>
          {/* <br></br> */}
          <span className="mt5 mb5"> {CONSULTATION_FEE_TYPE_TEXT[type]}</span>
          {/* <br></br> */}
          <span className="fs20 mt5 mb5 br3 fw600 p5 pl10 br-brown-grey">
            {amount}
          </span>
        </div>
      );
    }

    return options;
  };

  handleItemSelect = key => () => {
    const {
      users,
      history,
      authenticated_category,
      authenticated_user,
      authPermissions = []
    } = this.props;
    const current_user = users[authenticated_user];
    const { onboarded } = current_user;
    switch (key) {
      case CONSULTATION_FEE:
        if (onboarded) {
          history.push(PATH.CONSULTATION_FEE);
        }
        break;
      case BILLING:
        if (onboarded) {
          history.push(PATH.BILLING);
        }
        break;
      case PAYMENT_DETAILS:
        if (onboarded) {
          history.push(PATH.PAYMENT_DETAILS);
        }
        break;

      default:
        history.push(PATH.LANDING_PAGE);
        break;
    }
    this.setState({ selectedKey: key });
  };

  consultationFeeDisplay = () => {
    const {
      noDoctorPaymentProducts,
      selectedKey,
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
                      {this.formatMessage(messages.addMore)}
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

  deleteAccountDetails = id => {
    this.handleDelete(id);
  };

  deleteAccountDetails = (id) => () => {

    this.handleDelete(id);

}



  handleDelete = id => {
    // e.preventDefault();
    const { warnNote } = this;


    confirm({
      title: `${this.formatMessage(messages.warnNote)}`,
      content: (
        <div>
          {warnNote()}
        </div>
      ),
      onOk: async () => {
        try {
                  const { deleteAccountDetails } = this.props;
                  const response = await deleteAccountDetails(id);
            
                  const {
                    status,
                    payload: { data: { users = {}, account_details = {} } = {} } = {},
                    statusCode
                  } = response || {};
            
                  if (status && Object.keys(account_details).length === 0) {
                    this.setState({
                      noAccountDetails: true
                    });
                  }
            
                  if (status) {
                    this.setState({ account_details });
                    message.success(
                      this.formatMessage(messages.accountDetailsDeleteSuccess)
                    );
                  }
                } catch (err) {
                  console.log("err ", err);
                  message.warn(this.formatMessage(messages.somethingWentWrong));
                }
      },
      onCancel() { }
    });
  };


  warnNote = () => {
    return (
      <div className="pt16">
        <p>
          <span className="fw600">{"Note"}</span>
          {` :${this.formatMessage(messages.irreversibleWarn)} `}
        </p>
      </div>
    );
  };




  getAddedAccountDetails = () => {
    const { account_details } = this.state;
    let details = [];

    const accountDetails = Object.keys(account_details).map(account_id => {
        const {
            basic_info: {
                id,
                customer_name,
                account_number,
                ifsc_code,
                account_type,
                account_mobile_number,
                prefix,
                upi_id,
                in_use = false,
            } = {}
        } = account_details[account_id] || {};

        return (
          <div
            className={`relative br5 wp30 ml20 mt20 flex direction-column justify-center ${
              in_use ? "bg-lighter-blue" : "bg-lighter-grey"
            }`}
            key={`account-detail-${id}`}
          >
            {/* customer_name */}
            <div className="mt10 ml10 flex direction-column align-start wp90">
              <span className="fs14">
                {this.formatMessage(messages.linkedAccountName)}
              </span>

              <span className="fs18 fw700">
                <span>
                  {customer_name ? customer_name : TABLE_DEFAULT_BLANK_FIELD}
                </span>
              </span>
            </div>

            {/* mobile_number */}
            <div className="mt10 mb10 ml10 flex direction-column align-start wp90">
              <span className="fs14">
                {this.formatMessage(messages.contactNumber)}
              </span>

              <span className="fs18 fw700">
                <span>
                  {`+${prefix ? prefix : TABLE_DEFAULT_BLANK_FIELD}-${
                    account_mobile_number
                      ? account_mobile_number
                      : TABLE_DEFAULT_BLANK_FIELD
                  }`}
                </span>
              </span>
            </div>

            {/* account_number */}
            <div className="mt10 mb10 ml10 flex direction-column align-start wp90">
              <span className="fs14">
                {this.formatMessage(messages.accountNumber)}
              </span>

              <span className="fs18 fw700">
                <span>
                  {account_number ? account_number : TABLE_DEFAULT_BLANK_FIELD}
                </span>
              </span>
            </div>

            {/* ifsc_code */}
            <div className="mt10 mb10 ml10 flex direction-column align-start wp90">
              <span className="fs14">{this.formatMessage(messages.ifsc)}</span>

              <span className="fs18 fw700">
                <span>{ifsc_code ? ifsc_code : TABLE_DEFAULT_BLANK_FIELD}</span>
              </span>
            </div>

            {/* account_type */}
            <div className="mt10 mb10 ml10 flex direction-column align-start wp90">
              <span className="fs14">{this.formatMessage(messages.accountType)}</span>

              <span className="fs18 fw700">
                <span>
                  {account_type ? account_type : TABLE_DEFAULT_BLANK_FIELD}
                </span>
              </span>
            </div>

            {/* upi_id */}
            <div className="mt10 mb10 ml10 flex direction-column align-start wp90">
              <span className="fs14">{this.formatMessage(messages.upiId)}</span>

              <span className="fs18 fw700">
                <span>{upi_id ? upi_id : TABLE_DEFAULT_BLANK_FIELD}</span>
              </span>
            </div>
              
            <div className="flex  align-center justify-space-evenly wp100 mb10">
           
              <Tooltip placement={"bottom"} title={this.formatMessage(messages.editAccount)}>
                 <div className="flex align-center justify-space-between w60 pointer" onClick={this.displayEditRazorpayAccountDetails(id)} >
                   
                    <div className="flex direction-column  align-center justify-center" >
                    <img src={edit_image} className="pointer edit-patient-icon" />
                    </div>
                    <div className="flex direction-column  align-center justify-center dark-sky-blue" >
                    <span className="fs18 " >{this.formatMessage(messages.editAccount)}</span>
                    </div>
                 </div>
              </Tooltip>
              {/* </div> */}
              <Tooltip className="absolute t10 r10"  title={this.formatMessage(messages.deleteAccount)}>
              <DeleteTwoTone
                className={"pointer align-self-start"}
                onClick={this.deleteAccountDetails(id)}
                twoToneColor="#707070"
                style={{ fontSize: "18px" }}
              />
              </Tooltip>
            </div>
          </div>
        );
    });

    return accountDetails;

   
   

  };

  getPaymentDetails = () => {
    const { noAccountDetails } = this.state;

    if (noAccountDetails) {
      // add custom message here centered
      return (<div className="flex align-center justify-center mt40">
      {this.getAddAccountDetailsDisplay()}
    </div>);
    }

    return (
      <Fragment>
        <div className="flex align-center justify-center mt40">
          {this.getAddAccountDetailsDisplay()}
        </div>
        <div className="wp100 flex flex-wrap">
          {this.getAddedAccountDetails()}
        </div>
      </Fragment>
    );
  };

  render() {
    const {
      noDoctorPaymentProducts,
      selectedKey,
      doctorPaymentProducts
    } = this.state;
    const { getPaymentDetails } = this;

    return (
      <Fragment>
        {/************************* HEADER *************************/}
        <div className="wp100 ml20 mt20 fs28 fw700 flex justify-start align-center">
          {this.formatMessage(messages.doctor_settings_header_text)}
        </div>

        {/************************* SIDEBAR *************************/}
        <div className="wp100 p20 flex ">
          <div className=" bg-grey h250 p20 wp30 flex direction-column ">
            <div
              className="fs20 fw700 mb14 h-cursor-p"
              onClick={this.handleItemSelect(CONSULTATION_FEE)}
            >
              {this.getConsultationFeesHeader()}
            </div>
            <div
              className="fs20 fw700 mb14 h-cursor-p"
              onClick={this.handleItemSelect(BILLING)}
            >
              {this.getBillingHeader()}
            </div>
            <div
              className="fs20 fw700 mb14 h-cursor-p"
              onClick={this.handleItemSelect(PAYMENT_DETAILS)}
            >
              {this.getPaymentDetailsHeader()}
            </div>
          </div>

          {/************************* SIDEBAR RELATED CONTENTS *************************/}
          {selectedKey === CONSULTATION_FEE && this.consultationFeeDisplay()}


          {selectedKey === BILLING && (
            <div className="wp70 flex direction-column justify-space-between">
              <div className="flex direction-column align-center justify-center">
              {this.formatMessage(messages.billingDisplay)}
              </div>
            </div>
          )}

          {selectedKey === PAYMENT_DETAILS && (
            <div className="wp70 ml10 mr10 flex direction-column justify-space-between">
              {getPaymentDetails()}
            </div>
          )}
        </div>

        <AddConsultationFeeDrawer
          defaultPaymentsProducts={this.state.defaultPaymentsProducts}
          setIsUpdated={this.setIsUpdated}
        />

        <AddAccountDetailsDrawer
          defaultPaymentsProducts={this.state.defaultPaymentsProducts}
          setIsUpdated={this.setIsUpdated}
          updateAccountDetailsAdded={this.updateAccountDetailsAdded}
        />

        <EditAccountDetailsDrawer
          editDetailsSelectedID={this.state.editDetailsSelectedID}
          defaultPaymentsProducts={this.state.defaultPaymentsProducts}
          setIsUpdated={this.setIsUpdated}
          updateAccountDetailsAdded={this.updateAccountDetailsAdded}
        />
      </Fragment>
    );
  }
}

export default withRouter(injectIntl(DoctorSettingsPage));
