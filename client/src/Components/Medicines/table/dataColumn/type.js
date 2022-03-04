import React from "react";
import TabletIcon from "../../../../Assets/images/tabletIcon3x.png";
import InjectionIcon from "../../../../Assets/images/injectionIcon3x.png";
import SyrupIcon from "../../../../Assets/images/pharmacy.png";
import Tooltip from "antd/es/tooltip";
import messages from "../messages";

const TABLET = "tablet";
const SYRUP = "syrup";

export default (props) => {
  const {
    medicineData: { basic_info: { type = "" } = {} } = {},
    formatMessage,
  } = props || {};

  console.log("103712398 type", { type });

  return (
    <div className="flex align-center">
      <Tooltip
        title={
          type === TABLET || type === "tablets"
            ? formatMessage(messages.tablet)
            : type === SYRUP
            ? formatMessage(messages.syrup)
            : formatMessage(messages.syringe)
        }
        className="flex align-center justify-start"
      >
        <img
          className="w20 mr10"
          src={
            type === TABLET || type === "tablets"
              ? TabletIcon
              : type === SYRUP
              ? SyrupIcon
              : InjectionIcon
          }
          alt="medicine icon"
        />

        <span className="fs14 fw600 italic">{type.toUpperCase()}</span>
      </Tooltip>
    </div>
  );
};
