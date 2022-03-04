export default class WorkoutTemplate {
  constructor(data) {
    this._data = data;
  }

  getId = () => this._data.id;

  getName = () => this._data.name;

  getCreatorId = () => this._data.creator_id;

  getCreatorType = () => this._data.creator_type;

  getExerciseDetailId = () => this._data.exercise_detail_id;

  getExerciseDetails = () => {
    return this._data.exercise_details ? this._data.exercise_details : null;
  };
}
