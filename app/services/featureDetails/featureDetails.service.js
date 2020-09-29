import database from "../../../libs/mysql";

const {feature_details: FeatureDetails} = database.models;

class FeatureDetailsService {

    getDetailsByData = async (data) => {
      try {
          const featureDetails = FeatureDetails.findOne({
              where: data
          });
          return featureDetails;
      } catch(err) {
          throw err;
      }
    };
}

export default new FeatureDetailsService();