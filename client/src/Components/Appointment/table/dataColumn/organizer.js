import React from "react";

export default props => {
    const { appointmentData, userData } = props || {};
    const {basic_info: {first_name, middle_name, last_name} = {}} = userData || {};

    return <div>{`${first_name} ${middle_name ? `${middle_name} `: ""}${last_name}`}</div>;
};
