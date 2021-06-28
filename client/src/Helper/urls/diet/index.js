export const addDietUrl = () => {
    return `/diet`;
};

export const updateDietUrl = (diet_id) => {
    return `/diet/${diet_id}`;
}

export const getDietsForCareplanUrl = (care_plan_id) => {
    return `/diet?care_plan_id=${care_plan_id}`;
};

export const getDietDetailsByIdUrl = (id) => {
    return `/diet/${id}`;
};


export const getAllDietsForDoctorUrl = () => {
    return `/diet/all-diets`;
};

export const getDietTimelineUrl = (id) => {
    return `/diet/${id}/timeline`;
};
