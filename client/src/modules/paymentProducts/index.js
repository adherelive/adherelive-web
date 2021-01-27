import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";


function paymentProductsReducer(state, data) {
  const { payment_products} = data || {};
  if (payment_products) {
      return {
          ...state,
          ...payment_products
      };
  } else {
      return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
      default:
          return paymentProductsReducer(state, data)
  }
};
