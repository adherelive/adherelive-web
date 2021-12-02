import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { TimePicker, Form } from "antd";
import messages from "../message";
import moment from "moment";

import { EVENT_TYPE, EVENT_ACTION } from "../../../../constant";

const { Item: FormItem } = Form;

const FIELD_NAME = "start_time";

class StartTime extends Component {
  getParentNode = (t) => t.parentNode;

  formatMessage = (data) => this.props.intl.formatMessage(data);

  getInitialValue = () => {
    const { purpose, event = {} } = this.props;

    let initialValue = new moment();
    if (purpose) {
      const { startTime } = event;
      initialValue = new moment(startTime);
    }
    return initialValue;
  };

  isValidStartTime = (rule, value, callback) => {
    const now = new moment().subtract("minutes", 1);

    if (value && value < now) {
      callback("Start Time cannot be less than current Time");
    } else {
      callback();
    }
  };

  render() {
    const {
      form: { getFieldDecorator, getFieldError },
      onChangeEventStartTime,
      eventMode,
      purpose,
    } = this.props;
    const { formatMessage, getInitialValue, isValidStartTime } = this;

    let error;
    if (purpose !== EVENT_ACTION.EDIT_NOTES) {
      error = getFieldError(FIELD_NAME);
    }

    return (
      <FormItem
        className={`${
          eventMode === EVENT_TYPE.APPOINTMENT ? "mr12" : ""
        } flex-grow-1`}
        label={
          eventMode === EVENT_TYPE.APPOINTMENT
            ? formatMessage(messages.from)
            : formatMessage(messages.at)
        }
        validateStatus={error ? "error" : ""}
        help={error || ""}
      >
        {getFieldDecorator(FIELD_NAME, {
          initialValue: getInitialValue(),
          rules: [
            {
              validator: isValidStartTime,
            },
          ],
        })(
          <TimePicker
            allowClear={false}
            disabled={purpose === EVENT_ACTION.EDIT_NOTES}
            use12Hours
            format="h:mm A"
            style={{ width: "100%" }}
            suffixIcon={null}
            // value={moment(eventEndTime)}
            // onChange={onChangeEventEndTime}
            onChange={onChangeEventStartTime}
            getPopupContainer={this.getParentNode}
            popupStyle={{ left: 0 }}
          />
        )}
      </FormItem>
    );
  }
}

const Field = injectIntl(StartTime);

export default {
  field_name: FIELD_NAME,
  render: (props) => <Field {...props} />,
};
