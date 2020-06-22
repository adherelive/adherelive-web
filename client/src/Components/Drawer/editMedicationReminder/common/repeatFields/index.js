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
      <div className="select-days-wrapper flex align-items-center justify-content-space-between wp100">
        <div className="repeats wp100">{selectedDays.render(props)}</div>
      </div>
      <div className="flex align-items-center justify-content-space-between">
        {startDate.render(props)}

        {endDate.render(props)}
      </div>
    </Fragment>
  );
};
