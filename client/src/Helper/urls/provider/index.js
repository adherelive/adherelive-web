export const sendPasswordMailUrl = () => {
  return `/providers/mail-password`;
};

export const getAllDoctorsForProviderUrl = () => {
  return `/providers/doctors`;
};

export const getCalenderDataCountForDayUrl = (date) => {
  return `/providers/appointments-count?date=${date}`;
};

export const getCalenderDataForDayUrl = (date, type) => {
  return `/providers/day-appointments?value=${date}&type=${type}`;
};

export const getAllProvidersUrl = () => {
  return `/admin/providers`;
};

export const updateProviderUrl = (provider_id) => {
  return `/admin/providers/${provider_id}`;
};
