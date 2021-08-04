export default class ExerciseDetail {
  constructor(data) {
    this._data = data;
  }

  getId = () => this._data.id;

  getExerciseId = () => this._data.exercise_id;

  getRepetitionId = () => this._data.repetition_id;

  getCreatorId = () => this._data.creator_id;

  getCreatorType = () => this._data.creator_type;

  getCalorificValue = () => this._data.calorific_value;

  getRepetition = () => {
    return this._data.repetition ? this._data.repetition : null;
  };

  getExercise = () => {
    return this._data.exercise ? this._data.exercise : null;
  }
}
