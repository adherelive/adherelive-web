import React, { Component } from "react";
import { injectIntl } from "react-intl";
import Select from "antd/es/select";
import SecondaryDoctorForm from "./form";
import Form from "antd/es/form";
import message from "antd/es/message";
import messages from "./messages";
import Spin from "antd/es/spin";
import { getName } from "../../../Helper/validation";
import debounce from "lodash-es/debounce";
import isEmpty from "../../../Helper/is-empty";

const { Option } = Select;
const { Item: FormItem } = Form;

const DOCTOR_ROLE_ID = "doctor_role_id";

class AddSecondaryDoctor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchingName: false,
      rowData: [],
      dropDownVisible: false,
    };

    this.FormWrapper = Form.create({ onFieldsChange: this.onFormFieldChanges })(
      SecondaryDoctorForm
    );

    this.searchName = debounce(this.searchName.bind(this), 200);
  }

  async componentDidMount() {}

  formatMessage = (data) => this.props.intl.formatMessage(data);

  searchName = async (name) => {
    try {
      const { searchDoctorName } = this.props;
      this.setState({ searchingName: true });
      const response = await searchDoctorName(name);
      const {
        status,
        statusCode,
        payload: { data = {}, message: res_message = "" } = {},
      } = response || {};
      if (!status && statusCode !== 422) {
        this.setState({ rowData: [] });
        message.error(res_message);
      }
      const { rowData = [], user_roles = {} } = data || {};
      this.setState({
        rowData,
        searchingName: false,
        user_roles: user_roles,
      });
    } catch (error) {
      this.setState({ searchingName: false });
      console.log("error ===>", error);
    }
  };

  getNameOptions = () => {
    const {
      rowData = [],
      dropDownVisible = false,
      user_roles = {},
    } = this.state;
    const {
      doctors = {},
      providers = {},
      auth_role = null,
      userRoles = {},
    } = this.props;
    // console.log("467236472647264782",{rowData});
    console.log("doctors", doctors);
    console.log("providers", providers);
    console.log("userRoles", userRoles);
    return Object.keys(rowData).map((id) => {
      const rowDataObj = rowData[id] || {};
      const { doctor_id, provider_id, user_id, user_role_id } =
        rowDataObj || {};

      if (auth_role.toString() === user_role_id.toString()) {
        return null;
      }
      //PREV CODE
      // const {
      //   basic_info: { first_name = "", middle_name = "", last_name = "" } = {},
      // } = doctors[doctor_id] || {};

      // AKSHAY NEW CODE IMPLEMETATION START

      const {
        [doctor_id]: { basic_info: { full_name = "" } = {} },
      } = doctors || {};

      const { basic_info: { linked_id = null } = {} } =
        user_roles[user_role_id] || {};

      // AKSHAY NEW CODE IMPLEMETATION END

      let provider_name = "";
      //PREV CODE START
      // if (provider_id && !isEmpty(providers)) {
      //   console.log(providers[provider_id]);
      //   const { basic_info: { name } = {} } = providers[provider_id];
      //   provider_name = name;
      // }
      //PREV CODE END
      // AKSHAY NEW CODE IMPLEMETATION START
      if (linked_id) {
        const { basic_info: { name } = {} } = providers[linked_id] || {};

        provider_name = name;
      }
      // AKSHAY NEW CODE IMPLEMETATION END

      console.log(provider_name);

      return (
        <Option key={user_role_id} value={user_role_id}>
          <div className="flex direction-column">
            <div className="fs16 flex ">
              {`${getName(full_name)}`}
              {dropDownVisible ? null : provider_name ? (
                <div className="fs16 ml10">{`(${provider_name})`}</div>
              ) : null}
            </div>
            {dropDownVisible ? (
              <div className="fs14">{provider_name}</div>
            ) : null}
          </div>
        </Option>
      );
    });
  };

  setDoctor = (value) => {
    const { form: { setFieldsValue } = {} } = this.props;

    setFieldsValue({ [DOCTOR_ROLE_ID]: value });
  };

  onDropdownVisibleChange = (visible) => {
    this.setState({ dropDownVisible: visible });
  };

  render() {
    const { formatMessage } = this;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { searchingName = false } = this.state;
    return (
      <Form className="fw700 wp100 pb30 Form">
        <FormItem
          label={formatMessage(messages.doctor_name)}
          className="flex-grow-1 mt-4"
        >
          {getFieldDecorator(DOCTOR_ROLE_ID, {
            rules: [
              {
                required: true,
                message: formatMessage(messages.doctor_name_required_error),
              },
            ],
          })(
            <Select
              className="form-inputs-ap drawer-select"
              onSearch={this.searchName}
              onSelect={this.setDoctor}
              placeholder={this.formatMessage(messages.name)}
              showSearch
              notFoundContent={searchingName ? <Spin size="small" /> : null}
              autoComplete="off"
              optionFilterProp="children"
              onDropdownVisibleChange={this.onDropdownVisibleChange}
              filterOption={(input, option) =>
                option.props.children
                  .toString()
                  .toLowerCase()
                  .indexOf(option.props.children.toString().toLowerCase()) > -1
              }
            >
              {this.getNameOptions()}
            </Select>
          )}
        </FormItem>
      </Form>
    );
  }
}

export default injectIntl(AddSecondaryDoctor);
