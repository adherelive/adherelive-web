const intial_state = {
  23: {
    first_name: "Gagneet",
    middle_name: "B",
    last_name: "Singh",
    age: 45,
    gender: "M",
    phone_number: "+919810739699",
    email_id: "gagneet@gmail.com",
    patient_id: "ATD/001/005",
    profile_picture:
      "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
    treatment_details: {
      treatment_name: "Thyroid Condition",
      treatment_severity: 0,
      treatment_condition: "Trauma",
      treatment_start_date: "2nd Decenber, 2020",
      treatment_doctor: "Sparsh Jaiswal",
      treatment_provider: "Alfred",
    },
    alerts: {
      count: 7,
      new_symptoms: ["Shoulder Pain", "Redness on stitches"],
      missed_appointment: ["05 Dec, 2020"],
    },
  },
};

function userReducer(state, data) {
  const { users = {} } = data || {};
  if (Object.keys(users).length > 0) {
    return {
      ...state,
      ...users,
    };
  } else {
    return state;
  }
}

export default (state = intial_state, action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return userReducer(state, data);
  }
};
