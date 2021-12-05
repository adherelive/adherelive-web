export default class ExerciseGroup {
  constructor(data) {
    this._data = data;
  }
  
  getId = () => this._data.id;
  
  getExerciseDetails = () => this._data.exercise_detail || null;
  
  getWorkoutExerciseGroupMappings = () =>
    this._data.workout_exercise_group_mappings || {};
}
