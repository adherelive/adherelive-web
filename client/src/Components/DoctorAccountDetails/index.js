import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import Button from "antd/es/button";
import Tooltip from "antd/es/tooltip";
import { DeleteTwoTone } from "@ant-design/icons";
import message from "antd/es/message";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../constant";
import messages from "./messages";
import confirm from "antd/es/modal/confirm";
import edit_image from "../../Assets/images/edit.svg";
import Loading from "../Common/Loading";

class DoctorAccountDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noAccountDetails: true,
      loading: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    const { account_details: prev_account_details = {} } = prevProps;
    const { account_details = {} } = this.props;
    if (
      Object.keys(account_details).length &&
      !Object.keys(prev_account_details).length
    ) {
      this.setState({ noAccountDetails: false });
    }
  }

  componentDidMount() {
    this.handleGetAccountDetails();
  }

  isDoctorRoleAssociatedWithProvider = () => {
    const { auth: { auth_role } = {}, user_roles = {} } = this.props;
    const { basic_info: { linked_with, linked_id } = {} } =
      user_roles[auth_role] || {};

    if (linked_id) {
      return linked_id;
    }
    return false;
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  async handleGetAccountDetails() {
    try {
      const { getAccountDetails } = this.props;
      this.setState({ loading: true });
      const provider_id = this.isDoctorRoleAssociatedWithProvider() || null;
      let response = {};

      if (provider_id) {
        response = await getAccountDetails(provider_id);
      } else {
        response = await getAccountDetails();
      }
      const {
        status,
        payload: { data: { users = {}, account_details = {} } = {} } = {},
        statusCode,
      } = response || {};

      if (status && Object.keys(account_details).length > 0) {
        this.setState({
          noAccountDetails: false,
        });
      }

      this.setState({ loading: false });
    } catch (err) {
      console.log("err ", err);
      this.setState({ loading: false });
      message.warn(this.formatMessage(messages.somethingWentWrong));
    }
  }

  getAddedAccountDetails = () => {
    const { account_details } = this.props;
    let details = [];

    const providerid = this.isDoctorRoleAssociatedWithProvider() || null;

    const accountDetails = Object.keys(account_details).map((account_id) => {
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
        } = {},
      } = account_details[account_id] || {};

      return (
        <div
          className={`relative br5 wp20 ml20 mt20 flex direction-column justify-center ${
            in_use ? "bg-lighter-blue" : "bg-lighter-grey"
          } account-details `}
          key={`account-detail-${id}`}
        >
          {/* customer_name */}
          <div className="mt10 ml10 flex direction-column align-start wp100">
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
            <span className="fs14">
              {this.formatMessage(messages.accountType)}
            </span>

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

          {!providerid && (
            <div className="flex  align-center justify-space-evenly wp100 mb10">
              <Tooltip
                placement={"bottom"}
                title={this.formatMessage(messages.editAccount)}
                className="account-details-edit"
              >
                <div
                  className="flex align-center justify-space-between w60 pointer"
                  onClick={this.displayEditRazorpayAccountDetails(id)}
                >
                  <div className="flex direction-column  align-center justify-center">
                    <img
                      src={edit_image}
                      className="pointer edit-patient-icon"
                    />
                  </div>
                  <div className="flex direction-column  align-center justify-center dark-sky-blue">
                    <span className="fs18 ">
                      {this.formatMessage(messages.editAccount)}
                    </span>
                  </div>
                </div>
              </Tooltip>
              {/* </div> */}
              <Tooltip
                className="absolute t10 r10 account-details-delete"
                title={this.formatMessage(messages.deleteAccount)}
              >
                <DeleteTwoTone
                  className={"pointer align-self-start "}
                  onClick={this.handleDelete(id)}
                  twoToneColor="#707070"
                  style={{ fontSize: "18px" }}
                />
              </Tooltip>
            </div>
          )}
        </div>
      );
    });

    return accountDetails;
  };

  displayEditRazorpayAccountDetails = (account_detail_id) => (e) => {
    e.preventDefault();
    console.log("328794682374672983042", { account_detail_id });
    const { openEditRazorpayAccountDetailsDrawer } = this.props;
    openEditRazorpayAccountDetailsDrawer({ account_detail_id });
  };

  handleDelete = (id) => (e) => {
    e.preventDefault();
    const { warnNote } = this;

    confirm({
      title: `${this.formatMessage(messages.warnNote)}`,
      content: <div>{warnNote()}</div>,
      onOk: async () => {
        try {
          const { deleteAccountDetails } = this.props;
          const response = await deleteAccountDetails(id);

          const {
            status,
            payload: { data: { users = {}, account_details = {} } = {} } = {},
            statusCode,
          } = response || {};

          if (status && Object.keys(account_details).length === 0) {
            this.setState({
              noAccountDetails: true,
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
      onCancel() {},
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

  displayRazorpayAccountDetails = () => {
    const { openRazorpayAccountDetailsDrawer } = this.props;
    openRazorpayAccountDetailsDrawer();
  };

  getAddAccountDetailsDisplay = () => {
    const providerid = this.isDoctorRoleAssociatedWithProvider();

    const { noAccountDetails = true } = this.state;

    if (providerid) {
      if (noAccountDetails) {
        return (
          <div className="flex align-center justify-center ">
            {this.formatMessage(messages.noPaymentDetailsHeader)}
          </div>
        );
      } else {
        return null;
      }
    }

    return (
      <Button
        type="dashed"
        className="p10 hauto w400 flex  align-center justify-center"
        onClick={this.displayRazorpayAccountDetails}
        icon={"plus"}
        value={this.formatMessage(messages.addAccountDetails)}
      >
        <div className="mr10 flex direction-column align-center justify-center hp100">
          <span className="fs20 fw700">
            {this.formatMessage(messages.addAccountDetails)}
          </span>
        </div>
      </Button>
    );
  };

  getPaymentDetails = () => {
    const { noAccountDetails = true } = this.state;

    return (
      <Fragment>
        <div className="flex align-center justify-center mt40">
          {this.getAddAccountDetailsDisplay()}
        </div>
        {!noAccountDetails && (
          <div className="wp100 flex flex-wrap">
            {this.getAddedAccountDetails()}
          </div>
        )}
      </Fragment>
    );
  };

  render() {
    const { loading = false } = this.state;

    if (loading) {
      return <Loading />;
    }
    // console.log("38271638726137612736721",{props:this.props});
    return <div>{this.getPaymentDetails()}</div>;
  }
}

export default injectIntl(DoctorAccountDetails);
