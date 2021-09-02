export default class FoodGroup {
  constructor(data) {
    this._data = data;
  }

  getId = () => {
    return this._data.id;
  };

  getPortionSize = () => {
    return this._data.portion_size;
  };

  getPortionId = () => {
    return this._data.portion_id;
  };

  getServing = () => {
    return this._data.serving;
  };

  getFoodItemDetailsId = () => {
    return this._data.food_item_detail_id;
  };
}
