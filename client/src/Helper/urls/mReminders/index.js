export const getAddMedicationReminderURL = (id) => {
    return `/events/medication-reminder/${id}`;
}

export const getMedicationForParticipantUrl = (id) => {
    return `/medications/${id}`;
};