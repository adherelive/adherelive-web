import BasePaymentProduct from "../../../services/paymentProducts";
import PaymentProductService from "../../../services/paymentProducts/paymentProduct.service";

class PaymentProductWrapper extends BasePaymentProduct {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {id, creator_id, creator_type, name, type, details, amount, product_user_type} = this._data;

        return {
            basic_info: {
                id,
                name,
                type,
                amount,
            },
            creator_id,
            creator_type,
            product_user_type,
            details
        };
    };

    getAllInfo = () => {};

    getReferenceInfo = () => {};
}

export default async ({data = null, id = null}) => {
  try {
      if(data) {
          return new PaymentProductWrapper(data);
      }
      const paymentProductService = new PaymentProductService();
      const paymentProduct = await paymentProductService.getByData({id});
      return new PaymentProductWrapper(paymentProduct);
  } catch(error) {
      throw error;
  }
};