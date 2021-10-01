export default class MealTemplate {
  constructor(data) {
    this._data = data;
  }

  getId = () => {
    return this._data.id;
    }

  getName = () => {
    return this._data.name;
    }

  getCreatorId = () => {
    return this._data.creator_id;
    }

  getDetails = () => {
    return this._data.details;
    }

  getFoodItemDetails = () => {
    console.log("1230998213 this._data.food_items", this._data);
    return this._data.food_item_details || [];
    }
}
