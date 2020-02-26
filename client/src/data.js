export const AUTH_INITIAL_STATE = {
  authenticated: true,
  authenticated_user: "1"
  // authRedirection:
};

export const GRAPH_INITIAL_STATE = {
  missed_report: [
    {
      id: "no_adherence",
      data: {
        total: "119",
        critical: "90"
      }
    },
    {
      id: "no_medication",
      data: {
        total: "119",
        critical: "90"
      }
    },
    {
      id: "no_appointment",
      data: {
        total: "119",
        critical: "90"
      }
    },
    {
      id: "no_action",
      data: {
        total: "119",
        critical: "90"
      }
    }
  ]
};

export const USER_INITIAL_STATE = {};
