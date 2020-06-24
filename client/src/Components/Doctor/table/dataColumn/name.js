import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
    console.log("129381273 props --> ", props);
    const { doctorData } = props || {};
    const { basic_info: { first_name, middle_name, last_name, gender, age } = {} } = doctorData || {};

    return (
        <div>
            {first_name ? `${first_name} ${middle_name ? `${middle_name} ` : ""}${last_name ? last_name : ""} ${gender ? gender.toUpperCase() : ""}` : TABLE_DEFAULT_BLANK_FIELD}
        </div>
    );
};
