import React from "react";
import { MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default (props) => {
  const { userData } = props || {};
  const { basic_info: { mobile_number, email } = {} } = userData || {};

  return (
    <div className="flex direction-column">
      <div className="flex direction-row align-center">
        <MailOutlined
          className="mr10"
          style={{
            color: "#4a90e2",
          }}
        />
        <div>{email ? email.toLowerCase() : TABLE_DEFAULT_BLANK_FIELD}</div>
      </div>
      <div className="flex direction-row align-center">
        <PhoneOutlined
          className="mr10"
          style={{
            color: "#4a90e2",
          }}
        />
        <div>{mobile_number ? mobile_number : TABLE_DEFAULT_BLANK_FIELD}</div>
      </div>
    </div>
  );
};
