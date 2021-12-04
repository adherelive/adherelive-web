export default class FoodItem {
  constructor(data) {
    this._data = data;
  }
  
  getId() {
    return this._data.id;
  }
  
  getFoodItemName() {
    return this._data.name;
  }
  
  getfoodItemDetails = () => {
    return this._data.food_item_details || [];
  };
  
  getCreatorId = () => {
    return this._data.creator_id;
  };
  
  getCreatorType = () => {
    return this._data.creator_type;
  };
  
  getCreatorId = () => {
    return this._data.creator_id;
  };
  
  getCreatorType = () => {
    return this._data.creator_type;
  };
}
