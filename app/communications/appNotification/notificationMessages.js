const user_categories = {
  careCoach: "Care Coach",
  patient: "Patient",
  doctor: "Doctor",
  admin: "Admin",
  programAdmin: "Program Admin",
  superAdmin: "Super Admin"
};

const notificationMessages = {
  reminder: {
    Create: data => {
      return `${data.name} (${data.category}) has set Reminder for you`;
    },
    Reschedule: data => {
      return `${data.category} (${data.name}) has rescheduled the Reminder`;
    },
    Now: data => {
      switch (data.nowType) {
        case "P2P":
          return `You have ${data.reminderName} now for ${data.time}`;
        case "C2P":
          return `It's time for ${data.reminderName} for ${data.time}`;
        case "C2D":
          return `It's time to Call ${data.name} ${data.category}`;
        case "C2C":
          return `${data.name} (${data.category}) is having ${
            data.reminderName
          } for ${data.time}`;
      }
    }
  },
  appointment: {
    Create: data => {
      return `${data.name} (${
        user_categories[data.category]
      })  has created an Appointment for you`;
    },
    Reschedule: data => {
      return `${data.name} (${
        user_categories[data.category]
      }) has rescheduled the Appointment`;
    },
    Prior: data => {
      return `You have an Appointment with ${data.name} (${
        user_categories[data.category]
      }) in ${data.time}`;
    },
    Now: data => {
      return `You have an Appointment with ${data.name} (${
        user_categories[data.category]
      }) now`;
    },
    Delete: data => {
      return `${data.name} (${
        user_categories[data.category]
      }) has deleted the Appointment`;
    }
  },
  survey: {
    Create: data => {
      return `${data.name} (${
        user_categories[data.category]
      }) has sent you survey ${data.title}`;
    },
    Answered: data => {
      return `Patient ${data.name} has responded to survey ${data.title}`;
    },

    Complete: data => {
      return `Survey ${data.title} has been completed`;
    }
  },
  article: {
    Create: data => {
      return `${data.name} (${
        user_categories[data.category]
      }) has shared an Article with you ${data.title}`;
    }
  },
  patient: {
    Discharge: data => {
      return `Patient ${data.name} has been discharged from program ${
        data.title
      }`;
    }
  },
  adverseEvent: {
    Add: data => {
      return `${data.name} seems to have a ${data.concern} like for ${
        data.duration
      } after the medication`;
    }
  },
  vitals: {
    SelfUpdate: data => {
      return `${data.name} (${
        user_categories[data.category]
      }) has updated the Vitals`;
    },
    OtherUpdate: data => {
      return `${data.name} (${
        user_categories[data.category]
      }) has updated your Vitals`;
    }
  }
};

module.exports = notificationMessages;
