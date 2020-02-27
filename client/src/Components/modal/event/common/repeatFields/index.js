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
        {repeatType.render(props)}
        {repeat && repeat !== REPEAT_TYPE.DAILY && repeat !== REPEAT_TYPE.NONE
          ? repeatInterval.render(props)
          : null}
      </div>
      {repeat && repeat === REPEAT_TYPE.WEEKLY
        ? selectedDays.render(props)
        : null}

      <div className="flex align-items-center justify-content-space-between">
        {startDate.render(props)}
        {repeat && repeat !== REPEAT_TYPE.NONE ? endDate.render(props) : null}
      </div>
    </Fragment>
  );
};
