export default class Exercise {
  constructor(data) {
    this._data = data;
  }

  getId = () => this._data.id;

  getName = () => this._data.name;

  getCreatorId = () => this._data.creator_id;

  getCreatorType = () => this._data.creator_type;

  getExerciseDetails = () => {
    return this._data.exercise_details ? this._data.exercise_details : [];
  };
}
