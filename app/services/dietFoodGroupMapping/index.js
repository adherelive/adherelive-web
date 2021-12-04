export default class DietFoodGroupMapping {
  constructor(data) {
    this._data = data;
  }
  
  getId = () => {
    return this._data.id;
  };
  
  getTime = () => {
    return this._data.time;
  };
  
  getFoodGroupId = () => {
    return this._data.food_group_id;
  };
  
  getDietId = () => {
    return this._data.diet_id;
  };
  
  getSimilarFoodMappings = () => {
    return this._data.similar_food_mappings || [];
  };
}
