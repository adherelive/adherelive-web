import serviceSubscribeTx from "../services/serviceSubscribeTranaction/serviceSubscribeTranaction";
import ServiceSubscriptionUserMapping from "../services/serviceSubscriptionUserMapping/serviceSubscriptionUserMapping.service"
import Logger from "../../libs/log";
import moment from "moment";
const Log = new Logger("CRON > RENEW > SUBSCRIPTION");

class RenewTxActivity {
  runObserver = async () => {
    try {
        
        // get all the service subscriptionuser mapping that have next rechage date in next7 days
        let data = {
            next_recharge_date: {
                $lte: moment().add(7, 'days').toDate()
            },
            expire_date: {
                $gt: moment().add(7, 'days').toDate()
            }
        }
        let serviceSubscriptionUserMapping = new ServiceSubscriptionUserMapping()
        let newTxs = await serviceSubscriptionUserMapping.getAllServiceSubscriptionUserMappingByData(data)

        for (let i in newTxs){
            console.log("====1=1=1=1=1=1=1==1=1=1=1=1=1=1=1=1")
            console.log(newTxs[i])
            console.log("====1=1=1=1=1=1=1==1=1=1=1=1=1=1=1=1")
            console.log("id is here", newTxs[i]["id"])
            let all_details = serviceSubscribeTx.getAllServiceSubscriptionTx({subscription_user_plan_id:newTxs[i]["id"] })
            console.log(all_details)
            console.log("======================================")
        }

        // get all serviceSubscribeTx that have same service_sub_plan_Id


        console.log("================ txActivities ============ txActivities ================")
        console.log({ newTxs })
        console.log("================ txActivities ============ txActivities ================")
    } catch (error) {
      Log.debug("RenewSubscription 500 error", error);
    }
  };
}

export default new RenewTxActivity();
