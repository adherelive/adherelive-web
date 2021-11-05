import React from "react";
import TabletIcon from "../../../../Assets/images/tabletIcon3x.png";
import InjectionIcon from "../../../../Assets/images/injectionIcon3x.png";
import SyrupIcon from "../../../../Assets/images/pharmacy.png";
import { TABLET, SYRUP, MEDICINE_FORM_TYPE } from "../../../../constant";

export default (props) => {
  const { medicationTemplateData, medicationData } = props || {};

  const { basic_info: { name } = {} } = medicationTemplateData || {};
  const { basic_info: { details: { medicine_type = "1" } = {} } = {} } =
    medicationData || {};
  return (
    <div className="flex direction-row justify-space-around align-center">
      <img
        className="w20 mr10"
        src={
          medicine_type === TABLET
            ? TabletIcon
            : medicine_type === SYRUP
            ? SyrupIcon
            : InjectionIcon
        }
        alt="medicine icon"
      />
      <p className="mb0">{name ? `${name}` : "--"}</p>
    </div>
  );
};
