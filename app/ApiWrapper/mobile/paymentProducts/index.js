import BasePaymentProduct from "../../../services/paymentProducts";
import PaymentProductService from "../../../services/paymentProducts/paymentProduct.service";

class PaymentProductWrapper extends BasePaymentProduct {
  constructor(data) {
    super(data);
  }
  
  getBasicInfo = () => {
    const {
      id,
      creator_role_id,
      creator_type,
      name,
      type,
      details,
      amount,
      product_user_type,
      for_user_role_id,
      for_user_type,
      razorpay_link,
    } = this._data;
    // const {id, creator_id, creator_type, name,
    //     type, details, amount, product_user_type, for_user_id, for_user_type,
    //     razorpay_link} = this._data;
    
    return {
      basic_info: {
        id,
        name,
        type,
        amount,
      },
      creator_role_id,
      creator_type,
      for_user_role_id,
      for_user_type,
      product_user_type,
      details,
      razorpay_link,
    };
  };
  
  getAllInfo = () => {
  };
  
  getReferenceInfo = () => {
  };
}

export default async ({data = null, id = null}) => {
  try {
    if (data) {
      return new PaymentProductWrapper(data);
    }
    const paymentProductService = new PaymentProductService();
    const paymentProduct = await paymentProductService.getByData({id});
    return new PaymentProductWrapper(paymentProduct);
  } catch (error) {
    throw error;
  }
};
