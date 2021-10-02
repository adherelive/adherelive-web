import React, {Component, Fragment} from "react";
import {injectIntl} from "react-intl";
import FormItem from "antd/lib/form/FormItem";

class WhenToTakeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: [],
        };
    }

    componentDidMount() {
        const {medication_details: {timings = {}} = {}} = this.props;
        this.setState({
            count: [timings],
        });
    }

    getUnitOption = (index) => {
        const {count} = this.state;
        const timings = count[index] || {};
        return Object.keys(timings).map((id) => {
            const {text, time} = timings[id] || {};
            return (
                <Option key={`${index}.${id}.${time}`} value={id}>
                    {`${text} (${time})`}
                </Option>
            );
        });
    };

    getFormItems = () => {
        const {form} = this.props;
        const {count} = this.state;
        const {
            getFieldDecorator,
            //getFieldValue
        } = form;
        return count.map((details, index) => {
            return (
                <FormItem
                    className="flex-1 align-self-end"
                    validateStatus={error ? "error" : ""}
                >
                    {getFieldDecorator(`${FIELD_NAME}.${index}`, {
                        rules: [
                            {
                                required: true,
                                message: "Select The Time",
                            },
                        ],
                        initialValue: getInitialValue(),
                    })(
                        <Select
                            className="full-width"
                            placeholder=""
                            showSearch
                            autoComplete="off"
                            optionFilterProp="children"
                            suffixIcon={null}
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                            getPopupContainer={this.getParentNode}
                        >
                            {this.getUnitOption(index)}
                        </Select>
                    )}
                </FormItem>
            );
        });
    };

    render() {
        const {getFormItems} = this;
        return (
            <Fragment>
                <FormItem>{getFormItems()}</FormItem>
            </Fragment>
        );
    }
}

export default injectIntl(WhenToTakeForm);
