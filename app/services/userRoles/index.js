export default class UserRoles {
  constructor(data) {
    this._data = data;
  }
  
  getId = () => {
    return this._data.id;
  };
  
  getUserId = () => {
    return this._data.user_identity;
  };
  
  getLinkedId = () => {
    return this._data.linked_id;
  };
  
  getLinkedWith = () => {
    return this._data.linked_with;
  };
  
  getUser = () => this._data.user;
  
  // getCategoryId = () => {
  //     return this._data.category_id
  // }
  
  // getCategoryType = () => {
  //     return this._data.category_type
  // }
}
