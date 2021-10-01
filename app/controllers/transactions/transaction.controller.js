import Controller from "../index";

import Logger from "../../../libs/log";
import { USER_CATEGORY } from "../../../constant";

import * as TransactionHelper from "./helper";

const Log = new Logger("WEB > TRANSACTIONS > CONTROLLER");

class TransactionController extends Controller {
  constructor() {
    super();
  }

  getAllTransactions = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { userDetails: { userData: { category } = {} } = {} } = req;
      let responseData = {};

      switch (category) {
        case USER_CATEGORY.PROVIDER:
                    responseData = await TransactionHelper.getProviderTransactions(req) || {};
          break;
        case USER_CATEGORY.DOCTOR:
                    responseData = await TransactionHelper.getDoctorTransactions(req) || {};
          break;
        case USER_CATEGORY.HSP:
                    responseData = await TransactionHelper.getDoctorTransactions(req) || {};
          break;
        default:
          break;
      }

      if (Object.keys(responseData).length > 0) {
                return raiseSuccess(res, 200, {...responseData}, "Transaction details fetched successfully");
      } else {
                return raiseSuccess(res, 200, {}, "No transactions available at the moment");
      }

      // const transactionService = new TransactionService();
      //
      // const allTransactions = await transactionService.getAllByData({
      //    requestor_id: userCategoryId,
      //    requestor_type: USER_CATEGORY.PROVIDER
      // }) || [];
      //
      // let transactionData = {};
      // let paymentProductData = {};
      //
      // if(allTransactions.length > 0) {
      //     for(let index = 0; index < allTransactions.length; index++) {
      //         const transaction = await TransactionWrapper({data: allTransactions[index]});
      //         const {transactions, payment_products, transaction_id, payment_product_id} = await transaction.getReferenceInfo();
      //         transactionData = {...transactionData, ...transactions};
      //         paymentProductData = {...paymentProductData, ...payment_products};
      //     }
      // }
    } catch (error) {
      Log.debug("getAllTransactions 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new TransactionController();
