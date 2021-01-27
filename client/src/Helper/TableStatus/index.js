import React from "react";
import Tag from "antd/es/tag";
import {TABLE_STATUS} from "../../constant";

export default props => {
    const {displayProps  : {type,status} = {}} = props;

    // TODO-V: need to update based on each status | make it more reusable

    switch(type) {
        case TABLE_STATUS.TRANSACTION_TABLE:
            return (
                <div>
                    {status === "completed" ?
                        <Tag color={"green"} >{status.toUpperCase()}</Tag>
                        :
                        <Tag color={"red"} >{status.toUpperCase()}</Tag>
                    }
                </div>
            );
        case TABLE_STATUS.ADMIN_DOCTOR_TABLE:
            return (
                <div>
                    {status === "active" ?
                        <Tag color={"green"} >{status.toUpperCase()}</Tag>
                        :
                        <Tag color={"red"} >{status.toUpperCase()}</Tag>
                    }
                </div>
            );
        default:
            return null;
    }
};
