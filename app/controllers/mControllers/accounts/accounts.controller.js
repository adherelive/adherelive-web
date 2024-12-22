import Controller from "../../index";

import accountDetailsService from "../../../services/accountDetails/accountDetails.service";

import userService from "../../../services/user/user.service";

import MAccountsWrapper from "../../../apiWrapper/mobile/accountDetails";
import UserWrapper from "../../../apiWrapper/mobile/user";
import ProviderWrapper from "../../../apiWrapper/mobile/provider";

import Log from "../../../../libs/log";

const Logger = new Log("MOBILE ACCOUNTS CONTROLLER");

class MobileAccountsController extends Controller {
  constructor() {
    super();
  }

  addAccountDetails = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { userDetails: { userId } = {}, params: { id = null } = {} } = req;
      const {
        customer_name,
        account_number,
        ifsc_code,
        account_type,
        account_mobile_number,
        prefix,
        use_as_main = false,
        upi_id = null,
      } = req.body;

      if (use_as_main) {
        const updatedDetails =
          await accountDetailsService.updateInUseForAccount(userId);
      }

      const accountData = {
        customer_name,
        account_number,
        ifsc_code,
        account_type,
        account_mobile_number,
        user_id: userId,
        prefix,
        in_use: use_as_main,
        upi_id,
      };
      let accountDetails = {};
      let accountWrapper = null;

      if (!id) {
        accountDetails = await accountDetailsService.addAccountDetails(
          accountData
        );
        accountWrapper = await MAccountsWrapper(accountDetails);
      } else {
        accountDetails = await accountDetailsService.update(accountData, id);
        accountWrapper = await MAccountsWrapper(null, id);
      }

      const userWrapper = await UserWrapper(null, userId);

      return raiseSuccess(
        res,
        200,
        {
          users: {
            [userWrapper.getId()]: userWrapper.getBasicInfo(),
          },
          account_details: {
            [accountWrapper.getId()]: accountWrapper.getBasicInfo(),
          },
        },
        "Account details updated successfully."
      );
    } catch (error) {
      Logger.debug("add account details 500 error", error);
      return raiseServerError(res);
    }
  };

  getUserAccountDetails = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { userDetails: { userId } = {} } = req;
      Logger.debug("6564546787654678787678965678", req.query);

      const { query: { all_accounts = 0, provider_id = null } = {} } = req;
      const get_all_accounts = all_accounts == 0 ? false : true;

      let accountDetails = {};
      let accountWrapperDetails = {};
      let accountWrapper = null;

      if (provider_id) {
        let providerApiData = {},
          allUsers = {};

        const providerWrapper = await ProviderWrapper(null, provider_id);
        providerApiData[providerWrapper.getProviderId()] =
          providerWrapper.getBasicInfo();
        const providerUserId = await providerWrapper.getUserId();
        const accountDetails =
          (await accountDetailsService.getAllAccountsForUser(providerUserId)) ||
          [];

        const providerUserWrapper = await UserWrapper(null, providerUserId);
        allUsers[providerUserWrapper.getId()] =
          providerUserWrapper.getBasicInfo();

        if (accountDetails && accountDetails.length) {
          for (const account of accountDetails) {
            accountWrapper = await MAccountsWrapper(account);
            accountWrapperDetails[accountWrapper.getId()] =
              accountWrapper.getBasicInfo();
          }
        } else {
          return raiseClientError(res, 422, {}, "No account Details Found");
        }

        const userWrapper = await UserWrapper(null, userId);

        allUsers[userWrapper.getId()] = userWrapper.getBasicInfo();
        return raiseSuccess(
          res,
          200,
          {
            users: {
              ...allUsers,
            },
            account_details: {
              ...accountWrapperDetails,
            },
            providers: {
              ...providerApiData,
            },
          },
          "Account details fetched successfully."
        );
      }

      if (get_all_accounts) {
        accountDetails = await accountDetailsService.getAllAccountsForUser(
          userId
        );

        if (accountDetails) {
          for (const account of accountDetails) {
            accountWrapper = await MAccountsWrapper(account);
            accountWrapperDetails[accountWrapper.getId()] =
              accountWrapper.getBasicInfo();
          }
        }
      } else {
        accountDetails = await accountDetailsService.getCurrentAccountByUserId(
          userId
        );

        if (accountDetails) {
          accountWrapper = await MAccountsWrapper(accountDetails);
          accountWrapperDetails[accountWrapper.getId()] =
            accountWrapper.getBasicInfo();
        }
      }

      const userWrapper = await UserWrapper(null, userId);

      return raiseSuccess(
        res,
        200,
        {
          users: {
            [userWrapper.getId()]: userWrapper.getBasicInfo(),
          },
          account_details: {
            ...accountWrapperDetails,
          },
        },
        "Account details fetched successfully."
      );
    } catch (error) {
      Logger.debug("get account details 500 error", error);
      return raiseServerError(res);
    }
  };

  deleteUserAccountDetails = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { userDetails: { userId } = {} } = req;
      const { params: { id = null } = {} } = req;

      if (!id) {
        return raiseClientError(
          res,
          422,
          {},
          "No such details found to delete."
        );
      }

      const accountDetails = await accountDetailsService.deleteAccountDetails(
        id
      );

      return raiseSuccess(
        res,
        200,
        {},
        "Account details deleted successfully."
      );
    } catch (error) {
      Logger.debug("delete account details 500 error", error);
      return raiseServerError(res);
    }
  };

  getUserAvailablePaymentMethods = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { params: { user_id } = {} } = req;

      const accountDetails =
        await accountDetailsService.getCurrentAccountByUserId(user_id);

      if (accountDetails) {
        const account = await MAccountsWrapper(accountDetails);

        let isUpi = false;
        let isRazorpayAccount = false;

        if (account.getUpi() !== null) {
          isUpi = true;
        }

        if (account.getRazorpayAccountId() !== null) {
          isRazorpayAccount = true;
        }

        return raiseSuccess(
          res,
          200,
          {
            isUpi,
            isRazorpayAccount,
          },
          "Payment methods fetched successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "No account details listed for the user"
        );
      }
    } catch (error) {
      Logger.debug("getUserAvailablePaymentMethods 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new MobileAccountsController();
