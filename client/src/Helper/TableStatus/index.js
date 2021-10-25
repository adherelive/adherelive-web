import React from "react";
import Tag from "antd/es/tag";
import { TABLE_STATUS, TRANSACTION_STATUS } from "../../constant";
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

export default (props) => {
  const { displayProps: { type, status } = {} } = props;

  // TODO-V: need to update based on each status | make it more reusable

  switch (type) {
    case TABLE_STATUS.TRANSACTION_TABLE:
      return (
        <div>
          {status === TRANSACTION_STATUS.COMPLETED && (
            <Tag color="green">
              <CheckCircleOutlined className="mr10" />
              {status.toUpperCase()}
            </Tag>
          )}
          {status === TRANSACTION_STATUS.ACCEPTED && (
            <Tag color="cyan">
              <ExclamationCircleOutlined className="mr10" />
              {status.toUpperCase()}
            </Tag>
          )}
          {status === TRANSACTION_STATUS.PENDING && (
            <Tag color="orange">
              <SyncOutlined className="mr10" />
              {status.toUpperCase()}
            </Tag>
          )}
          {status === TRANSACTION_STATUS.STARTED && (
            <Tag color="purple">
              <ClockCircleOutlined className="mr10" />
              {status.toUpperCase()}
            </Tag>
          )}
          {status === TRANSACTION_STATUS.CANCELLED && (
            <Tag color="red">
              <CloseCircleOutlined className="mr10" />
              {status.toUpperCase()}
            </Tag>
          )}
          {status === TRANSACTION_STATUS.EXPIRED && (
            <Tag color="grey">
              <MinusCircleOutlined className="mr10" />
              {status.toUpperCase()}
            </Tag>
          )}
        </div>
      );
    case TABLE_STATUS.ADMIN_DOCTOR_TABLE:
      return (
        <div>
          {status === "active" ? (
            <Tag color={"green"}>{status.toUpperCase()}</Tag>
          ) : (
            <Tag color={"red"}>{status.toUpperCase()}</Tag>
          )}
        </div>
      );
    default:
      return null;
  }
};
