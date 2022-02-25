import { combineReducers } from "redux";
import public_medicines from "./adminPublic";
import private_medicines from "./adminPrivate";

const adminMedicineReducer = combineReducers({
  public_medicines,
  private_medicines,
});

export default (state, action) => {
  return adminMedicineReducer(state, action);
};
