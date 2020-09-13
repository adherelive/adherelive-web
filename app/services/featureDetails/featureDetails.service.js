import FeatureDetails from "../../models/featureDetails";

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