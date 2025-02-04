import serviceSubscribeTransaction from "../services/serviceSubscribeTransaction/serviceSubscribeTransaction";
import ServiceSubscriptionUserMapping from "../services/serviceSubscriptionUserMapping/serviceSubscriptionUserMapping.service";
import { TABLE_NAME as serviceSubscriptionUserMappingTable } from "../models/serviceSubscriptionUserMapping";
import { createLogger } from "../../libs/log";
import Database from "../../libs/mysql";
import { TABLE_NAME as serviceSubscribeTransactionTable } from "../models/serviceSubscribeTransaction";
import moment from "moment";
import { Op } from "sequelize";

const logger = createLogger("CRON > RENEW > SUBSCRIPTION");

class RenewTxActivity {
  runObserver = async () => {
    logger.debug("\n\n Creating transactions inside RenewTxActivity... \n\n");

    try {
      // get all the service subscriptionuser mapping that have next rechage date in next7 days
      let data = {
        next_recharge_date: {
          [Op.lte]: moment().add(7, "days").toDate(),
        },
        expire_date: {
          [Op.gt]: moment().add(7, "days").toDate(),
        },
      };
      logger.debug({ data });
      let serviceSubscriptionUserMapping = new ServiceSubscriptionUserMapping();
      let newTxs =
        await serviceSubscriptionUserMapping.getAllServiceSubscriptionUserMappingByData(
          data
        );

      for (let i in newTxs) {
        let all_details =
          await serviceSubscribeTransaction.getAllServiceSubscriptionTx({
            subscription_user_plan_id: newTxs[i]["id"],
            is_next_tx_create: false,
          });

        logger.debug({ id: newTxs[i]["id"], all_details });

        if (all_details.length > 0) {
          const transaction = await Database.initTransaction();
          try {
            logger.debug("updating tx table");
            await Database.getModel(serviceSubscribeTransactionTable).update(
              { is_next_tx_create: true },
              {
                where: { id: all_details[0]["id"] },
                raw: true,
                returning: true,
                transaction,
              }
            );
            let { id: myid, ...rest } = all_details[0];
            logger.debug({ ...rest, due_date: new Date() });
            const txDetails = {
              ...rest,
              due_date: newTxs[i]["next_recharge_date"],
              patient_status: "inactive",
            };
            logger.debug("creating in  tx table new entry -> ", { txDetails });

            await Database.getModel(serviceSubscribeTransactionTable).create(
              txDetails,
              {
                raw: true,
                transaction,
              }
            );
            logger.debug(
              "updating in  userservicesubmapping....",
              newTxs[i]["next_recharge_date"],
              {
                next_rec_date: moment(newTxs[i]["next_recharge_date"]).add(
                  1,
                  "month"
                ),
              }
            );
            await Database.getModel(serviceSubscriptionUserMappingTable).update(
              {
                next_recharge_date: moment(newTxs[i]["next_recharge_date"]).add(
                  1,
                  "month"
                ),
              },
              {
                where: {
                  id: newTxs[i]["id"],
                },
                raw: true,
                returning: true,
                transaction,
              }
            );
            await transaction.commit();
          } catch (ex) {
            logger.debug(ex);
            await transaction.rollback();
          }
        }
      }
    } catch (error) {
      logger.debug("RenewSubscription 500 error", error);
    }
  };
}

export default new RenewTxActivity();
