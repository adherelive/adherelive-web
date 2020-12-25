import React from "react";
import { Button } from "antd";

export default props => {
    const {
        onSubmit,
        onClose,
        className = "",
        cancelComponent,
        submitComponent,
        cancelText,
        submitText,
        cancelButtonProps = {},
        submitButtonProps = {}
    } = props;

    const CancelButton = (
        <Button onClick={onClose} className="mr10" {...cancelButtonProps}>
            {cancelText}
        </Button>
    );

    const SubmitButton = (
        <Button
            onClick={onSubmit}
            className="mr10"
            type="primary"
            {...submitButtonProps}
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
};
