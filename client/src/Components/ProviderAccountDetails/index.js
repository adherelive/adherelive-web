import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import Button from "antd/es/button";
import message from "antd/es/message";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../constant";
import messages from "./messages";

class ProviderAccountDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      noAccountDetails: true,
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

  formatMessage = (data) => this.props.intl.formatMessage(data);

  async handleGetAccountDetails() {
    try {
      const {
        getAccountDetails,
        providers = {},
        authenticated_user = {},
      } = this.props;
      let provider_id = null;

      for (let each in providers) {
        const { basic_info: { user_id = null } = {} } = providers[each] || {};
        if (user_id.toString() === authenticated_user.toString()) {
          provider_id = each;
          break;
        }
      }

      const response = await getAccountDetails(provider_id);

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
    } catch (err) {
      console.log("err ", err);
      message.warn(this.formatMessage(messages.somethingWentWrong));
    }
  }

  getAddedAccountDetails = () => {
    const { account_details } = this.props;
    let details = [];

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
        </div>
      );
    });

    return accountDetails;
  };

  getPaymentDetails = () => {
    const { noAccountDetails } = this.state;

    if (noAccountDetails) {
      return (
        <div className="flex align-center justify-center mt40">
          {this.formatMessage(messages.noPaymentDetailsHeader)}
        </div>
      );
    }

    return (
      <Fragment>
        <div className="wp100 flex direction-column">
          <div className="p18 fs30 fw700 ">
            {this.formatMessage(messages.paymentDetailsHeader)}
          </div>
          <div className="wp100 flex flex-wrap">
            {this.getAddedAccountDetails()}
          </div>
        </div>
      </Fragment>
    );
  };

  render() {
    return <div>{this.getPaymentDetails()}</div>;
  }
}

export default injectIntl(ProviderAccountDetails);
