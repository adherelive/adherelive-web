import React from "react";
import { Button } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";
import { injectIntl } from "react-intl";
import messages from "./message";

export default injectIntl((props) => {
  const {
    onSubmit,
    onClose,
    className = "",
    cancelComponent,
    submitComponent,
    cancelText,
    submitText,
    cancelButtonProps = {},
    submitButtonProps = {},
    submitting = false,
  } = props;

  const CancelButton = (
    <Button onClick={onClose} className="mr10" {...cancelButtonProps}>
      {cancelText}
    </Button>
  );

  const formatMessage = (data) => props.intl.formatMessage(data);

  const SubmitButton = (
    <Button
      onClick={onSubmit}
      className="mr10"
      type="primary"
      {...submitButtonProps}
      icon={submitting ? <PoweroffOutlined /> : null}
      loading={submitting}
    >
      {submitText}
    </Button>
  );

  return (
    <div className={`adhere-drawer-footer  ${className} z1`}>
      {cancelComponent === null
        ? null
        : cancelComponent
        ? cancelComponent
        : CancelButton}

      {submitComponent !== undefined ? submitComponent : SubmitButton}
    </div>
  );
});
