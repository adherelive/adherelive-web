import React from "react";
import { Form, Input, Select, Checkbox, Button, message } from "antd";
import { PATH } from "../../../constant";
import { hasErrors } from "../../../helpers/validation";
import csc from "country-state-city";

export const NAME = "name";
export const COMPANY_NAME = "company_name";
export const EMAIL = "email";
export const PASSWORD = "password";
export const CONFIRM_PASSWORD = "confirm_password";
export const MOBILE_NUMBER = "mobile_number";
export const AGREEMENT = "agreement";
export const COUNTRY_NAME = "country_name";

const { Option } = Select;
const { TextArea } = Input;
const FIELDS = [
    NAME,
    COMPANY_NAME,
    EMAIL,
    PASSWORD,
    CONFIRM_PASSWORD,
    MOBILE_NUMBER,
    COUNTRY_NAME
];

class ProfileRegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            confirmDirty: false
        };
    }

    componentDidMount() {
        this.props.form.validateFields();
    }

    handleConfirmBlur = e => {
        const { value } = e.target;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    };

    compareToFirstPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && value !== form.getFieldValue("password")) {
            callback("Two passwords that you enter is inconsistent!");
        } else {
            callback();
        }
    };

    validateToNextPassword = (rule, value, callback) => {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
            form.validateFields(["confirm"], { force: true });
        }
        callback();
    };

    getCountryOptions = () => {
        const countries = csc.getAllCountries();
        let options = [];
        for (const key in countries) {
            const country = countries[key];
            const { name, id } = country;
            options.push(
                <Option key={id} value={id} name={name}>
                    {name}
                </Option>
            );
        }
        return options;
    };

    setCountry = country => {
        // setFieldsValue({ [STATE]: null, [CITY]: null });
        // validateFields([STATE, CITY]);
        this.setState({ country });
    };

    handleSubmit = e => {
        e.preventDefault();
        const { signup, match: { path } = {}, history } = this.props;
        this.setState({ loading: true });
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const { country_name } = values;
                const countries = csc.getAllCountries();
                const country = countries[parseInt(country_name) - 1] || {};
                console.log(country);
                signup({ ...values, country })
                    .then(response => {
                        const {
                            status = false,
                            payload: { message: responseMessage } = {}
                        } = response;
                        if (status) {
                            message.success(
                                "Please confirm your email to login",
                                10
                            );
                            if (path === PATH.SIGNUP) {
                                history.replace(PATH.SIGNUP_SUCCESS);
                            }
                        } else {
                            this.setState({ loading: false });
                            message.error(responseMessage, 5);
                        }
                    })
                    .catch(err => {
                        this.setState({ loading: false });
                        // console.log("ERR!", err);
                        message.error(
                            "Something went wrong, Please try again",
                            4
                        );
                    });
            } else {
                // console.log("ERR => ", err);
                this.setState({ loading: false });
            }
        });
    };

    isCheckboxChecked = (rule, value, callback) => {
        if (!value) {
            callback("Please confirm the agreement");
        } else {
            callback();
        }
    };

    render() {
        const {
            getFieldDecorator,
            isFieldTouched,
            getFieldError,
            getFieldsError
        } = this.props.form;

        const { loading } = this.state;

        let fieldsError = {};
        FIELDS.forEach(value => {
            const error = isFieldTouched(value) && getFieldError(value);
            fieldsError = { ...fieldsError, [value]: error };
        });

        const prefixSelector = getFieldDecorator("prefix", {
            initialValue: "91"
        })(
            <Select className="flex">
                {/* india */}
                <Option value="91">+91</Option>
                {/* us */}
                <Option value="1">+1</Option>
                {/* uk */}
                <Option value="44">+44</Option>
                {/* china */}
                <Option value="86">+86</Option>
                {/* japan */}
                <Option value="81">+81</Option>
                {/* germany */}
                <Option value="49">+49</Option>
                {/* france */}
                <Option value="33">+33</Option>
                {/* switzerland */}
                <Option value="41">+41</Option>
                {/* australia */}
                <Option value="61">+61</Option>
                {/* russia */}
                <Option value="7">+7</Option>
                {/* south africa */}
                <Option value="27">+27</Option>
                {/* pakistan */}
                <Option value="9, 2">+92</Option>
                {/* bangladesh */}
                <Option value="880">+880</Option>
            </Select>
        );

        return (
            <Form layout="vertical">
                {/* Name */}
                <Form.Item
                    label="Name"
                    validateStatus={fieldsError[NAME] ? "error" : ""}
                    help={fieldsError[NAME] || ""}
                >
                    {getFieldDecorator("name", {
                        rules: [
                            {
                                required: true,
                                message: "Please enter your name"
                            },
                            {}
                        ]
                    })(<Input placeholder="Your name" />)}
                </Form.Item>

                {/* Email */}
                <Form.Item
                    label="E-mail"
                    validateStatus={fieldsError[EMAIL] ? "error" : ""}
                    help={fieldsError[EMAIL] || ""}
                >
                    {getFieldDecorator("email", {
                        rules: [
                            {
                                type: "email",
                                message: "The input is not valid E-mail!"
                            },
                            {
                                required: true,
                                message: "Please input your E-mail!"
                            }
                        ]
                    })(<Input placeholder="Your email address" />)}
                </Form.Item>

                {/* phone number */}
                <Form.Item
                    label="Phone Number"
                    validateStatus={fieldsError[MOBILE_NUMBER] ? "error" : ""}
                    help={fieldsError[MOBILE_NUMBER] || ""}
                >
                    {getFieldDecorator("mobile_number", {
                        rules: [
                            {
                                required: true,
                                message: "Please input your phone number!"
                            },
                            {
                                len: 10,
                                message: "Please enter a valid 10 digit number"
                            }
                        ]
                    })(
                        <Input
                            addonBefore={prefixSelector}
                            placeholder="mobile phone number"
                        />
                    )}
                </Form.Item>

                {/* currency */}
                <Form.Item
                    validateStatus={fieldsError[COUNTRY_NAME] ? "error" : ""}
                    help={fieldsError[COUNTRY_NAME] || ""}
                    label={"Country"}
                >
                    {getFieldDecorator(COUNTRY_NAME, {
                        rules: [
                            {
                                required: true,
                                message: "Please input your Country!"
                            }
                        ]
                    })(
                        <Select
                            onChange={this.setCountry}
                            showSearch={true}
                            optionFilterProp={"name"}
                        >
                            {this.getCountryOptions()}
                        </Select>
                    )}
                </Form.Item>

                {/* address */}
                <Form.Item label="Address">
                    {getFieldDecorator("address")(
                        <TextArea placeholder="Enter your address" autosize />
                    )}
                </Form.Item>

                {/* read T&C */}
                <Form.Item
                    validateStatus={fieldsError[AGREEMENT] ? "error" : ""}
                    help={fieldsError[AGREEMENT] || ""}
                >
                    {getFieldDecorator("agreement", {
                        rules: [
                            {
                                validator: this.isCheckboxChecked
                            }
                        ],
                        valuePropName: "checked"
                    })(
                        <Checkbox>
                            I have read the <span>agreement</span>
                        </Checkbox>
                    )}
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        onClick={this.handleSubmit}
                        loading={loading}
                        disabled={hasErrors(getFieldsError())}
                    >
                        Sign Up
                    </Button>
                </Form.Item>
            </Form>
        );
    }
}

export default Form.create()(ProfileRegisterForm);
