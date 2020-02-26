<<<<<<< HEAD
const intial_state = {
    "23":{
        first_name:"John",
        middle_name: "",
        last_name:"Doe",
        age:62,
        gender:"M",
        phone_number:"+91-6298649934",
        email_id:"doe.john@gmail.com",
        patient_id:12990912,
        profile_picture:"https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
        treatment_details: {
            treatment_name: "Hip Replacement",
            treatment_severity: 0,
            treatment_condition: "Trauma",
            treatment_start_date: "12th March, 2019",
            treatment_doctor: "John Wick",
            treatment_provider: "Alfred"
        },
        alerts: {
            count:7,
            new_symptoms: ['Shoulder Pain','Redness on stitches'],
            missed_appointment: ['26 Nov, 2019']
        }
    }
};

export default (state=intial_state,action) => {
    const {type} = action;
    switch(type){
        default : 
        return state;
    }
};
=======
import { USER_INITIAL_STATE } from "../../data";

export default (state = USER_INITIAL_STATE, action) => {
  const { data, type } = action;

  switch (type) {
    default:
      return state;
  }
};
>>>>>>> 137ad1c8b06e0c64e5950edd45fc6f1de2e85eb9
