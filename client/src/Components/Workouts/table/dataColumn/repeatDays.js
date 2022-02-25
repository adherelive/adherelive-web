import React from "react";

export default (props) => {
  const { workoutData: { details: { repeat_days = [] } = {} } = {} } =
    props || {};
  let str = repeat_days.toString() || "";

  console.log("7823432486823764723", { repeat_days, props });

  return <div>{str.length > 0 ? str : "--"}</div>;
};
