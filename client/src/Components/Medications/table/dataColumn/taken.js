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

  return (
    <div className="ml10">
      {" "}
      {strength === 1 ? "One" : strength} {strength !== 1 && unit} | {quantity}{" "}
      | {WHEN_TO_TAKE_ABBR_LABELS[when_to_take.length]}{" "}
    </div>
  );
};
