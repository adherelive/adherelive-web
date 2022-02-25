import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";

import { Select } from "antd";
import Form from "antd/es/form";

import india from "../../Assets/images/india.png";
import australia from "../../Assets/images/australia.png";
import us from "../../Assets/images/flag.png";
import uk from "../../Assets/images/uk.png";
import russia from "../../Assets/images/russia.png";
import germany from "../../Assets/images/germany.png";
import southAfrica from "../../Assets/images/south-africa.png";
import pakistan from "../../Assets/images/pakistan.png";
import bangladesh from "../../Assets/images/bangladesh.png";
import japan from "../../Assets/images/japan.png";
import china from "../../Assets/images/china.png";
import switzerland from "../../Assets/images/switzerland.png";
import france from "../../Assets/images/france.png";

const { Item: FormItem } = Form;
const { Option } = Select;
const FIELD_NAME = "prefix";

class Prefix extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  getInitialValue = () => {
    const { prefix } = this.props;

    let initialValue = "91";
    if (prefix) {
      initialValue = prefix;
    }
    return initialValue;
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldError, isFieldTouched },
    } = this.props;

    const error = isFieldTouched(FIELD_NAME) && getFieldError(FIELD_NAME);
    const { getInitialValue } = this;

    return (
      <FormItem
        className=" flex-1 align-self-end mb0I w60"
        validateStatus={error ? "error" : ""}
        help={error || ""}
      >
        {getFieldDecorator(FIELD_NAME, {
          initialValue: getInitialValue(),
        })(
          <Select className="flex align-center h50 w80">
            {/* india */}
            <Option value="91">
              <div className="flex align-center">
                <img src={india} className="w16 h16" />{" "}
                <div className="ml4">+91</div>
              </div>
            </Option>
            {/* australia */}
            <Option value="61">
              <div className="flex align-center">
                <img src={australia} className="w16 h16" />{" "}
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
                <img src={china} className="w16 h16" />{" "}
                <div className="ml4">+86</div>
              </div>
            </Option>
            {/* japan */}
            <Option value="81">
              <div className="flex align-center">
                <img src={japan} className="w16 h16" />{" "}
                <div className="ml4">+81</div>
              </div>
            </Option>
            {/* germany */}
            <Option value="49">
              <div className="flex align-center">
                <img src={germany} className="w16 h16" />{" "}
                <div className="ml4">+49</div>
              </div>
            </Option>
            {/* france */}
            <Option value="33">
              <div className="flex align-center">
                <img src={france} className="w16 h16" />{" "}
                <div className="ml4">+33</div>
              </div>
            </Option>
            {/* switzerland */}
            <Option value="41">
              <div className="flex align-center">
                <img src={switzerland} className="w16 h16" />{" "}
                <div className="ml4">+41</div>
              </div>
            </Option>

            {/* russia */}
            <Option value="7">
              <div className="flex align-center">
                <img src={russia} className="w16 h16" />{" "}
                <div className="ml4">+7</div>
              </div>
            </Option>
            {/* south africa */}
            <Option value="27">
              <div className="flex align-center">
                <img src={southAfrica} className="w16 h16" />{" "}
                <div className="ml4">+27</div>
              </div>
            </Option>
            {/* pakistan */}
            <Option value="92">
              <div className="flex align-center">
                <img src={pakistan} className="w16 h16" />{" "}
                <div className="ml4">+92</div>
              </div>
            </Option>
            {/* bangladesh */}
            <Option value="880">
              <div className="flex align-center">
                <img src={bangladesh} className="w16 h16" />{" "}
                <div className="ml4">+880</div>
              </div>
            </Option>
          </Select>
        )}
      </FormItem>
    );
  }
}

const Field = injectIntl(Prefix);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
