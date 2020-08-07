import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
    const { doctorData } = props || {};
    const { basic_info: {speciality} = {} } = doctorData || {};

    return (
        <div>
            {speciality ? speciality : TABLE_DEFAULT_BLANK_FIELD}
        </div>
    );
};
