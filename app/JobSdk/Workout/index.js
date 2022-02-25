export default class WorkoutJob {
  constructor(data) {
    this._data = data;
  }

  getWorkoutData = () => {
    return this._data;
  };
}
