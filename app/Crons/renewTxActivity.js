import serviceSubscribeTx from "../services/serviceSubscribeTranaction/serviceSubscribeTranaction";
import ServiceSubscriptionUserMapping from "../services/serviceSubscriptionUserMapping/serviceSubscriptionUserMapping.service";
import { TABLE_NAME as serviceSubscriptionUserMappingTable } from "../models/serviceSubscriptionUserMapping";
import Logger from "../../libs/log";
import Database from "../../libs/mysql";
import { TABLE_NAME as serviceSubscribeTranactionTable } from "../models/serviceSubscribeTranaction";
import moment from "moment";
import { Op } from "sequelize";
const Log = new Logger("CRON > RENEW > SUBSCRIPTION");

class RenewTxActivity {
  runObserver = async () => {
    console.log(
      "\n\n\n\n\n\n\n\n\n\n\n\n\n\ntx creatining...\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n"
    );

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
      console.log({ data });
      let serviceSubscriptionUserMapping = new ServiceSubscriptionUserMapping();
      let newTxs =
        await serviceSubscriptionUserMapping.getAllServiceSubscriptionUserMappingByData(
          data
        );

      for (let i in newTxs) {
        let all_details = await serviceSubscribeTx.getAllServiceSubscriptionTx({
          subscription_user_plan_id: newTxs[i]["id"],
          is_next_tx_create: false,
        });

        console.log({ id: newTxs[i]["id"], all_details });

        if (all_details.length > 0) {
          const transaction = await Database.initTransaction();
          try {
            console.log("updating tx table");
            await Database.getModel(serviceSubscribeTranactionTable).update(
              { is_next_tx_create: true },
              {
                where: { id: all_details[0]["id"] },
                raw: true,
                returning: true,
                transaction,
              }
            );
            let { id: myid, ...rest } = all_details[0];
            console.log({ ...rest, due_date: new Date() });
            const txDetails = {
              ...rest,
              due_date: newTxs[i]["next_recharge_date"],
              patient_status: "inactive",
            };
            console.log("creating in  tx table new entry -> ", { txDetails });

            await Database.getModel(serviceSubscribeTranactionTable).create(
              txDetails,
              {
                raw: true,
                transaction,
              }
            );
            console.log(
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
            console.log(ex);
            await transaction.rollback();
          }
        }
      }
    } catch (error) {
      Log.debug("RenewSubscription 500 error", error);
    }
  };
}

export default new RenewTxActivity();
