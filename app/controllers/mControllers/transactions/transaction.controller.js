import Controller from "../../index";
import moment from "moment";

// SERVICES ...
import RazorpayService from "../../../services/razorpay/razorpay.service";
import TransactionService from "../../../services/transactions/transaction.service";
import SubscriptionService from "../../../services/subscriptions/subscription.service";
import accountDetailService from "../../../services/accountDetails/accountDetails.service";
import doctorProviderMappingService from "../../../services/doctorProviderMapping/doctorProviderMapping.service";
import userRolesService from "../../../services/userRoles/userRoles.service";

// WRAPPERS ...
import PaymentProductWrapper from "../../../ApiWrapper/mobile/paymentProducts";
import TransactionWrapper from "../../../ApiWrapper/mobile/transactions";
import DoctorWrapper from "../../../ApiWrapper/mobile/doctor";
import SubscriptionWrapper from "../../../ApiWrapper/mobile/subscriptions";
import AccountDetailsWrapper from "../../../ApiWrapper/mobile/accountDetails";
import DoctorProviderMappingWrapper from "../../../ApiWrapper/web/doctorProviderMapping";
// used for web as no ui for provider on mobile
import ProviderWrapper from "../../../ApiWrapper/web/provider";

// MODELS ...
import {CHECKOUT, STATUS, UPI} from "../../../models/transactions";

// HELPERS ...
import Logger from "../../../../libs/log";
import {generateTransactionId} from "../../../helper/payment";
import * as TransactionHelper from "./helper";
import {USER_CATEGORY} from "../../../../constant";
import {PAYMENT_TYPE} from "../../../models/paymentProducts";

const Log = new Logger("TRANSACTIONS > MOBILE > CONTROLLER");

class TransactionController extends Controller {
  constructor() {
    super();
  }
  
  createOrder = async (req, res) => {
    const {raiseSuccess, raiseClientError, raiseServerError} = this;
    try {
      const {
        body: {payment_product_id, currency, isUpi = false},
        userDetails: {userRoleId, userData: {category} = {}} = {},
      } = req;
      
      const paymentProduct = await PaymentProductWrapper({
        id: payment_product_id,
      });
      
      const transactionService = new TransactionService();
      
      let requestorId = paymentProduct.getCreatorRoleId();
      let requestorType = paymentProduct.getCreatorType();
      
      if (isUpi) {
        const generateTransaction = await transactionService.createTransaction({
          payment_product_id,
          transaction_id: generateTransactionId(userRoleId),
          mode: UPI,
          amount: paymentProduct.getAmount(),
          requestor_id: requestorId,
          requestor_type: requestorType,
          payee_id: userRoleId,
          payee_type: category,
          // transaction_response: {
          //     order_id
          // },
        });
        
        const transactions = await TransactionWrapper({
          data: generateTransaction,
        });
        
        const requestor_id = transactions.getRequestorId();
        const requestorRole =
          (await userRolesService.findOne({
            where: {id: requestor_id},
            attributes: ["user_identity"],
          })) || null;
        
        const {user_identity = null} = requestorRole || {};
        const accountDetails =
          await accountDetailService.getCurrentAccountByUserId(user_identity);
        const accountDetialsWrapper = await AccountDetailsWrapper(
          accountDetails
        );
        const upi_id = accountDetialsWrapper.getUpi();
        
        return raiseSuccess(
          res,
          200,
          {
            payment_products: {
              [paymentProduct.getId()]: paymentProduct.getBasicInfo(),
            },
            transactions: {
              [transactions.getId()]: transactions.getBasicInfo(),
            },
            transaction_id: transactions.getId(),
            upi_id,
          },
          "UPI Order created successfully"
        );
      } else {
        // razorpay order create here
        
        const razorpayService = new RazorpayService();
        const order = await razorpayService.createOrder({
          currency: process.config.app.default_currency,
          amount: paymentProduct.getAmount() * 100,
        });
        
        const {error = null, id} = order || {};
        if (!error) {
          // transaction create here
          
          const generateTransaction =
            await transactionService.createTransaction({
              payment_product_id,
              transaction_id: generateTransactionId(userRoleId),
              mode: CHECKOUT,
              amount: paymentProduct.getAmount(),
              requestor_id: requestorId,
              requestor_type: requestorType,
              payee_id: userRoleId,
              payee_type: category,
              transaction_response: {
                order_id: id,
              },
            });
          
          const transactions = await TransactionWrapper({
            data: generateTransaction,
          });
          return raiseSuccess(
            res,
            200,
            {
              razorpay_orders: {
                ...order,
              },
              payment_products: {
                [paymentProduct.getId()]: paymentProduct.getBasicInfo(),
              },
              transactions: {
                [transactions.getId()]: transactions.getBasicInfo(),
              },
              transaction_id: transactions.getId(),
            },
            "Order created successfully"
          );
        } else {
          return raiseClientError(
            res,
            422,
            {},
            "Please check provided details to continue"
          );
        }
      }
    } catch (error) {
      Log.debug("createOrder 500 error", error);
      return raiseServerError(res);
    }
  };
  
  processTransaction = async (req, res) => {
    const {raiseSuccess, raiseClientError, raiseServerError} = this;
    try {
      Log.info(`PARAMS : id : ${req.params.id}`);
      const {
        params: {id} = {},
        body: {
          transaction_response,
          isUpi = false,
          txnId,
          currency = "INR",
        } = {},
        userDetails: {
          userId,
          userData: {category} = {},
          userCategoryId,
          userRoleId,
        } = {},
      } = req;
      const oldTransaction = await TransactionWrapper({id});
      
      const transactionService = new TransactionService();
      
      if (oldTransaction.getMode() === UPI) {
        const updateTransaction = await transactionService.updateTransaction(
          {
            transaction_response: {
              ...oldTransaction.getTransactionResponse(),
              bank_transaction_id: txnId,
            },
            status: STATUS.COMPLETED,
          },
          id
        );
        
        const transaction = await TransactionWrapper({id});
        
        return raiseSuccess(
          res,
          200,
          {
            transactions: {
              [transaction.getId()]: transaction.getBasicInfo(),
            },
            transaction_id: transaction.getId(),
          },
          "UPI Payment completed successfully"
        );
      }
      
      const isVerified = TransactionHelper.verifyTransaction(
        transaction_response,
        oldTransaction
      );
      
      Log.info(`transaction verified : ${isVerified}`);
      
      if (isVerified) {
        const updateTransaction = await transactionService.updateTransaction(
          {
            transaction_response: {
              ...oldTransaction.getTransactionResponse(),
              ...transaction_response,
            },
            status: STATUS.COMPLETED,
          },
          id
        );
        
        // if subscription based payment made -> add subscription entry for patient with next due
        // transaction -> payment_product -> (type) == recurring -> check for subscription -> existing? -> Y (update next due) N (create new subscription)
        
        Log.debug("After update transaction -->", updateTransaction);
        
        const transaction = await TransactionWrapper({id});
        
        const {payment_products, payment_product_id} =
          await transaction.getReferenceInfo();
        
        const {basic_info: {type, amount: paymentAmount} = {}} =
        payment_products[payment_product_id] || {};
        
        let subscriptionData = {};
        
        if (type === PAYMENT_TYPE.RECURRING) {
          const subscriptionService = new SubscriptionService();
          
          // check if subscription already exists
          const subscriptionExists = await subscriptionService.getByData({
            payment_product_id,
            subscriber_id: userRoleId,
            subscriber_type: category,
          });
          
          if (subscriptionExists) {
            // update subscription
            const updateSubscription =
              await subscriptionService.updateSubscription({
                renew_on: moment().add(1, "years").toISOString(),
                expired_on: moment()
                  .add(1, "years")
                  .add(1, "month")
                  .toISOString(),
              });
            
            Log.debug("updateSubscription --> ", updateSubscription);
            
            const subscriptions = await SubscriptionWrapper({
              id: subscriptionExists.id,
            });
            subscriptionData[subscriptions.getId()] =
              subscriptions.getBasicInfo();
          } else {
            // create subscription
            const addSubscription =
              await subscriptionService.createSubscription({
                payment_product_id,
                subscriber_id: userRoleId,
                subscriber_type: category,
                activated_on: moment().toISOString(),
                renew_on: moment().add(1, "years").toISOString(),
                expired_on: moment()
                  .add(1, "years")
                  .add(1, "month")
                  .toISOString(),
              });
            
            const subscriptions = await SubscriptionWrapper({
              data: addSubscription,
            });
            subscriptionData[subscriptions.getId()] =
              subscriptions.getBasicInfo();
          }
        }
        
        let accountUserId = null;
        
        switch (transaction.getRequestorType()) {
          case USER_CATEGORY.DOCTOR:
          case USER_CATEGORY.HSP:
          case USER_CATEGORY.PROVIDER:
            const requestor_id = transaction.getRequestorId();
            const requestorRole =
              (await userRolesService.findOne({
                where: {id: requestor_id},
                attributes: ["user_identity"],
              })) || null;
            const {user_identity = null} = requestorRole || {};
            accountUserId = user_identity;
            break;
          default:
            break;
        }
        
        const accountDetails =
          await accountDetailService.getCurrentAccountByUserId(accountUserId);
        const account = await AccountDetailsWrapper(accountDetails);
        const accountId = account.getRazorpayAccountId();
        
        if (accountId) {
          // TODO: make payment to doctor or provider account
          // direct transfer (https://razorpay.com/docs/api/route/#direct-transfers)
          
          const razorpayService = new RazorpayService();
          const transfer = await razorpayService.directTransfer({
            account: accountId,
            amount: parseInt(paymentAmount) * 100,
            currency: process.config.app.default_currency, // todo: payment specific currency
          });
        } else {
          // todo: method to notify doctor about the same
          
          return raiseSuccess(res, 200, {}, "Payment made successfully");
        }
        
        return raiseSuccess(
          res,
          200,
          {
            transactions: {
              [transaction.getId()]: transaction.getBasicInfo(),
            },
            subscriptions: {
              ...subscriptionData,
            },
            transaction_id: transaction.getId(),
          },
          "Payment completed successfully"
        );
      } else {
        return raiseClientError(res, 400, {}, "Payment has not been processed");
      }
    } catch (error) {
      Log.debug("process transaction 500 error", error);
      return raiseServerError(res);
    }
  };
  
  updateTransaction = async (req, res) => {
    const {raiseSuccess, raiseClientError, raiseServerError} = this;
    try {
      Log.info(`PARAMS : id : ${req.params.id}`);
      const {
        params: {id} = {},
        body: {transaction_response} = {},
        userDetails: {
          userId,
          userData: {category} = {},
          userCategoryId,
        } = {},
      } = req;
      const oldTransaction = await TransactionWrapper({id});
      
      const isVerified = TransactionHelper.verifyTransaction(
        transaction_response,
        oldTransaction
      );
      
      Log.info(`transaction verified : ${isVerified}`);
      
      if (isVerified) {
        const transactionService = new TransactionService();
        const updateTransaction = await transactionService.updateTransaction(
          {
            transaction_response: {
              ...oldTransaction.getTransactionResponse(),
              ...transaction_response,
            },
            status: STATUS.COMPLETED,
          },
          id
        );
        
        Log.debug("After update transaction -->", updateTransaction);
        
        // TODO: make payment to doctor or provider account
        // direct transfer (https://razorpay.com/docs/api/route/#direct-transfers)
        
        const transaction = await TransactionWrapper({id});
        return raiseSuccess(
          res,
          200,
          {
            transactions: {
              [transaction.getId()]: transaction.getBasicInfo(),
            },
            transaction_id: transaction.getId(),
          },
          "Payment completed successfully"
        );
      } else {
        return raiseClientError(res, 400, {}, "Payment has not been processed");
      }
    } catch (error) {
      Log.debug("createOrder 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new TransactionController();
