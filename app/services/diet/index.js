export default class Diet {
  constructor(data) {
    this._data = data;
  }

  getId = () => {
    return this._data.id;
  };

  getName = () => {
    return this._data.name;
  };

  getTotalCalories = () => {
    return this._data.total_calories;
  };

  getStartDate = () => {
    return this._data.start_date;
  };

  getEndDate = () => {
    return this._data.end_date;
  };

  getCareplanId = () => {
    return this._data.care_plan_id;
  };

  getDetails = () => {
    return this._data.details;
  };

  getDietFoodGroupMappings = () => {
    return this._data.diet_food_group_mappings;
  };

  getExpiredOn = () => {
    return this._data.expired_on;
  };
}
