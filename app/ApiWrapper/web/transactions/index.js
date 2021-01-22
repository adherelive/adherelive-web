import BaseTransaction from "../../../services/transactions";

// services ...
import TransactionService from "../../../services/transactions/transaction.service";

// wrappers ...
import PaymentProductWrapper from "../../../ApiWrapper/web/paymentProducts";

class TransactionWrapper extends BaseTransaction {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const {
      id,
      transaction_id,
      payment_product_id,
      mode,
      amount,
      requestor_id,
      requestor_type,
      payee_id,
      payee_type,
      status,
      transaction_response
    } = _data;

    return {
      basic_info: {
        id,
        transaction_id,
        payment_product_id,
        mode,
        amount
      },
      status,
      requestor: {
        id: requestor_id,
        category: requestor_type
      },
      payee: {
        id: payee_id,
        category: payee_type
      },
      transaction_response
    };
  };

  getAllInfo = async () => {
    const {getBasicInfo, getId} = this;
    return {
      transactions: {
        [getId()]: getBasicInfo()
      },
      transaction_id: getId()
    };
  };

  getReferenceInfo = async () => {
    try {
      const {getAllInfo, _data} = this;
      const {payment_product} = _data || {};

      const paymentProducts = await PaymentProductWrapper({data: payment_product});

      return {
        ...await getAllInfo(),
        payment_products: {
          [paymentProducts.getId()]: paymentProducts.getBasicInfo()
        },
        payment_product_id: paymentProducts.getId(),
      };
    } catch(error) {
      throw error;
    }
  };
}

export default async ({ data = null, id = null }) => {
  try {
    if (data) {
      return new TransactionWrapper(data);
    }
    const transactionService = new TransactionService();
    const transaction = await transactionService.getByData({ id });
    return new TransactionWrapper(transaction);
  } catch(error) {
    throw error;
  }
};
