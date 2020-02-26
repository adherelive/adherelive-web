export const PATH = {
  LANDING_PAGE: "/",
  SIGN_IN: "/sign-in",
  FORGOT_PASSWORD: "/forgot-password",
  IDENTIFY: "/identify/:link",
  SIGN_UP: "/sign-up/:link",
  RESET_PASSWORD: "/reset-password/:link",
  PATIENT: {
    PA: "/patients",
    DETAILS: "/patients/:id"
  }
};



export const SEVERITY_STATUS = {
  0:{
      text:'Critical',
      color:'red'
  },
  1:{
    text:'Low',
    color:'orange'
  },
  2:{
    text:'High',
    color:'yellow'
  },
  3:{
    text:'Medium',
    color:'black'
  }
};
export const NO_ADHERENCE = "no_adherence";
export const NO_MEDICATION = "no_medication";
export const NO_APPOINTMENT = "no_appointment";
export const NO_ACTION = "no_action";

export const CHART_TITLE = {
  [NO_ADHERENCE]: "Adherence",
  [NO_MEDICATION]: "Missed Medication",
  [NO_APPOINTMENT]: "Missed Appointments",
  [NO_ACTION]: "Missed Actions"
};

export const GRAPH_COLORS = {
  [NO_ADHERENCE]: {
    dark: "#13c2c2",
    light: "#b5f5ec",
    className: {
      dark: "bg-dark-aqua",
      light: "bg-light-aqua"
    }
  },
  [NO_MEDICATION]: {
    dark: "#722ed1",
    light: "#d3adf7",
    className: {
      dark: "bg-dark-purple",
      light: "bg-light-purple"
    }
  },
  [NO_APPOINTMENT]: {
    dark: "#fa8c16",
    light: "#ffd591",
    className: {
      dark: "bg-dark-orange",
      light: "bg-light-orange"
    }
  },
  [NO_ACTION]: {
    dark: "#597ef7",
    light: "#adc6ff",
    className: {
      dark: "bg-dark-blue",
      light: "bg-light-blue"
    }
  }
};
