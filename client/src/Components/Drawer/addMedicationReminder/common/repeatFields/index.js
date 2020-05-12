import React, { Fragment } from "react";
import repeatType from "../repeatType";
import repeatInterval from "../repeatInterval";
import startDate from "../startDate";
import endDate from "../endDate";
import selectedDays from "../selectedDays";
import { REPEAT_TYPE } from "../../../../../constant";

export default props => {
  const {
    form: { getFieldValue }
  } = props;
  const repeat = getFieldValue(repeatType.field_name);

  return (
    <Fragment>
      <div className="flex align-items-center justify-content-space-between">
        <div id="repeats">{selectedDays.render(props)}</div>
      </div>
      <div className="flex align-items-center justify-content-space-between">
        <div>{startDate.render(props)}</div>

        <div>{endDate.render(props)}</div>
      </div>
    </Fragment>
  );
};
