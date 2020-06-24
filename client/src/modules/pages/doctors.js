
function doctorPageReducer(state, data) {
  console.log("192371937812 data --> ", data);
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
      return doctorPageReducer(state, payload);
  }
};
