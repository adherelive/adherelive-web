import React from "react";
import moment from "moment";
import {
  CheckCircleTwoTone,
  ExclamationCircleTwoTone,
} from "@ant-design/icons";

export default (props) => {
  const { userData } = props || {};
  const { activated_on } = userData || {};

  return (
    <div>
      {activated_on ? (
        <div className="flex direction-row align-center">
          <CheckCircleTwoTone className="mr10" twoToneColor={`#43b02a`} />
          <span>{`Verified`}</span>
        </div>
      ) : (
        <div className="flex direction-row align-center">
          <ExclamationCircleTwoTone className="mr10" twoToneColor={`#f1c40f`} />
          <span>{`Not Verified`}</span>
        </div>
      )}
    </div>
  );
};
