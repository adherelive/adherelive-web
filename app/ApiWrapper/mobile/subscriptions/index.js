import BaseSubscription from "../../../services/subscriptions";
import SubscriptionService from "../../../services/subscriptions/subscription.service";

// wrappers
import PaymentProductWrapper from "../paymentProducts";

class SubscriptionWrapper extends BaseSubscription {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const {
      id,
      payment_product_id,
      subscriber_type,
      subscriber_id,
      activated_on,
      renew_on,
      expired_on
    } = _data || {};

    return {
      basic_info: {
        id,
        payment_product_id,
        subscriber_id,
        subscriber_type
      },
      activated_on,
      renew_on,
      expired_on
    };
  };

  getAllInfo = async () => {
    const { getId, getBasicInfo } = this;
    return {
      subscriptions: {
        [getId()]: getBasicInfo()
      },
      subscription_id: getId()
    };
  };

  getReferenceInfo = async () => {
    try {
      const { getAllInfo, _data } = this;

      const { payment_products } = _data || {};
      const paymentProduct = await PaymentProductWrapper({
        data: payment_products
      });

      return {
        ...(await getAllInfo()),
        payment_products: {
          [paymentProduct.getId()]: paymentProduct.getBasicInfo()
        },
        payment_product_id: paymentProduct.getId()
      };
    } catch (error) {
      throw error;
    }
  };
}

export default async ({ data = null, id = null }) => {
  try {
    if (data) {
      return new SubscriptionWrapper(data);
    }
    const subscriptionService = new SubscriptionService();
    const subscription = await subscriptionService.getByData({ id });
    return new SubscriptionWrapper(subscription);
  } catch (error) {
    throw error;
  }
};
