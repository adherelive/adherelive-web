import { createLogger } from "../../../libs/logger";

const logger = createLogger("FOOD ITEM DETAILS SERVICE");

export default class FoodItem {
  constructor(data) {
    this._data = data;
  }

  getId() {
    return this._data.id;
  }

  getFoodItemId() {
    return this._data.food_item_id;
  }

  getFoodItemCarbs() {
    return this._data.carbs;
  }

  getFoodItemProteins() {
    return this._data.proteins;
  }

  getFoodItemCalorificValue() {
    return this._data.calorific_value;
  }

  getFoodItemDetails() {
    return this._data.details;
  }

  getPortionId() {
    return this._data.portion_id;
  }

  getCreatorId = () => {
    return this._data.creator_id;
  };

  getCreatorType = () => {
    return this._data.creator_type;
  };

  // getPortionDetails = () => {
  //     logger.debug("Get Portions Data: ",{data:this._data});
  //     const portion = this._data.portion ? this._data.portion : {};
  //     return { ...portion };
  // }
}
