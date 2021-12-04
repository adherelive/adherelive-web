export default class UserFavourites {
  constructor(data) {
    this._data = data;
  }
  
  getId = () => {
    return this._data.id;
  };
  
  getUserCategoryType = () => this._data.user_category_type;
  
  getUserCategoryId = () => {
    return this._data.user_category_id;
  };
  
  getMarkedFavouriteType = () => {
    return this._data.marked_favourite_type;
  };
  
  getMarkedFavouriteId = () => {
    return this._data.marked_favourite_id;
  };
}
