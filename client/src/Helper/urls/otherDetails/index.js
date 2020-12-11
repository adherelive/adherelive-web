export const getMedicationDetailsUrl = (patientId) => {
    return `/medications/${patientId}/details`;
};

export const getTermsAndPolicyUrl = (type) => {
    return `/admin/details/${type}`;
};

export const updateTermsAndPolicyUrl = () => {
    return `/admin/details`;
};