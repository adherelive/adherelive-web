
function doctorPageReducer(state, data) {
  // console.log("92832738492 data --> ", data);
  const {doctor_ids} = data || {};
  if(doctor_ids) {
    return [
      ...doctor_ids
    ];
  } else {
    return [
      ...state
    ];
  }
}

export default (state = [], action) => {
  const { type, payload } = action;
  switch (type) {
    default:
      console.log("92832738492 data 2--> ", payload);
      return doctorPageReducer(state, payload);
  }
};
