export default class MealTemplateFoodItemMapping {
  constructor(data) {
    this._data = data;
  }

  getId = () => {
    return this._data.id;
    }

  getMealTemplateId = () => {
    return this._data.meal_template_id;
    }

  getFoodItemId = () => {
    return this._data.food_item_id;
    }

  getFoodItemDetailId = () => {
    return this._data.food_item_detail_id;
    }
}
