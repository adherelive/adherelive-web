export default class Workout {
  constructor(data) {
    this._data = data;
  }
  
  getId = () => this._data.id;
  
  getCareplanId = () => this._data.care_plan_id;
  
  getTime = () => this._data.time;
  
  getStartDate = () => this._data.start_date;
  
  getDetails = () => this._data.details || {};
  
  getExerciseGroups = () => this._data.exercise_groups || [];
  
  getExpiredOn = () => {
    return this._data.expired_on;
  };
}
