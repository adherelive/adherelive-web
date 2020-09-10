import React from "react";
import {FieldTimeOutlined} from "@ant-design/icons";
import Tooltip from "antd/es/tooltip";
import messages from "../messages";

export default props => {
    const { action, formatMessage, id } = props || {};

    return (
        <div onClick={action(id)}>
            <Tooltip placement="bottom" title={formatMessage(messages.response_timeline)}>
                <FieldTimeOutlined className="flex align-center justify-center"/>
            </Tooltip>
        </div>
    );
};
