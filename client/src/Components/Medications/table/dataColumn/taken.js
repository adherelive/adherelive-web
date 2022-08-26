import React from "react";
import { WHEN_TO_TAKE_ABBR_LABELS } from "../../../../constant";

export default (props) => {
  const { medicationData } = props || {};
  const { remaining = 0, total = 0, basic_info = {} } = medicationData || {};
  // details: { quantity : "", strength : "", unit : "", when_to_take =:[] },

  const {
    quantity = "",
    strength = "",
    unit = "",
    when_to_take = [],
  } = basic_info.details || {};

  // return <div className="ml10">
  //   {`${total - remaining}/${total}`}
  //   </div>;

  let newStrength = "";
  let newUnit = "";

  if (strength !== 1) {
    if (unit === "1") {
      newStrength = strength;
      newUnit = "mg";
    } else if (unit === "2") {
      newUnit = "ml";
      newStrength = strength;
    }
  } else {
    newStrength = "";
    newUnit = "One";
  }

  return (
    <div className="ml10">
      {" "}
      {`${newStrength} ${newUnit}`} | {quantity} |{" "}
      {WHEN_TO_TAKE_ABBR_LABELS[when_to_take.length]}{" "}
    </div>
  );
};
