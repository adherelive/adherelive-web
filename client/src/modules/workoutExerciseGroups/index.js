function workoutExerciseGroupsReducer(state, data) {
  const { workout_exercise_groups } = data || {};
  if (workout_exercise_groups) {
    return [...state, ...workout_exercise_groups];
  } else {
    if (Object.keys(state).length === 0) {
      return [];
    } else {
      return state;
    }
  }
}

export default (state = [], action) => {
  const { type, data } = action;
  switch (type) {
    default:
      return workoutExerciseGroupsReducer(state, data);
  }
};
