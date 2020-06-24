import React from "react";
import { TABLE_DEFAULT_BLANK_FIELD } from "../../../../constant";

export default props => {
    console.log("28374 this.props --> ", props);
    const { appointmentData, userData } = props || {};
    const {basic_info: {first_name, middle_name, last_name} = {}} = userData || {};

    return <div>{`${first_name} ${middle_name ? `${middle_name} `: ""}${last_name}`}</div>;
};
