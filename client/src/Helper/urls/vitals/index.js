export const searchVitals = (data) => {
  return `/vitals?value=${data}`;
};
export const getVitalOccurenceUrl = () => {
  return `/vitals/details`;
};
export const getAddVitalURL = () => {
  return `/vitals`;
};

export const getVitalTimelineURL = (id) => {
  return `/vitals/${id}/timeline`;
};

export const getUpdateVitalURL = (id) => {
  return `/vitals/${id}`;
};
