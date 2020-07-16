import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
    const { doctorData } = props || {};

    console.log("1926123 props --> ", props);
    const { basic_info: { address } = {} } = doctorData || {};

    return (
        <div>
            {address ? address : TABLE_DEFAULT_BLANK_FIELD}
        </div>
    );
};
