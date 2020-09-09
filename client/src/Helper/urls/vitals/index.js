export const searchVitals = (data) => {
    return `/vitals?value=${data}`;
};
export const getVitalOccurenceUrl = () => {
    return `/vitals/details`;
};
export const getAddVitalURL = () => {
    return `/vitals`;
};