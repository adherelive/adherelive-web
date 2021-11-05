export const getWorkoutDetailsUrl = () => {
  return `/workout/details`;
};

export const addWorkoutUrl = () => {
  return `/workout`;
};

export const updateWorkoutUrl = (id) => {
  return `/workout/${id}`;
};

export const updateWorkoutTotalCaloriesUrl = (workout_id, total_calories) => {
  return `/workout/update-calories?id=${workout_id}&total_calories=${total_calories}`;
};

export const getSingleWorkoutDetailsUrl = (id) => {
  return `/workout/${id}`;
};

export const getWorkoutsForPatientDetailsUrl = (patient_id) => {
  return `/workout/patients?patient_id=${patient_id}`;
};

export const getWorkoutTimelineUrl = (id) => {
  return `/workout/${id}/timeline`;
};

export const getWorkoutScheduleEventDetailsUrl = (schedule_event_id) => {
  return `/workout/response?schedule_event_id=${schedule_event_id}`;
};
