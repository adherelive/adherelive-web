import { doRequest } from "../../Helper/network";
import { REQUEST_TYPE } from "../../constant";

export const DELETE_DOCTOR_PAYMENT_PRODUCT_COMPLETE =
  "DELETE_DOCTOR_PAYMENT_PRODUCT_COMPLETE";

function paymentProductsReducer(state, data) {
  const { payment_products } = data || {};
  if (payment_products) {
    return {
      ...state,
      ...payment_products,
    };
  } else {
    return state;
  }
}

function deletePaymentProduct(state, data) {
  const { id } = data || {};

  if (id) {
    const { [id.toString()]: product, ...rest } = state;

    return {
      ...rest,
    };
  } else {
    return state;
  }
}

export default (state = {}, action) => {
  const { type, data } = action;
  switch (type) {
    case DELETE_DOCTOR_PAYMENT_PRODUCT_COMPLETE:
      return deletePaymentProduct(state, data);
    default:
      return paymentProductsReducer(state, data);
  }
};
