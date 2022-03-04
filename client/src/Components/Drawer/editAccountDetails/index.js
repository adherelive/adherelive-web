import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import {
  Drawer,
  Icon,
  Select,
  Input,
  Button,
  Spin,
  Radio,
  DatePicker,
  Checkbox,
} from "antd";
import message from "antd/es/message";
import {
  CONSULTATION_FEE_TYPE_TEXT,
  SAVINGS,
  CURRENT,
  ACCOUNT_TYPES,
} from "../../../constant";

import moment from "moment";
import throttle from "lodash-es/throttle";
import india from "../../../Assets/images/india.png";
import australia from "../../../Assets/images/australia.png";
import us from "../../../Assets/images/flag.png";
import uk from "../../../Assets/images/uk.png";
import russia from "../../../Assets/images/russia.png";
import germany from "../../../Assets/images/germany.png";
import southAfrica from "../../../Assets/images/south-africa.png";
import pakistan from "../../../Assets/images/pakistan.png";
import bangladesh from "../../../Assets/images/bangladesh.png";
import japan from "../../../Assets/images/japan.png";
import china from "../../../Assets/images/china.png";
import switzerland from "../../../Assets/images/switzerland.png";
import france from "../../../Assets/images/france.png";
import TextArea from "antd/lib/input/TextArea";

import messages from "./message";
import Footer from "../footer";

const { Option } = Select;

const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class editAccountDetailsDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accountDetailsId: "",
      customer_name: "",
      account_mobile_number: "",
      prefix: "91",
      account_number: "",
      ifsc_code: "",
      account_type: "",
      use_as_main: true,
      upi_id: null,
      account_details: {},
      submitting: false,
    };
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {
    const { visible: prev_visible } = prevProps;
    const { visible } = this.props;
    const { account_details = {} } = this.props;
    console.log("edit props", this.props);
    if (prev_visible !== visible) {
      this.handleGetAccountDetails();
    }
  }

  async handleGetAccountDetails() {
    try {
      const {
        payload: { account_detail_id: editDetailsSelectedID = null } = {},
      } = this.props;
      const { getAccountDetails } = this.props;
      const response = await getAccountDetails();
      const {
        status,
        payload: { data: { users = {}, account_details = {} } = {} } = {},
        statusCode,
      } = response || {};

      if (status && Object.keys(account_details).length > 0) {
        this.setState({ account_details });

        const {
          basic_info: {
            id = "",
            customer_name = "",
            account_number = "",
            ifsc_code = "",
            account_type = "",
            account_mobile_number = "",
            in_use = false,
            prefix = "",
            upi_id = null,
          } = {},
        } = account_details[editDetailsSelectedID] || {};
        this.setState({
          accountDetailsId: id,
          customer_name,
          account_mobile_number,
          prefix,
          account_number,
          ifsc_code,
          account_type,
          use_as_main: in_use,
          upi_id,
        });
      }
    } catch (err) {
      console.log("err ", err);
      message.warn(this.formatMessage(messages.somethingWentWrong));
    }
  }

  setLinkedAccountName = (e) => {
    e.preventDefault();
    const { value } = e.target;
    const reg = /^[a-zA-Z][a-zA-Z\s]*$/;
    if (reg.test(value) || value === "") {
      this.setState({ customer_name: e.target.value });
    }
  };

  setPhoneNumber = (e) => {
    e.preventDefault();
    const { value } = e.target;

    this.setState({ account_mobile_number: e.target.value });
  };

  setAccountNumber = (e) => {
    e.preventDefault();
    const { value } = e.target;
    this.setState({ account_number: value });
  };

  setAccountType = (value) => {
    this.setState({ account_type: value });
  };

  setPrefix = (value) => {
    this.setState({ prefix: value });
  };

  set_ifsc_code = (e) => {
    e.preventDefault();
    const { value } = e.target;
    this.setState({ ifsc_code: value });
  };

  setMain = (e) => {
    e.preventDefault();
    const { use_as_main } = this.state;
    if (use_as_main) {
      this.setState({ use_as_main: false });
    } else {
      this.setState({ use_as_main: true });
    }
  };

  setUPIidValue = (e) => {
    e.preventDefault();
    const { value } = e.target;
    this.setState({ upi_id: value });
  };

  renderAddAccountDetailsForm = () => {
    const {
      customer_name = "",
      account_mobile_number = "",
      prefix = "91",
      account_type = "",
      ifsc_code = "",
      account_number = "",
      use_as_main = true,
      upi_id = null,
    } = this.state;

    const prefixSelector = (
      <Select
        className="flex align-center h50 w80"
        value={prefix}
        onChange={this.setPrefix}
      >
        {/* india */}
        <Option value="91">
          <div className="flex align-center">
            <img src={india} className="w16 h16" />
            <div className="ml4">+91</div>
          </div>
        </Option>
        {/* australia */}
        <Option value="61">
          <div className="flex align-center">
            <img src={australia} className="w16 h16" />
            <div className="ml4">+61</div>
          </div>
        </Option>
        {/* us */}
        <Option value="1">
          <div className="flex align-center">
            <img src={us} className="w16 h16" />
            <div className="ml4">+1</div>
          </div>
        </Option>
        {/* uk */}
        <Option value="44">
          <div className="flex align-center">
            <img src={uk} className="w16 h16" />
            <div className="ml4">+44</div>
          </div>
        </Option>
        {/* china */}
        <Option value="86">
          <div className="flex align-center">
            <img src={china} className="w16 h16" />
            <div className="ml4">+86</div>
          </div>
        </Option>
        {/* japan */}
        <Option value="81">
          <div className="flex align-center">
            <img src={japan} className="w16 h16" />
            <div className="ml4">+81</div>
          </div>
        </Option>
        {/* germany */}
        <Option value="49">
          <div className="flex align-center">
            <img src={germany} className="w16 h16" />
            <div className="ml4">+49</div>
          </div>
        </Option>
        {/* france */}
        <Option value="33">
          <div className="flex align-center">
            <img src={france} className="w16 h16" />
            <div className="ml4">+33</div>
          </div>
        </Option>
        {/* switzerland */}
        <Option value="41">
          <div className="flex align-center">
            <img src={switzerland} className="w16 h16" />
            <div className="ml4">+41</div>
          </div>
        </Option>

        {/* russia */}
        <Option value="7">
          <div className="flex align-center">
            <img src={russia} className="w16 h16" />
            <div className="ml4">+7</div>
          </div>
        </Option>
        {/* south africa */}
        <Option value="27">
          <div className="flex align-center">
            <img src={southAfrica} className="w16 h16" />
            <div className="ml4">+27</div>
          </div>
        </Option>
        {/* pakistan */}
        <Option value="92">
          <div className="flex align-center">
            <img src={pakistan} className="w16 h16" />
            <div className="ml4">+92</div>
          </div>
        </Option>
        {/* bangladesh */}
        <Option value="880">
          <div className="flex align-center">
            <img src={bangladesh} className="w16 h16" />
            <div className="ml4">+880</div>
          </div>
        </Option>
      </Select>
    );

    return (
      <div className="form-block-ap">
        <div
          className="form-headings
                //    flex align-center justify-start
                   tac"
        >
          <span className="fwbolder fs22 mb20 ">
            {this.formatMessage(messages.primaryDetails)}
          </span>
        </div>

        <div>
          <div className="form-headings flex align-center justify-start">
            {this.formatMessage(messages.linkedAccountName)}
            <div className="star-red">*</div>
          </div>

          <Input
            className={"form-inputs-ap"}
            value={customer_name}
            onChange={this.setLinkedAccountName}
            type="string"
          />

          <div className="form-headings flex align-center justify-start">
            {this.formatMessage(messages.contactNumber)}
            <div className="star-red">*</div>
          </div>

          <Input
            addonBefore={prefixSelector}
            className={"form-inputs-ap"}
            value={account_mobile_number}
            onChange={this.setPhoneNumber}
            minLength={6}
            maxLength={20}
            type="number"
          />
        </div>
        <div
          className="form-headings
                    //    flex align-center justify-start
                    tac"
        >
          <span className="fwbolder fs22 mb20 ">
            {this.formatMessage(messages.bankDetails)}
          </span>
        </div>
        <div>
          <div className="form-headings flex align-center justify-start">
            {this.formatMessage(messages.accountNumber)}
            <div className="star-red">*</div>
          </div>

          <Input
            className={"form-inputs-ap"}
            value={account_number}
            onChange={this.setAccountNumber}
            type="number"
            maxLength={500}
          />

          <div className="form-headings flex align-center justify-start">
            {this.formatMessage(messages.accountType)}
            <div className="star-red">*</div>
          </div>

          <div className="add-patient-radio  wp100 mt6 mb18 flex">
            <Radio.Group
              buttonStyle="solid"
              value={account_type}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Radio.Button
                style={{
                  width: "40%",
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
                value={SAVINGS}
                onClick={() => {
                  this.setAccountType(SAVINGS);
                }}
              >
                {ACCOUNT_TYPES[SAVINGS]}
              </Radio.Button>

              <Radio.Button
                style={{
                  width: "40%",
                  marginBottom: "10px",
                  marginTop: "10px",
                }}
                value={CURRENT}
                onClick={() => {
                  this.setAccountType(CURRENT);
                }}
              >
                {ACCOUNT_TYPES[CURRENT]}
              </Radio.Button>
            </Radio.Group>
          </div>

          <div className="form-headings flex align-center justify-start">
            {this.formatMessage(messages.enterUPIID)}
          </div>

          <Input
            className={"form-inputs-ap"}
            value={upi_id}
            onChange={this.setUPIidValue}
            type="string"
          />

          <div className="form-headings flex align-center justify-start">
            {this.formatMessage(messages.ifsc)}
            <div className="star-red">*</div>
          </div>

          <Input
            className={"form-inputs-ap"}
            value={ifsc_code}
            onChange={this.set_ifsc_code}
            type="string"
            maxLength={500}
          />

          <div className="form-headings flex align-center justify-start">
            {this.formatMessage(messages.useAsMainAccount)}
          </div>

          <Checkbox checked={use_as_main} onClick={this.setMain}>
            <span className="fs20 ml10">
              {this.formatMessage(messages.yes)}
            </span>
          </Checkbox>
        </div>

        <div className="add-patient-footer">
          <Button onClick={this.onClose} style={{ marginRight: 8 }}>
            {this.formatMessage(messages.cancel)}
          </Button>
          <Button onClick={this.onSubmit} type="primary">
            {this.formatMessage(messages.submit)}
          </Button>
        </div>
      </div>
    );
  };

  formatMessage = (data) => this.props.intl.formatMessage(data);

  onClose = () => {
    const { close } = this.props;
    this.setState({
      customer_name: "",
      account_mobile_number: "",
      prefix: "91",
      account_number: "",
      ifsc_code: "",
      account_type: "",
      use_as_main: true,
      upi_id: null,
    });
    close();
  };

  validateData = () => {
    const {
      customer_name = "",
      account_mobile_number = "",
      prefix = "",
      account_number = "",
      ifsc_code = "",
      account_type = "",
    } = this.state;

    if (!prefix) {
      message.error(this.formatMessage(messages.prefixError));
      return false;
    } else if (
      account_mobile_number.length < 6 ||
      account_mobile_number.length > 20 ||
      !account_mobile_number
    ) {
      message.error(this.formatMessage(messages.account_mobile_numberError));
      return false;
    } else if (!customer_name) {
      message.error(this.formatMessage(messages.customer_nameError));
      return false;
    } else if (!account_number) {
      message.error(this.formatMessage(messages.account_numberError));
      return false;
    } else if (!ifsc_code) {
      message.error(this.formatMessage(messages.ifsc_codeError));
      return false;
    } else if (!account_type) {
      message.error(this.formatMessage(messages.account_typeError));
      return false;
    }

    return true;
  };

  submit = ({
    customer_name,
    account_mobile_number,
    prefix,
    account_number,
    ifsc_code,
    account_type,
    use_as_main = false,
    upi_id,
  }) => {
    this.handleSubmit({
      customer_name,
      account_mobile_number,
      prefix,
      account_number,
      ifsc_code,
      account_type,
      use_as_main,
      upi_id,
    });
  };

  async handleSubmit({
    customer_name,
    account_mobile_number,
    prefix,
    account_number,
    ifsc_code,
    account_type,
    use_as_main,
    upi_id,
  }) {
    try {
      const { updateAccountDetails, updateAccountDetailsAdded } = this.props;
      const { accountDetailsId } = this.state;
      this.setState({ submitting: true });
      const response = await updateAccountDetails(accountDetailsId, {
        customer_name,
        account_mobile_number,
        prefix,
        account_number,
        ifsc_code,
        account_type,
        use_as_main,
        upi_id,
      });
      const { status, payload: { message: msg } = {} } = response;
      if (status) {
        message.success(this.formatMessage(messages.editAccountDetailsSuccess));
        updateAccountDetailsAdded();
        this.onClose();
      }
      this.setState({ submitting: false });
    } catch (err) {
      console.log("err", err);
      this.setState({ submitting: false });
      message.warn(this.formatMessage(messages.somethingWentWrong));
    }
  }

  onSubmit = () => {
    const {
      customer_name = "",
      account_mobile_number = "",
      prefix = "",
      account_number = "",
      ifsc_code = "",
      account_type = "",
      use_as_main = false,
      upi_id = null,
    } = this.state;
    const validate = this.validateData();
    const { submit } = this;
    if (validate) {
      submit({
        customer_name,
        account_mobile_number,
        prefix,
        account_number,
        ifsc_code,
        account_type,
        use_as_main,
        upi_id,
      });
    }
  };

  // onEdit = (accountDetailsId) => {

  //     const { customer_name = '', account_mobile_number = '', prefix = '', account_number = '', ifsc_code = '', account_type = '' , use_as_main=false} = this.state;
  //     const validate = this.validateData();
  //     const { edit } = this;
  //     if (validate) {
  //         edit(accountDetailsId,{ customer_name, account_mobile_number,prefix,account_number,ifsc_code,account_type,use_as_main})
  //     }
  // }

  // edit = (accountDetailsId,{ customer_name, account_mobile_number,prefix,account_number,ifsc_code,account_type,use_as_main=false}) => {

  //     this.handleEdit(accountDetailsId,{ customer_name, account_mobile_number,prefix,account_number,ifsc_code,account_type,use_as_main});

  // }

  // async handleEdit(accountDetailsId,{ customer_name, account_mobile_number,prefix,account_number,ifsc_code,account_type,use_as_main}){

  //     try {
  //         const {updateAccountDetails,updateAccountDetailsAdded} = this.props;
  //         const response = await updateAccountDetails(accountDetailsId,{ customer_name, account_mobile_number,prefix,account_number,ifsc_code,account_type,use_as_main});
  //         const { status, payload: { message : msg } = {} } = response;
  //         if(status){
  //             message.success(this.formatMessage(messages.updateAccountDetailsSuccess));
  //             updateAccountDetailsAdded();
  //             this.onClose();
  //         }

  //       } catch (err) {
  //         console.log("err", err);
  //         message.warn(this.formatMessage(messages.somethingWentWrong));
  //       }

  // }

  render() {
    const { renderAddAccountDetailsForm } = this;
    const { visible } = this.props;
    const {
      onClose,
      //  renderAddNewConsultationFee
    } = this;

    const { submitting = false } = this.state;

    if (visible !== true) {
      return null;
    }

    return (
      <Fragment>
        <Drawer
          title="Edit Account Details"
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
          width={`30%`}
        >
          {renderAddAccountDetailsForm()}

          <Footer
            onSubmit={this.onSubmit}
            onClose={this.onClose}
            submitText={this.formatMessage(messages.submit)}
            submitButtonProps={{}}
            cancelComponent={
              <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                {this.formatMessage(messages.cancel)}
              </Button>
            }
            submitting={submitting}
          />

          {/* <div className='add-patient-footer'>
                        <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                            {this.formatMessage(messages.cancel)}
                        </Button>
                        <Button 
                        onClick={this.onSubmit}
                         type="primary">
                            {this.formatMessage(messages.submit)}
                        </Button>
                    </div> */}
        </Drawer>
      </Fragment>
    );
  }
}

export default injectIntl(editAccountDetailsDrawer);
